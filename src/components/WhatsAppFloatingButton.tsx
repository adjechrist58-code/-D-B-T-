import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings, buildWhatsAppUrl } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2">
      {/* Tooltip greeting */}
      {showTooltip && (
        <div className="relative bg-white text-stone-900 border border-stone-200/90 shadow-xl rounded-2xl p-3 max-w-[240px] text-xs animate-fade-in flex items-start gap-2">
          <div>
            <div className="font-bold text-stone-950 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Service Client Give to God
            </div>
            <p className="text-stone-600 mt-1 text-[11px] leading-relaxed">
              Une question sur une taille ou votre commande ? Écrivez-nous en direct !
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full cursor-pointer"
            aria-label="Fermer le message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        aria-label={`Contacter ${settings.storeName} sur WhatsApp`}
        title={`Contacter ${settings.storeName} sur WhatsApp : ${settings.phone}`}
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};
