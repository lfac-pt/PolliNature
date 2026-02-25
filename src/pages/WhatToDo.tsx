import React from 'react';
import { Leaf, Sprout, Wind, Flower2, Scissors, Hammer, ShieldOff, GraduationCap, Microscope } from 'lucide-react';

const WhatToDo = () => {
    return (
        <div className="bg-white min-h-screen">
            <section className="py-20 bg-nature-50">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl lg:text-6xl mb-6">O que <span className="text-primary">fazer?</span></h1>
                    <p className="text-xl text-slate-600 max-w-4xl mx-auto">
                        Pequenas ações, quando ligadas em rede, têm um grande impacto na biodiversidade urbana. Eis algumas medidas concretas que pode implementar no seu espaço.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <ActionCard
                            icon={<Flower2 className="text-primary w-8 h-8" />}
                            title="Manutenção de recursos florais nativos espontâneos"
                            text="Conserve zonas naturalizadas com vegetação herbácea espontânea e plantas silvestres com flor, recorrendo apenas a intervenções pontuais de controlo da vegetação. Estas áreas fornecem alimento ao longo do ano e são, em regra, mais resistentes à seca e menos exigentes em rega e manutenção."
                        />
                        <ActionCard
                            icon={<Wind className="text-secondary w-8 h-8" />}
                            title="Manutenção de estruturas de suporte existentes"
                            text="Preserve vegetação arbustiva e arbórea natural, bem como matéria morta associada. Mantenha afloramentos rochosos, muros de pedra, taludes e pequenas áreas de solo exposto. Estes elementos funcionam como locais de nidificação para abelhas selvagens e como abrigo e alimento para moscas-das-flores e borboletas."
                        />
                        <ActionCard
                            icon={<Leaf className="text-emerald-500 w-8 h-8" />}
                            title="Gestão diferenciada do coberto vegetal"
                            text="Reduza a frequência de corte da relva e adie o corte até após a frutificação. Pode também aplicar cortes diferenciados em zonas distintas do espaço. Esta abordagem permite que as plantas nativas completem o seu ciclo de vida e prolonga a disponibilidade de flores (alimento na forma de pólen e/ou néctar) para os polinizadores."
                        />
                        <ActionCard
                            icon={<Sprout className="text-primary w-8 h-8" />}
                            title="Plantação e sementeira de flora diversa"
                            text="Plante ou semeie espécies nativas com flor, silvestres ou aromáticas, de porte herbáceo, arbustivo ou arbóreo. Estas plantas complementam a flora local, especialmente em ambientes mais artificializados, aumentando a diversidade estrutural e funcional do habitat."
                        />
                        <ActionCard
                            icon={<Scissors className="text-red-500 w-8 h-8" />}
                            title="Controlo de plantas invasoras"
                            text="Remova manualmente espécies invasoras como mimosas (Acacia), canas (Arundo) ou penachos (Cortaderia selloana). A sua eliminação permite recuperar áreas degradadas, aumentar a diversidade de plantas nativas e melhorar a disponibilidade de alimento e de locais de nidificação para os polinizadores."
                        />
                        <ActionCard
                            icon={<Hammer className="text-amber-600 w-8 h-8" />}
                            title="Criação de locais de suporte e/ou nidificação"
                            text="Crie micro-habitats que não existiam previamente, como pequenas áreas de solo exposto, corpos de água, acumulações de madeira morta ou folhada, amontoados de pedra ou hotéis de insetos. Pode também plantar espécies hospedeiras para larvas de borboletas ou plantas que forneçam recursos a diferentes fases do ciclo de vida dos polinizadores. Estas estruturas são essenciais para que completem o seu ciclo de vida."
                        />
                        <ActionCard
                            icon={<ShieldOff className="text-rose-600 w-8 h-8" />}
                            title="Eliminação do uso de químicos"
                            text="Substitua pesticidas, fungicidas e herbicidas por métodos mecânicos ou por uma gestão ecológica do espaço. O corte seletivo, a monda mecânica e a renaturalização local evitam impactos negativos na biodiversidade e promovem serviços dos ecossistemas como controlo biológico de pragas, qualidade do solo e regulação hídrica."
                        />
                        <ActionCard
                            icon={<GraduationCap className="text-blue-500 w-8 h-8" />}
                            title="Iniciativas de educação e sensibilização ambiental"
                            text="Instale sinalética explicativa, organize workshops ou visitas guiadas. Envolver a comunidade aumenta a literacia ecológica e garante continuidade às ações implementadas."
                        />
                        <ActionCard
                            icon={<Microscope className="text-fuchsia-500 w-8 h-8" />}
                            title="Monitorização e/ou participação em projetos de ciência cidadã"
                            text="Registe observações em plataformas como o iNaturalist, participe em contagens FITCount ou em programas de monitorização de borboletas. A recolha de dados por cidadãos é fundamental para apoiar decisões de gestão e fortalecer a ligação entre ciência, território e sociedade."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const ActionCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-50 hover:border-primary/20 transition-all hover:shadow-xl group flex flex-col h-full">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-800 leading-tight">{title}</h3>
        <p className="text-slate-600 leading-relaxed flex-grow">{text}</p>
    </div>
);

export default WhatToDo;
