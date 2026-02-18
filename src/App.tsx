import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import About from './pages/About';
import Explore from './pages/Explore';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider } from './lib/AuthContext';

const App = () => {
  const basename = process.env.NODE_ENV === 'production' ? '/PolliNature' : '';

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
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          <footer className="bg-slate-900 text-white py-16">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <Leaf className="text-primary" size={32} />
                    <span className="text-2xl font-display font-bold">PolliNature</span>
                  </div>
                  <p className="text-slate-400 max-w-sm mb-6">
                    Uma iniciativa para o restauro da natureza em jardins e quintais de Coimbra.
                    Inspirado pelo All-Ireland Pollinator Plan.
                  </p>
                  <div className="flex gap-4">
                    {/* Social links placeholder */}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-6 italic">Links Rápidos</h4>
                  <ul className="space-y-4 text-slate-400">
                    <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
                    <li><Link to="/map" className="hover:text-primary transition-colors">Mapa Publico</Link></li>
                    <li><Link to="/register" className="hover:text-primary transition-colors">Registrar Local</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-6 italic">Documentação</h4>
                  <ul className="space-y-4 text-slate-400">
                    <li><a href="https://pollinators.ie" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Polinators Plan (Ireland)</a></li>
                    <li><a href="https://www.pollinet.pt/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">PolliNet.pt</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} PolliNature Coimbra. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
