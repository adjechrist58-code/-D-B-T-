import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  Search, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenSearch }) => {
  const { settings, buildWhatsAppUrl } = useStore();
  const { totalItems, setIsCartOpen } = useCart();
  const { activeOffers } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'boutique', label: 'Boutique' },
    { 
      id: 'offres', 
      label: 'Offres & Promos',
      badge: activeOffers.length > 0 ? `${activeOffers.length}` : undefined 
    },
    { id: 'a-propos', label: 'Notre Histoire' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all duration-200">
      {/* Dynamic Announcement Banner */}
      {settings.showAnnouncement && settings.announcement && (
        <div className="bg-stone-900 text-stone-100 px-4 py-2 text-xs font-medium text-center tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{settings.announcement}</span>
          <button 
            onClick={() => handleNavClick('offres')}
            className="underline underline-offset-2 hover:text-amber-300 ml-1 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            En profiter <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-stone-700 hover:text-stone-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-md"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo / Brand Name - DYNAMICALLY LOADED FROM STORE SETTINGS */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('accueil')}
              className="group text-left focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 group-hover:text-stone-700 transition-colors uppercase">
                {settings.storeName || 'Give to God'}
              </span>
              <span className="block text-[10px] tracking-widest text-amber-800 uppercase font-semibold">
                Haute Confection & Foi
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm font-medium transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm cursor-pointer ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-amber-600 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Direct WhatsApp Call/Chat */}
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-2 rounded-full transition-colors"
              title="Discuter sur WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{settings.phone}</span>
            </a>

            {/* Quick Search */}
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
                else handleNavClick('boutique');
              }}
              className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer"
              aria-label="Rechercher des articles"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon with Live Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-stone-900 hover:bg-stone-200/50 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 cursor-pointer"
              aria-label={`Panier avec ${totalItems} articles`}
              title="Voir mon panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-amber-700 rounded-full shadow-sm animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-left ${
                  currentTab === link.id
                    ? 'bg-stone-200/70 text-stone-950 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-amber-600 rounded-full">
                    {link.badge} promo{parseInt(link.badge) > 1 ? 's' : ''}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Commander sur WhatsApp ({settings.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
