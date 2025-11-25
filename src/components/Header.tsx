import React from 'react';
import { ShoppingCart, Phone } from 'lucide-react';
import { SiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  settings: SiteSettings;
  cartItemCount: number;
  onCartClick: () => void;
}

export function Header({ settings, cartItemCount, onCartClick }: HeaderProps) {

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.webp" 
              alt="لوگو فروشگاه" 
              className="h-10 w-48 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-sm">ف</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">{settings.siteName}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Phone Number */}
            <a
              href={`tel:${settings.contact.phone}`}
              className="flex flex-row-reverse items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-xl transition-colors" 
            >
              <Phone size={25} />
              <span className="hidden sm:inline font-medium">{settings.contact.phone}</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative bg-primary-50 hover:bg-primary-100 text-primary-600 p-3 rounded-xl transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}