import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/lib/store";
import { api } from "@/lib/api";

export const Route = createFileRoute("/seller/$id")({
  component: SellerPage,
  notFoundComponent: () => <div className="p-16 text-center">Seller not found</div>,
  errorComponent: () => <div className="p-16 text-center">Error</div>,
});

function SellerPage() {
  const { id } = Route.useParams();
  const { products } = useApp();
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSeller(id).then((res) => {
      setSeller(res.seller ?? res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mx-auto max-w-xl p-16 text-center text-muted-foreground">Loading...</div>;
  if (!seller) throw notFound();

  const list = products.filter((p) => p.sellerId === id);
  const totalSales = list.reduce((s, p) => s + p.sales, 0);
  const avgRating = list.length ? list.reduce((s, p) => s + p.rating, 0) / list.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-border/60 bg-card-gradient p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 ring-2 ring-primary/30"><AvatarImage src={seller.avatar} /><AvatarFallback>{(seller.name ?? "").slice(0,2)}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold">{seller.name}</h1>
              {seller.approved && <Badge>Verified</Badge>}
            </div>
            <p className="mt-1 max-w-2xl text-muted-foreground">{seller.bio}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {seller.joined}</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-primary text-primary" /> {avgRating.toFixed(1)} avg rating</span>
              <span>{totalSales.toLocaleString()} total sales</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-6 font-display text-xl font-bold">{list.length} products from {seller.name}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
