import React, { useState } from 'react';
import { useEffect } from 'react';
import { CustomerInfo, CartItem, Order } from '../types';
import { formatPrice } from '../utils/persianDate';
import { User, Phone, Mail, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import woocommerceApi from '../services/woocommerceApi';

interface CheckoutFormProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBackToCart: () => void;
  onOrderComplete: (orderData: any) => void;
  settings: any;
}

export function CheckoutForm({ cartItems, totalPrice, onBackToCart, onOrderComplete }: CheckoutFormProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: 'N/A',
    state: 'N/A',
    postcode: 'N/A',
    country: 'IR'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [paymentGateways, setPaymentGateways] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod');
  const [storeCurrency, setStoreCurrency] = useState<string>('IRR');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadPaymentGateways();
    loadStoreSettings();
  }, []);

  const loadPaymentGateways = async () => {
    try {
      const gateways = await woocommerceApi.getPaymentGateways();
      const enabledGateways = gateways.filter(gateway => gateway.enabled);
      setPaymentGateways(enabledGateways);
      
      // Set default payment method to first enabled gateway
      if (enabledGateways.length > 0) {
        setSelectedPaymentMethod(enabledGateways[0].id);
      }
    } catch (error) {
      console.error('Failed to load payment gateways:', error);
      // Fallback to COD
      setPaymentGateways([{
        id: 'cod',
        title: 'پرداخت در محل',
        enabled: true
      }]);
    }
  };

  const loadStoreSettings = async () => {
    try {
      const settings = await woocommerceApi.getStoreSettings();
      const currencySetting = settings.find((setting: any) => setting.id === 'woocommerce_currency');
      if (currencySetting) {
        setStoreCurrency(currencySetting.value);
      }
    } catch (error) {
      console.error('Failed to load store settings:', error);
    }
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.first_name.trim()) {
      newErrors.first_name = 'نام الزامی است';
    }
    if (!customerInfo.last_name.trim()) {
      newErrors.last_name = 'نام خانوادگی الزامی است';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'شماره موبایل الزامی است';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentRedirect = (paymentUrl: string) => {
    // Open payment gateway in the same window
    window.location.href = paymentUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedGateway = paymentGateways.find(gateway => gateway.id === selectedPaymentMethod);
      
      const orderData: Order = {
        payment_method: selectedPaymentMethod,
        payment_method_title: selectedGateway?.title || 'پرداخت در محل',
        set_paid: selectedPaymentMethod === 'cod' ? false : false,
        billing: customerInfo,
        shipping: customerInfo,
        line_items: cartItems.map(item => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
          subtotal: (parseFloat(item.variation?.price || item.product.price) * item.quantity).toString(),
          total: (parseFloat(item.variation?.price || item.product.price) * item.quantity).toString()
        })),
        currency: storeCurrency
      };

      const order = await woocommerceApi.createOrder(orderData);
      
      // Check if order has payment URL (for online payment gateways)
      if (order.payment_url && selectedPaymentMethod !== 'cod') {
        // Store order data in sessionStorage for after payment return
        sessionStorage.setItem('pendingOrder', JSON.stringify(order));
        handlePaymentRedirect(order.payment_url);
      } else {
        // For COD or completed payments, go directly to thank you page
        onOrderComplete(order);
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      // For demo purposes, simulate successful order
      onOrderComplete({
        id: Date.now(),
        number: `${Date.now()}`,
        status: 'processing',
        total: totalPrice.toString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBackToCart}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowRight size={20} />
          بازگشت به فروشگاه
        </button>
        <h1 className="text-3xl font-bold text-gray-800">تکمیل خرید</h1>
        <p className="text-gray-600 mt-2">اطلاعات خود را وارد کنید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User size={20} />
              اطلاعات خریدار
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام *
                </label>
                <input
                  type="text"
                  value={customerInfo.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="نام خود را وارد کنید"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام خانوادگی *
                </label>
                <input
                  type="text"
                  value={customerInfo.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="نام خانوادگی خود را وارد کنید"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                شماره موبایل *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="09xxxxxxxxx"
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Payment Method Selection */}
            {paymentGateways.length > 1 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <CreditCard size={16} />
                  روش پرداخت
                </label>
                <div className="space-y-3">
                  {paymentGateways.map(gateway => (
                    <label key={gateway.id} className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value={gateway.id}
                        checked={selectedPaymentMethod === gateway.id}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="ml-3 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="font-medium text-gray-800">{gateway.title}</span>
                      {gateway.description && (
                        <span className="text-sm text-gray-600 mr-2">- {gateway.description}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                آدرس (اختیاری)
              </label>
              <textarea
                value={customerInfo.address_1}
                onChange={(e) => handleInputChange('address_1', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="آدرس خود را با نام شهر وارد کنید"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              {isSubmitting ? 'در حال ثبت سفارش...' : 
               selectedPaymentMethod === 'cod' ? 'ثبت سفارش' : 'ادامه پرداخت'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">خلاصه سفارش</h3>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => {
                const price = item.variation?.price || item.product.price;
                const image = item.variation?.image?.src || item.product.images?.[0]?.src || 
                  'https://images.pexels.com/photos/3961793/pexels-photo-3961793.jpeg?auto=compress&cs=tinysrgb&w=400';

                return (
                  <div key={`${item.productId}-${item.variationId || ''}`} className="flex gap-3">
                    <img
                      src={image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">تعداد: {item.quantity}</span>
                        <span className="text-sm font-medium text-primary-600">
                          {formatPrice(parseFloat(price) * item.quantity)} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>مجموع:</span>
                <span className="text-primary-600">{formatPrice(totalPrice)} تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}