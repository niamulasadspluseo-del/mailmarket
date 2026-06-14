import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: Checkout, head: () => ({ meta: [{ title: "Checkout — MailMarket" }] }) });

function Checkout() {
  const { cart, products, checkout, user } = useApp();
  const nav = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => { if (!user) nav({ to: "/login" }); }, [user, nav]);

  const items = cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal * 1.05;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    checkout();
    setDone(true);
    toast.success("Payment confirmed!");
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 font-display text-3xl font-bold">Order complete</h1>
        <p className="mt-2 text-muted-foreground">Your downloads are ready in your dashboard.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link to="/orders">View orders</Link></Button>
          <Button asChild variant="outline"><Link to="/marketplace">Keep browsing</Link></Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) return <div className="mx-auto max-w-xl p-16 text-center"><p>Your cart is empty.</p></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="space-y-6 rounded-xl border border-border/60 bg-card p-6">
          <div>
            <h2 className="mb-3 font-display font-semibold">Contact</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Full name</Label><Input defaultValue={user?.name} required /></div>
              <div><Label>Email</Label><Input type="email" defaultValue={user?.email} required /></div>
            </div>
          </div>
          <div>
            <h2 className="mb-3 font-display font-semibold">Payment</h2>
            <div className="grid gap-3">
              <div><Label>Card number</Label><Input placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Exp</Label><Input placeholder="12/28" defaultValue="12/28" /></div>
                <div><Label>CVC</Label><Input placeholder="123" defaultValue="123" /></div>
                <div><Label>ZIP</Label><Input placeholder="10001" defaultValue="10001" /></div>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Demo only — no real charges.</p>
          </div>
          <Button type="submit" size="lg" className="w-full shadow-glow">Pay ${total.toFixed(2)}</Button>
        </form>

        <aside className="h-fit rounded-xl border border-border/60 bg-card p-5">
          <h2 className="font-display text-lg font-bold">Order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.product.id} className="flex justify-between text-sm">
                <span className="truncate pr-2">{i.product.title} × {i.qty}</span>
                <span>${(i.product.price * i.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border/60 pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fees</span><span>${(total - subtotal).toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between font-display text-base font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}