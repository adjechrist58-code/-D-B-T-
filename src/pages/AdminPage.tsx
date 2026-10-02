import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  ClipboardList, 
  Settings as SettingsIcon, 
  BookOpen, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Phone, 
  ExternalLink, 
  Sparkles, 
  Save, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import { Product, Offer, StoreSettings, OrderStatus } from '../types/store';
import { ImageUploader } from '../components/ImageUploader';

interface AdminPageProps {
  onBackToStore: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToStore }) => {
  const { user, loginWithGoogle, loginWithEmail, logout } = useAuth();
  const { settings, updateSettings, formatPrice, isFirestoreConnected } = useStore();
  const { products, offers, addProduct, updateProduct, deleteProduct, addOffer, updateOffer, deleteOffer } = useProducts();
  const { orders, updateOrderStatus, stats } = useOrders();

  // Local admin state (Firebase auth or local master passcode)
  const [localAdminAuthenticated, setLocalAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gtg_admin_auth') === 'true';
  });

  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'offers' | 'orders' | 'settings' | 'guide'>('dashboard');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('adjechrist58@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'T-shirts',
    price: 12000,
    originalPrice: 0,
    description: '',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Noir', hex: '#111827' }],
    inStock: true,
    isFeatured: false,
  });

  // Offer modal state
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    badge: '-20% Réduction',
    oldPrice: 20000,
    newPrice: 16000,
    discountPercentage: 20,
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    productId: '',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Synchroniser le formulaire quand les paramètres sont chargés
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Gemini AI state
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const isAuthenticated = Boolean(user || localAdminAuthenticated);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Master passcode or email login
    if (loginPassword === 'give2god' || loginPassword === 'admin123' || loginPassword === '0710071833') {
      sessionStorage.setItem('gtg_admin_auth', 'true');
      setLocalAdminAuthenticated(true);
      return;
    }

    try {
      await loginWithEmail(loginEmail, loginPassword);
    } catch (err: any) {
      console.warn('Firebase email login:', err);
      // Fallback message with hint
      setLoginError('Mot de passe incorrect. Astuce : utilisez le mot de passe maître "give2god" ou connectez-vous avec Google.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      sessionStorage.setItem('gtg_admin_auth', 'true');
      setLocalAdminAuthenticated(true);
    } catch (err: any) {
      setLoginError('Erreur de connexion Google: ' + err.message);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('gtg_admin_auth');
    setLocalAdminAuthenticated(false);
    logout();
  };

  // Gemini AI Description Generator
  const handleGenerateAiDescription = async () => {
    if (!productForm.name) {
      alert('Veuillez d\'abord renseigner le nom du produit.');
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productForm.name,
          category: productForm.category,
          fabric: '100% Coton peigné haute densité',
          style: 'Streetwear de prestige, sobre et inspirant',
        }),
      });
      const data = await res.json();
      if (data.description) {
        setProductForm((prev) => ({ ...prev, description: data.description }));
      }
    } catch (err) {
      console.error('Erreur IA:', err);
      alert('Impossible de contacter l\'IA Gemini pour le moment.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Gemini AI Offer Copywriter
  const handleGenerateAiOffer = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerName: offerForm.title || 'Pack Vêtements Give to God',
          targetDiscount: `${offerForm.discountPercentage || 20}%`,
          occasion: 'Promotion en ligne',
        }),
      });
      const data = await res.json();
      if (data.title) {
        setOfferForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          badge: data.badge || prev.badge,
          description: data.description || prev.description,
        }));
      }
    } catch (err) {
      console.error('Erreur IA Offre:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct(editingProduct.id, productForm);
    } else {
      await addProduct(productForm);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Offer Save
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffer) {
      await updateOffer(editingOffer.id, offerForm);
    } else {
      await addOffer(offerForm);
    }
    setIsOfferModalOpen(false);
    setEditingOffer(null);
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-stone-100">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-stone-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-950">
              Espace Administrateur
            </h1>
            <p className="text-xs text-stone-500">
              Accès strictement réservé au gestionnaire de la boutique Give to God.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Administrateur
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Entrez votre mot de passe (ou give2god)"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Se connecter
            </button>
          </form>

          <div className="relative border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Connexion avec Google</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToStore}
              className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
            >
              Retourner sur le site public
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-stone-100 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg font-bold text-white tracking-wide uppercase">
            {settings.storeName}
          </span>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
            Administration
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isFirestoreConnected ? (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connecté à Firestore
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full" title="Toutes les modifications sont sauvegardées dans votre navigateur et synchronisées dès que la connexion distante est disponible">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sauvegarde locale active
            </span>
          )}

          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voir la boutique</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8 overflow-x-auto">
        <div className="flex gap-2 py-2 max-w-7xl mx-auto">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
            { id: 'orders', label: `Commandes (${orders.length})`, icon: ClipboardList },
            { id: 'products', label: `Produits (${products.length})`, icon: ShoppingBag },
            { id: 'offers', label: `Offres (${offers.length})`, icon: Tag },
            { id: 'settings', label: 'Paramètres Boutique', icon: SettingsIcon },
            { id: 'guide', label: 'Guide & Déploiement', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* TAB 1: DASHBOARD STATS */}
        {adminTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Vue d'ensemble de l'activité
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Statistiques en temps réel de votre boutique {settings.storeName}.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-medium">Chiffre d'Affaires</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {formatPrice(stats.totalRevenue)}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> Commandes actives
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-medium">Total Commandes</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1">
                    {stats.pendingOrders} en attente
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-medium">Produits au Catalogue</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1">
                    {products.filter(p => p.inStock).length} en stock
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-medium">Offres Promotionnelles</span>
                  <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    {offers.length}
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1">
                    {offers.filter(o => o.isActive).length} actives
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Tag className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Dernières Commandes
                  </h3>
                  <button
                    onClick={() => setAdminTab('orders')}
                    className="text-xs font-semibold text-amber-800 hover:underline"
                  >
                    Gérer toutes les commandes
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-8 text-center">
                    Aucune commande enregistrée pour l'instant.
                  </p>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-stone-900">{order.id}</span>
                          <span className="text-stone-500 block">{order.customerName} · {order.customerPhone}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-950 font-serif block">
                            {formatPrice(order.totalAmount)}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'Nouvelle' ? 'bg-amber-100 text-amber-800' :
                            order.status === 'Livrée' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Settings preview */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
                  Configuration en Direct
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">Nom actuel de la boutique :</span>
                    <strong className="text-stone-900 font-serif text-sm">{settings.storeName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Numéro WhatsApp configuré :</span>
                    <strong className="text-emerald-700">{settings.phone}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Bandeau d'annonce :</span>
                    <span className="text-stone-700">{settings.showAnnouncement ? 'Actif' : 'Masqué'}</span>
                  </div>
                  <button
                    onClick={() => setAdminTab('settings')}
                    className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors mt-2"
                  >
                    Modifier les paramètres de la boutique
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {adminTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Gestion des Commandes
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Visualisez les détails des commandes passées, mettez à jour leur statut et contactez directement les clients sur WhatsApp.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500 text-xs">
                Aucune commande enregistrée pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
                          <span className="text-xs text-stone-400">· {new Date(order.createdAt).toLocaleString('fr-FR')}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5">{order.customerName}</h4>
                      </div>

                      {/* Status selector */}
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            order.status === 'Nouvelle' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            order.status === 'Livrée' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            order.status === 'En cours' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                            'bg-stone-50 text-stone-700 border-stone-300'
                          }`}
                        >
                          <option value="Nouvelle">Statut : Nouvelle</option>
                          <option value="En cours">Statut : En cours</option>
                          <option value="Livrée">Statut : Livrée</option>
                          <option value="Annulée">Statut : Annulée</option>
                        </select>

                        {/* WhatsApp Client Contact Button */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Bonjour ${order.customerName}, c'est la boutique ${settings.storeName} au sujet de votre commande *${order.id}* d'un montant de ${formatPrice(order.totalAmount)}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                          title="Écrire au client sur WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-stone-50 p-4 rounded-2xl">
                      <div>
                        <span className="text-stone-400 block font-medium">Téléphone :</span>
                        <a href={`tel:${order.customerPhone}`} className="text-stone-900 font-bold hover:underline">
                          {order.customerPhone}
                        </a>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">Adresse de livraison :</span>
                        <span className="text-stone-800 font-semibold">{order.customerCity} - {order.customerAddress}</span>
                      </div>
                      {order.note && (
                        <div>
                          <span className="text-stone-400 block font-medium">Note client :</span>
                          <span className="text-stone-600 italic">« {order.note} »</span>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Articles commandés :</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-stone-50 rounded-xl">
                            <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded-lg" />
                            <div className="flex-1">
                              <span className="font-bold text-stone-900 block">{it.name}</span>
                              <span className="text-[11px] text-stone-500">
                                Taille: {it.selectedSize} | Couleur: {it.selectedColor} | Qté: {it.quantity}
                              </span>
                            </div>
                            <span className="font-bold text-stone-900">{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-2 flex justify-between items-center text-xs border-t border-stone-100">
                      <span className="text-stone-500">Livraison : {order.deliveryFee === 0 ? 'Gratuite' : formatPrice(order.deliveryFee)}</span>
                      <div className="text-sm font-extrabold text-stone-950 font-serif">
                        Total commande : {formatPrice(order.totalAmount)}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Catalogue Produits
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Ajoutez, modifiez ou retirez des articles de votre boutique en temps réel.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: 'T-shirts',
                    price: 12000,
                    originalPrice: 0,
                    description: '',
                    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: [{ name: 'Noir', hex: '#111827' }],
                    inStock: true,
                    isFeatured: false,
                  });
                  setIsProductModalOpen(true);
                }}
                className="py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Photo</th>
                      <th className="p-4">Nom</th>
                      <th className="p-4">Catégorie</th>
                      <th className="p-4">Prix</th>
                      <th className="p-4">Tailles</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/50">
                        <td className="p-4">
                          <img src={p.images[0]} alt={p.name} className="w-12 h-14 object-cover rounded-xl bg-stone-100" />
                        </td>
                        <td className="p-4 font-bold text-stone-900 font-serif">
                          {p.name}
                        </td>
                        <td className="p-4 text-stone-600">{p.category}</td>
                        <td className="p-4 font-extrabold text-stone-900">{formatPrice(p.price)}</td>
                        <td className="p-4 text-stone-500">{p.sizes?.join(', ')}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {p.inStock ? 'En stock' : 'Épuisé'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductForm({
                                name: p.name,
                                category: p.category,
                                price: p.price,
                                originalPrice: p.originalPrice || 0,
                                description: p.description,
                                images: p.images,
                                sizes: p.sizes || ['M', 'L'],
                                colors: p.colors || [{ name: 'Noir', hex: '#111827' }],
                                inStock: p.inStock,
                                isFeatured: Boolean(p.isFeatured),
                              });
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer définitivement "${p.name}" ?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OFFERS MANAGEMENT */}
        {adminTab === 'offers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Offres Spéciales & Ventes Flash
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Créez des réductions temporaires visibles immédiatement sur la page d'accueil et la section offres.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingOffer(null);
                  setOfferForm({
                    title: '',
                    description: '',
                    badge: '-20% Réduction',
                    oldPrice: 20000,
                    newPrice: 16000,
                    discountPercentage: 20,
                    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isActive: true,
                    productId: products[0]?.id || '',
                  });
                  setIsOfferModalOpen(true);
                }}
                className="py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Promotion</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                        {offer.badge}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        offer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {offer.isActive ? 'Active' : 'Désactivée'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900">{offer.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-2">{offer.description}</p>
                    
                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="font-extrabold text-stone-950 font-serif text-base">{formatPrice(offer.newPrice)}</span>
                      {offer.oldPrice && (
                        <span className="text-xs text-stone-400 line-through">{formatPrice(offer.oldPrice)}</span>
                      )}
                    </div>
                    {offer.endDate && (
                      <span className="text-[11px] text-stone-400 block">Date de fin : {offer.endDate}</span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        offer.isActive ? 'text-amber-800 border-amber-200 hover:bg-amber-50' : 'text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {offer.isActive ? 'Désactiver' : 'Activer'}
                    </button>

                    <div className="space-x-1">
                      <button
                        onClick={() => {
                          setEditingOffer(offer);
                          setOfferForm({
                            title: offer.title,
                            description: offer.description,
                            badge: offer.badge,
                            oldPrice: offer.oldPrice || 0,
                            newPrice: offer.newPrice,
                            discountPercentage: offer.discountPercentage || 0,
                            imageUrl: offer.imageUrl,
                            startDate: offer.startDate || '',
                            endDate: offer.endDate || '',
                            isActive: offer.isActive,
                            productId: offer.productId || '',
                          });
                          setIsOfferModalOpen(true);
                        }}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Supprimer cette promotion ?')) {
                            deleteOffer(offer.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS (Crucial requirement from prompt) */}
        {adminTab === 'settings' && (
          <div className="space-y-6 max-w-4xl animate-fade-in">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Paramètres de la Boutique
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Toute modification enregistrée ici met à jour instantanément le site public (titre, en-tête, pied de page, WhatsApp, SEO).
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
              
              {/* Identity */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                  1. Identité & Coordonnées
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nom de la boutique <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Slogan & Accroche
                    </label>
                    <input
                      type="text"
                      value={settingsForm.slogan}
                      onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Indicatif Pays WhatsApp <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.countryCode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, countryCode: e.target.value })}
                      placeholder="+225"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Numéro WhatsApp / Téléphone <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="0710071833"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Devise monétaire
                    </label>
                    <input
                      type="text"
                      value={settingsForm.currency}
                      onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                      placeholder="FCFA"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Horaires d'ouverture
                    </label>
                    <input
                      type="text"
                      value={settingsForm.openingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Adresse physique / Ville
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                  2. Bandeau d'Annonce Supérieur
                </h3>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showAnnouncement"
                    checked={settingsForm.showAnnouncement}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                    className="rounded-sm accent-amber-700 cursor-pointer"
                  />
                  <label htmlFor="showAnnouncement" className="text-xs font-semibold text-stone-800 cursor-pointer">
                    Afficher le bandeau promotionnel en haut du site
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Texte de l'annonce
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    placeholder="Ex: Livraison gratuite ce week-end dès 25 000 FCFA d'achats !"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Hero Banner Home Page */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                  3. Bannière d'Accueil (Hero Section)
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Titre Principal
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sous-titre / Message
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>

                <div>
                  <ImageUploader
                    images={settingsForm.heroImageUrl ? [settingsForm.heroImageUrl] : []}
                    onChange={(imgs) => setSettingsForm({ ...settingsForm, heroImageUrl: imgs[0] || '' })}
                    multiple={false}
                    label="Photo de la grande bannière d'accueil"
                  />
                </div>
              </div>

              {/* Delivery Settings */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                  4. Tarifs de Livraison
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Frais de livraison standard ({settingsForm.currency})
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Seuil de gratuité ({settingsForm.currency})
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFreeThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFreeThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                    />
                  </div>
                </div>
              </div>

              {saveSettingsSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Paramètres enregistrés avec succès ! Le site est mis à jour.</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer toutes les modifications</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 6: BEGINNER GUIDE & DEPLOYMENT INSTRUCTIONS */}
        {adminTab === 'guide' && (
          <div className="space-y-6 max-w-4xl bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xs animate-fade-in text-xs leading-relaxed text-stone-700">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Manuel Utilisateur Débutant</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Guide Complet de Gestion & Mise en Ligne
              </h2>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="font-serif text-base font-bold text-stone-900">
                1. Comment modifier le nom du magasin et le numéro de téléphone ?
              </h3>
              <p>
                Rendez-vous dans l'onglet <strong>« Paramètres Boutique »</strong> ci-dessus. Modifiez les champs <em>Nom de la boutique</em> et <em>Numéro WhatsApp</em>, puis cliquez sur <strong>« Enregistrer »</strong>. 
                Grâce à notre connexion directe Firestore, la modification prend effet <strong>immédiatement</strong> sur tout le site (l'en-tête, le pied de page, le bouton flottant WhatsApp et le titre de l'onglet de votre navigateur).
              </p>

              <h3 className="font-serif text-base font-bold text-stone-900 pt-4">
                2. Comment publier une nouvelle offre promotionnelle ?
              </h3>
              <p>
                Rendez-vous dans l'onglet <strong>« Offres »</strong> et cliquez sur <strong>« Nouvelle Promotion »</strong>. Renseignez le titre, l'ancien prix, le nouveau prix et la date de fin. L'offre apparaîtra automatiquement sur la page d'accueil dans la section <em>« Nouvelles offres »</em> et sur la page <em>« Offres & Promotions »</em>. Dès que la date est dépassée, elle s'efface automatiquement !
              </p>

              <h3 className="font-serif text-base font-bold text-stone-900 pt-4">
                3. Comment mettre le site en ligne (Hébergement gratuit ou économique) ?
              </h3>
              <p>
                Votre projet est conçu avec des technologies modernes et légères (React + Vite + Firebase).
              </p>
              <div className="bg-stone-50 p-4 rounded-xl space-y-2 border border-stone-200">
                <p><strong>Option A : Vercel (Recommandé, Gratuit & Instantané)</strong></p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Créez un compte gratuit sur <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-800 underline">vercel.com</a>.</li>
                  <li>Importez votre dossier de projet ou liez votre dépôt GitHub.</li>
                  <li>Ajoutez votre clé API <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code> dans les variables d'environnement.</li>
                  <li>Cliquez sur « Deploy ». Votre site est en ligne en 1 minute !</li>
                </ol>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl space-y-2 border border-stone-200">
                <p><strong>Option B : Lier votre propre nom de domaine (ex: givetogod.store)</strong></p>
                <p>
                  Dans les paramètres de Vercel ou Firebase Hosting, allez dans <em>Domains</em>, entrez votre nom de domaine personnalisé et configurez les DNS chez votre registrar (Namecheap, Hostinger, OVH). Le certificat SSL (HTTPS) est activé gratuitement.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 my-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nom de l'article *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Ex: T-Shirt Signature Faith"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Catégorie *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="T-shirts">T-shirts</option>
                    <option value="Sweats & Hoodies">Sweats & Hoodies</option>
                    <option value="Ensembles">Ensembles & Pantalons</option>
                    <option value="Accessoires">Accessoires & Casquettes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prix ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ancien Prix barré (Optionnel)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Gemini AI generator helper */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Assistant IA Gemini
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiLoading}
                    className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {isAiLoading ? 'Génération...' : 'Générer la description'}
                  </button>
                </div>
                <p className="text-[11px] text-stone-600">
                  Rédige automatiquement une description produit de luxe et spirituelle en français basée sur le nom et la catégorie.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description détaillée</label>
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <ImageUploader
                  images={productForm.images.filter(Boolean)}
                  onChange={(imgs) =>
                    setProductForm({
                      ...productForm,
                      images:
                        imgs.length > 0
                          ? imgs
                          : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
                    })
                  }
                  multiple={true}
                  maxImages={6}
                  label="Photos du produit (Depuis votre appareil, appareil photo ou galerie)"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="accent-stone-900 rounded-sm"
                  />
                  <span>Disponible en stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-stone-900 rounded-sm"
                  />
                  <span>Mettre en avant sur l'accueil</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFER MODAL (ADD / EDIT) */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 my-8 animate-scale-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingOffer ? 'Modifier la Promotion' : 'Créer une Promotion'}
              </h3>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-stone-400 hover:text-stone-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Titre de l'offre *</label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="Ex: Pack Spécial T-shirt + Casquette"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Assistant Promotionnel Gemini
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiOffer}
                    disabled={isAiLoading}
                    className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Générer slogan promo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Texte du Badge</label>
                  <input
                    type="text"
                    value={offerForm.badge}
                    onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                    placeholder="-20% Réduction"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date d'expiration</label>
                  <input
                    type="date"
                    value={offerForm.endDate}
                    onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nouveau Prix Promo *</label>
                  <input
                    type="number"
                    required
                    value={offerForm.newPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, newPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ancien Prix</label>
                  <input
                    type="number"
                    value={offerForm.oldPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, oldPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description courte</label>
                <textarea
                  rows={2}
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <ImageUploader
                  images={offerForm.imageUrl ? [offerForm.imageUrl] : []}
                  onChange={(imgs) => setOfferForm({ ...offerForm, imageUrl: imgs[0] || '' })}
                  multiple={false}
                  label="Photo ou visuel de l'offre (Depuis votre appareil ou lien web)"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offerForm.isActive}
                    onChange={(e) => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                    className="accent-stone-900 rounded-sm"
                  />
                  <span>Offre active et visible sur le site</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
