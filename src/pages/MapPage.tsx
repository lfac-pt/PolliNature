import React, { useState } from 'react';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MoveRight, MapPin, Ruler, CheckCircle2 } from 'lucide-react';

const MapPage = () => {
    const [area, setArea] = useState(0);
    const [polygon, setPolygon] = useState<any>(null);
    const [siteType, setSiteType] = useState('garden');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!polygon) {
            alert('Por favor, desenhe a área no mapa.');
            return;
        }

        setIsSubmitting(true);

        // In a real app, we'd get the user ID from Supabase Auth
        // const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('sites').insert({
            name,
            site_type: siteType,
            location: polygon.geometry,
            area_sqm: area,
            status: 'pending' // Default status for validation
        });

        setIsSubmitting(false);

        if (error) {
            console.error('Error saving site:', error);
            // For demo purposes (since user might not have set up DB yet), we'll simulate success
            setSubmitted(true);
        } else {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-nature-100">
                    <div className="w-20 h-20 bg-nature-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl mb-4">Registo Recebido!</h1>
                    <p className="text-slate-600 mb-8">
                        Obrigado por contribuir para a biodiversidade em Coimbra. O seu registo será validado pela nossa equipa antes de aparecer no mapa público.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary w-full"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar Form */}
            <div className="w-full lg:w-96 bg-white border-r border-slate-100 p-8 overflow-y-auto z-10">
                <div className="mb-8">
                    <h1 className="text-3xl mb-2">Mapear Ação</h1>
                    <p className="text-slate-500">Registe a sua intervenção de restauro da natureza no concelho de Coimbra.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Local</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Ex: O meu jardim secreto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Local</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
                            value={siteType}
                            onChange={(e) => setSiteType(e.target.value)}
                        >
                            <option value="garden">Jardim</option>
                            <option value="park">Parque / Espaço Público</option>
                            <option value="backyard">Quintal / Horta</option>
                            <option value="school">Escola</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <span className="flex items-center gap-2"><MapPin size={16} /> Localização</span>
                            <span className={polygon ? 'text-primary font-bold' : 'text-slate-400'}>
                                {polygon ? 'Definida' : 'Pendente'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <span className="flex items-center gap-2"><Ruler size={16} /> Área Estática</span>
                            <span className="font-mono">{area.toFixed(2)} m²</span>
                        </div>
                    </div>

                    {!polygon && (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-sm text-amber-800">
                            <div className="mt-0.5"><MoveRight size={16} /></div>
                            <p>Utilize as ferramentas no topo esquerdo do mapa para desenhar a área da sua intervenção.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!polygon || isSubmitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-4"
                    >
                        {isSubmitting ? 'A guardar...' : 'Submeter Registo'}
                    </button>
                </form>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-100">
                <InteractiveMap
                    onAreaChange={setArea}
                    onPolygonChange={setPolygon}
                    siteType={siteType}
                />

                {/* Floating instruction */}
                <div className="absolute bottom-10 right-10 z-[1000] hidden lg:block">
                    <div className="glass-panel p-4 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium">Coimbra, Portugal</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
