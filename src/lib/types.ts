export type Role = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  bio?: string;
  joined: string;
  approved?: boolean;
}

export interface Variation {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  category_name?: string;
  price: number;
  stock: number;
  image: string;
  sellerId: string;
  seller_name?: string;
  seller_avatar?: string;
  rating: number;
  reviewsCount: number;
  deliveryType: "Instant Download" | "Email Delivery" | "License Key";
  sales: number;
  trending?: boolean;
  featured?: boolean;
  createdAt: string;
  variations?: Variation[];
}

export interface Order {
  id: string;
  buyerId: string;
  productId: string;
  amount: number;
  status: "pending" | "completed" | "refunded";
  date: string;
}

export interface Review {
  id: string;
  userId: string;
  user_name?: string;
  user_avatar?: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
}
