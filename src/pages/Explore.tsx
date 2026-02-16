import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, CircleMarker, useMapEvents, LayersControl } from 'react-leaflet';
import * as turf from '@turf/turf';
import { supabase } from '../lib/supabase';
import { Leaf, Info, MapPin, Ruler, User, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const SITE_COLORS: Record<string, string> = {
    garden: '#10b981',
    park: '#3b82f6',
    backyard: '#f59e0b',
    school: '#a855f7', // purple
    planters: '#ec4899', // pink
    other: '#64748b'   // slate
};

const ACTION_LABELS: Record<string, string> = {
    habitats: 'Proteger habitats existentes',
    mowing: 'Reduzir frequência de corte',
    planting: 'Plantação amiga de polinizadores',
    control: 'Controlo de plantas invasoras',
    nesting: 'Criar locais de nidificação',
    pesticides: 'Reduzir uso de pesticidas',
    awareness: 'Sensibilização',
    tracking: 'Monitorização',
    bio_general: 'Biodiversidade geral',
    other: 'Outro'
};

const Explore = () => {
    const [sites, setSites] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalArea: 0, count: 0 });

    useEffect(() => {
        const fetchSites = async () => {
            const { data } = await supabase
                .from('sites')
                .select('*')
                .eq('status', 'approved');

            if (data) {
                // Pre-calculate centers for better performance
                const sitesWithCenters = data.map(site => {
                    try {
                        const center = turf.center(site.location);
                        return {
                            ...site,
                            center: [center.geometry.coordinates[1], center.geometry.coordinates[0]] // [lat, lng]
                        };
                    } catch (e) {
                        return site;
                    }
                });

                setSites(sitesWithCenters);
                const total = data.reduce((acc, site) => acc + (site.area_sqm || 0), 0);
                setStats({ totalArea: total, count: data.length });
            }
        };

        fetchSites();
    }, []);

    return (
        <div className="h-[calc(100vh-64px)] relative flex flex-col">
            {/* Stats Overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-4 w-full max-w-2xl px-6">
                <StatsCard
                    label="Total de Locais"
                    value={stats.count.toString()}
                    icon={<Leaf size={20} className="text-primary" />}
                />
                <StatsCard
                    label="Área Recuperada"
                    value={`${Math.round(stats.totalArea).toLocaleString()} m²`}
                    icon={<Leaf size={20} className="text-secondary" />}
                />
            </div>

            {/* Legend */}
            <div className="absolute bottom-10 left-6 z-[1000] glass-panel p-6 max-w-xs">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Info size={16} /> Legenda
                </h4>
                <div className="space-y-2">
                    <LegendItem color={SITE_COLORS.garden} label="Jardins" />
                    <LegendItem color={SITE_COLORS.park} label="Parques" />
                    <LegendItem color={SITE_COLORS.backyard} label="Quintais" />
                    <LegendItem color={SITE_COLORS.school} label="Escolas" />
                    <LegendItem color={SITE_COLORS.planters} label="Floreiras Públicas" />
                    <LegendItem color={SITE_COLORS.other} label="Outros" />
                </div>
            </div>

            <div className="flex-1">
                <MapContainer
                    center={[40.2033, -8.4103]}
                    zoom={13}
                    className="w-full h-full"
                >
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="Mapa">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satélite">
                            <TileLayer
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <MapContent sites={sites} />
                </MapContainer>
            </div>
        </div>
    );
};

// Component to handle zoom events and rendering switch
const MapContent = ({ sites }: { sites: any[] }) => {
    const [zoom, setZoom] = useState(13);

    useMapEvents({
        zoomend: (e) => {
            setZoom(e.target.getZoom());
        }
    });

    const isZoomedOut = zoom < 16; // Threshold for switching to dots

    return (
        <>
            {sites.map(site => (
                <div key={site.id}>
                    {isZoomedOut && site.center ? (
                        <CircleMarker
                            center={site.center}
                            pathOptions={{
                                color: SITE_COLORS[site.site_type] || '#ccc',
                                fillColor: SITE_COLORS[site.site_type] || '#ccc',
                                fillOpacity: 0.8
                            }}
                            radius={8}
                        >
                            <Popup>
                                <SitePopupContent site={site} />
                            </Popup>
                        </CircleMarker>
                    ) : (
                        <GeoJSON
                            data={site.location}
                            style={{
                                color: SITE_COLORS[site.site_type] || '#ccc',
                                fillColor: SITE_COLORS[site.site_type] || '#ccc',
                                fillOpacity: 0.5,
                                weight: 2
                            }}
                        >
                            <Popup>
                                <SitePopupContent site={site} />
                            </Popup>
                        </GeoJSON>
                    )}
                </div>
            ))}
        </>
    );
};

const SitePopupContent = ({ site }: { site: any }) => (
    <div className="p-1 min-w-[200px]">
        <h3 className="text-lg font-bold text-slate-900 mb-2 border-b pb-2">{site.name || 'Sem nome'}</h3>

        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={14} className="text-primary" />
                <span className="text-xs font-medium uppercase tracking-wide">{site.site_type}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
                <Ruler size={14} className="text-secondary" />
                <span className="text-xs font-bold">{site.area_sqm?.toFixed(1)} m²</span>
            </div>
            {site.start_date && (
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-xs">
                        {site.end_date
                            ? `Período: ${new Date(site.start_date).toLocaleDateString()} - ${new Date(site.end_date).toLocaleDateString()}`
                            : `Desde: ${new Date(site.start_date).toLocaleDateString()}`
                        }
                    </span>
                </div>
            )}
            {site.show_author && site.author_name && (
                <div className="flex items-center gap-2 text-slate-600 border-t pt-2 mt-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-xs italic">Criado por {site.author_name}</span>
                </div>
            )}
        </div>

        {site.actions_taken && site.actions_taken.length > 0 && (
            <div className="space-y-2 mb-4">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Ações Realizadas</p>
                <div className="flex flex-wrap gap-1">
                    {site.actions_taken.map((action: string) => (
                        <span key={action} className="px-1.5 py-0.5 bg-nature-50 text-primary-dark rounded text-[10px] font-medium border border-nature-100">
                            {ACTION_LABELS[action] || action}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {site.website_url && (
            <a
                href={site.website_url.startsWith('http') ? site.website_url : `https://${site.website_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline mt-2"
            >
                <ExternalLink size={12} />
                Visitar Website
            </a>
        )}
    </div>
);

const StatsCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="flex-1 glass-panel p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
            <p className="text-xl font-display font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm text-slate-600 font-medium">{label}</span>
    </div>
);

export default Explore;
