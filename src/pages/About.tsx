import { Users, Shield, Target } from 'lucide-react';
import photo1 from '../assets/photos/photo1.webp';
import photo2 from '../assets/photos/photo2.webp';
import photo3 from '../assets/photos/photo3.webp';
import photo4 from '../assets/photos/photo4.webp';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            <section className="py-20 bg-nature-50">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl lg:text-6xl mb-6">Sobre o <span className="text-primary">Poll&Nature</span></h1>
                    <div className="text-xl text-slate-600 max-w-4xl mx-auto space-y-6 text-center">
                        <p>
                            O Poll&Nature é a plataforma de Coimbra para agir em prol dos polinizadores e da
                            biodiversidade urbana. Através de um sistema colaborativo de mapeamento, qualquer
                            cidadão, escola, empresa, associação ou entidade pública pode tornar visíveis as
                            ações que implementa no território. Cada registo contribui para construir uma cidade
                            mais conectada, mais resiliente e ecologicamente mais funcional.
                        </p>
                        <p>
                            Desenvolvido no âmbito do projeto europeu BeeConnected SUDOE, o Poll&Nature é
                            coordenado pelo Centre for Functional Ecology da Universidade de Coimbra, em
                            estreita articulação com o Jardim Monte Formoso e a iniciativa São Flores, Coimbra e a
                            polli.NET.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="flex items-center">
                            <div className="space-y-8">
                                <AboutItem
                                    icon={<Target className="text-primary" />}
                                    title="A nossa missão"
                                    text="Mobilizar a comunidade para transformar espaços verdes públicos, privados, comunitários e educativos em habitats mais favoráveis aos polinizadores. Ao ligar jardins, hortas, galerias ripícolas, varandas com plantas e infraestruturas verdes lineares, criamos uma rede ecológica urbana que sustenta abelhas, moscas-das-flores, borboletas e muitos outros organismos essenciais ao equilíbrio dos ecossistemas."
                                />
                                <AboutItem
                                    icon={<Shield className="text-secondary" />}
                                    title="Rigor e transparência"
                                    text="Todos os registos são analisados por uma equipa técnica, garantindo qualidade, consistência e credibilidade científica. Esta validação assegura que as ações reportadas contribuem efetivamente para a promoção da biodiversidade e para o restauro ecológico em contexto urbano."
                                />
                                <AboutItem
                                    icon={<Users className="text-primary" />}
                                    title="Comunidade e ação coletiva"
                                    text="O Poll&Nature é uma iniciativa aberta e participativa. Cada ação individual reforça um esforço coletivo maior. Ao mapearmos o que já está a ser feito, inspiramos novas intervenções, fortalecemos a conectividade ecológica da cidade e demonstramos que a conservação da biodiversidade começa à escala local."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-primary/10">
                                    <img src={photo1} className="w-full h-full object-cover" alt="Garden" />
                                </div>
                                <div className="h-48 rounded-3xl overflow-hidden shadow-lg border-2 border-secondary/10">
                                    <img src={photo2} className="w-full h-full object-cover" alt="Pollinator" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-48 rounded-3xl overflow-hidden shadow-lg border-2 border-secondary/10">
                                    <img src={photo3} className="w-full h-full object-cover" alt="Strawberries" />
                                </div>
                                <div className="h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-primary/10">
                                    <img src={photo4} className="w-full h-full object-cover" alt="Nature" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-primary/5 text-center mt-6">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl leading-tight font-medium text-slate-800">
                        Cada espaço conta. Cada ação importa. Juntos, podemos construir uma Coimbra mais biodiversa, resiliente e preparada para os desafios ambientais do futuro.
                    </h2>
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
