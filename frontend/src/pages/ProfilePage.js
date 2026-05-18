import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.full_name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  // Use supabase.auth.getUser() — ensures we check the live auth server
  // rather than trusting only the last emitted getSession() value
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!authUser && !authLoading) {
        navigate("/auth");
      }
    });
  }, [authLoading, navigate]);

  // Full-page loading while auth initialises; getUser() guard below fires after this
  if (authLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ full_name: name, phone, address });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-testid="profile-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'Outfit' }}>My Profile</h1>
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-[#16a34a] rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{name || "User"}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            {user.role === "admin" && <span className="text-xs bg-[#16a34a] text-white px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 mb-1 flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm" data-testid="profile-name" />
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
            <input value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-slate-500" />
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm" data-testid="profile-phone" />
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your delivery address" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm resize-none" data-testid="profile-address" />
          </div>
          <button type="submit" disabled={saving} className="bg-[#16a34a] text-white hover:bg-[#15803d] rounded-xl px-6 py-3 font-medium transition-colors flex items-center gap-2 disabled:opacity-50" data-testid="save-profile-btn">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}