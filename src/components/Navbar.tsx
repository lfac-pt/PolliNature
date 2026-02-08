import { Link } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

const Navbar = () => {
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-100">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                            <Leaf size={24} />
                        </div>
                        <span className="text-xl font-display font-bold text-slate-900 tracking-tight">PolliNature</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-slate-600 hover:text-primary font-medium transition-colors">Início</Link>
                        <Link to="/explore" className="text-slate-600 hover:text-primary font-medium transition-colors">Explorar</Link>
                        {user && <Link to="/admin" className="text-slate-600 hover:text-primary font-medium transition-colors">Validar</Link>}
                        <Link to="/about" className="text-slate-600 hover:text-primary font-medium transition-colors">Sobre o Projeto</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="hidden sm:block text-sm font-medium text-slate-500">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    title="Sair"
                                >
                                    <LogOut size={20} />
                                </button>
                                <Link to="/map" className="btn-primary py-2 px-6 text-sm text-white">
                                    Participar
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-5 py-2 text-slate-600 hover:text-primary font-semibold transition-colors">
                                    Entrar
                                </Link>
                                <Link to="/map" className="btn-primary py-2 px-6 text-sm text-white">
                                    Participar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
