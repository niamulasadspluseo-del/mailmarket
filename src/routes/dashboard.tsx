import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Heart, ShoppingBag, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({ component: BuyerDash, head: () => ({ meta: [{ title: "Dashboard — MailMarket" }] }) });

function BuyerDash() {
  const { user, orders, products, wishlist } = useApp();
  if (!user) return <div className="mx-auto max-w-xl p-16 text-center"><p>Please <Link to="/login" className="text-primary underline">sign in</Link>.</p></div>;
  const mine = orders.filter((o) => o.buyerId === user.id);
  const spent = mine.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0);

  const stats = [
    { label: "Total orders", value: mine.length, icon: ShoppingBag },
    { label: "Total spent", value: `$${spent.toFixed(2)}`, icon: Download },
    { label: "Wishlist", value: wishlist.length, icon: Heart },
    { label: "Reviews", value: mine.filter((o) => o.status === "completed").length, icon: Star },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Hi, {user.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's an overview of your activity.</p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold">Recent orders</h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          {mine.length === 0 && <div className="p-10 text-center text-muted-foreground">No orders yet. <Link to="/marketplace" className="text-primary underline">Browse</Link></div>}
          {mine.slice(0, 5).map((o) => {
            const p = products.find((x) => x.id === o.productId);
            return (
              <div key={o.id} className="flex items-center gap-4 border-b border-border/40 p-4 last:border-0">
                {p && <img src={p.image} alt="" className="h-12 w-16 rounded object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{p?.title}</div>
                  <div className="text-xs text-muted-foreground">{o.date}</div>
                </div>
                <Badge variant={o.status === "completed" ? "default" : "secondary"} className="capitalize">{o.status}</Badge>
                <div className="w-20 text-right font-medium">${o.amount.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}