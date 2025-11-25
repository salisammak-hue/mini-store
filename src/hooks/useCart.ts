import { useState, useCallback } from 'react';
import { CartItem, Product, ProductVariation } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((
    product: Product,
    quantity: number = 1,
    variation?: ProductVariation,
    selectedAttributes?: { [key: string]: string }
  ) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.productId === product.id && 
        item.variationId === variation?.id
      );

      if (existingItemIndex > -1) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        productId: product.id,
        variationId: variation?.id,
        quantity,
        product,
        variation,
        selectedAttributes
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, variationId?: number) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.productId === productId && item.variationId === variationId)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number, variationId?: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId && item.variationId === variationId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.variation?.price || item.product.price;
      return total + (parseFloat(price) * item.quantity);
    }, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
}