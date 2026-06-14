import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — MailMarket" }] }),
  component: Register,
});

function Register() {
  const { signUp } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("buyer");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    try {
      const u = await signUp(name, email, role);
      toast.success(role === "seller" ? "Seller account created — pending approval" : "Account created");
      nav({ to: role === "seller" ? "/seller-dashboard" : "/dashboard" });
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join MailMarket as a buyer or seller.</p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>I want to…</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as Role)} className="mt-2 grid grid-cols-2 gap-2">
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 p-3 text-sm ${role === "buyer" ? "border-primary bg-primary/10" : ""}`}>
                <RadioGroupItem value="buyer" /> Buy products
              </label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 p-3 text-sm ${role === "seller" ? "border-primary bg-primary/10" : ""}`}>
                <RadioGroupItem value="seller" /> Sell products
              </label>
            </RadioGroup>
          </div>
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" className="w-full shadow-glow">Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">Already have one? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}