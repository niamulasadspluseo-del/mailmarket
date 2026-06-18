import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import type { Order, Product, Role, User, Variation } from "./types";

type Theme = "dark" | "light";

interface CartItem { id?: string; productId: string; variationId?: string; variationName?: string; qty: number }

interface AppState {
  user: User | null;
  theme: Theme;
  cart: CartItem[];
  wishlist: string[];
  products: Product[];
  orders: Order[];
  users: User[];
  loading: boolean;
  signIn: (email: string, role?: Role) => Promise<User | null>;
  signUp: (name: string, email: string, role: Role) => Promise<User>;
  signOut: () => void;
  toggleTheme: () => void;
  addToCart: (productId: string, qty?: number, variationId?: string) => void;
  removeFromCart: (productId: string) => void;
  setCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  checkout: () => Promise<Order[]>;
  addReview: (productId: string, rating: number, comment: string) => void;
  addProduct: (p: Omit<Product, "id" | "rating" | "reviewsCount" | "sales" | "createdAt" | "variations"> & { variations?: { name: string; price: number; stock: number }[] }) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveSeller: (id: string, approved: boolean) => void;
  deleteUser: (id: string) => void;
  findUser: (id: string) => User | undefined;
  findProduct: (id: string) => Product | undefined;
}

const Ctx = createContext<AppState | null>(null);

