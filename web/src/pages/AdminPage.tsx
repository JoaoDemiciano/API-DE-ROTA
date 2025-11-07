import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/adminService';
import type { RouteRequestHistory, User } from '../types/api';

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<(RouteRequestHistory & { user: User })[]>([]);
  const [metrics, setMetrics] = useState<{ routesPerDay: { date: string; total: number }[]; averageDistance: number; averageDurationSec: number } | null>(
    null
  );
  const [filters, setFilters] = useState<{ userId?: string; from?: string; to?: string }>({});

  const loadUsers = async () => {
    const data = await adminService.listUsers();
    setUsers(data);
  };

  const loadHistory = async () => {
    const data = await adminService.history(filters);
    setHistory(data);
  };

  const loadMetrics = async () => {
    const data = await adminService.metrics();
    setMetrics(data);
  };

  useEffect(() => {
    loadUsers();
    loadMetrics();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [filters]);

  const exportCsv = async () => {
    const blob = await adminService.exportHistory(filters);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historico-rotas.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const metricsCards = useMemo(
    () => [
      {
        label: 'Rotas/Dia',
        value: metrics ? metrics.routesPerDay.reduce((acc, cur) => acc + cur.total, 0) : 0,
        helper: 'Total nos filtros aplicados'
      },
      {
        label: 'Distância média',
        value: metrics ? `${metrics.averageDistance.toFixed(1)} km` : '0 km',
        helper: 'Por solicitação'
      },
      {
        label: 'Tempo médio',
        value: metrics ? `${Math.round(metrics.averageDurationSec / 60)} min` : '0 min',
        helper: 'Por solicitação'
      }
    ],
    [metrics]
  );

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Dashboard administrativo</h2>
            <p className="text-sm text-gray-500">Gerencie usuários, histórico e configurações globais</p>
          </div>
          <button onClick={exportCsv} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark">
            Exportar CSV
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metricsCards.map((card) => (
            <div key={card.label} className="p-4 rounded-lg bg-primary/10 dark:bg-primary/20">
              <p className="text-xs uppercase text-primary">{card.label}</p>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-xs text-gray-500">{card.helper}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Usuários</h3>
            <p className="text-sm text-gray-500">Ative, desative ou filtre</p>
          </div>
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={async () => {
                    await adminService.updateUser(user.id, !user.isActive);
                    loadUsers();
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    user.isActive
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {user.isActive ? 'Desativar' : 'Ativar'}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="text-xs uppercase text-gray-500">Usuário</label>
                <select
                  className="mt-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                  value={filters.userId || ''}
                  onChange={(event) => setFilters((prev) => ({ ...prev, userId: event.target.value || undefined }))}
                >
                  <option value="">Todos</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-gray-500">De</label>
                <input
                  type="date"
                  className="mt-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                  value={filters.from || ''}
                  onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value || undefined }))}
                />
              </div>
              <div>
                <label className="text-xs uppercase text-gray-500">Até</label>
                <input
                  type="date"
                  className="mt-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                  value={filters.to || ''}
                  onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value || undefined }))}
                />
              </div>
            </div>
            <button
              onClick={() => loadHistory()}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Filtrar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Data</th>
                  <th className="pb-2">Usuário</th>
                  <th className="pb-2">Origem → Destino</th>
                  <th className="pb-2">Distância</th>
                  <th className="pb-2">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {history.map((item) => {
                  const hours = Math.floor(item.durationSec / 3600);
                  const minutes = Math.round((item.durationSec % 3600) / 60);
                  return (
                    <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <td className="py-2">{new Date(item.createdAt).toLocaleString('pt-BR')}</td>
                      <td className="py-2">
                        <p className="font-medium">{item.user.name}</p>
                        <p className="text-xs text-gray-500">{item.user.email}</p>
                      </td>
                      <td className="py-2">
                        <p className="font-medium">{item.origin}</p>
                        <p className="text-xs text-gray-500">{item.destination}</p>
                      </td>
                      <td className="py-2">{item.distanceKm.toFixed(1)} km</td>
                      <td className="py-2">{hours}h {minutes}m</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
