import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { Slider } from "@/components/ui/slider";

const search = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(["popular", "newest", "price-asc", "price-desc", "rating"]).optional(),
});

export const Route = createFileRoute("/marketplace")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Marketplace — MailMarket" }, { name: "description", content: "Browse 12,000+ digital products across UI kits, code, fonts, audio and more." }] }),
  component: Marketplace,
});

function Marketplace() {
  const { q, category, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/marketplace" });
  const { products } = useApp();
  const [query, setQuery] = useState(q ?? "");
  const [cat, setCat] = useState<string>(category ?? "all");
  const [sortBy, setSortBy] = useState<string>(sort ?? "popular");
  const [price, setPrice] = useState<number[]>([0, 200]);

  useEffect(() => { setQuery(q ?? ""); }, [q]);
  useEffect(() => { setCat(category ?? "all"); }, [category]);

  const updateUrl = (next: { q?: string; category?: string; sort?: string }) => {
    navigate({
      search: {
        ...(next.q ? { q: next.q } : {}),
        ...(next.category && next.category !== "all" ? { category: next.category } : {}),
        ...(next.sort && next.sort !== "popular" ? { sort: next.sort } : {}),
      } as never,
      replace: true,
    });
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (query.trim()) {
      const t = query.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(t) || p.description.toLowerCase().includes(t));
    }
    list = list.filter((p) => p.price >= price[0] && p.price <= price[1]);
    switch (sortBy) {
      case "newest": list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.sales - a.sales);
    }
    return list;
  }, [products, cat, query, sortBy, price]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Marketplace</h1>
        <p className="mt-1 text-muted-foreground">Discover {products.length} curated digital products.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => { setQuery(e.target.value); updateUrl({ q: e.target.value, category: cat, sort: sortBy }); }} placeholder="Search…" className="pl-9" />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4" /> Categories</div>
            <div className="space-y-1">
              <button onClick={() => { setCat("all"); updateUrl({ q: query, category: "all", sort: sortBy }); }} className={`w-full rounded-md px-3 py-1.5 text-left text-sm ${cat === "all" ? "bg-primary/15 text-primary" : "hover:bg-accent"}`}>All categories</button>
              {CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => { setCat(c.slug); updateUrl({ q: query, category: c.slug, sort: sortBy }); }} className={`w-full rounded-md px-3 py-1.5 text-left text-sm ${cat === c.slug ? "bg-primary/15 text-primary" : "hover:bg-accent"}`}>{c.name}</button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="mb-3 text-sm font-semibold">Price range</div>
            <Slider value={price} min={0} max={200} step={5} onValueChange={setPrice} />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>${price[0]}</span><span>${price[1]}</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{filtered.length} results</Badge>
              {cat !== "all" && <Badge variant="outline">{CATEGORIES.find((c) => c.slug === cat)?.name}</Badge>}
              {query && <Badge variant="outline">“{query}”</Badge>}
            </div>
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); updateUrl({ q: query, category: cat, sort: v }); }}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}