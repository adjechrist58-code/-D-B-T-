import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Phone, 
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onGoToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onGoToCheckout, onContinueShopping }) => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    subtotal, 
    deliveryFee, 
    grandTotal, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  const { formatPrice, settings, buildWhatsAppUrl } = useStore();

  if (!isCartOpen) return null;

  const threshold = settings.deliveryFreeThreshold || 25000;
  const remainingForFreeDelivery = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let itemsSummary = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.name}*\n   - Taille: ${it.selectedSize} | Couleur: ${it.selectedColor}\n   - Qté: ${it.quantity} x ${formatPrice(it.price)} = ${formatPrice(it.price * it.quantity)}`
      )
      .join('\n\n');

    const message = `Bonjour ${settings.storeName}, je souhaite valider mon panier en ligne :

🛒 *RÉCAPITULATIF DU PANIER* (${totalItems} article${totalItems > 1 ? 's' : ''}) :
${itemsSummary}

💰 *Sous-total* : ${formatPrice(subtotal)}
🚚 *Livraison estimée* : ${deliveryFee === 0 ? 'Offerte !' : formatPrice(deliveryFee)}
⭐ *TOTAL À PAYER* : *${formatPrice(grandTotal)}*

Pouvez-vous m'indiquer la disponibilité et enregistrer mon adresse de livraison ? Merci !`;

    window.open(buildWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Header */}
          <div className="p-6 bg-white border-b border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-950" />
              <h2 className="font-serif text-lg font-bold text-stone-950">
                Mon Panier
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full">
                {totalItems}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="bg-amber-50/70 border-b border-amber-100 p-4 text-xs">
              {remainingForFreeDelivery === 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Félicitations ! Vous bénéficiez de la livraison offerte.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Plus que <strong className="text-amber-800 font-bold">{formatPrice(remainingForFreeDelivery)}</strong> pour la livraison offerte !
                    </span>
                    <span className="text-stone-500 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Votre panier est vide
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Découvrez nos collections de vêtements et profitez de nos pièces haut de gamme.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onContinueShopping();
                  }}
                  className="mt-2 py-2.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Découvrir la boutique
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div 
                  key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-stone-200/70 shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 font-serif">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Supprimer cet article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                        <span>Taille: <strong className="text-stone-700">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span>Couleur: <strong className="text-stone-700">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 text-xs">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Total line price */}
                      <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Actions */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Frais de livraison</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">Offerte</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-stone-950 pt-2 border-t border-stone-100">
                  <span>Total estimé</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Checkout Page */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onGoToCheckout();
                  }}
                  className="w-full py-3.5 px-4 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Passer la commande</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Direct WhatsApp Order */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Commander via WhatsApp</span>
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
                      clearCart();
                    }
                  }}
                  className="w-full py-2 text-[11px] text-stone-500 hover:text-rose-600 font-medium transition-colors text-center cursor-pointer"
                >
                  Vider le panier
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
