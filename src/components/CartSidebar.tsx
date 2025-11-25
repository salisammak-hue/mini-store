import React from 'react';
import { CartItem } from '../types';
import { formatPrice } from '../utils/persianDate';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  onRemoveItem: (productId: number, variationId?: number) => void;
  onCheckout: () => void;
  totalPrice: number;
}

export function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  totalPrice 
}: CartSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">سبد خرید</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag size={48} className="mb-4" />
                <p>سبد خرید شما خالی است</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const price = item.variation?.price || item.product.price;
                  const image = item.variation?.image?.src || item.product.images?.[0]?.src || 
                    'https://images.pexels.com/photos/3961793/pexels-photo-3961793.jpeg?auto=compress&cs=tinysrgb&w=400';

                  return (
                    <div key={`${item.productId}-${item.variationId || ''}`} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex gap-4">
                        <img
                          src={image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1), item.variationId)}
                                className="p-1 hover:bg-white rounded-md transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-medium px-3 py-1 bg-white rounded-md">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.variationId)}
                                className="p-1 hover:bg-white rounded-md transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => onRemoveItem(item.productId, item.variationId)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="mt-2 text-primary-600 font-bold">
                            {formatPrice(parseFloat(price) * item.quantity)} تومان
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">مجموع:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(totalPrice)} تومان
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 rounded-xl transition-colors"
              >
                ادامه خرید
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}