import { WooCommerceConfig, Product, ProductVariation, ProductCategory, Order } from '../types';
import config from '../config/woocommerce.json';

class WooCommerceApi {
  private config: WooCommerceConfig;
  private baseApiUrl: string;

  constructor() {
    this.config = config as WooCommerceConfig;
    this.baseApiUrl = `${this.config.baseUrl}/wp-json/${this.config.version}`;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  private getAuthString(): string {
    return btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseApiUrl}${endpoint}`;
    const headers = {
      'Authorization': `Basic ${this.getAuthString()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getProducts(page: number = 1, perPage: number = 20): Promise<Product[]> {
    return this.makeRequest<Product[]>(`/products?page=${page}&per_page=${perPage}&status=publish`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.makeRequest<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<ProductCategory[]> {
    return this.makeRequest<ProductCategory[]>('/products/categories?parent=0&per_page=100');
  }

  async getProductVariations(productId: number): Promise<ProductVariation[]> {
    return this.makeRequest<ProductVariation[]>(`/products/${productId}/variations`);
  }

  async createOrder(orderData: Order): Promise<any> {
    return this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getStoreSettings(): Promise<any> {
    return this.makeRequest<any>('/settings/general');
  }

  async getPaymentGateways(): Promise<any[]> {
    return this.makeRequest<any[]>('/payment_gateways');
  }
}

export default new WooCommerceApi();