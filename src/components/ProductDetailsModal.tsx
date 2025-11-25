import React, { useState } from 'react';
import { Product, ProductVariation } from '../types';
import { formatPrice } from '../utils/persianDate';
import { X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variation?: ProductVariation, attributes?: { [key: string]: string }) => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>();
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  if (!product || !isOpen) return null;

  const images = product.images?.length > 0 ? product.images : [
    { id: 1, src: 'https://images.pexels.com/photos/3961793/pexels-photo-3961793.jpeg?auto=compress&cs=tinysrgb&w=600', name: '', alt: '' }
  ];

  const currentImage = images[currentImageIndex];
  const price = selectedVariation?.price || product.price;
  const regularPrice = selectedVariation?.regular_price || product.regular_price;
  const isOnSale = regularPrice !== price && regularPrice !== '';

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariation, selectedAttributes);
    setQuantity(1);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<div>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full md:max-w-4xl md:rounded-2xl rounded-t-3xl shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 flex-1 text-center md:text-right">جزئیات محصول</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={currentImage.src}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  حراج
                </div>
              )}

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-primary-600 ring-2 ring-primary-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={`محصول ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Product Name and Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl md:text-4xl font-bold text-primary-600">
                  {formatPrice(price)} تومان
                </span>
                {isOnSale && (
                  <span className="text-lg md:text-xl text-gray-400 line-through">
                    {formatPrice(regularPrice)} تومان
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`font-medium ${
                    product.stock_status === 'instock' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.stock_status === 'instock' ? 'موجود' : 'ناموجود'}
                </span>
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
                </p>
              </div>
            )}

            {/* Full Description */}
            {product.description && (
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">توضیحات کامل</h3>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm md:text-base">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              </div>
            )}

            {/* Attributes/Features */}
            {product.attributes && product.attributes.length > 0 && (
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">مشخصات</h3>
                <div className="space-y-3">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">{attr.name}</label>
                      <select
                        value={selectedAttributes[attr.name] || ''}
                        onChange={(e) =>
                          setSelectedAttributes({
                            ...selectedAttributes,
                            [attr.name]: e.target.value
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">انتخاب {attr.name}</option>
                        {attr.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {product.stock_status === 'instock' && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">تعداد</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium min-w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart size={20} />
                  افزودن به سبد خرید
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
