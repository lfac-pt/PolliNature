import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, Clock, MapPin, Ruler, ExternalLink, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACTION_LABELS: Record<string, string> = {
    floral_resources: 'Manutenção de recursos florais',
    support_structures: 'Manutenção de estruturas',
    vegetation_management: 'Gestão do coberto vegetal',
    planting: 'Plantação/sementeira',
    invasive_control: 'Controlo de invasoras',
    nesting: 'Abrigo/nidificação',
    chemicals: 'Sem químicos',
    education: 'Educação ambiental',
    monitoring: 'Monitorização',
    other: 'Outro',
    // Legacy mapping
    habitats: 'Proteger habitats',
    mowing: 'Reduzir corte',
    control: 'Controlo invasoras',
    pesticides: 'Sem pesticidas',
    awareness: 'Sensibilização',
    tracking: 'Monitorização',
    bio_general: 'Biodiversidade'
};

const AdminPage = () => {
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('sites')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setSites(data);
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
                <Link to="/explore" className="btn-secondary flex items-center gap-2">
                    <ExternalLink size={18} />
                    Ver Mapa Público
                </Link>
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
                                <button
                                    onClick={() => handleStatusUpdate(site.id, 'pending')}
                                    className="h-12 px-4 rounded-2xl bg-slate-50 text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
                                >
                                    Mover para Pendente
                                </button>
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

export default AdminPage;
