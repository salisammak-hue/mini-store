import React, { useState } from 'react';
import { Product, ProductVariation } from '../types';
import { formatPrice } from '../utils/persianDate';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variation?: ProductVariation, attributes?: { [key: string]: string }) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>();
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});

  const mainImage = product.images?.[0]?.src || 'https://images.pexels.com/photos/3961793/pexels-photo-3961793.jpeg?auto=compress&cs=tinysrgb&w=400';
  const price = selectedVariation?.price || product.price;
  const regularPrice = selectedVariation?.regular_price || product.regular_price;
  const isOnSale = regularPrice !== price && regularPrice !== '';

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariation, selectedAttributes);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onViewDetails(product)}
        />
        {isOnSale && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            حراج
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Eye className="text-white drop-shadow-lg" size={32} />
        </button>
      </div>

      <div className="p-6">
        <button
          onClick={() => onViewDetails(product)}
          className="text-right w-full hover:text-primary-600 transition-colors"
        >
          <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 leading-relaxed hover:text-primary-600">
            {product.name}
          </h3>
        </button>

        {product.short_description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
          </p>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(price)} تومان
          </span>
          {isOnSale && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(regularPrice)} تومان
            </span>
          )}
        </div>

        {product.stock_status === 'outofstock' ? (
          <div className="text-center py-3 bg-gray-100 rounded-xl text-gray-500 font-medium">
            ناموجود
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              افزودن به سبد
            </button>
            <button
              onClick={() => onViewDetails(product)}
              className="px-4 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Eye size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}