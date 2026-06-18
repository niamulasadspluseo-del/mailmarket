const isBrowser = typeof window !== 'undefined';

// SSR: call PHP directly. Browser: use relative path (same origin).
const API_BASE = !isBrowser
  ? 'http://localhost:8080/api'
  : ((import.meta as any).env?.VITE_API_URL || '/api');

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('mm_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('mm_token', token);
    } else {
      localStorage.removeItem('mm_token');
    }
  }

  getToken() { return this.token; }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
      throw new Error(err.message);
    }
    return res.json();
  }

  // Auth
  login(email: string, role?: string) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, role }) });
  }
  register(name: string, email: string, role: string) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, role }) });
  }
  me() { return this.request('/auth/me'); }
  logout() { return this.request('/auth/logout', { method: 'POST' }); }

  // Products
  getProducts(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/products${qs}`);
  }
  getProduct(id: string) { return this.request(`/products/${id}`); }
  getFeaturedProducts() { return this.request('/products/featured'); }
  getTrendingProducts() { return this.request('/products/trending'); }
  getRelatedProducts(id: string) { return this.request(`/products/${id}/related`); }
  createProduct(data: any) { return this.request('/products', { method: 'POST', body: JSON.stringify(data) }); }
  updateProduct(id: string, data: any) { return this.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteProduct(id: string) { return this.request(`/products/${id}`, { method: 'DELETE' }); }

  // Categories
  getCategories() { return this.request('/categories'); }

  // Cart
  getCart() { return this.request('/cart'); }
  addToCart(productId: string, quantity = 1, variationId?: string) {
    return this.request('/cart/add', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity, variation_id: variationId }) });
  }
  updateCartItem(cartItemId: string, quantity: number) {
    return this.request(`/cart/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
  }
  removeFromCart(cartItemId: string) { return this.request(`/cart/${cartItemId}`, { method: 'DELETE' }); }
  clearCart() { return this.request('/cart', { method: 'DELETE' }); }

  // Wishlist
  getWishlist() { return this.request('/wishlist'); }
  toggleWishlist(productId: string) { return this.request(`/wishlist/${productId}`, { method: 'POST' }); }

  // Orders
  getOrders() { return this.request('/orders'); }
  checkout() { return this.request('/checkout', { method: 'POST' }); }

  // Variations
  getProductVariations(productId: string) { return this.request(`/products/${productId}/variations`); }
  createVariation(productId: string, data: any) { return this.request(`/products/${productId}/variations`, { method: 'POST', body: JSON.stringify(data) }); }
  updateVariation(variationId: string, data: any) { return this.request(`/variations/${variationId}`, { method: 'PUT', body: JSON.stringify(data) }); }
  deleteVariation(variationId: string) { return this.request(`/variations/${variationId}`, { method: 'DELETE' }); }

  // Reviews
  getProductReviews(productId: string) { return this.request(`/products/${productId}/reviews`); }
  addReview(productId: string, rating: number, comment: string) {
    return this.request(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
  }
  deleteReview(reviewId: string) { return this.request(`/reviews/${reviewId}`, { method: 'DELETE' }); }

  // Seller
  getSellerDashboard() { return this.request('/seller/dashboard'); }
  getSeller(id: string) { return this.request(`/sellers/${id}`); }

  // Admin
  getAdminDashboard() { return this.request('/admin/dashboard'); }
  getUsers() { return this.request('/admin/users'); }
  approveSeller(userId: string) { return this.request(`/admin/users/${userId}/approve`, { method: 'POST' }); }
  deleteUser(userId: string) { return this.request(`/admin/users/${userId}`, { method: 'DELETE' }); }
  getAdminReviews() { return this.request('/admin/reviews'); }
  deleteAdminReview(reviewId: string) { return this.request(`/admin/reviews/${reviewId}`, { method: 'DELETE' }); }
}

export const api = new ApiClient();
