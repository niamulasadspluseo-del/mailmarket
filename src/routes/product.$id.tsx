import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Download, Heart, Share2, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import type { Review } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  notFoundComponent: () => <div className="mx-auto max-w-3xl p-16 text-center"><h1 className="text-2xl font-bold">Product not found</h1></div>,
  errorComponent: () => <div className="mx-auto max-w-3xl p-16 text-center">Something went wrong.</div>,
});

function Stars({ value }: { value: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const { products, addToCart, toggleWishlist, wishlist, user, addReview } = useApp();
  const product = products.find((p) => p.id === id);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.getProductReviews(id).then((res) => {
      const items = (res.reviews ?? []).map((r: any) => ({
        id: String(r.id),
        userId: String(r.userId ?? r.user_id),
        user_name: r.user_name,
        user_avatar: r.user_avatar,
        productId: String(r.productId ?? r.product_id),
        rating: r.rating,
        comment: r.comment,
        date: r.date ?? r.created_at?.slice(0, 10) ?? "",
      }));
      setLocalReviews(items);
    }).catch(() => {});
  }, [id]);

  if (!product) throw notFound();
  const cat = CATEGORIES.find((c) => c.slug === product.category);
  const productReviews = localReviews;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const wished = wishlist.includes(product.id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/marketplace" className="hover:text-foreground">Marketplace</Link> / <span className="text-foreground">{cat?.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">{cat?.name}</Badge>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5"><Stars value={product.rating} /> <span className="font-medium">{product.rating.toFixed(1)}</span><span className="text-muted-foreground">({product.reviewsCount} reviews)</span></div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{product.sales.toLocaleString()} sales</span>
            </div>
          </div>

          {seller && (
            <Link to="/seller/$id" params={{ id: seller.id }} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition hover:border-primary/40">
              <Avatar className="h-10 w-10"><AvatarImage src={seller.avatar} /><AvatarFallback>{seller.name.slice(0, 2)}</AvatarFallback></Avatar>
              <div className="min-w-0">
                <div className="truncate font-medium">{seller.name}</div>
                <div className="text-xs text-muted-foreground">View seller profile</div>
              </div>
            </Link>
          )}

          <p className="text-muted-foreground">{product.description}</p>

          <div className="rounded-xl border border-border/60 bg-card-gradient p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Price</div>
                <div className="font-display text-4xl font-bold">${product.price}</div>
              </div>
              <Badge variant="secondary"><Download className="mr-1 h-3 w-3" />{product.deliveryType}</Badge>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="flex-1 shadow-glow" onClick={() => { addToCart(product.id); toast.success("Added to cart"); }}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)}>
                <Heart className={`mr-2 h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} /> Wishlist
              </Button>
              <Button size="lg" variant="ghost" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Lifetime updates included</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Commercial license</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 14-day money-back guarantee</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="mt-6 space-y-6">
            {user && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="mb-3 font-medium">Leave a review</div>
                <div className="mb-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} onClick={() => setRating(i)} aria-label={`Rate ${i}`}>
                      <Star className={`h-6 w-6 ${i <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you think?" rows={3} />
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => { if (!comment.trim()) return; addReview(product.id, rating, comment.trim()); const optimistic: Review = { id: `r${Date.now()}`, userId: user?.id ?? "", user_name: user?.name, user_avatar: user?.avatar, productId: product.id, rating, comment: comment.trim(), date: new Date().toISOString().slice(0, 10) }; setLocalReviews((rs) => [optimistic, ...rs]); setComment(""); toast.success("Review posted"); }}>Post review</Button>
                </div>
              </div>
            )}
            {productReviews.length === 0 && <div className="text-muted-foreground">No reviews yet.</div>}
            {productReviews.map((r) => {
              return (
                <div key={r.id} className="rounded-xl border border-border/60 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={r.user_avatar} /><AvatarFallback>{(r.user_name ?? "U").slice(0, 2)}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium">{r.user_name ?? "User"}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
                </div>
              );
            })}
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="grid gap-4 rounded-xl border border-border/60 bg-card p-5 sm:grid-cols-2">
              <Row label="Category" value={cat?.name ?? product.category} />
              <Row label="Delivery" value={product.deliveryType} />
              <Row label="Stock" value={String(product.stock)} />
              <Row label="Sales" value={product.sales.toLocaleString()} />
              <Row label="Rating" value={`${product.rating.toFixed(1)} / 5`} />
              <Row label="Released" value={product.createdAt} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">You might also like</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 pb-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}