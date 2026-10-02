import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { OffersPage } from './pages/OffersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';

import { Product } from './types/store';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.includes('admin')) return 'admin';
      if (pathname.includes('boutique')) return 'boutique';
      if (pathname.includes('offres')) return 'offres';
      if (pathname.includes('contact')) return 'contact';
      if (pathname.includes('commande')) return 'commande';
    }
    return 'accueil';
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync with browser history state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('admin')) setCurrentTab('admin');
      else if (path.includes('boutique')) setCurrentTab('boutique');
      else if (path.includes('offres')) setCurrentTab('offres');
      else if (path.includes('contact')) setCurrentTab('contact');
      else if (path.includes('commande')) setCurrentTab('commande');
      else setCurrentTab('accueil');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = tab === 'accueil' ? '/' : `/${tab}`;
      window.history.pushState(null, '', url);
    } catch {
      // Ignore in iframe if pushState restricted
    }
  };

  const isAdminView = currentTab === 'admin';

  return (
    <AuthProvider>
      <StoreProvider>
        <ProductsProvider>
          <CartProvider>
            <OrdersProvider>
              <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
                
                {/* Header (Hidden on admin page to maintain focus) */}
                {!isAdminView && (
                  <Header
                    currentTab={currentTab}
                    setCurrentTab={handleTabChange}
                    onOpenSearch={() => handleTabChange('boutique')}
                  />
                )}

                {/* Main Content Area */}
                <main className="flex-1">
                  {currentTab === 'accueil' && (
                    <HomePage
                      setCurrentTab={handleTabChange}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                    />
                  )}

                  {currentTab === 'boutique' && (
                    <ShopPage
                      onSelectProduct={(p) => setSelectedProduct(p)}
                    />
                  )}

                  {currentTab === 'offres' && (
                    <OffersPage
                      onSelectProduct={(p) => setSelectedProduct(p)}
                      setCurrentTab={handleTabChange}
                    />
                  )}

                  {currentTab === 'a-propos' && (
                    <AboutPage
                      setCurrentTab={handleTabChange}
                    />
                  )}

                  {currentTab === 'contact' && (
                    <ContactPage />
                  )}

                  {currentTab === 'commande' && (
                    <CheckoutPage
                      setCurrentTab={handleTabChange}
                    />
                  )}

                  {currentTab === 'admin' && (
                    <AdminPage
                      onBackToStore={() => handleTabChange('accueil')}
                    />
                  )}
                </main>

                {/* Footer (Hidden in admin view) */}
                {!isAdminView && (
                  <Footer
                    setCurrentTab={handleTabChange}
                  />
                )}

                {/* Shopping Cart Drawer */}
                {!isAdminView && (
                  <CartDrawer
                    onGoToCheckout={() => handleTabChange('commande')}
                    onContinueShopping={() => handleTabChange('boutique')}
                  />
                )}

                {/* Product Detail Modal */}
                <ProductDetailModal
                  product={selectedProduct}
                  onClose={() => setSelectedProduct(null)}
                />

                {/* Floating WhatsApp Action Button */}
                {!isAdminView && <WhatsAppFloatingButton />}

              </div>
            </OrdersProvider>
          </CartProvider>
        </ProductsProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
