import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: Contact, head: () => ({ meta: [{ title: "Contact — MailMarket" }] }) });

function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold">Get in touch</h1>
        <p className="mt-2 text-muted-foreground">Questions, feedback, or partnership ideas? We'd love to hear from you.</p>
      </header>
      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", body: "support@mailmarket.dev" },
            { icon: MessageSquare, title: "Live chat", body: "Mon–Fri, 9–18 UTC" },
            { icon: MapPin, title: "HQ", body: "Remote-first · Worldwide" },
          ].map((c) => (
            <div key={c.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><c.icon className="h-4 w-4" /></div>
              <div><div className="font-medium">{c.title}</div><div className="text-sm text-muted-foreground">{c.body}</div></div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent (demo)"); }} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name</Label><Input required /></div>
            <div><Label>Email</Label><Input type="email" required /></div>
          </div>
          <div><Label>Subject</Label><Input required /></div>
          <div><Label>Message</Label><Textarea rows={5} required /></div>
          <Button type="submit" className="w-full shadow-glow">Send message</Button>
        </form>
      </div>
    </div>
  );
}