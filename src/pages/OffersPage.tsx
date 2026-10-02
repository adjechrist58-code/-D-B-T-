import React from 'react';
import { 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Tag, 
  ShoppingBag, 
  Phone 
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface OffersPageProps {
  onSelectProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onSelectProduct, setCurrentTab }) => {
  const { activeOffers, products } = useProducts();
  const { formatPrice, settings, buildWhatsAppUrl } = useStore();

  const handleOrderOffer = (offer: any) => {
    if (offer.productId) {
      const linked = products.find((p) => p.id === offer.productId);
      if (linked) {
        onSelectProduct(linked);
        return;
      }
    }
    // Direct WhatsApp message for the offer
    const msg = `Bonjour ${settings.storeName}, je souhaite profiter de votre offre promotionnelle vue sur le site :
- Offre : ${offer.title}
- Prix promo : ${formatPrice(offer.newPrice)}
Pouvez-vous me confirmer comment finaliser ma commande ? Merci !`;
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Bons Plans & Réductions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950">
          Offres & Promotions
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Découvrez nos réductions exclusives et packs spéciaux sur nos collections {settings.storeName}. Les offres sont temporaires et mises à jour régulièrement.
        </p>
      </div>

      {/* Offers Grid */}
      {activeOffers.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-stone-200 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Aucune offre en cours actuellement
          </h3>
          <p className="text-xs text-stone-500">
            Revenez bientôt ou visitez notre boutique pour découvrir l'intégralité de nos collections de vêtements.
          </p>
          <button
            onClick={() => setCurrentTab('boutique')}
            className="py-2.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Voir la boutique
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Photo */}
              <div className="sm:w-1/2 relative aspect-4/3 sm:aspect-auto overflow-hidden bg-stone-100">
                <img
                  src={offer.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
                  {offer.badge || 'Promotion'}
                </div>
              </div>

              {/* Information */}
              <div className="sm:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 group-hover:text-amber-800 transition-colors leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
                    {offer.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-stone-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-stone-950 font-serif">
                      {formatPrice(offer.newPrice)}
                    </span>
                    {offer.oldPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice(offer.oldPrice)}
                      </span>
                    )}
                  </div>

                  {offer.endDate && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Se termine le : <strong>{offer.endDate}</strong></span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      onClick={() => handleOrderOffer(offer)}
                      className="w-full py-3 px-4 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Profiter de cette offre</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        const msg = `Bonjour ${settings.storeName}, pouvez-vous me donner plus de détails sur l'offre : "${offer.title}" ?`;
                        window.open(buildWhatsAppUrl(msg), '_blank');
                      }}
                      className="w-full py-2 px-3 text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>Poser une question sur WhatsApp</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assurance banner */}
      <div className="p-6 bg-stone-100 rounded-3xl border border-stone-200 text-center max-w-3xl mx-auto space-y-2">
        <h4 className="font-serif font-bold text-stone-900 text-base">
          Des offres transparentes et sans frais cachés
        </h4>
        <p className="text-xs text-stone-600">
          Toutes nos réductions s'appliquent automatiquement dans votre panier. Le stock promotionnel est limité au nombre de pièces disponibles en atelier.
        </p>
      </div>

    </div>
  );
};
