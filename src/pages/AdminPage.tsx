import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, Clock, MapPin, Ruler, ExternalLink, User, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Popup, LayersControl } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import { SITE_COLORS, ACTION_LABELS } from '../constants/site';
const AdminPage = () => {
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPendingOnly, setShowPendingOnly] = useState(true);

    useEffect(() => {
        fetchSites();
    }, []);

    const handleEdit = (id: string) => {
        // Navigate to map page with edit mode
        window.location.href = `/map/${id}`;
    };

    const fetchSites = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('sites')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            const sitesWithCenters = data.map(site => {
                try {
                    const center = turf.center(site.location);
                    return {
                        ...site,
                        center: [center.geometry.coordinates[1], center.geometry.coordinates[0]]
                    };
                } catch (e) {
                    return site;
                }
            });
            setSites(sitesWithCenters);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('sites')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setSites(sites.map(s => s.id === id ? { ...s, status: newStatus } : s));
        } else {
            alert('Erro ao atualizar status. Verifique se tem permissões de Admin.');
        }
    };

    const handleExportCSV = () => {
        if (!sites || sites.length === 0) return;

        // Define columns
        const headers = [
            'ID', 'Nome', 'Tipo', 'Subtipo', 'Outro Tipo',
            'Area (m2)', 'Status', 'Data Criacao', 'Data Inicio', 'Data Fim',
            'Nome Autor', 'Autor Publico', 'Website',
            'Acoes Realizadas', 'Outras Acoes',
            'Localizacao (GeoJSON)', 'User ID'
        ];

        // Helper to escape CSV fields
        const escapeCsv = (str: any) => {
            if (str === null || str === undefined) return '';
            const stringValue = String(str);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Map sites to rows
        const rows = sites.map(site => [
            site.id,
            site.name,
            site.site_type,
            site.site_subtype,
            site.site_type_other,
            site.area_sqm,
            site.status,
            site.created_at,
            site.start_date,
            site.end_date,
            site.author_name,
            site.show_author,
            site.website_url,
            site.actions_taken?.join('; '),
            site.actions_other,
            JSON.stringify(site.location),
            site.user_id
        ].map(escapeCsv).join(','));

        // Combine headers and rows
        const csvContent = [headers.join(','), ...rows].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `pollinature_sites_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="p-20 text-center text-slate-500">A carregar registos...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl mb-2">Painel de Validação</h1>
                    <p className="text-slate-500">Existem {sites.filter(s => s.status === 'pending').length} registos pendentes.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="btn-secondary flex items-center gap-2"
                        title="Exporta todos os registos da base de dados (Validados e Pendentes)"
                    >
                        <Download size={18} />
                        Exportar Todos (CSV)
                    </button>
                    <Link to="/explore" className="btn-secondary flex items-center gap-2">
                        <ExternalLink size={18} />
                        Ver Mapa Público
                    </Link>
                </div>
            </div>

            <div className="h-96 rounded-3xl overflow-hidden mb-10 border border-slate-200 shadow-sm relative z-0">
                <AdminMap sites={showPendingOnly ? sites.filter(s => s.status === 'pending') : sites} />
                <div className="absolute top-4 left-[60px] z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                    <button
                        onClick={() => setShowPendingOnly(!showPendingOnly)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${showPendingOnly ? 'bg-primary' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${showPendingOnly ? 'left-5' : 'left-1'}`} />
                    </button>
                    <span className="text-xs font-bold text-slate-600 cursor-pointer select-none" onClick={() => setShowPendingOnly(!showPendingOnly)}>
                        Apenas por validar
                    </span>
                </div>
            </div>



            <div className="grid gap-6">
                {sites.map(site => (
                    <div key={site.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-start gap-6">
                        {site.image_url && (
                            <a href={site.image_url} target="_blank" rel="noopener noreferrer" className="block w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 group">
                                <img
                                    src={site.image_url}
                                    alt={site.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </a>
                        )}
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">{site.name || 'Sem nome'}</h3>
                                <StatusBadge status={site.status} />
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {site.site_type}</span>
                                {site.site_subtype && <span className="flex items-center gap-1.5 text-slate-500 border p-1 rounded bg-slate-50">{site.site_subtype}</span>}
                                {site.site_type === 'other' && site.site_type_other && <span className="flex items-center gap-1.5 text-slate-500 border p-1 rounded bg-slate-50">{site.site_type_other}</span>}
                                <span className="flex items-center gap-1.5"><Ruler size={14} /> {site.area_sqm.toFixed(2)} m²</span>
                                {site.start_date && (
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Início: {new Date(site.start_date).toLocaleDateString()}</span>
                                )}
                                <span className="flex items-center gap-1.5"><Clock size={14} /> Criado: {new Date(site.created_at).toLocaleDateString()}</span>
                                {site.author_name && <span className="flex items-center gap-1.5"><User size={14} /> {site.author_name} {site.show_author ? '(Público)' : '(Privado)'}</span>}
                                {site.website_url && (
                                    <a href={site.website_url} target="_blank" className="flex items-center gap-1.5 text-primary hover:underline">
                                        <ExternalLink size={14} /> Website
                                    </a>
                                )}
                            </div>

                            {site.actions_taken && site.actions_taken.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {site.actions_taken.map((action: string) => (
                                        <span key={action} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-tight">
                                            {action === 'other' && site.actions_other ? site.actions_other : (ACTION_LABELS[action] || action)}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            {site.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleEdit(site.id)}
                                        className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                        title="Editar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(site.id, 'approved')}
                                        className="h-12 px-6 rounded-2xl bg-nature-100 text-primary-dark font-bold flex items-center gap-2 hover:bg-nature-200 transition-colors"
                                    >
                                        <Check size={18} /> Aprovar
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(site.id, 'rejected')}
                                        className="h-12 px-6 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
                                    >
                                        <X size={18} /> Rejeitar
                                    </button>
                                </>
                            )}
                            {site.status !== 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleEdit(site.id)}
                                        className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                        title="Editar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(site.id, 'pending')}
                                        className="h-12 px-4 rounded-2xl bg-slate-50 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
                                    >
                                        Mover para Pendente
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {sites.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 text-lg">Ainda não existem registos para validar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-nature-100 text-primary-dark',
        rejected: 'bg-red-100 text-red-700'
    };
    const labels: any = {
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Rejeitado'
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

const AdminMap = ({ sites }: { sites: any[] }) => {
    return (
        <MapContainer center={[40.2033, -8.4103]} zoom={12} className="w-full h-full z-0">
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
            {sites.map(site => (
                <div key={site.id}>
                    {site.location && (
                        <GeoJSON
                            data={site.location}
                            style={{
                                color: SITE_COLORS[site.site_type] || '#ccc',
                                fillColor: SITE_COLORS[site.site_type] || '#ccc',
                                fillOpacity: 0.5,
                                weight: site.status === 'pending' ? 4 : 2,
                                dashArray: site.status === 'pending' ? '5,5' : undefined
                            }}
                        >
                            <Popup>
                                <div className="p-1 min-w-[150px]">
                                    <h3 className="font-bold text-sm mb-1">{site.name || 'Sem nome'}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <StatusBadge status={site.status} />
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{ACTION_LABELS[site.site_type] || site.site_type}</p>
                                </div>
                            </Popup>
                        </GeoJSON>
                    )}
                </div>
            ))}
        </MapContainer>
    );
};

export default AdminPage;
