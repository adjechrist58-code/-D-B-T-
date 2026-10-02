import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../firebase/config';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '../types/store';

const STORE_SETTINGS_KEY = 'gtg_store_settings_v1';

interface StoreContextType {
  settings: StoreSettings;
  loading: boolean;
  isFirestoreConnected: boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  formatPrice: (amount: number) => string;
  buildWhatsAppUrl: (customMessage?: string) => string;
  cleanPhoneForWhatsApp: () => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialiser d'abord depuis le localStorage local pour une disponibilité immédiate et hors ligne
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORE_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Lecture des paramètres locaux impossible:', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  const [loading, setLoading] = useState(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  // Initialisation et écoute temps réel Firestore avec fallback local
  useEffect(() => {
    let isMounted = true;

    testConnection().then((connected) => {
      if (isMounted) setIsFirestoreConnected(connected);
    });

    const settingsDocRef = doc(db, 'settings', 'store');
    
    // Attachement du listener temps réel
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (!isMounted) return;
        setIsFirestoreConnected(true);

        if (docSnap.exists()) {
          const remoteData = docSnap.data() as StoreSettings;
          const merged = { ...DEFAULT_STORE_SETTINGS, ...remoteData };
          setSettings(merged);
          // Sauvegarde locale de sécurité
          try {
            localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('Erreur sauvegarde cache local:', e);
          }
        } else {
          // Si le document distant n'existe pas encore, tente de l'initialiser
          setDoc(settingsDocRef, settings, { merge: true }).catch((err) => {
            console.warn('Initialisation distante différée:', err.message);
          });
        }
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Firestore hors ligne ou indisponible. Conservation des paramètres locaux :', error.message);
        setIsFirestoreConnected(false);
        // Log sans crash
        handleFirestoreError(error, OperationType.GET, 'settings/store', false);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Synchronisation du titre de la page et des métadonnées SEO en fonction des paramètres actuels
  useEffect(() => {
    if (settings.storeName) {
      document.title = `${settings.storeName} | ${settings.slogan || 'Boutique de Prêt-à-Porter'}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${settings.storeName} - ${settings.slogan}`);
      }
    }
  }, [settings.storeName, settings.slogan]);

  /**
   * Met à jour les paramètres :
   * 1. Sauvegarde immédiatement dans l'état React.
   * 2. Sauvegarde immédiatement dans le localStorage (persistance garantie même hors ligne).
   * 3. Tente de synchroniser avec Firebase Firestore sans bloquer ni planter en cas d'échec réseau.
   */
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated: StoreSettings = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    // 1 & 2 : Mise à jour locale immédiate et inconditionnelle
    setSettings(updated);
    try {
      localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erreur écriture localStorage:', e);
    }

    // 3 : Tentative de synchronisation vers Firestore
    try {
      await setDoc(doc(db, 'settings', 'store'), updated, { merge: true });
      setIsFirestoreConnected(true);
    } catch (error) {
      console.warn('Échec de synchronisation Firestore, modifications conservées en local :', error);
      setIsFirestoreConnected(false);
      handleFirestoreError(error, OperationType.UPDATE, 'settings/store', false);
    }
  };

  const formatPrice = (amount: number): string => {
    const formatted = new Intl.NumberFormat('fr-FR').format(amount);
    return `${formatted} ${settings.currency || 'FCFA'}`;
  };

  const cleanPhoneForWhatsApp = (): string => {
    let cleanCode = (settings.countryCode || '+225').replace(/[^0-9]/g, '');
    let cleanNumber = (settings.phone || '0710071833').replace(/[^0-9]/g, '');
    
    // Nettoyer le 0 initial si l'indicatif est déjà présent
    if (cleanNumber.startsWith('0') && cleanCode) {
      cleanNumber = cleanNumber.substring(1);
    }
    return `${cleanCode}${cleanNumber}`;
  };

  const buildWhatsAppUrl = (customMessage?: string): string => {
    const fullNumber = cleanPhoneForWhatsApp();
    const defaultMsg = `Bonjour ${settings.storeName}, je visite votre boutique en ligne et j'aimerais avoir plus de renseignements sur vos collections.`;
    const message = encodeURIComponent(customMessage || defaultMsg);
    return `https://wa.me/${fullNumber}?text=${message}`;
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        loading,
        isFirestoreConnected,
        updateSettings,
        formatPrice,
        buildWhatsAppUrl,
        cleanPhoneForWhatsApp,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
