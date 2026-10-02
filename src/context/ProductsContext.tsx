import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Product, Offer } from '../types/store';
import { INITIAL_PRODUCTS, INITIAL_OFFERS } from '../data/seedData';

const PRODUCTS_STORAGE_KEY = 'gtg_products_v1';
const OFFERS_STORAGE_KEY = 'gtg_offers_v1';

interface ProductsContextType {
  products: Product[];
  offers: Offer[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<string>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  activeOffers: Offer[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Chargement initial depuis le localStorage pour une disponibilité immédiate
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erreur lecture produits locaux:', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem(OFFERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erreur lecture offres locales:', e);
    }
    return INITIAL_OFFERS;
  });

  const [loading, setLoading] = useState(false);

  // Synchronisation avec Firebase Firestore
  useEffect(() => {
    let isMounted = true;
    const productsCollectionRef = collection(db, 'products');
    const offersCollectionRef = collection(db, 'offers');

    const seedIfEmpty = async () => {
      try {
        const prodSnap = await getDocs(productsCollectionRef);
        if (prodSnap.empty) {
          for (const item of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', item.id), item).catch(() => {});
          }
        }

        const offerSnap = await getDocs(offersCollectionRef);
        if (offerSnap.empty) {
          for (const offer of INITIAL_OFFERS) {
            await setDoc(doc(db, 'offers', offer.id), offer).catch(() => {});
          }
        }
      } catch (error) {
        console.warn('Initialisation distante des données ignorée ou différée:', error);
      }
    };

    seedIfEmpty();

    const unsubProducts = onSnapshot(
      productsCollectionRef,
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Product));
          setProducts(list);
          try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
          } catch (e) {
            console.warn(e);
          }
        }
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Firestore products offline, conservation des données locales:', error.message);
        handleFirestoreError(error, OperationType.LIST, 'products', false);
        setLoading(false);
      }
    );

    const unsubOffers = onSnapshot(
      offersCollectionRef,
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list: Offer[] = [];
          snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Offer));
          setOffers(list);
          try {
            localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(list));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Firestore offers offline, conservation des offres locales:', error.message);
        handleFirestoreError(error, OperationType.LIST, 'offers', false);
      }
    );

    return () => {
      isMounted = false;
      unsubProducts();
      unsubOffers();
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
    };

    // Sauvegarde locale immédiate
    const updated = [newProduct, ...products];
    setProducts(updated);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (error) {
      console.warn('Sauvegarde produit conservée en local (Firestore différé):', error);
      handleFirestoreError(error, OperationType.CREATE, `products/${id}`, false);
    }
    return id;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Sauvegarde locale immédiate
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await setDoc(doc(db, 'products', id), updates, { merge: true });
    } catch (error) {
      console.warn('Modification produit conservée en local :', error);
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`, false);
    }
  };

  const deleteProduct = async (id: string) => {
    // Sauvegarde locale immédiate
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.warn('Suppression produit locale confirmée (Firestore différé) :', error);
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`, false);
    }
  };

  const addOffer = async (offerData: Omit<Offer, 'id'>): Promise<string> => {
    const id = `offer-${Date.now()}`;
    const newOffer: Offer = {
      ...offerData,
      id,
    };

    // Sauvegarde locale immédiate
    const updated = [newOffer, ...offers];
    setOffers(updated);
    try {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await setDoc(doc(db, 'offers', id), newOffer);
    } catch (error) {
      console.warn('Offre enregistrée localement (Firestore différé) :', error);
      handleFirestoreError(error, OperationType.CREATE, `offers/${id}`, false);
    }
    return id;
  };

  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    // Sauvegarde locale immédiate
    const updated = offers.map((o) => (o.id === id ? { ...o, ...updates } : o));
    setOffers(updated);
    try {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await setDoc(doc(db, 'offers', id), updates, { merge: true });
    } catch (error) {
      console.warn('Modification offre conservée localement :', error);
      handleFirestoreError(error, OperationType.UPDATE, `offers/${id}`, false);
    }
  };

  const deleteOffer = async (id: string) => {
    // Sauvegarde locale immédiate
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    try {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await deleteDoc(doc(db, 'offers', id));
    } catch (error) {
      console.warn('Suppression offre locale confirmée :', error);
      handleFirestoreError(error, OperationType.DELETE, `offers/${id}`, false);
    }
  };

  // Filtrer les offres actives et non expirées
  const nowStr = new Date().toISOString().split('T')[0];
  const activeOffers = offers.filter((offer) => {
    if (!offer.isActive) return false;
    if (offer.endDate && offer.endDate < nowStr) return false;
    return true;
  });

  return (
    <ProductsContext.Provider
      value={{
        products,
        offers,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addOffer,
        updateOffer,
        deleteOffer,
        activeOffers,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
