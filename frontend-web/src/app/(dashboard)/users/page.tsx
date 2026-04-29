'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const schema = z.object({
  fullName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const statusLabel: Record<string, string> = { active: 'Ativo', inactive: 'Inativo', pending: 'Pendente' };
const statusVariant: Record<string, 'success' | 'secondary' | 'warning'> = {
  active: 'success', inactive: 'secondary', pending: 'warning',
};

export default function UsersPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/users', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      reset();
      setShowForm(false);
      setFormError('');
    },
    onError: (err: any) => setFormError(err.response?.data?.message ?? 'Erro ao criar usuário'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
          <p className="text-slate-500 mt-1">Membros do sistema</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setFormError(''); }}>
          {showForm ? 'Cancelar' : '+ Novo usuário'}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle>Novo usuário</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label>Nome completo *</Label>
                <Input placeholder="João Silva" {...register('fullName')} />
                {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>E-mail *</Label>
                  <Input type="email" placeholder="joao@clinica.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone</Label>
                  <Input placeholder="(11) 99999-9999" {...register('phone')} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Senha *</Label>
                <Input type="password" placeholder="Mínimo 8 caracteres" {...register('password')} />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <Button type="submit" loading={isSubmitting}>Criar usuário</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Carregando...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Nenhum usuário encontrado</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Usuário</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">2FA</th>
                  <th className="px-6 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary text-xs font-semibold">
                            {u.fullName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{u.fullName}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.phone ?? '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[u.status] ?? 'secondary'}>
                        {statusLabel[u.status] ?? u.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.twoFactorEnabled ? 'success' : 'secondary'}>
                        {u.twoFactorEnabled ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
