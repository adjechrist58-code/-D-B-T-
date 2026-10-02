import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Phone, 
  Clock, 
  Star,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useProducts } from '../context/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { Product, Offer } from '../types/store';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, onSelectProduct }) => {
  const { settings, formatPrice, buildWhatsAppUrl } = useStore();
  const { products, activeOffers } = useProducts();

  // Pick featured or first products
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-stone-100">
        <div className="absolute inset-0">
          <img
            src={
              settings.heroImageUrl ||
              'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80'
            }
            alt={settings.storeName}
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 lg:py-44 flex flex-col justify-center min-h-[600px]">
          <div className="max-w-2xl space-y-6">
            
            {/* Top Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Collection Exclusive & Inspirée</span>
            </div>

            {/* Dynamic Hero Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {settings.heroTitle || 'Donnez le meilleur de vous-même.'}
            </h1>

            {/* Dynamic Hero Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              {settings.heroSubtitle ||
                'Des pièces de prêt-à-porter haut de gamme conçues pour exprimer votre foi, votre reconnaissance et votre élégance au quotidien.'}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  setCurrentTab('boutique');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 px-8 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explorer la boutique</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Nous contacter sur WhatsApp</span>
              </a>
            </div>

            {/* Fast Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-800/80 text-xs text-stone-400">
              <div>
                <span className="block text-xl font-bold text-white font-serif">100%</span>
                <span>Coton Peigné Noble</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white font-serif">24h/48h</span>
                <span>Livraison Express</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white font-serif">7j/7</span>
                <span>Support WhatsApp</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* "Nouvelles Offres" Section - Required by prompt */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Tag className="w-4 h-4" />
                <span>Promotions Exclusives</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-stone-950 mt-1">
                Nouvelles Offres du Moment
              </h2>
            </div>

            <button
              onClick={() => {
                setCurrentTab('offres');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-stone-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Voir toutes les offres</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeOffers.map((offer) => (
              <div
                key={offer.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
              >
                {/* Offer Image */}
                <div className="sm:w-1/2 relative aspect-4/3 sm:aspect-auto overflow-hidden bg-stone-100">
                  <img
                    src={offer.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-700 text-white text-xs font-bold uppercase px-3 py-1 rounded-sm shadow-md">
                    {offer.badge || 'Offre Spéciale'}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-950 group-hover:text-amber-800 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black text-stone-950 font-serif">
                        {formatPrice(offer.newPrice)}
                      </span>
                      {offer.oldPrice && (
                        <span className="text-sm text-stone-400 line-through">
                          {formatPrice(offer.oldPrice)}
                        </span>
                      )}
                    </div>

                    {offer.endDate && (
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Offre valable jusqu'au {offer.endDate}</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (offer.productId) {
                          const linked = products.find((p) => p.id === offer.productId);
                          if (linked) {
                            onSelectProduct(linked);
                            return;
                          }
                        }
                        setCurrentTab('offres');
                      }}
                      className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Profiter de l'offre</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Nos Incontournables
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-950 mt-1">
              Pièces Phares & Nouveautés
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentTab('boutique');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-stone-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Voir toute la collection ({products.length} articles)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Brand Presentation / Story section */}
      <section className="bg-stone-100 py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                La Philosophie {settings.storeName}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 leading-tight">
                Plus qu'un vêtement, une déclaration de reconnaissance.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Fondée sur des valeurs de foi, de grâce et d'excellence, <strong>{settings.storeName}</strong> conçoit des pièces de prêt-à-porter qui célèbrent le don de la vie. Chaque création associe des matières d'exception à des messages puissants pour inspirer la confiance et la paix intérieure.
              </p>

              <div className="space-y-3 pt-2 text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Confection Éthique :</strong> Coton biologique peigné, finitions minutieuses et teintures durables.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Streetwear Élégant :</strong> Des coupes modernes, fluides et intemporelles adaptées à chaque morphologie.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Impact Positif :</strong> Une partie de nos bénéfices soutient des actions de partage communautaires.</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setCurrentTab('a-propos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Lire toute notre histoire
                </button>
              </div>
            </div>

            {/* Collage Visual */}
            <div className="relative">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"
                  alt="Atelier Give to God"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-lg border border-stone-200 max-w-xs hidden sm:block">
                <p className="font-serif italic text-stone-800 text-sm">
                  « Habillez votre corps avec élégance, et revêtez votre cœur d'humilité et de gratitude. »
                </p>
                <span className="block text-[11px] font-bold text-amber-800 uppercase tracking-widest mt-2">
                  — L'équipe {settings.storeName}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Avis Vérifiés
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-950">
            Ils portent Give to God
          </h2>
          <p className="text-xs text-stone-500">
            La satisfaction de nos clients est notre plus belle fierté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                « Le Hoodie Écru est tout simplement magnifique. Le coton est épais, lourd et chaud, la broderie dorée est très soignée. Reçu en 24h chrono à Abidjan avec un suivi WhatsApp exemplaire. »
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">David K.</span>
              <span className="text-stone-400">Abidjan, Cocody</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                « J'ai commandé le T-shirt Faith Over Fear et la casquette. La qualité dépasse celle de nombreuses marques internationales. Le message fait du bien à porter. Je recommande sans hésitation ! »
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Sarah B.</span>
              <span className="text-stone-400">Abidjan, Marcory</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                « Le processus de commande par WhatsApp est hyper simple et sécurisé. L'équipe répond en quelques minutes, confirme la taille et planifie la livraison. Vraiment au top ! »
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">Emmanuel T.</span>
              <span className="text-stone-400">Yopougon</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
