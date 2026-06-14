import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Code2, Image, Layout, Music, Palette, Sparkles, Type, TrendingUp, Zap, Shield, Download } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, STATS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MailMarket — Premium Digital Marketplace" },
      { name: "description", content: "Discover, buy, and sell premium digital products — UI kits, code, fonts, audio, e-books and more." },
      { property: "og:title", content: "MailMarket — Premium Digital Marketplace" },
      { property: "og:description", content: "The modern marketplace for digital creators and makers." },
    ],
  }),
  component: Index,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout, Palette, BookOpen, Type, Sparkles, Music, Image, Code2,
};

function Index() {
  const { products } = useApp();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const trending = products.filter((p) => p.trending).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="mr-1.5 h-3 w-3" /> 12,000+ digital products
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
              The marketplace for <span className="text-gradient">premium digital products</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Buy and sell beautifully crafted UI kits, templates, code, fonts, audio and more — from independent creators worldwide.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/marketplace">Explore marketplace <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Start selling</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: "Products", value: STATS.products.toLocaleString() },
                { label: "Sellers", value: STATS.sellers.toLocaleString() },
                { label: "Buyers", value: `${(STATS.buyers / 1000).toFixed(0)}k` },
                { label: "Countries", value: STATS.countries },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold sm:text-3xl">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Browse categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find exactly what you need across 8 categories.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon] ?? Sparkles;
            return (
              <Link key={c.slug} to="/marketplace" search={{ category: c.slug } as never} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition hover:border-primary/40 hover:shadow-elevated">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Hand-picked by our editorial team.</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/marketplace">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/30 text-primary"><TrendingUp className="mr-1 h-3 w-3" /> Hot this week</Badge>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Trending now</h2>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/marketplace">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Zap, title: "Instant delivery", body: "Get your purchase the moment payment clears — no waiting, no shipping." },
            { icon: Shield, title: "Buyer protection", body: "Every sale is covered by our 14-day money-back guarantee." },
            { icon: Download, title: "Unlimited access", body: "Download your purchases anytime, anywhere, from your dashboard." },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border border-border/60 bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><v.icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card-gradient p-10 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.2),transparent_60%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold">Start selling on MailMarket</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Join 1,800+ independent creators reaching 96k+ buyers around the world.</p>
            <Button asChild size="lg" className="mt-6 shadow-glow"><Link to="/register">Become a seller</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
