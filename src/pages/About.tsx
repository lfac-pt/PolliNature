import { Users, Shield, Target } from 'lucide-react';

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

            <section className="py-20 bg-primary/5 text-center mt-6">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl leading-tight font-medium text-slate-800">
                        Cada espaço conta. Cada ação importa. Juntos, podemos construir uma Coimbra mais biodiversa, resiliente e preparada para os desafios ambientais do futuro.
                    </h2>
                </div>
            </section>
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Para saber mais</h2>

                    <div className="space-y-12">
                        {/* Investigação e Monitorização */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-primary border-b border-slate-100 pb-4">Investigação e Monitorização</h3>
                            <div className="space-y-6">
                                <ResourceLink
                                    title="BeeConnected SUDOE (PT, ES, FR)"
                                    description="Projeto transfronteiriço de restauro de infraestruturas verdes para os polinizadores em paisagens fragmentadas."
                                    url="https://interreg-sudoe.eu/pt-pt/proyecto-interreg/beeconnected-sudoe/"
                                />
                                <ResourceLink
                                    title="polli.NET (PT)"
                                    description="Rede Colaborativa para a Avaliação, Conservação e Valorização dos Polinizadores e da Polinização."
                                    url="https://www.pollinet.pt"
                                />
                                <ResourceLink
                                    title="PolinizAÇÃO (PT)"
                                    description="Plano de Ação para a Conservação e Sustentabilidade dos Polinizadores."
                                    url="https://www.pollinet.pt/polinização"
                                />
                                <ResourceLink
                                    title="FITCount – contagem de polinizadores em flores (PolinizAÇÃO) (PT)"
                                    description="Contagens temporizadas de interações planta-polinizador."
                                    url="https://www.pollinet.pt/fitcount"
                                />
                                <ResourceLink
                                    title="PolinizAÇÃO - interações planta-polinizador (BioDiversity4All) (PolinizAÇÃO) (PT)"
                                    description="Projeto de ciência cidadã para recolher registos da polinização através de fotografias de insetos e flores em interação."
                                    url="https://www.inaturalist.org/projects/polinizacao-interacoes-planta-polinizador"
                                />
                                <ResourceLink
                                    title="Censos de Borboletas de Portugal (Tagis) (PT)"
                                    description="Projeto de ciência cidadã para monitorização de borboletas diurnas."
                                    url="https://www.tagis.pt"
                                />
                                <ResourceLink
                                    title="Rede de Estações de Borboletas Noturnas (Associação REBN) (PT)"
                                    description="Projeto de ciência cidadã para monitorização de borboletas noturnas."
                                    url="https://www.reborboletasn.org"
                                />
                                <ResourceLink
                                    title="Flora-On (Sociedade Portuguesa de Botânica) (PT)"
                                    description="Portal onde se pretende sistematizar informação fotográfica, geográfica, morfológica e ecológica de todas as espécies de plantas vasculares autóctones ou naturalizadas listadas para a flora de Portugal (Continente, Açores e Madeira)."
                                    url="https://flora-on.pt/"
                                />
                            </div>
                        </div>

                        {/* Recursos Educativos */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-secondary border-b border-slate-100 pb-4">Recursos Educativos</h3>
                            <div className="space-y-6">
                                <ResourceLink
                                    title="Pollinator Academy (Naturalis Biodiversity Center) (PT, EN)"
                                    description="Compilação de recursos educativos sobre polinizadores europeus, com materiais de aprendizagem para todos os níveis."
                                    url="https://pollinatoracademy.eu/"
                                />
                                <ResourceLink
                                    title="Guia de campo dos insetos e plantas de Oeiras (Tagis/CM Oeiras) (PT)"
                                    description="Guia de campo sobre as espécies presentes nas Estações da Biodiversidade e Biospots de Oeiras, com conteúdos científicos sobre 162 insetos e 88 plantas."
                                    url="http://www.tagis.pt/uploads/4/7/9/5/47950987/guia_oeiras2022digital.pdf"
                                />
                                <ResourceLink
                                    title="Guia dos Insetos Polinizadores de Guimarães (Laboratório da Paisagem) (PT)"
                                    description="Guia com 40 espécies de insetos polinizadores, na sua fase adulta, observados no concelho de Guimarães."
                                    url="https://www.labpaisagem.pt/wp-content/uploads/2022/10/Guia-dos-insetos-polinizadores-de-Guimaraes-Web.pdf"
                                />
                                <ResourceLink
                                    title="Chaves dicotómicas dos géneros de abelhas de Portugal: Hymenoptera Anthophila (Universidade de Coimbra) (PT)"
                                    description="Versão atualizada das chaves dicotómicas dos géneros de abelhas de Portugal."
                                    url="https://monographs.uc.pt/iuc/catalog/book/478"
                                />
                                <ResourceLink
                                    title="Chave ilustrada dos géneros de sirfídeos da Europa (Syrphidae e Microdontidae) (PolinizAÇÃO) (PT)"
                                    description="Chave de identificação traduzida, atualizada e ampliada da Illustrated key to the hoverfly genera of Europe que engloba agora todos os géneros europeus de moscas-das-flores e é a primeira do seu género totalmente ilustrada."
                                    url="https://zenodo.org/records/14832065"
                                />
                                <ResourceLink
                                    title="Guia das borboletas comuns de Portugal Continental (Tagis) (PT)"
                                    description="Guia de apoio à realização dos Censos de Borboletas de Portugal, com imagens de 60 borboletas diurnas."
                                    url="https://tagis.pt/wp-content/uploads/2020/07/Guia-Borboletas-Comuns-PT.pdf"
                                />
                                <ResourceLink
                                    title="Borboletas de Coimbra (Luís Cardoso) (PT)"
                                    description="Plataforma com informação sobre as borboletas diurnas que ocorrem no distrito de Coimbra."
                                    url="https://borboletasdecoimbra.pt"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ResourceLink = ({ title, description, url }: { title: string, description: string, url: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all group">
        <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">{description}</p>
        <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            Visitar site <span className="text-lg leading-none">&rarr;</span>
        </span>
    </a>
);

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
