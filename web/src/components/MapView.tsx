import { useEffect, useRef } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import type { RouteAlternative } from '../types/api';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface Props {
  route?: RouteAlternative;
}

const MapView = ({ route }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-47.9292, -15.7801],
      zoom: 4
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !route) return;
    const map = mapInstance.current;

    if (!route.geometry || (route.geometry as GeoJSON.Geometry).type !== 'LineString') {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: route.geometry
      }
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1d4ed8',
        'line-width': 4
      }
    });

    const coordinates = (route.geometry as GeoJSON.LineString).coordinates;
    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord as [number, number]),
      new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
    );
    map.fitBounds(bounds, { padding: 40 });

    route.points.forEach((point, index) => {
      const marker = new mapboxgl.Marker({
        color: index === 0 ? '#16a34a' : index === route.points.length - 1 ? '#dc2626' : '#2563eb'
      })
        .setLngLat(point)
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [route]);

  return <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" aria-label="Mapa" />;
};

export default MapView;
