export interface StoreSettings {
  storeName: string;
  slogan: string;
  phone: string;
  countryCode: string;
  email: string;
  address: string;
  currency: string;
  openingHours: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  announcement: string;
  showAnnouncement: boolean;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  deliveryFee: number;
  deliveryFreeThreshold: number;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  badge: string;
  oldPrice?: number;
  newPrice: number;
  discountPercentage?: number;
  imageUrl: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  productId?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'Nouvelle' | 'En cours' | 'Livrée' | 'Annulée';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  note?: string;
  deliveryMethod?: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Give to God",
  slogan: "L'élégance qui glorifie. Vêtements haut de gamme d'inspiration chrétienne.",
  phone: "0710071833",
  countryCode: "+225",
  email: "contact@givetogod.store",
  address: "Plateau, Abidjan - Côte d'Ivoire",
  currency: "FCFA",
  openingHours: "Lundi - Samedi: 09h00 - 19h30",
  heroTitle: "Donnez le meilleur de vous-même.",
  heroSubtitle: "Des pièces de prêt-à-porter confectionnées avec passion, alliant streetwear raffiné, confort noble et messages d'espérance.",
  heroImageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
  announcement: "Livraison offerte à Abidjan dès 25 000 FCFA d'achats ! Commande rapide par WhatsApp.",
  showAnnouncement: true,
  instagramUrl: "https://instagram.com/givetogod",
  facebookUrl: "https://facebook.com/givetogod",
  tiktokUrl: "https://tiktok.com/@givetogod",
  deliveryFee: 1500,
  deliveryFreeThreshold: 25000,
};
