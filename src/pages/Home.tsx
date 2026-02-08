import React from 'react';
import { Leaf, Map as MapIcon, ShieldCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="relative overflow-hidden bg-white">
            {/* Decorative Network Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="4" fill="currentColor" className="text-primary" />
                    <circle cx="700" cy="150" r="6" fill="currentColor" className="text-secondary" />
                    <circle cx="400" cy="400" r="5" fill="currentColor" className="text-primary" />
                    <line x1="100" y1="100" x2="400" y2="400" stroke="currentColor" className="text-primary" strokeWidth="1" />
                    <line x1="700" y1="150" x2="400" y2="400" stroke="currentColor" className="text-secondary" strokeWidth="1" />
                </svg>
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 sm:pt-32 sm:pb-40">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nature-100 text-primary-dark font-medium text-sm mb-6">
                                <Leaf size={16} />
                                <span>Restaurar a Natureza em Coimbra</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl mb-6 text-slate-900 leading-tight">
                                Dê vida ao seu <span className="text-primary">Jardim</span> e ajude a <span className="text-secondary">Biodiversidade</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                                O projeto PolliNature incentiva o restauro da natureza em Coimbra. Mapeie a sua intervenção, calcule a área recuperada e inspire outros a fazer o mesmo.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Link to="/map" className="btn-primary flex items-center gap-2">
                                    <MapIcon size={20} />
                                    Mapear Ação
                                </Link>
                                <Link to="/about" className="px-6 py-3 border-2 border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-colors">
                                    Saber mais
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative w-80 h-80 sm:w-[500px] sm:h-[500px]">
                                {/* Circular image masks inspired by pollinet.pt */}
                                <div className="absolute inset-0 rounded-full border-4 border-nature-200 overflow-hidden shadow-2xl transform rotate-3 scale-95">
                                    <img
                                        src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800"
                                        alt="Natureza"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-4 border-amber-100 overflow-hidden shadow-xl transform -rotate-6">
                                    <img
                                        src="https://images.unsplash.com/photo-1558509374-95411707ef4c?auto=format&fit=crop&q=80&w=400"
                                        alt="Polinizador"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-slate-50 py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl mb-4">Como funciona?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Simples, transparente e impacto real para os ecossistemas locais.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MapIcon className="text-primary" />}
                            title="Mapeamento"
                            description="Desenhe os limites da sua intervenção no nosso mapa interativo e veja a área calculada automaticamente."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-secondary" />}
                            title="Validação"
                            description="A nossa equipa valida todos os registos para garantir a qualidade dos dados e transparência do projeto."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-primary" />}
                            title="Impacto Local"
                            description="Acompanhe o crescimento da rede de restauro no concelho de Coimbra e o aumento das áreas amigas dos polinizadores."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-2xl mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed">
            {description}
        </p>
    </div>
);

export default Home;
