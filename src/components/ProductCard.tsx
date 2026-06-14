import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useApp();
  const seller = product.seller_name ? { name: product.seller_name, avatar: product.seller_avatar, id: product.sellerId } as any : null;
  const wished = wishlist.includes(product.id);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {product.trending && (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">Trending</Badge>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background"
        aria-label="Toggle wishlist"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
      </button>
      <div className="space-y-2 p-4">
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-1 font-semibold hover:text-primary">{product.title}</Link>
        {seller && (
          <Link to="/seller/$id" params={{ id: seller.id }} className="text-xs text-muted-foreground hover:text-foreground">
            by {seller.name}
          </Link>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span>({product.reviewsCount})</span>
          </div>
          <div className="font-display text-lg font-bold">${product.price}</div>
        </div>
      </div>
    </div>
  );
}