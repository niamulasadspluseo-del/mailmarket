import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — MailMarket" }] }),
  component: Login,
});

function Login() {
  const { signIn, users } = useApp();
  const onlineCount = users.length || 2;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false);

  const doSignIn = async (email: string) => {
    const u = await signIn(email);
    if (u) {
      toast.success(`Welcome back, ${u.name}`);
      navigate({ to: u.role === "admin" ? "/admin" : u.role === "seller" ? "/seller-dashboard" : "/dashboard" });
    } else {
      toast.error("Sign in failed");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    doSignIn(email);
  };

  const quick = (email: string) => doSignIn(email);

  if (forgot) {
    return (
      <AuthShell title="Reset password" sub="Enter your email and we'll send a (demo) reset link.">
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent (demo)"); setForgot(false); }} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button className="w-full" type="submit">Send reset link</Button>
          <button type="button" onClick={() => setForgot(false)} className="block w-full text-center text-sm text-muted-foreground hover:text-foreground">Back to sign in</button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Welcome back" sub="Sign in to access your MailMarket account.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" onClick={() => setForgot(true)} className="text-xs text-primary hover:underline">Forgot?</button>
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full shadow-glow">Sign in</Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" /> Demo accounts <div className="h-px flex-1 bg-border" /></div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" onClick={() => quick("sarah@mailmarket.dev")}>Buyer</Button>
        <Button variant="outline" size="sm" onClick={() => quick("pixel@mailmarket.dev")}>Seller</Button>
        <Button variant="outline" size="sm" onClick={() => quick("admin@mailmarket.dev")}>Admin</Button>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link to="/register" className="text-primary hover:underline">Create an account</Link></p>
      <p className="mt-2 text-center text-xs text-muted-foreground">{users.length} accounts in this demo workspace</p>
    </AuthShell>
  );
}

function AuthShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-6">{children}</div>
    </div>
  );
}