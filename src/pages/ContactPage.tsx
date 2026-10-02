import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, buildWhatsAppUrl } = useStore();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Renseignement produit');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Quels sont les délais et tarifs de livraison ?",
      a: `Nous livrons sous 24h à 48h ouvrées. La livraison est facturée ${new Intl.NumberFormat('fr-FR').format(settings.deliveryFee || 1500)} ${settings.currency}, et elle est entièrement OFFERTE dès ${new Intl.NumberFormat('fr-FR').format(settings.deliveryFreeThreshold || 25000)} ${settings.currency} d'achats.`
    },
    {
      q: "Comment commander directement par WhatsApp ?",
      a: `C'est très simple ! Cliquez sur n'importe quel bouton "Commander via WhatsApp" ou enregistrez notre numéro ${settings.phone}. Votre panier ou l'article choisi sera automatiquement pré-rempli dans la discussion pour une confirmation express.`
    },
    {
      q: "Comment taillent les vêtements Give to God ?",
      a: "Nos pièces respectent les standards européens de coupe moderne. Pour un tombé ajusté élégant, choisissez votre taille habituelle. Pour un style streetwear oversize plus ample, prenez une taille au-dessus."
    },
    {
      q: "Quels sont les moyens de paiement acceptés ?",
      a: "Nous acceptons le paiement en espèces à la livraison, ainsi que les transferts Mobile Money (Wave, Orange Money, MTN MoMo) lors de la remise de votre colis."
    },
    {
      q: "Puis-je échanger un article si la taille ne me convient pas ?",
      a: "Oui, absolument ! Vous disposez de 48 heures après réception pour nous signaler un problème de taille et demander un échange gratuit (produit non lavé et avec son étiquette d'origine)."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    setSubmitted(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          À votre écoute
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
          Contactez la Maison {settings.storeName}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Une question sur nos collections, une commande sur-mesure ou un suivi de livraison ? Notre équipe vous répond avec bienveillance.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* WhatsApp & Phone */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">WhatsApp & Appel</h3>
              <p className="text-xs text-stone-500 mt-1">Discutez en direct avec un conseiller de vente.</p>
            </div>
          </div>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
          >
            {settings.phone}
          </a>
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Adresse Email</h3>
              <p className="text-xs text-stone-500 mt-1">Pour vos partenariats ou questions générales.</p>
            </div>
          </div>
          <a
            href={`mailto:${settings.email || 'contact@givetogod.store'}`}
            className="text-xs font-bold text-stone-900 hover:underline"
          >
            {settings.email || 'contact@givetogod.store'}
          </a>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Boutique & Atelier</h3>
              <p className="text-xs text-stone-500 mt-1">Point de retrait et showroom officiel.</p>
            </div>
          </div>
          <span className="text-xs font-medium text-stone-700">
            {settings.address || 'Plateau, Abidjan - Côte d\'Ivoire'}
          </span>
        </div>

        {/* Hours */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Horaires</h3>
              <p className="text-xs text-stone-500 mt-1">Accueil physique et expéditions.</p>
            </div>
          </div>
          <span className="text-xs font-medium text-stone-700">
            {settings.openingHours || 'Lundi - Samedi : 09h00 - 19h30'}
          </span>
        </div>

      </div>

      {/* Form & FAQ split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-700" />
              Laissez-nous un message
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Remplissez ce formulaire et nous vous répondrons sous 24h ouvrées.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Message envoyé avec succès !
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Merci {formName || 'cher client'}, notre équipe a bien reçu votre demande et reviendra vers vous très vite.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="py-2 px-5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Votre nom complet <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Kouamé N'Guessan"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Numéro de Téléphone <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Ex: 07 10 07 18 33"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ex: vous@exemple.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Objet du message
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 cursor-pointer"
                >
                  <option value="Renseignement produit">Renseignement sur un article</option>
                  <option value="Suivi de commande">Suivi de ma commande</option>
                  <option value="Échange de taille">Échange de taille</option>
                  <option value="Partenariat / Gros">Partenariat / Commande de groupe</option>
                  <option value="Autre demande">Autre demande</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre message <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Écrivez-nous vos questions en toute liberté..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-stone-950 hover:bg-stone-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer mon message</span>
              </button>
            </form>
          )}

        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Foire Aux Questions
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick WhatsApp helper */}
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-3">
            <h4 className="font-serif font-bold text-emerald-950 text-sm">
              Vous préférez discuter directement ?
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Notre équipe WhatsApp est connectée 7j/7 pour vous assister en temps réel.
            </p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Ouvrir WhatsApp ({settings.phone})</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
