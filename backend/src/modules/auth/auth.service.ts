import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';
import { WorkspaceUser } from '../workspaces/entities/workspace-user.entity';
import { LoginDto } from './dto/login.dto';
import { UserStatus, SessionStatus } from '../../common/enums';
import { JwtPayload } from './strategies/jwt.strategy';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(WorkspaceUser) private wsUserRepo: Repository<WorkspaceUser>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'fullName', 'status', 'password', 'twoFactorEnabled'],
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Conta desativada');
    }

    const validPassword = await user.validatePassword(dto.password);
    if (!validPassword) throw new UnauthorizedException('Credenciais inválidas');

    // Get user's primary workspace (first active one)
    const wsUser = await this.wsUserRepo.findOne({
      where: { userId: user.id },
      relations: ['role'],
      order: { createdAt: 'ASC' },
    });

    const workspaceId = wsUser?.workspaceId ?? undefined;
    const roleType = wsUser?.role?.type ?? undefined;

    const tokens = await this.generateTokens(user, workspaceId, roleType);

    // Persist session
    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresAt = this.parseExpiry(refreshExpires);

    await this.sessionRepo.save(
      this.sessionRepo.create({
        userId: user.id,
        workspaceId: workspaceId ?? null,
        refreshToken: tokens.refreshToken,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        expiresAt,
        status: SessionStatus.ACTIVE,
      }),
    );

    if (user.status === UserStatus.PENDING) {
      await this.userRepo.update(user.id, { status: UserStatus.ACTIVE });
    }

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        workspaceId,
        roleType,
      },
    };
  }

  async refresh(userId: string, sessionId: string, refreshToken: string, workspaceId?: string) {
    // Revoke old session
    await this.sessionRepo.update(sessionId, { status: SessionStatus.REVOKED });

    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    const wsUser = workspaceId
      ? await this.wsUserRepo.findOne({
          where: { userId, workspaceId },
          relations: ['role'],
        })
      : null;

    const roleType = wsUser?.role?.type ?? undefined;
    const tokens = await this.generateTokens(user, workspaceId, roleType);

    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresAt = this.parseExpiry(refreshExpires);

    await this.sessionRepo.save(
      this.sessionRepo.create({
        userId: user.id,
        workspaceId: workspaceId ?? null,
        refreshToken: tokens.refreshToken,
        expiresAt,
        status: SessionStatus.ACTIVE,
      }),
    );

    return tokens;
  }

  async logout(sessionId?: string, userId?: string) {
    if (sessionId) {
      await this.sessionRepo.update(sessionId, { status: SessionStatus.REVOKED });
    } else if (userId) {
      await this.sessionRepo.update(
        { userId, status: SessionStatus.ACTIVE },
        { status: SessionStatus.REVOKED },
      );
    }
  }

  private async generateTokens(user: User, workspaceId?: string, roleType?: string) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      workspaceId,
      roleType,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private parseExpiry(expiry: string): Date {
    const now = new Date();
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [, amount, unit] = match;
    const ms = parseInt(amount) * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit]!;
    return new Date(now.getTime() + ms);
  }

  async generatePasswordResetToken(email: string): Promise<string | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;
    const token = crypto.randomBytes(32).toString('hex');
    // In production, store token with expiry and send via email
    // For MVP, just return token (caller would send email)
    return token;
  }
}
