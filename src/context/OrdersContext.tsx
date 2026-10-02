import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Order, OrderStatus } from '../types/store';

const ORDERS_STORAGE_KEY = 'gtg_orders_v1';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Chargement immédiat depuis le stockage local
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Erreur lecture commandes locales:', e);
    }
    return [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        if (!isMounted) return;
        const list: Order[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Order);
        });
        if (list.length > 0) {
          setOrders(list);
          try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(list));
          } catch (e) {
            console.warn(e);
          }
        }
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Firestore orders indisponible, utilisation du cache local :', error.message);
        handleFirestoreError(error, OperationType.LIST, 'orders', false);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    // Génère une référence lisible comme GTG-2026-9842
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GTG-${new Date().getFullYear()}-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'Nouvelle',
      createdAt: new Date().toISOString(),
    };

    // 1. Sauvegarde locale immédiate garantie
    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erreur sauvegarde locale commande:', e);
    }

    // 2. Synchronisation avec Firestore
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (error) {
      console.warn('Commande enregistrée en local (Firestore différé):', error);
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`, false);
    }

    return orderId;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Mise à jour locale immédiate
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Synchronisation Firestore
    try {
      await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
    } catch (error) {
      console.warn('Statut commande mis à jour en local :', error);
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`, false);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'Annulée')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Nouvelle' || o.status === 'En cours').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Livrée').length;

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        updateOrderStatus,
        stats: {
          totalRevenue,
          totalOrders,
          pendingOrders,
          deliveredOrders,
        },
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
