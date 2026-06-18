import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({ component: Cart, head: () => ({ meta: [{ title: "Cart — MailMarket" }] }) });

function Cart() {
  const { cart, products, removeFromCart, setCartQty, checkout, user } = useApp();
  const nav = useNavigate();
  const items = cart.map((i) => ({
    ...i,
    product: products.find((p) => p.id === i.productId)!,
    variation: i.variationId ? products.flatMap((p) => p.variations ?? []).find((v) => v.id === i.variationId) : null,
  })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + (i.variation?.price ?? i.product.price) * i.qty, 0);
  const fee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + fee;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Your cart</h1>
      <p className="mt-1 text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border/60 p-16 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6"><Link to="/marketplace">Browse marketplace</Link></Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map(({ product, qty, variation, variationId }) => {
              const unitPrice = variation?.price ?? product.price;
              const key = variationId ? `${product.id}-${variationId}` : product.id;
              return (
              <div key={key} className="flex gap-4 rounded-xl border border-border/60 bg-card p-4">
                <img src={product.image} alt={product.title} className="h-24 w-32 shrink-0 rounded-lg object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to="/product/$id" params={{ id: product.id }} className="truncate font-medium hover:text-primary">{product.title}</Link>
                  <div className="text-xs text-muted-foreground">{product.deliveryType}</div>
                  {variation && <div className="mt-0.5 text-xs font-medium text-primary">{variation.name}</div>}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-md border border-border/60">
                      <button onClick={() => setCartQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-accent"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button onClick={() => setCartQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-accent"><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-display font-bold">${(unitPrice * qty).toFixed(2)}</div>
                      <button onClick={() => removeFromCart(key)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-xl border border-border/60 bg-card p-5">
            <h2 className="font-display text-lg font-bold">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee (5%)</dt><dd>${fee.toFixed(2)}</dd></div>
              <div className="flex justify-between border-t border-border/60 pt-2 font-display text-base font-bold"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
            </dl>
            <Button className="mt-5 w-full shadow-glow" onClick={() => { if (!user) { toast.error("Please sign in"); nav({ to: "/login" }); return; } nav({ to: "/checkout" }); }}>
              Checkout
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}