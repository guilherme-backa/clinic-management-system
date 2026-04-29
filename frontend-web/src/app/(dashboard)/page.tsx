'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StatCard({
  title, value, description, icon,
}: { title: string; value: string | number; description: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => api.get('/workspaces').then((r) => r.data),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
  });

  const { data: establishments = [] } = useQuery({
    queryKey: ['establishments', workspaces[0]?.id],
    queryFn: () =>
      workspaces[0]?.id
        ? api.get(`/establishments?workspaceId=${workspaces[0].id}`).then((r) => r.data)
        : [],
    enabled: workspaces.length > 0,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Visão geral do seu sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Workspaces"
          value={workspaces.length}
          description="Organizações ativas"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="Clínicas"
          value={establishments.length}
          description="Estabelecimentos cadastrados"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 21h18M9 21V10l3-3 3 3v11M12 3v4M6 21V14h3m6 7v-7h3" />
            </svg>
          }
        />
        <StatCard
          title="Usuários"
          value={users.length}
          description="Membros cadastrados"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Workspaces list */}
      {workspaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seus Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workspaces.map((ws: any) => (
                <div key={ws.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{ws.name}</p>
                    <p className="text-sm text-slate-500">{ws.slug}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium capitalize">
                    {ws.plan}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
