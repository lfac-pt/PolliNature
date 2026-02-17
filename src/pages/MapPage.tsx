import React, { useState } from 'react';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MoveRight, MapPin, Ruler, CheckCircle2, Info, Upload, X } from 'lucide-react';
import { resizeImage } from '../utils/imageUtils';

const MapPage = () => {
    const [area, setArea] = useState(0);
    const [polygon, setPolygon] = useState<any>(null);
    const [siteType, setSiteType] = useState('public');
    const [subType, setSubType] = useState('');
    const [otherDescription, setOtherDescription] = useState('');
    const [name, setName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [showAuthor, setShowAuthor] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [otherActionsDescription, setOtherActionsDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    const SITE_SUBTYPES: Record<string, string[]> = {
        public: [
            'Jardins públicos e parques urbanos',
            'Jardins históricos',
            'Espaços verdes associados a equipamentos ou instituições públicas',
            'Outros espaços verdes públicos'
        ],
        private: [
            'Jardins residenciais',
            'Quintais e hortas',
            'Terreno com vegetação espontânea',
            'Espaços verdes associados a empresas, hotéis, comércio ou serviços',
            'Outros espaços verdes privados'
        ],
        community: [
            'Hortas urbanas comunitárias',
            'Baldios',
            'Outros espaços verdes comunitários'
        ],
        educational: [
            'Jardins, espaços verdes e hortas escolares',
            'Jardins e espaços verdes universitários',
            'Outros espaços verdes educativos'
        ],
        micro: [
            'Floreiras',
            'Caldeiras de árvores',
            'Varandas com plantas',
            'Telhados verdes',
            'Paredes verdes',
            'Outras microestruturas'
        ],
        riparian: [
            'Zonas ribeirinhas com vegetação espontânea',
            'Taludes ribeirinhos com vegetação espontânea',
            'Outras zonas húmidas'
        ],
        linear: [
            'Bermas de estrada, caminhos urbanos, ciclovias ou percursos pedonais com vegetação espontânea',
            'Separadores centrais com vegetação espontânea',
            'Rotundas com vegetação espontânea',
            'Taludes rodoviários com vegetação espontânea',
            'Outras infraestruturas verdes lineares e/ou viárias'
        ]
    };

    const ACTIONS = [
        {
            id: 'floral_resources',
            label: 'Manutenção de recursos florais nativos espontâneos',
            tooltip: 'Conservação de áreas com plantas com flor nativas espontâneas'
        },
        {
            id: 'support_structures',
            label: 'Manutenção de estruturas de suporte existentes',
            tooltip: 'e.g., conservação de muros de pedra e taludes, manutenção de sebes com arbustos nativos'
        },
        {
            id: 'vegetation_management',
            label: 'Gestão diferenciada do coberto vegetal',
            tooltip: 'e.g., redução da frequência de corte da relva, adiamento do corte para o final do verão para permitir a floração e a sementeira natural'
        },
        {
            id: 'planting',
            label: 'Plantação e sementeira de flora diversa',
            tooltip: 'e.g., criação de prados com sementes de plantas com flor silvestres nativas, plantação de aromáticas ou árvores de fruto nativas'
        },
        {
            id: 'invasive_control',
            label: 'Controlo de plantas invasoras',
            tooltip: 'e.g., remoção manual de mimosas, penachos ou outras espécies exóticas invasoras'
        },
        {
            id: 'nesting',
            label: 'Criação de locais de abrigo e/ou nidificação',
            tooltip: 'e.g., instalação de hotéis de insetos, manutenção de madeira morta, criação de áreas de solo exposto'
        },
        {
            id: 'chemicals',
            label: 'Eliminação do uso de químicos',
            tooltip: 'e.g., substituição de herbicidas por monda mecânica, eliminação total do uso de pesticidas e herbicidas'
        },
        {
            id: 'education',
            label: 'Iniciativas de educação e sensibilização ambiental',
            tooltip: 'e.g., colocação de sinalética explicativa no local, organização de workshops ou visitas guiadas sobre polinizadores'
        },
        {
            id: 'monitoring',
            label: 'Monitorização e/ou participação em projetos de ciência cidadã',
            tooltip: 'e.g., registo de observações no BioDiversity4All, realização de contagens FITCount, participação no eBMS'
        },
        {
            id: 'other',
            label: 'Outro',
            tooltip: ''
        },
    ];

    const handleActionToggle = (id: string) => {
        setSelectedActions(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                // Resize image to max 800x800, 0.7 quality
                const resizedBlob = await resizeImage(file, 800, 800, 0.7);
                setImageFile(resizedBlob);
                setImagePreview(URL.createObjectURL(resizedBlob));
            } catch (error) {
                console.error('Error resizing image:', error);
                alert('Erro ao processar imagem. Tente novamente.');
            }
        }
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!polygon) {
            alert('Por favor, desenhe a área no mapa.');
            return;
        }

        if (selectedActions.length === 0) {
            alert('Por favor, selecione pelo menos uma ação realizada.');
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (imageFile && !user) {
                throw new Error('Apenas utilizadores autenticados podem carregar imagens.');
            }

            // 1. Insert Site first to get ID
            const { data: siteData, error: insertError } = await supabase
                .from('sites')
                .insert({
                    name,
                    site_type: siteType,
                    site_subtype: subType || null,
                    site_type_other: siteType === 'other' ? otherDescription : null,
                    location: polygon.geometry,
                    area_sqm: area,
                    actions_taken: selectedActions,
                    actions_other: selectedActions.includes('other') ? otherActionsDescription : null,
                    author_name: authorName,
                    show_author: showAuthor,
                    website_url: websiteUrl,
                    start_date: startDate,
                    end_date: endDate || null,
                    user_id: user?.id,
                    status: 'pending'
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // 2. Upload Image using Site ID as filename (enforces one image per site)
            if (imageFile && siteData) {
                const fileExt = 'jpg';
                const filePath = `sites/${siteData.id}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('site_images')
                    .upload(filePath, imageFile, {
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    alert('Local registado com sucesso, mas ocorreu um erro ao carregar a imagem.');
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('site_images')
                        .getPublicUrl(filePath);

                    // 3. Update Site with Image URL
                    await supabase
                        .from('sites')
                        .update({ image_url: publicUrl })
                        .eq('id', siteData.id);
                }
            }

            setSubmitted(true);
        } catch (error: any) {
            console.error('Error saving site:', error);
            alert(error.message || 'Erro ao submeter o registo. Verifique os dados e tente novamente.');
        } finally {
            setIsSubmitting(false);
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
            <div className="w-full lg:w-[480px] bg-white border-r border-slate-100 p-8 overflow-y-auto z-10">
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
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Fotografia do Local <span className="text-slate-400 font-normal ml-1">(Opcional)</span></label>
                        <div className="flex items-start gap-4">
                            {imagePreview ? (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex-1 cursor-pointer group">
                                    <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 group-hover:bg-white group-hover:border-primary/50 transition-all">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-primary">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-primary">Carregar Fotografia</span>
                                        <span className="text-xs text-slate-400 mt-1">Carregamento automático com redução de tamanho</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Ação Realizada por (Nome/Entidade)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                required
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                placeholder="Ex: Nome do morador ou associação"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                            />
                            <label className={`flex items-center gap-2 px-4 rounded-xl border cursor-pointer transition-all select-none ${showAuthor ? 'bg-nature-100 border-nature-200 text-primary-dark' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    checked={showAuthor}
                                    onChange={(e) => setShowAuthor(e.target.checked)}
                                />
                                <span className="text-sm font-medium">Público</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Website / Redes Sociais <span className="text-slate-400 font-normal ml-1">(Opcional)</span>
                        </label>
                        <input
                            type="url"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="https://exemplo.pt"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Local</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
                            value={siteType}
                            onChange={(e) => {
                                setSiteType(e.target.value);
                                setSubType('');
                            }}
                        >
                            <option value="public">Espaços verdes públicos</option>
                            <option value="private">Espaços verdes privados</option>
                            <option value="community">Espaços verdes comunitários</option>
                            <option value="educational">Espaços verdes educativos</option>
                            <option value="micro">Microestruturas e soluções baseadas na natureza</option>
                            <option value="riparian">Galeria ripícolas e zonas ribeirinhas</option>
                            <option value="linear">Infraestruturas verdes lineares e/ou viárias</option>
                            <option value="other">Outro</option>
                        </select>

                        {SITE_SUBTYPES[siteType] && (
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Sub-tipo de Local</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
                                    value={subType}
                                    required
                                    onChange={(e) => setSubType(e.target.value)}
                                >
                                    <option value="">Selecione uma opção...</option>
                                    {SITE_SUBTYPES[siteType].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {siteType === 'other' && (
                            <input
                                type="text"
                                className="w-full mt-4 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Descreva o tipo de local..."
                                value={otherDescription}
                                onChange={(e) => setOtherDescription(e.target.value)}
                                required
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Data de Início</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Data de Fim <span className="text-slate-400 font-normal">(Opcional)</span></label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Ações Realizadas</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 overflow-x-hidden">
                            {ACTIONS.map(action => (
                                <div key={action.id}>
                                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer flex-shrink-0"
                                            checked={selectedActions.includes(action.id)}
                                            onChange={() => handleActionToggle(action.id)}
                                        />
                                        {action.id === 'other' && selectedActions.includes(action.id) ? (
                                            <input
                                                type="text"
                                                autoFocus
                                                className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="Descreva qual..."
                                                value={otherActionsDescription}
                                                onChange={(e) => setOtherActionsDescription(e.target.value)}
                                                onClick={(e) => e.preventDefault()}
                                            />
                                        ) : (
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors leading-tight select-none flex-1 flex items-center gap-1.5">
                                                {action.label}
                                                {action.tooltip && (
                                                    <span className="text-slate-400 hover:text-primary" title={action.tooltip}>
                                                        <Info size={14} />
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>
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
            <div className={`flex-1 relative bg-slate-100 ${!polygon ? 'map-draw-mode' : ''}`}>
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
