import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({ component: Wishlist, head: () => ({ meta: [{ title: "Wishlist — MailMarket" }] }) });

function Wishlist() {
  const { wishlist, products } = useApp();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Wishlist</h1>
      <p className="mt-1 text-muted-foreground">{items.length} saved item{items.length === 1 ? "" : "s"}</p>
      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border/60 p-16 text-center">
          <p className="text-muted-foreground">No saved items yet.</p>
          <Button asChild className="mt-6"><Link to="/marketplace">Browse products</Link></Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}