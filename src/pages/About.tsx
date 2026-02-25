import { Users, Shield, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            <section className="py-20 bg-nature-50">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl lg:text-6xl mb-6">Sobre o <span className="text-primary">Poll&Nature</span></h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Uma iniciativa focada no restauro ecológico urbano, incentivando cidadãos a transformar os seus espaços em refúgios para a biodiversidade.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl mb-8 leading-tight">Incentivando o Restauro da Natureza em Coimbra</h2>
                            <div className="space-y-8">
                                <AboutItem
                                    icon={<Target className="text-primary" />}
                                    title="A Nossa Missão"
                                    text="Promover ações concretas de conservação em jardins, quintais e espaços públicos no concelho de Coimbra, criando uma rede conectada de habitats."
                                />
                                <AboutItem
                                    icon={<Shield className="text-secondary" />}
                                    title="Rigor e Transparência"
                                    text="Todos os registos são validados por especialistas para garantir que as ações reportadas contribuem efetivamente para os ecossistemas locais."
                                />
                                <AboutItem
                                    icon={<Users className="text-primary" />}
                                    title="Comunidade"
                                    text="Inspirado no All-Ireland Pollinator Plan, queremos mobilizar a comunidade de Coimbra para ser um exemplo nacional de biodiversidade urbana."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-primary/10">
                                    <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Garden" />
                                </div>
                                <div className="h-48 rounded-3xl overflow-hidden shadow-lg border-2 border-secondary/10">
                                    <img src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Pollinator" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-48 rounded-3xl overflow-hidden shadow-lg border-2 border-secondary/10">
                                    <img src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Strawberries" />
                                </div>
                                <div className="h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-primary/10">
                                    <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Nature" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AboutItem = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
    <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{text}</p>
        </div>
    </div>
);

export default About;
