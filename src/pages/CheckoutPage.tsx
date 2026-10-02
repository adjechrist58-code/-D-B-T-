import React, { useState } from 'react';
import { 
  CheckCircle, 
  ArrowLeft, 
  Phone, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useOrders } from '../context/OrdersContext';

interface CheckoutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setCurrentTab }) => {
  const { items, subtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const { settings, formatPrice, buildWhatsAppUrl } = useStore();
  const { createOrder } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Abidjan');
  const [customerAddress, setCustomerAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wave' | 'card'>('cod');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  if (items.length === 0 && !createdOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Votre panier est vide
        </h2>
        <p className="text-xs text-stone-500">
          Ajoutez des articles à votre panier avant de passer commande.
        </p>
        <button
          onClick={() => setCurrentTab('boutique')}
          className="py-2.5 px-6 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Découvrir la boutique
        </button>
      </div>
    );
  }

  // Prepares cleanly formatted WhatsApp order summary
  const generateWhatsAppMessage = (orderId?: string) => {
    const ref = orderId || 'COMMANDE-EN-ATTENTE';
    const itemsList = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.name}*\n   - Taille : ${it.selectedSize} | Couleur : ${it.selectedColor}\n   - Qté : ${it.quantity} x ${formatPrice(it.price)} = ${formatPrice(it.price * it.quantity)}`
      )
      .join('\n\n');

    return `*NOUVELLE COMMANDE SUR LE SITE - ${ref}*

👤 *COORDONNÉES DU CLIENT :*
- Nom : ${customerName || 'Non précisé'}
- Téléphone : ${customerPhone || 'Non précisé'}
- Ville : ${customerCity}
- Adresse précise : ${customerAddress || 'À préciser lors de l\'échange'}
${note ? `- Note livraison : ${note}\n` : ''}
🛒 *DÉTAIL DU PANIER :*
${itemsList}

💰 *Sous-total* : ${formatPrice(subtotal)}
🚚 *Livraison* : ${deliveryFee === 0 ? 'Offerte' : formatPrice(deliveryFee)}
⭐ *TOTAL À PAYER* : *${formatPrice(grandTotal)}*

💳 *Mode de paiement souhaité* : ${
      paymentMethod === 'cod' ? 'Paiement à la livraison (Espèces)' : 'Mobile Money / Wave'
    }

Merci de me confirmer la réception de ma commande et l'horaire de livraison !`;
  };

  const handleValidateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMsg('Veuillez renseigner votre nom, téléphone et adresse de livraison.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderId = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: customerCity.trim(),
        customerAddress: customerAddress.trim(),
        note: note.trim(),
        deliveryMethod: 'Livraison standard',
        items,
        totalAmount: grandTotal,
        deliveryFee,
      });

      setCreatedOrderId(orderId);
      clearCart();
    } catch (err: any) {
      console.error('Erreur enregistrement commande:', err);
      setErrorMsg('Une erreur est survenue lors de l\'enregistrement de votre commande. Vous pouvez aussi commander directement via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirectClick = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMsg('Veuillez au moins indiquer votre nom, téléphone et adresse pour pré-remplir le message WhatsApp.');
      return;
    }

    try {
      // Create order in Firestore as well for tracking
      const orderId = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: customerCity.trim(),
        customerAddress: customerAddress.trim(),
        note: note.trim(),
        deliveryMethod: 'WhatsApp Direct',
        items,
        totalAmount: grandTotal,
        deliveryFee,
      });

      const message = generateWhatsAppMessage(orderId);
      window.open(buildWhatsAppUrl(message), '_blank');
      setCreatedOrderId(orderId);
      clearCart();
    } catch {
      // In case of network glitch, open WhatsApp directly
      const message = generateWhatsAppMessage();
      window.open(buildWhatsAppUrl(message), '_blank');
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (createdOrderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Commande Confirmée avec Succès
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
            Merci pour votre confiance !
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Votre commande a été transmise à notre équipe sous la référence :
          </p>
          <div className="inline-block px-4 py-2 bg-stone-100 rounded-xl font-mono text-base font-bold text-stone-900 border border-stone-200 mt-2">
            {createdOrderId}
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-sm max-w-md mx-auto text-left space-y-4 text-xs">
          <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
            Prochaines étapes :
          </h3>
          <p className="text-stone-600">
            1. Notre équipe prépare votre colis avec le plus grand soin.
          </p>
          <p className="text-stone-600">
            2. Vous recevrez un appel ou un message WhatsApp sur le <strong>{customerPhone}</strong> pour convenir de l'horaire précis de passage du livreur.
          </p>
          <p className="text-stone-600">
            3. Le règlement s'effectue en toute sérénité à la livraison ou par Mobile Money.
          </p>
        </div>

        {/* WhatsApp Button for instant confirmation */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl(`Bonjour ${settings.storeName}, je viens de passer la commande *${createdOrderId}* sur votre boutique en ligne. Pouvez-vous me confirmer sa prise en charge ?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Suivre ma commande sur WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setCurrentTab('boutique');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      <button
        onClick={() => setCurrentTab('boutique')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continuer mes achats</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Customer & Delivery Details Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Étape finale
            </span>
            <h1 className="font-serif text-3xl font-bold text-stone-950 mt-1">
              Finaliser votre commande
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Renseignez vos coordonnées de livraison ci-dessous.
            </p>
          </div>

          <form onSubmit={handleValidateOrder} className="space-y-6">
            
            {/* Customer Details Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                <User className="w-4 h-4 text-amber-700" />
                Informations du destinataire
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nom et Prénom <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Jean-Marc Kouassi"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Numéro de Téléphone (WhatsApp) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: 07 10 07 18 33"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ville / Commune <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Ex: Abidjan - Cocody Angré"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Adresse précise de livraison <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Ex: Rue L82, Résidence Les Oliviers"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Note ou instructions spéciales pour le livreur (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Appelez-moi dès que vous arrivez devant le portail gris."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
              </div>
            </div>

            {/* Payment Options Selector */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                <CreditCard className="w-4 h-4 text-amber-700" />
                Mode de règlement
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-stone-900"
                  />
                  <div>
                    <span className="block font-bold text-stone-900 text-xs sm:text-sm">
                      Paiement à la livraison
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-0.5">
                      Réglez en espèces ou par Mobile Money lors de la réception du colis.
                    </span>
                  </div>
                </label>

                <label 
                  onClick={() => setPaymentMethod('wave')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'wave'
                      ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wave'}
                    onChange={() => setPaymentMethod('wave')}
                    className="mt-0.5 accent-stone-900"
                  />
                  <div>
                    <span className="block font-bold text-stone-900 text-xs sm:text-sm">
                      Wave / Orange / MTN MoMo
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-0.5">
                      Paiement rapide et direct via QR code ou numéro marchand.
                    </span>
                  </div>
                </label>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transactions 100% sécurisées avec confirmation par SMS / WhatsApp.</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Validation Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-stone-950 hover:bg-stone-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enregistrement en cours...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Confirmer et enregistrer ma commande</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirectClick}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Commander via WhatsApp avec message pré-rempli</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm sticky top-28 space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>Récapitulatif</span>
              <span className="text-xs font-normal text-stone-500">
                {items.length} article{items.length > 1 ? 's' : ''}
              </span>
            </h2>

            {/* Items scroll */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-2 border-b border-stone-100 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded-xl bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 font-serif line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        Taille: <strong>{item.selectedSize}</strong> · Couleur: <strong>{item.selectedColor}</strong>
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-stone-700">
                      <span>Qté : {item.quantity}</span>
                      <span className="font-bold text-stone-950 font-serif">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total articles</span>
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
              <div className="flex justify-between text-base font-extrabold text-stone-950 pt-3 border-t border-stone-200 font-serif">
                <span>Total à régler</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Direct support note */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
              <p className="font-bold text-stone-900">Besoin d'aide pour valider ?</p>
              <p>Contactez notre service client en direct au <strong>{settings.phone}</strong>.</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
