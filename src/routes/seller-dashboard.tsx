import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, TrendingUp, Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORIES } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { useApp } from "@/lib/store";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/seller-dashboard")({ component: SellerDash, head: () => ({ meta: [{ title: "Seller Dashboard — MailMarket" }] }) });

function SellerDash() {
  const { user, products, addProduct, deleteProduct, updateProduct } = useApp();
  const [dashboard, setDashboard] = useState<any>(null);
  if (!user) return <div className="mx-auto max-w-xl p-16 text-center"><p>Please <Link to="/login" className="text-primary underline">sign in</Link>.</p></div>;

  useEffect(() => {
    api.getSellerDashboard().then((res) => setDashboard(res)).catch(() => {});
  }, []);

  const mine = products.filter((p) => p.sellerId === user.id);
  const sales = dashboard?.recent_sales ?? [];
  const revenue = dashboard?.stats?.revenue ?? 0;
  const chart = dashboard?.chart ?? Array.from({ length: 8 }).map((_, i) => ({
    week: `W${i + 1}`, revenue: 0, sales: 0,
  }));

  const avgRating = mine.length ? (mine.reduce((s, p) => s + p.rating, 0) / mine.length).toFixed(1) : "0.0";

  const stats = [
    { label: "Revenue", value: `$${Number(revenue).toFixed(2)}`, icon: DollarSign, color: "text-primary" },
    { label: "Sales", value: sales.length, icon: ShoppingBag },
    { label: "Products", value: mine.length, icon: Package },
    { label: "Avg rating", value: avgRating, icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Seller dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your products, sales and earnings.</p>
        </div>
        <ProductDialog onSave={(p) => { addProduct({ ...p, sellerId: user.id }); toast.success("Product created"); }} />
      </div>

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

      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Earnings (last 8 weeks)</h2>
            <p className="text-sm text-muted-foreground">Revenue and sales trend</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="gr" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 152)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 152)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
              <XAxis dataKey="week" stroke="oklch(0.7 0.02 250)" fontSize={12} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.02 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.78 0.18 152)" fill="url(#gr)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold">Your products</h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Sales</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {mine.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No products yet. Click "Add product" above.</TableCell></TableRow>}
              {mine.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-10 w-14 rounded object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">{p.deliveryType}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{CATEGORIES.find((c) => c.slug === p.category)?.name}</Badge></TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>{p.sales}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <ProductDialog product={p} onSave={(patch) => { updateProduct(p.id, patch); toast.success("Updated"); }} trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>} />
                      <Button size="icon" variant="ghost" onClick={() => { deleteProduct(p.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold">Recent sales</h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Product</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
            <TableBody>
              {sales.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No sales yet.</TableCell></TableRow>}
              {sales.map((o: any) => {
                const p = products.find((x) => x.id === String(o.product_id ?? o.productId));
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell>{p?.title ?? o.product_title}</TableCell>
                    <TableCell className="text-muted-foreground">{o.date}</TableCell>
                    <TableCell className="font-medium">${Number(o.amount ?? 0).toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function ProductDialog({ product, onSave, trigger }: { product?: Product; onSave: (p: Omit<Product, "id" | "rating" | "reviewsCount" | "sales" | "createdAt" | "sellerId">) => void; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    category: product?.category ?? CATEGORIES[0].slug,
    price: product?.price ?? 29,
    stock: product?.stock ?? 999,
    image: product?.image ?? "https://picsum.photos/seed/new-product/800/600",
    deliveryType: product?.deliveryType ?? "Instant Download",
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button className="shadow-glow"><Plus className="mr-2 h-4 w-4" /> Add product</Button>}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery</Label>
              <Select value={form.deliveryType} onValueChange={(v) => setForm({ ...form, deliveryType: v as Product["deliveryType"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instant Download">Instant Download</SelectItem>
                  <SelectItem value="Email Delivery">Email Delivery</SelectItem>
                  <SelectItem value="License Key">License Key</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
          </div>
          <div><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { onSave(form); setOpen(false); }}>{product ? "Save" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}