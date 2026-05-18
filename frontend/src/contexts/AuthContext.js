import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (session) => {
    if (!session?.user) {
      setUser(null);
      return;
    }
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setUser({
        id: session.user.id,
        email: session.user.email,
        ...(profile || {}),
      });
    } catch {
      setUser({
        id: session.user.id,
        email: session.user.email,
      });
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_UP') {
          if (session) await fetchProfile(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchProfile(data.session);
    return data.user;
  };

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) throw error;
    if (data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      return { id: data.user.id, email: data.user.email, ...(profile || {}) };
    }
    // Email confirmation required — no session yet, but user was created
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (error) throw error;
    setUser({ ...user, ...updates });
    return user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}