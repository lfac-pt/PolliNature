import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAdminStatus = async (currentUser: User | null) => {
        if (!currentUser) {
            setIsAdmin(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('admins')
                .select('email')
                .eq('email', currentUser.email)
                .single();

            // Single query throws if no rows returned, so we catch it
            if (error || !data) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        } catch (err) {
            console.error('Error checking admin status:', err);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            checkAdminStatus(currentUser).finally(() => setLoading(false));
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            checkAdminStatus(currentUser).finally(() => setLoading(false));
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
