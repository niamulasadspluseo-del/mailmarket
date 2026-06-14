import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/orders")({ component: Orders, head: () => ({ meta: [{ title: "Orders — MailMarket" }] }) });

function Orders() {
  const { user, orders, products } = useApp();
  if (!user) return <div className="mx-auto max-w-xl p-16 text-center"><p>Please <Link to="/login" className="text-primary underline">sign in</Link> to view orders.</p></div>;
  const mine = orders.filter((o) => o.buyerId === user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Your orders</h1>
      <p className="mt-1 text-muted-foreground">{mine.length} order{mine.length === 1 ? "" : "s"}</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Product</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead /></TableRow>
          </TableHeader>
          <TableBody>
            {mine.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No orders yet.</TableCell></TableRow>}
            {mine.map((o) => {
              const p = products.find((x) => x.id === o.productId);
              return (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p && <img src={p.image} alt="" className="h-10 w-14 rounded object-cover" />}
                      <Link to="/product/$id" params={{ id: o.productId }} className="font-medium hover:text-primary">{p?.title ?? o.productId}</Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="font-medium">${o.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={o.status === "completed" ? "default" : o.status === "pending" ? "secondary" : "destructive"} className="capitalize">{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {o.status === "completed" && <Button size="sm" variant="outline"><Download className="mr-1 h-3 w-3" /> Download</Button>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}