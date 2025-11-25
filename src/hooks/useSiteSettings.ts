import { useState, useEffect } from 'react';

export interface SiteSettings {
  siteName: string;
  siteSlogan: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  enamad: {
    enabled: boolean;
    url: string;
    showLogo: boolean;
  };
  theme: {
    primaryColor: string;
  };
  footer: {
    copyright: string;
  };
}

// Color palette mapping
const colorPalettes: { [key: string]: { [key: string]: string } } = {
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
};

const defaultSettings: SiteSettings = {
  siteName: 'فروشگاه آنلاین',
  siteSlogan: 'بهترین قیمت محصولات غذایی را با ما تجربه کنید',
  contact: {
    phone: '09123456789',
    email: 'info@shop.com',
    address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳'
  },
  enamad: {
    enabled: true,
    url: 'https://enamad.com',
    showLogo: false
  },
  theme: {
    primaryColor: 'emerald'
  },
  footer: {
    copyright: '© ۱۴۰۴ تمامی حقوق محفوظ است | طراحی و توسعه'
  }
};

const applyColorTheme = (colorName: string) => {
  const palette = colorPalettes[colorName];
  if (!palette) {
    console.warn(`Color palette "${colorName}" not found, using emerald as fallback`);
    return;
  }

  const root = document.documentElement;
  Object.entries(palette).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color);
  });
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Apply color theme when settings change
    if (settings.theme?.primaryColor) {
      applyColorTheme(settings.theme.primaryColor);
    }
  }, [settings.theme?.primaryColor]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/site-settings.json');
      if (response.ok) {
        const loadedSettings = await response.json();
        setSettings({ ...defaultSettings, ...loadedSettings });
      } else {
        console.warn('Could not load site settings, using defaults');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load site settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading };
}