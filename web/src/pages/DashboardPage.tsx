import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { routeService } from '../services/routeService';
import MapView from '../components/MapView';
import type { RouteAlternative, RouteRequestHistory, RouteResponse } from '../types/api';

interface RouteForm {
  origin: string;
  destination: string;
  waypoints: string;
  avoidTolls: boolean;
  avoidTraffic: boolean;
}

const DashboardPage = () => {
  const { register, handleSubmit, reset } = useForm<RouteForm>({
    defaultValues: {
      origin: '',
      destination: '',
      waypoints: '',
      avoidTolls: false,
      avoidTraffic: false
    }
  });
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [history, setHistory] = useState<RouteRequestHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    const data = await routeService.history({ limit: 10 });
    setHistory(data.items);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const waypoints = data.waypoints
        .split('\n')
        .map((w) => w.trim())
        .filter(Boolean);
      const response = await routeService.create({
        origin: data.origin,
        destination: data.destination,
        waypoints,
        avoidTolls: data.avoidTolls,
        avoidTraffic: data.avoidTraffic
      });
      setRoute(response);
      fetchHistory();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível calcular a rota');
    } finally {
      setLoading(false);
    }
  });

  const totalDistance = useMemo(() => (route ? route.selected.distanceKm.toFixed(2) : '0'), [route]);
  const totalDuration = useMemo(() => {
    if (!route) return '0h';
    const hours = Math.floor(route.selected.durationSec / 3600);
    const minutes = Math.round((route.selected.durationSec % 3600) / 60);
    return `${hours}h ${minutes}min`;
  }, [route]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <section className="xl:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Planejar nova rota</h2>
          <p className="text-sm text-gray-500">Origem, destino e pontos intermediários opcionais</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">Origem</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
              {...register('origin', { required: true })}
              placeholder="Ex: Avenida Paulista, 1000, São Paulo"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Destino</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
              {...register('destination', { required: true })}
              placeholder="Ex: Praça da Sé, São Paulo"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Waypoints (um por linha)</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
              {...register('waypoints')}
              placeholder="Paradas opcionais"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('avoidTolls')} className="rounded border-gray-300" /> Evitar pedágios
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('avoidTraffic')} className="rounded border-gray-300" /> Evitar tráfego
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2 rounded-md bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Calculando...' : 'Calcular rota'}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setRoute(null);
              }}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Limpar
            </button>
          </div>
        </form>
        {error && <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm">{error}</div>}
        {route && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Métricas da viagem</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-primary/10 dark:bg-primary/20">
                <p className="text-xs uppercase text-primary">Distância</p>
                <p className="text-2xl font-bold">{totalDistance} km</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 dark:bg-primary/20">
                <p className="text-xs uppercase text-primary">Tempo estimado</p>
                <p className="text-2xl font-bold">{totalDuration}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 dark:bg-primary/20">
                <p className="text-xs uppercase text-primary">Etapas</p>
                <p className="text-2xl font-bold">{route.selected.legs.length}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Sugestões inteligentes</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {route.suggestions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            {route.corrections.notes.length > 0 && (
              <div className="p-3 rounded-md bg-amber-100 text-amber-700 text-sm">
                <p className="font-semibold">Ajustes realizados:</p>
                <ul className="mt-1 space-y-1">
                  {route.corrections.notes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <h4 className="font-semibold">Alternativas</h4>
              {route.alternatives.map((alternative: RouteAlternative) => (
                <div key={alternative.id} className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{alternative.rationale}</span>
                    <span>{alternative.distanceKm.toFixed(2)} km · {(alternative.durationSec / 60).toFixed(0)} min</span>
                  </div>
                  <p className="text-xs text-gray-500">{alternative.provider} · {alternative.profile}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="xl:col-span-2 grid grid-rows-[minmax(400px,_1fr)_auto] gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
          <MapView route={route?.selected} />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Histórico recente</h3>
            <button className="text-sm text-primary hover:underline" onClick={fetchHistory}>
              Atualizar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Data</th>
                  <th className="pb-2">Origem → Destino</th>
                  <th className="pb-2">Distância</th>
                  <th className="pb-2">Tempo</th>
                  <th></th>
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
                        <p className="font-medium">{item.origin}</p>
                        <p className="text-xs text-gray-500">{item.destination}</p>
                      </td>
                      <td className="py-2">{item.distanceKm.toFixed(1)} km</td>
                      <td className="py-2">{hours}h {minutes}m</td>
                      <td className="py-2 text-right">
                        <button
                          className="text-sm text-primary hover:underline"
                          onClick={async () => {
                            const duplicated = await routeService.duplicate(item.id);
                            const restored = await routeService.get(duplicated.id);
                            setRoute({
                              selected: restored.data as RouteAlternative,
                              alternatives: restored.data ? [restored.data as RouteAlternative] : [],
                              suggestions: ['Reabertura do histórico'],
                              corrections: { notes: [] }
                            });
                            fetchHistory();
                          }}
                        >
                          Reabrir
                        </button>
                      </td>
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

export default DashboardPage;
