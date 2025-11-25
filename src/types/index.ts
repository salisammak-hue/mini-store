export interface WooCommerceConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  variations: number[];
  type: 'simple' | 'variable' | 'grouped' | 'external';
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  manage_stock: boolean;
  stock_quantity: number | null;
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
  variation: boolean;
  visible: boolean;
}

export interface ProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  attributes: VariationAttribute[];
  image: ProductImage;
  stock_status: string;
  stock_quantity: number | null;
}

export interface VariationAttribute {
  id: number;
  name: string;
  option: string;
}

export interface CartItem {
  productId: number;
  variationId?: number;
  quantity: number;
  product: Product;
  variation?: ProductVariation;
  selectedAttributes?: { [key: string]: string };
}

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  phone: string;
  address_1?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country: string;
}

export interface Order {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: CustomerInfo;
  shipping: CustomerInfo;
  line_items: OrderLineItem[];
  currency: string;
}

export interface OrderLineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  subtotal: string;
  total: string;
}