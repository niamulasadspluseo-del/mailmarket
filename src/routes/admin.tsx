import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DollarSign, Package, Star, Trash2, Users, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/store";
import { api } from "@/lib/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { CATEGORIES } from "@/lib/mock-data";
import type { Review } from "@/lib/types";
import { toast } from "sonner";

function hydrateReview(r: any): Review {
  return {
    id: String(r.id),
    userId: String(r.userId ?? r.user_id),
    user_name: r.user_name,
    user_avatar: r.user_avatar,
    productId: String(r.productId ?? r.product_id),
    rating: r.rating,
    comment: r.comment,
    date: r.date ?? r.created_at?.slice(0, 10) ?? "",
  };
}

export const Route = createFileRoute("/admin")({ component: Admin, head: () => ({ meta: [{ title: "Admin — MailMarket" }] }) });

const COLORS = ["oklch(0.78 0.18 152)", "oklch(0.7 0.18 220)", "oklch(0.75 0.18 50)", "oklch(0.7 0.2 320)", "oklch(0.8 0.17 90)", "oklch(0.65 0.2 200)", "oklch(0.7 0.2 10)", "oklch(0.75 0.18 280)"];

function Admin() {
  const { user, users, products, orders, approveSeller, deleteUser, deleteProduct, findUser } = useApp();
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.getAdminReviews().then((res) => {
      setAdminReviews((res.reviews ?? []).map(hydrateReview));
    }).catch(() => {});
  }, []);
  if (!user) return <div className="mx-auto max-w-xl p-16 text-center"><p>Please <Link to="/login" className="text-primary underline">sign in</Link>.</p></div>;
  if (user.role !== "admin") return <div className="mx-auto max-w-xl p-16 text-center"><p>Admins only. Try the <code>admin@mailmarket.dev</code> demo account.</p></div>;

  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0);
  const sellers = users.filter((u) => u.role === "seller");
  const buyers = users.filter((u) => u.role === "buyer");
  const pendingSellers = sellers.filter((s) => !s.approved);

  const monthly = Array.from({ length: 6 }).map((_, i) => ({
    month: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][i],
    revenue: Math.round(8000 + Math.random() * 6000 + i * 1500),
  }));

  const catData = CATEGORIES.map((c) => ({ name: c.name, value: products.filter((p) => p.category === c.slug).length })).filter((c) => c.value > 0);

  const stats = [
    { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign },
    { label: "Users", value: users.length, icon: Users },
    { label: "Products", value: products.length, icon: Package },
    { label: "Reviews", value: adminReviews.length, icon: Star },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <Badge variant="outline" className="border-primary/30 text-primary">Admin</Badge>
        <h1 className="mt-2 font-display text-3xl font-bold">Marketplace overview</h1>
        <p className="mt-1 text-muted-foreground">Monitor platform health, sellers, products, and revenue.</p>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Revenue (6 months)</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.02 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="oklch(0.78 0.18 152)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Products by category</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.2 0.02 250)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="sellers" className="mt-10">
        <TabsList>
          <TabsTrigger value="sellers">Sellers {pendingSellers.length > 0 && <Badge variant="destructive" className="ml-2">{pendingSellers.length}</Badge>}</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="sellers" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Seller</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead>Products</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {sellers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.slice(0,2)}</AvatarFallback></Avatar>
                        <div><div className="font-medium">{s.name}</div><div className="text-xs text-muted-foreground">{s.email}</div></div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.joined}</TableCell>
                    <TableCell><Badge variant={s.approved ? "default" : "secondary"}>{s.approved ? "Approved" : "Pending"}</Badge></TableCell>
                    <TableCell>{products.filter((p) => p.sellerId === s.id).length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!s.approved ? (
                          <Button size="sm" onClick={() => { approveSeller(s.id, true); toast.success("Approved"); }}><Check className="mr-1 h-3 w-3" /> Approve</Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => { approveSeller(s.id, false); toast.message("Revoked"); }}><X className="mr-1 h-3 w-3" /> Revoke</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {buyers.concat(sellers).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name.slice(0,2)}</AvatarFallback></Avatar>
                        <div><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize"><Badge variant="outline">{u.role}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => { deleteUser(u.id); toast.success("User removed"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Seller</TableHead><TableHead>Price</TableHead><TableHead>Sales</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {products.map((p) => {
                  const s = findUser(p.sellerId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-9 w-12 rounded object-cover" /><span className="font-medium">{p.title}</span></div></TableCell>
                      <TableCell>{s?.name}</TableCell>
                      <TableCell>${p.price}</TableCell>
                      <TableCell>{p.sales}</TableCell>
                      <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => { deleteProduct(p.id); toast.success("Removed"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-3">
            {adminReviews.map((r) => {
              const u = findUser(r.userId);
              const p = products.find((x) => x.id === r.productId);
              return (
                <div key={r.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
                  <Avatar className="h-9 w-9"><AvatarImage src={r.user_avatar ?? u?.avatar} /><AvatarFallback>{(r.user_name ?? u?.name ?? "U").slice(0,2)}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm"><span className="font-medium">{r.user_name ?? u?.name}</span><span className="text-muted-foreground">on</span><span className="font-medium">{p?.title}</span><Badge variant="outline">★ {r.rating}</Badge></div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => { api.deleteReview(r.id).then(() => setAdminReviews((rs) => rs.filter((x) => x.id !== r.id))).catch(() => {}); toast.success("Review removed"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}