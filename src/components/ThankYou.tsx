import React from 'react';
import { CheckCircle, Package, Calendar } from 'lucide-react';
import { toSolarDateTime } from '../utils/persianDate';

interface ThankYouProps {
  orderData: any;
  onBackToShop: () => void;
  settings: any;
}

export function ThankYou({ orderData, onBackToShop }: ThankYouProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-3xl shadow-xl p-12">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            سفارش شما با موفقیت ثبت شد!
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            از خرید شما متشکریم
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">جزئیات سفارش</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">شماره سفارش</p>
                <p className="font-bold text-gray-800">#{orderData.number || orderData.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">تاریخ سفارش</p>
                <p className="font-bold text-gray-800">{toSolarDateTime(new Date())}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            🚚 سفارش شما بزودی آماده و تحویل خواهد شد
          </p>
          <p className="text-gray-600">
            📱 برای پیگیری سفارش، شماره سفارش را نزد خود نگه دارید
          </p>
        </div>

        <div className="mt-10">
          <button
            onClick={onBackToShop}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-8 rounded-xl transition-colors"
          >
            سفارش جدید
          </button>
        </div>
      </div>
    </div>
  );
}