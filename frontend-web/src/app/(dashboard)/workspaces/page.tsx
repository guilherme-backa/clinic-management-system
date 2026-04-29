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
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hifens').optional().or(z.literal('')),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function WorkspacesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => api.get('/workspaces').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/workspaces', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaces'] });
      reset();
      setShowForm(false);
      setFormError('');
    },
    onError: (err: any) => setFormError(err.response?.data?.message ?? 'Erro ao criar workspace'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspaces</h1>
          <p className="text-slate-500 mt-1">Gerencie suas organizações</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setFormError(''); }}>
          {showForm ? 'Cancelar' : '+ Novo workspace'}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle>Novo workspace</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input placeholder="Ex: Clínica VetCare" {...register('name')} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Slug (opcional)</Label>
                <Input placeholder="Ex: vetcare" {...register('slug')} />
                {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
                <p className="text-xs text-slate-400">Gerado automaticamente se não informado</p>
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Input placeholder="Descrição opcional" {...register('description')} />
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <Button type="submit" loading={isSubmitting}>Criar workspace</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Carregando...</div>
          ) : workspaces.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Nenhum workspace encontrado</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Plano</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workspaces.map((ws: any) => (
                  <tr key={ws.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{ws.name}</p>
                      {ws.description && <p className="text-slate-400 text-xs mt-0.5">{ws.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{ws.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="capitalize">{ws.plan}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={ws.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                        {ws.status === 'active' ? 'Ativo' : ws.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(ws.createdAt).toLocaleDateString('pt-BR')}
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
