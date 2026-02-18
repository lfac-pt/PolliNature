import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Popup, CircleMarker, useMapEvents, LayersControl } from 'react-leaflet';
import * as turf from '@turf/turf';
import { supabase } from '../lib/supabase';
import { Leaf, MapPin, Ruler, User, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { SITE_COLORS, SITE_LABELS, ACTION_LABELS } from '../constants/site';



import { useAuth } from '../lib/AuthContext';

const Explore = () => {
    const { user } = useAuth();
    const [sites, setSites] = useState<any[]>([]);
    const [showMySitesOnly, setShowMySitesOnly] = useState(false);

    useEffect(() => {
        const fetchSites = async () => {
            const { data } = await supabase
                .from('sites')
                .select('*');

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
            }
        };

        fetchSites();
    }, []);

    const filteredSites = showMySitesOnly && user
        ? sites.filter(s => s.user_id === user.id)
        : sites;

    const stats = {
        totalArea: filteredSites.reduce((acc, site) => acc + (site.area_sqm || 0), 0),
        count: filteredSites.length
    };

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

            {/* Top Right Controls - Positioned below standard Leaflet controls */}
            <div className="absolute top-[80px] right-[10px] z-[1000] flex flex-col gap-2">
                {user && (
                    <div className="bg-white p-2 rounded-md shadow-md border border-slate-300">
                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-primary transition-colors">Meus Locais</span>
                            <div className={`relative w-8 h-4 transition-colors rounded-full ${showMySitesOnly ? 'bg-primary' : 'bg-slate-300'}`}>
                                <div className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${showMySitesOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <input
                                type="checkbox"
                                checked={showMySitesOnly}
                                onChange={(e) => setShowMySitesOnly(e.target.checked)}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-10 left-6 z-[1000] glass-panel p-4 max-w-xs flex flex-col gap-4">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    <LegendItem color={SITE_COLORS.public} label="Espaços verdes públicos" />
                    <LegendItem color={SITE_COLORS.private} label="Espaços verdes privados" />
                    <LegendItem color={SITE_COLORS.community} label="Espaços verdes comunitários" />
                    <LegendItem color={SITE_COLORS.educational} label="Espaços verdes educativos" />
                    <LegendItem color={SITE_COLORS.micro} label="Microestruturas e soluções..." />
                    <LegendItem color={SITE_COLORS.riparian} label="Galeria ripícolas..." />
                    <LegendItem color={SITE_COLORS.linear} label="Infraestruturas verdes..." />
                    <LegendItem color={SITE_COLORS.other} label="Outro" />
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
                    <MapContent sites={filteredSites} user={user} />
                </MapContainer>
            </div>
        </div>
    );
};

// Component to handle zoom events and rendering switch
const MapContent = ({ sites, user }: { sites: any[], user: any }) => {
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
                                <SitePopupContent site={site} user={user} />
                            </Popup>
                        </CircleMarker>
                    ) : (
                        <GeoJSON
                            data={site.location}
                            style={{
                                color: SITE_COLORS[site.site_type] || '#ccc',
                                fillColor: SITE_COLORS[site.site_type] || '#ccc',
                                fillOpacity: 0.5,
                                weight: 2,
                                dashArray: site.status === 'pending' ? '5, 5' : undefined
                            }}
                        >
                            <Popup>
                                <SitePopupContent site={site} user={user} />
                            </Popup>
                        </GeoJSON>
                    )}
                </div>
            ))}
        </>
    );
};

const SitePopupContent = ({ site, user }: { site: any, user: any }) => (
    <div className="p-1 min-w-[200px]">
        {site.image_url && (
            <div className="mb-3 rounded-lg overflow-hidden h-32 w-full relative bg-slate-100">
                <img
                    src={site.image_url}
                    alt={site.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>
        )}
        <div className="flex items-center justify-between mb-2 pb-2 border-b">
            <h3 className="text-lg font-bold text-slate-900">{site.name || 'Sem nome'}</h3>
            {site.status === 'pending' && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full tracking-wider border border-amber-200">
                    Pendente
                </span>
            )}
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-slate-600">
                <MapPin size={14} className="text-primary mt-0.5" />
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide">
                        {SITE_LABELS[site.site_type] || site.site_type}
                        {site.site_type === 'other' && site.site_type_other && ` - ${site.site_type_other}`}
                    </span>
                    {site.site_subtype && (
                        <span className="text-xs text-slate-500 italic">
                            {site.site_subtype}
                        </span>
                    )}
                </div>
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
                            {action === 'other' && site.actions_other ? site.actions_other : (ACTION_LABELS[action] || action)}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
            {user && (user.id === site.user_id || ['lfac.pt@gmail.com', 'jloureiro@uc.pt'].includes(user.email || '')) && (
                <Link
                    to={`/map/${encodeURIComponent(site.id)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors"
                >
                    <Leaf size={14} />
                    Editar Local
                </Link>
            )}

            {site.website_url && (
                <a
                    href={site.website_url.startsWith('http') ? site.website_url : `https://${site.website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                    <ExternalLink size={14} />
                    Visitar Website
                </a>
            )}
        </div>
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
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-slate-600 font-medium">{label}</span>
    </div>
);

export default Explore;
