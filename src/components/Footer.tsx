import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Lock, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { settings, buildWhatsAppUrl } = useStore();

  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Reassurance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-800 text-stone-200">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-800/40 border border-stone-700/50">
            <Truck className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-white text-base">Livraison Rapide & Soignée</h4>
              <p className="text-xs text-stone-400 mt-1">
                Expédition sécurisée sous 24h à 48h. Livraison gratuite dès {new Intl.NumberFormat('fr-FR').format(settings.deliveryFreeThreshold || 25000)} {settings.currency}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-800/40 border border-stone-700/50">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-white text-base">Confection Haut de Gamme</h4>
              <p className="text-xs text-stone-400 mt-1">
                Cotons peignés épais, broderies durables et finitions inspirées de la haute couture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-800/40 border border-stone-700/50">
            <Phone className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-white text-base">Support Client WhatsApp 7j/7</h4>
              <p className="text-xs text-stone-400 mt-1">
                Conseils personnalisés et suivi de votre colis en direct sur le {settings.phone}.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          
          {/* Brand Presentation */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white uppercase">
              {settings.storeName || 'Give to God'}
            </span>
            <p className="text-sm text-stone-400 leading-relaxed">
              {settings.slogan || 'Boutique de prêt-à-porter haut de gamme inspirée par la foi et l\'élégance.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('accueil')}
                  className="hover:text-amber-300 transition-colors text-stone-400 hover:underline cursor-pointer"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('boutique')}
                  className="hover:text-amber-300 transition-colors text-stone-400 hover:underline cursor-pointer"
                >
                  Boutique en ligne
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('offres')}
                  className="hover:text-amber-300 transition-colors text-stone-400 hover:underline cursor-pointer"
                >
                  Offres & Promotions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('a-propos')}
                  className="hover:text-amber-300 transition-colors text-stone-400 hover:underline cursor-pointer"
                >
                  Notre Histoire & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-300 transition-colors text-stone-400 hover:underline cursor-pointer"
                >
                  Contact & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (Dynamic) */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Nous contacter
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-medium">Téléphone & WhatsApp</span>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 underline underline-offset-2"
                  >
                    {settings.phone}
                  </a>
                </div>
              </li>
              {settings.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-medium">Email</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-white">
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-medium">Adresse</span>
                    <span>{settings.address}</span>
                  </div>
                </li>
              )}
              {settings.openingHours && (
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-medium">Horaires d'ouverture</span>
                    <span>{settings.openingHours}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / WhatsApp VIP */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Club Privilège
            </h4>
            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
              Soyez les premiers informés des nouvelles capsules, ventes privées et messages d'édification.
            </p>
            <a
              href={buildWhatsAppUrl('Bonjour, je souhaite rejoindre le Club Privilège Give to God pour recevoir les nouveautés en avant-première !')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Rejoindre la communauté</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar & Discreet Admin Link */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.storeName || 'Give to God'}. Tous droits réservés.</p>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-stone-400">
              Conçu avec <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> pour inspirer
            </span>

            {/* Discreet Admin Link */}
            <button
              onClick={() => handleNav('admin')}
              className="text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
              title="Accès Administrateur"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Espace Gestion</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
