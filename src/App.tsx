import React from 'react';
import { Phone, Mail, MapPin, Store } from 'lucide-react';
import { useCart } from './hooks/useCart';
import { useSiteSettings } from './hooks/useSiteSettings';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutForm } from './components/CheckoutForm';
import { ThankYou } from './components/ThankYou';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Product, ProductVariation } from './types';

function App() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCart();

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleCart = () => setIsOpen(!isOpen);

  const { settings, loading: settingsLoading } = useSiteSettings();

  const [currentView, setCurrentView] = React.useState<'shop' | 'checkout' | 'thankyou'>('shop');
  const [orderData, setOrderData] = React.useState<any>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = React.useState(false);

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleOrderComplete = (data: any) => {
    setOrderData(data);
    clearCart();
    setCurrentView('thankyou');
  };

  const handleBackToShop = () => {
    setCurrentView('shop');
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailsOpen(true);
  };

  const handleCloseProductDetails = () => {
    setIsProductDetailsOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCartFromModal = (
    product: Product,
    variation?: ProductVariation,
    attributes?: { [key: string]: string }
  ) => {
    addToCart(product, variation, attributes);
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        settings={settings}
        cartItemCount={getTotalItems()}
        onCartClick={toggleCart}
      />

      {currentView === 'shop' && (
        <>
          <main className="container mx-auto px-4 py-8">
            <ProductGrid
              onAddToCart={addToCart}
              onViewDetails={handleViewDetails}
            />
          </main>
        </>
      )}

      {currentView === 'checkout' && (
        <CheckoutForm
          cartItems={cartItems}
          totalPrice={getTotalPrice()}
          onOrderComplete={handleOrderComplete}
          onBackToCart={handleBackToShop}
          settings={settings}
        />
      )}

      {currentView === 'thankyou' && (
        <ThankYou 
          orderData={orderData}
          onBackToShop={handleBackToShop}
          settings={settings}
        />
      )}

      <CartSidebar
        isOpen={isOpen}
        onClose={toggleCart}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
        onCheckout={handleCheckout}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isProductDetailsOpen}
        onClose={handleCloseProductDetails}
        onAddToCart={handleAddToCartFromModal}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Info */}
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                <img 
                  src="/logo-footer.webp" 
                  alt={settings.siteName}
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const icon = target.nextElementSibling as HTMLElement;
                    if (icon) icon.style.display = 'block';
                  }}
                />
                <Store className="h-16 w-16 text-primary-600 hidden" />
                <div className="text-center md:text-right">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{settings.siteName}</h3>
                  <p className="text-gray-600">{settings.siteSlogan}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">تماس با ما</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-600">{settings.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-600">{settings.contact.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-1" />
                  <span className="text-gray-600">{settings.contact.address}</span>
                </div>
              </div>
            </div>

            {/* E-namad */}
            {settings.enamad.enabled && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">نماد اعتماد</h4>
                <a 
                  href={settings.enamad.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  {settings.enamad.showLogo ? (
                    <img 
                      src="/enamad-logo.png" 
                      alt="نماد اعتماد الکترونیکی"
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <div className="bg-primary-100 text-primary-600 px-4 py-2 rounded-lg text-sm font-medium">
                      نماد اعتماد الکترونیکی
                    </div>
                  )}
                </a>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              {settings.footer.copyright} <a href="https://hardweb.ir" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">هارد وب</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;