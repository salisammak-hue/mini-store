import React, { useEffect, useState } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { ImageSlider, SlideData } from './ImageSlider';
import { Loader2 } from 'lucide-react';
import woocommerceApi from '../services/woocommerceApi';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductGrid({ onAddToCart, onViewDetails }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  
  // جدا کردن stateهای لودینگ
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSlides, setLoadingSlides] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // محاسبه شده - زمانی که همه چیز لود شده باشد
  const isEverythingLoaded = !loadingProducts && !loadingCategories && !loadingSlides;

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadSliderData();
  }, []);

  useEffect(() => {
    filterProductsByCategory();
    updateCategoriesWithProducts();
  }, [selectedCategory, allProducts]);

  const loadSliderData = async () => {
    try {
      setLoadingSlides(true);
      
      // ابتدا فایل config.json را بارگذاری می‌کنیم
      const configResponse = await fetch('/config.json');
      if (!configResponse.ok) {
        throw new Error('Failed to load config');
      }
      const config = await configResponse.json();
      
      // سپس فایل slider data را بارگذاری می‌کنیم
      const sliderResponse = await fetch(config.sliderDataUrl);
      if (!sliderResponse.ok) {
        throw new Error('Failed to load slider data');
      }
      const sliderData = await sliderResponse.json();
      
      setSlides(sliderData);
    } catch (err) {
      console.error('Failed to load slider data:', err);
      
      // در صورت خطا، از داده‌های پیش‌فرض استفاده می‌کنیم
      setSlides([
        {
          desktopImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200&h=250',
          mobileImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=300',
          link: 'https://example.com/offer1',
          alt: 'پیشنهاد ویژه ۱'
        },
        {
          desktopImage: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1200&h=250',
          mobileImage: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600&h=300',
          alt: 'بنر تبلیغاتی ۲'
        }
      ]);
    } finally {
      setLoadingSlides(false);
    }
  };
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const fetchedProducts = await woocommerceApi.getProducts(1, 20);
      setAllProducts(fetchedProducts);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('خطا در بارگذاری محصولات');
      
      // Mock data for demonstration
      const mockProducts = [
        {
          id: 1,
          name: 'تی‌شرت کلاسیک',
          description: 'تی‌شرت با کیفیت عالی',
          short_description: 'راحت و شیک',
          price: '250000',
          regular_price: '300000',
          sale_price: '250000',
          images: [{ id: 1, src: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400', name: '', alt: '' }],
          categories: [{ id: 1, name: 'پوشاک', slug: 'clothing' }],
          attributes: [],
          variations: [],
          type: 'simple',
          stock_status: 'instock',
          manage_stock: false,
          stock_quantity: null
        },
        {
          id: 2,
          name: 'شلوار جین',
          description: 'شلوار جین با طراحی مدرن',
          short_description: 'مناسب برای روزمره',
          price: '450000',
          regular_price: '450000',
          sale_price: '',
          images: [{ id: 2, src: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400', name: '', alt: '' }],
          categories: [{ id: 1, name: 'پوشاک', slug: 'clothing' }],
          attributes: [],
          variations: [],
          type: 'simple',
          stock_status: 'instock',
          manage_stock: false,
          stock_quantity: null
        },
        {
          id: 3,
          name: 'کفش ورزشی',
          description: 'کفش ورزشی راحت و با کیفیت',
          short_description: 'مناسب برای ورزش و پیاده‌روی',
          price: '680000',
          regular_price: '750000',
          sale_price: '680000',
          images: [{ id: 3, src: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400', name: '', alt: '' }],
          categories: [{ id: 2, name: 'کفش', slug: 'shoes' }],
          attributes: [],
          variations: [],
          type: 'simple',
          stock_status: 'instock',
          manage_stock: false,
          stock_quantity: null
        },
        {
          id: 4,
          name: 'ساعت هوشمند',
          description: 'ساعت هوشمند با امکانات پیشرفته',
          short_description: 'مانیتورینگ سلامت و فیتنس',
          price: '1200000',
          regular_price: '1200000',
          sale_price: '',
          images: [{ id: 4, src: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400', name: '', alt: '' }],
          categories: [{ id: 3, name: 'الکترونیک', slug: 'electronics' }],
          attributes: [],
          variations: [],
          type: 'simple',
          stock_status: 'instock',
          manage_stock: false,
          stock_quantity: null
        }
      ];
      setAllProducts(mockProducts);
      setProducts(mockProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const fetchedCategories = await woocommerceApi.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
      
      // Set mock categories as fallback
      setCategories([
        { id: 1, name: 'پوشاک', slug: 'clothing' },
        { id: 2, name: 'کفش', slug: 'shoes' },
        { id: 3, name: 'الکترونیک', slug: 'electronics' },
        { id: 4, name: 'لوازم خانگی', slug: 'home' },
        { id: 5, name: 'کتاب', slug: 'books' },
        { id: 6, name: 'ورزش', slug: 'sports' }
      ]);
      
      setTimeout(loadCategories, 2000);
    } finally {
      setLoadingCategories(false);
    }
  };

  const filterProductsByCategory = () => {
    if (selectedCategory === null) {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.categories.some(category => category.id === selectedCategory)
      );
      setProducts(filtered);
    }
  };

  const updateCategoriesWithProducts = () => {
    const categoriesWithProductCount = categories.filter(category => 
      allProducts.some(product => 
        product.categories.some(productCategory => productCategory.id === category.id)
      )
    );
    setCategoriesWithProducts(categoriesWithProductCount);
  };

  return (
    <div className="space-y-6">
      {/* اسلایدر فقط زمانی نمایش داده می‌شود که داده‌ها لود شده باشند */}
      {!loadingSlides && slides.length > 0 && (
        <ImageSlider slides={slides} />
      )}
      
      {/* نمایش لودینگ فقط برای بخش محصولات و دسته‌بندی‌ها */}
      {!isEverythingLoaded ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-gray-600">
              در حال بارگذاری 
              {loadingSlides && ' اسلایدر'}
              {loadingProducts && ' محصولات'}
              {loadingCategories && ' دسته‌بندی‌ها'}
              ...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={loadProducts}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* دسته‌بندی‌ها فقط اگر موجود باشند نمایش داده می‌شوند */}
          {categoriesWithProducts.length > 0 && (
            <CategoryFilter
              categories={categoriesWithProducts}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}

          {/* محصولات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}