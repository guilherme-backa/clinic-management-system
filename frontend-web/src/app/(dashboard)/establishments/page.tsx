'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  cnpj: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EstablishmentsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => api.get('/workspaces').then((r) => r.data),
  });

  const workspaceId = workspaces[0]?.id;

  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ['establishments', workspaceId],
    queryFn: () => api.get(`/establishments?workspaceId=${workspaceId}`).then((r) => r.data),
    enabled: !!workspaceId,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post('/establishments', { ...data, workspaceId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['establishments'] });
      reset();
      setShowForm(false);
      setFormError('');
    },
    onError: (err: any) => setFormError(err.response?.data?.message ?? 'Erro ao criar clínica'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clínicas</h1>
          <p className="text-slate-500 mt-1">Estabelecimentos cadastrados</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setFormError(''); }} disabled={!workspaceId}>
          {showForm ? 'Cancelar' : '+ Nova clínica'}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle>Nova clínica</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input placeholder="Ex: VetCare São Paulo" {...register('name')} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Telefone</Label>
                  <Input placeholder="(11) 99999-9999" {...register('phone')} />
                </div>
                <div className="space-y-1.5">
                  <Label>CNPJ</Label>
                  <Input placeholder="00.000.000/0001-00" {...register('cnpj')} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input type="email" placeholder="contato@clinica.com" {...register('email')} />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <Button type="submit" loading={isSubmitting}>Criar clínica</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {!workspaceId ? (
            <div className="p-8 text-center text-slate-400">Crie um workspace primeiro</div>
          ) : isLoading ? (
            <div className="p-8 text-center text-slate-400">Carregando...</div>
          ) : establishments.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Nenhuma clínica cadastrada</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Contato</th>
                  <th className="px-6 py-3">CNPJ</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {establishments.map((est: any) => (
                  <tr key={est.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{est.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <p>{est.phone ?? '—'}</p>
                      {est.email && <p className="text-xs text-slate-400">{est.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{est.cnpj ?? '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={est.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                        {est.status === 'active' ? 'Ativa' : est.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(est.createdAt).toLocaleDateString('pt-BR')}
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
