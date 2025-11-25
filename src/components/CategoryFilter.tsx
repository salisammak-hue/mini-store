import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryFilterProps {
  categories: ProductCategory[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedCategoryName = selectedCategory === null
    ? 'همه'
    : categories?.find(cat => cat.id === selectedCategory)?.name || 'همه';

  if (!categories || categories.length === 0) {
    return null;
  }
  
  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/*<h3 className="text-lg font-bold text-gray-800 mb-4">دسته‌بندی‌ها</h3>*/}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onCategoryChange(null)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              همه
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-between"
        >
          <span className="font-medium text-gray-800">دسته‌بندی‌ها</span>
          <div className="flex items-center gap-2">
            <span className="text-primary-600 font-medium">{selectedCategoryName}</span>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">دسته‌بندی‌ها</h3>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 text-center ${
                      selectedCategory === null
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    همه
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`p-4 rounded-xl font-medium transition-all duration-200 text-center ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}