function hydrateUser(data: any): User {
  return {
    id: String(data.id ?? data.id),
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(data.email)}`,
    bio: data.bio,
    joined: data.joined ?? data.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    approved: data.approved ?? true,
  };
}

function hydrateProduct(p: any): Product {
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    category: p.category ?? p.category_slug ?? "",
    category_name: p.category_name,
    price: Number(p.price),
    stock: p.stock,
    image: p.image,
    sellerId: String(p.sellerId ?? p.seller_id),
    seller_name: p.seller_name,
    seller_avatar: p.seller_avatar,
    rating: Number(p.rating),
    reviewsCount: p.reviewsCount ?? p.reviews_count ?? 0,
    deliveryType: p.deliveryType ?? p.delivery_type ?? "Instant Download",
    sales: p.sales ?? 0,
    trending: p.trending ?? false,
    featured: p.featured ?? false,
    createdAt: p.createdAt ?? p.created_at?.slice(0, 10) ?? "",
  };
}

function hydrateOrder(o: any): Order {
  return {
    id: String(o.id),
    buyerId: String(o.buyerId ?? o.buyer_id ?? o.user_id ?? ""),
    productId: String(o.productId ?? o.product_id ?? o.items?.[0]?.product_id ?? ""),
    amount: Number(o.amount ?? o.total_amount),
    status: o.status,
    date: o.date ?? o.created_at?.slice(0, 10) ?? "",
  };
}

function hydrateReview(r: any): Review {
  return {
    id: String(r.id),
    userId: String(r.userId ?? r.user_id),
    user_name: r.user_name,
    user_avatar: r.user_avatar,
    productId: String(r.productId ?? r.product_id),
    rating: r.rating,
    comment: r.comment,
    date: r.date ?? r.created_at?.slice(0, 10) ?? "",
  };
}

function hydrateUserFromList(u: any): User {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(u.email)}`,
    bio: u.bio,
    joined: u.joined ?? u.created_at?.slice(0, 10) ?? "",
    approved: u.approved ?? true,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const usersById = useMemo(() => {
    const m = new Map<string, User>();
    for (const u of users) m.set(u.id, u);
    if (user) m.set(user.id, user);
    return m;
  }, [users, user]);

  const findUser = useCallback((id: string) => usersById.get(id), [usersById]);

  const findProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const toCategoryId = useCallback((slug: string) => categoryMap[slug] ?? slug, [categoryMap]);

  // Load theme from localStorage (UI preference only)
  useEffect(() => {
    const saved = localStorage.getItem("mm_theme") as Theme | null;
    if (saved === "light" || saved === "dark") setTheme(saved);
    // Load category mapping
    api.getCategories().then((res) => {
      const cats = res.categories ?? [];
      const map: Record<string, string> = {};
      for (const c of cats) map[c.slug] = String(c.id);
      setCategoryMap(map);
    }).catch(() => {});
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("mm_theme", theme);
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Hydrate: load products + user data
  useEffect(() => {
    const token = api.getToken();
    let cancelled = false;

    async function hydrate() {
      // Always load products for guests too
      api.getProducts({ per_page: '100' }).then((prodRes) => {
        if (!cancelled) {
          const allProds = (prodRes.products?.data ?? prodRes.products ?? []).map(hydrateProduct);
          setProducts(allProds);
        }
      }).catch(() => {});

      if (!token) { setLoading(false); return; }

      try {
        const [meRes] = await Promise.all([
          api.me(),
        ]);

        if (cancelled) return;

        const u = hydrateUser(meRes.user ?? meRes);
        setUser(u);

        // Load cart, wishlist, orders in parallel
        const [cartRes, wishRes, orderRes] = await Promise.all([
          api.getCart().catch(() => null),
          api.getWishlist().catch(() => null),
          api.getOrders().catch(() => null),
        ]);

        if (cancelled) return;

        if (cartRes?.cart) {
          setCart(cartRes.cart.map((item: any) => ({
            id: String(item.id),
            productId: String(item.productId ?? item.product_id),
            variationId: item.variationId ? String(item.variationId) : undefined,
            variationName: item.variationName,
            qty: item.qty ?? item.quantity ?? 1,
          })));
        }

        if (wishRes?.wishlistIds) {
          setWishlist(wishRes.wishlistIds.map((id: any) => String(id)));
        }

        if (orderRes?.orders) {
          setOrders(orderRes.orders.map(hydrateOrder));
        }

        // Load users if admin
        if (u.role === 'admin') {
          const usersRes = await api.getUsers().catch(() => null);
          if (usersRes?.users && !cancelled) {
            setUsers(usersRes.users.map(hydrateUserFromList));
          }
        }
      } catch {
        // Token expired or invalid
        api.setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(async (email: string, role: Role = "buyer") => {
    try {
      const res = await api.login(email, role);
      api.setToken(res.token);
      const u = hydrateUser(res.user);
      setUser(u);

      // Reload user-specific data
      const [cartRes, wishRes, orderRes] = await Promise.all([
        api.getCart().catch(() => null),
        api.getWishlist().catch(() => null),
        api.getOrders().catch(() => null),
      ]);

      if (cartRes?.cart) {
        setCart(cartRes.cart.map((item: any) => ({
          id: String(item.id),
          productId: String(item.productId ?? item.product_id),
          qty: item.qty ?? item.quantity ?? 1,
        })));
      }
      if (wishRes?.wishlistIds) {
        setWishlist(wishRes.wishlistIds.map((id: any) => String(id)));
      }
      if (orderRes?.orders) setOrders(orderRes.orders.map(hydrateOrder));

      if (u.role === 'admin') {
        const usersRes = await api.getUsers().catch(() => null);
        if (usersRes?.users) setUsers(usersRes.users.map(hydrateUserFromList));
      }

      return u;
    } catch {
      return null;
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, role: Role) => {
    const res = await api.register(name, email, role);
    api.setToken(res.token);
    const u = hydrateUser(res.user);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(() => {
    api.logout().catch(() => {});
    api.setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const addToCart = useCallback((productId: string, qty = 1, variationId?: string) => {
    const key = variationId ? `${productId}-${variationId}` : productId;
    api.addToCart(productId, qty, variationId).then((res) => {
      if (res?.cart_item) {
        const ci = res.cart_item;
        setCart((c) => {
          const ex = c.find((i) => i.productId === productId && i.variationId === variationId);
          if (ex) return c.map((i) => i.productId === productId && i.variationId === variationId ? { ...i, id: String(ci.id), qty: i.qty + qty } : i);
          return [...c, { id: String(ci.id), productId, variationId, variationName: ci.variationName, qty }];
        });
      }
    }).catch(() => {
      setCart((c) => {
        const ex = c.find((i) => i.productId === productId && i.variationId === variationId);
        if (ex) return c.map((i) => i.productId === productId && i.variationId === variationId ? { ...i, qty: i.qty + qty } : i);
        return [...c, { productId, variationId, qty }];
      });
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const item = cart.find((i) => i.productId === id || i.id === id);
    if (item?.id) api.removeFromCart(item.id).catch(() => {});
    setCart((c) => c.filter((i) => i.productId !== id && i.id !== id));
  }, [cart]);

  const setCartQty = useCallback((id: string, qty: number) => {
    const item = cart.find((i) => i.productId === id || i.id === id);
    if (item?.id) api.updateCartItem(item.id, Math.max(1, qty)).catch(() => {});
    setCart((c) => c.map((i) => i.productId === id || i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  }, [cart]);

  const clearCart = useCallback(() => {
    api.clearCart().catch(() => {});
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    api.toggleWishlist(id).catch(() => {});
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
  }, []);

  const checkout = useCallback(async () => {
    try {
      const res = await api.checkout();
      const newOrders: Order[] = (res.orders ?? []).map(hydrateOrder);
      setOrders((o) => [...newOrders, ...o]);
      setCart([]);
      return newOrders;
    } catch {
      return [];
    }
  }, []);

  const addReview = useCallback((productId: string, rating: number, comment: string) => {
    api.addReview(productId, rating, comment).then((res) => {
      if (res?.review) {
        setProducts((ps) => ps.map((p) => p.id === productId ? {
          ...p,
          reviewsCount: p.reviewsCount + 1,
          rating: Math.round(((p.rating * p.reviewsCount + rating) / (p.reviewsCount + 1)) * 10) / 10,
        } : p));
      }
    }).catch(() => {});
  }, []);

  const addProduct: AppState["addProduct"] = useCallback(async (p) => {
    const payload: Record<string, any> = {
      title: p.title,
      description: p.description,
      category_id: toCategoryId(p.category),
      price: p.price,
      stock: p.stock,
      image: p.image,
      delivery_type: p.deliveryType,
    };
    const res = await api.createProduct(payload);
    if (res?.product) {
      const newProduct = res.product;
      if (p.variations?.length) {
        await Promise.all(p.variations.map((v) => api.createVariation(newProduct.id, v)));
        const full = await api.getProduct(newProduct.id).catch(() => null);
        if (full?.product) setProducts((ps) => [hydrateProduct(full.product), ...ps]);
        else setProducts((ps) => [hydrateProduct(newProduct), ...ps]);
      } else {
        setProducts((ps) => [hydrateProduct(newProduct), ...ps]);
      }
    }
  }, [toCategoryId]);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    const payload: any = { ...patch };
    if (payload.category) { payload.category_id = toCategoryId(payload.category); delete payload.category; }
    api.updateProduct(id, payload).then((res) => {
      if (res?.product) {
        setProducts((ps) => ps.map((p) => p.id === id ? hydrateProduct(res.product) : p));
      }
    }).catch(() => {});
  }, [toCategoryId]);

  const deleteProduct = useCallback((id: string) => {
    api.deleteProduct(id).catch(() => {});
    setProducts((ps) => ps.filter((p) => p.id !== id));
  }, []);

  const approveSeller = useCallback((id: string, approved: boolean) => {
    api.approveSeller(id).catch(() => {});
    setUsers((us) => us.map((u) => u.id === id ? { ...u, approved: !u.approved } : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    api.deleteUser(id).catch(() => {});
    setUsers((us) => us.filter((u) => u.id !== id));
  }, []);

  const value = useMemo<AppState>(() => ({
    user, theme, cart, wishlist, products, orders, users, loading,
    signIn, signUp, signOut, toggleTheme,
    addToCart, removeFromCart, setCartQty, clearCart,
    toggleWishlist, checkout, addReview,
    addProduct, updateProduct, deleteProduct,
    approveSeller, deleteUser,
    findUser, findProduct,
  }), [user, theme, cart, wishlist, products, orders, users, loading,
      signIn, signUp, signOut, toggleTheme, addToCart, removeFromCart, setCartQty,
      clearCart, toggleWishlist, checkout, addReview, addProduct, updateProduct,
      deleteProduct, approveSeller, deleteUser, findUser, findProduct]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
