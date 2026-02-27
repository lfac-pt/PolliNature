import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import About from './pages/About';
import Explore from './pages/Explore';
import WhatToDo from './pages/WhatToDo';
import LearnMore from './pages/LearnMore';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider } from './lib/AuthContext';

const App = () => {
  const basename = '';
  const getImgPath = (path: string) => path;

  return (
    <AuthProvider>
      <Router basename={basename}>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/map/:id" element={<MapPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/what-to-do" element={<WhatToDo />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          <footer className="bg-slate-900 text-white py-16">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-12 gap-12 mb-16">
                <div className="md:col-span-5 relative">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                  <div className="flex items-center gap-2 mb-6 relative">
                    <Leaf className="text-primary" size={32} />
                    <span className="text-2xl font-display font-bold">Poll&Nature</span>
                  </div>
                  <p className="text-slate-300 mb-8 leading-relaxed relative text-lg">
                    Uma iniciativa para fortalecer a rede urbana de espaços amigos dos polinizadores em Coimbra,
                    inspirada em boas práticas internacionais de planeamento para polinizadores e desenvolvida
                    pelo Centre for Functional Ecology da Universidade de Coimbra e Borboletas de Coimbra
                    no âmbito do projeto BeeConnected SUDOE.
                  </p>
                  <div className="space-y-3 text-slate-300 relative text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase tracking-wider text-[10px] w-28 shrink-0">E-mail</span>
                      <a href="mailto:flowerlab@uc.pt" className="hover:text-primary transition-colors text-base font-medium">flowerlab@uc.pt</a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase tracking-wider text-[10px] w-28 shrink-0">Conceção e design</span>
                      <span className="text-base font-medium">Luís Cardoso</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <h4 className="font-bold mb-6 text-lg">Links Rápidos</h4>
                  <ul className="space-y-4 text-slate-300">
                    <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
                    <li><Link to="/about" className="hover:text-primary transition-colors">Sobre</Link></li>
                    <li><Link to="/what-to-do" className="hover:text-primary transition-colors">O que fazer?</Link></li>
                    <li><Link to="/explore" className="hover:text-primary transition-colors">Explorar (Mapa Público)</Link></li>
                    <li><Link to="/map" className="hover:text-primary transition-colors">Participar / Começar Mapeamento</Link></li>
                    <li><Link to="/learn-more" className="hover:text-primary transition-colors">Para saber mais</Link></li>
                  </ul>
                </div>

                <div className="md:col-span-4">
                  <h4 className="font-bold mb-6 text-lg">Parceiros e Apoios</h4>
                  <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-center gap-5">
                    <a href="mailto:flowerlab@uc.pt" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/flower-lab.webp")} alt="FLOWer Lab" className="h-10 object-contain hover:scale-105 transition-transform" />
                    </a>
                    <a href="https://borboletasdecoimbra.pt/" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/borboletas_de_coimbra_logo.webp")} alt="Borboletas de Coimbra" className="h-10 object-contain hover:scale-105 transition-transform" />
                    </a>
                    <a href="https://cfe.uc.pt/" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/cfe.webp")} alt="Centre for Functional Ecology" className="h-10 object-contain hover:scale-105 transition-transform" />
                    </a>
                    <a href="https://www.uc.pt/" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/uc.webp")} alt="Universidade de Coimbra" className="h-10 object-contain hover:scale-105 transition-transform" />
                    </a>
                    <a href="https://pollinet.pt/" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/pollinet.webp")} alt="polli.NET" className="h-9 object-contain hover:scale-105 transition-transform" />
                    </a>
                    <a href="https://interreg-sudoe.eu/pt-pt/proyecto-interreg/beeconnected-sudoe/" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/beeconnected.webp")} alt="BeeConnected SUDOE" className="h-14 object-contain hover:scale-105 transition-transform" />
                    </a>
                    <a href="https://www.instagram.com/jardimmonteformoso/" target="_blank" rel="noopener noreferrer">
                      <img src={getImgPath("/logos/sao-flores.webp")} alt="Jardim São Flores e Monte Formoso Coimbra" className="h-10 object-contain hover:scale-105 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Poll&Nature Coimbra. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
