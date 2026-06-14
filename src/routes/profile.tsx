import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({ component: Profile, head: () => ({ meta: [{ title: "Profile — MailMarket" }] }) });

function Profile() {
  const { user } = useApp();
  if (!user) return <div className="mx-auto max-w-xl p-16 text-center"><p>Please <Link to="/login" className="text-primary underline">sign in</Link>.</p></div>;
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Profile</h1>
      <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.slice(0,2)}</AvatarFallback></Avatar>
          <div>
            <div className="flex items-center gap-2"><h2 className="font-display text-xl font-bold">{user.name}</h2><Badge variant="outline" className="capitalize">{user.role}</Badge></div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved (demo)"); }} className="mt-6 space-y-4">
          <div><Label>Display name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
          <Button type="submit">Save changes</Button>
        </form>
      </div>
    </div>
  );
}