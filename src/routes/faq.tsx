import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({ component: FAQ, head: () => ({ meta: [{ title: "FAQ — MailMarket" }] }) });

const QA = [
  { q: "Is MailMarket a real marketplace?", a: "No — this is a demo project built for testing and demonstration purposes only." },
  { q: "How do I become a seller?", a: "Click 'Get started', choose 'Sell products' on signup, and you'll land on your seller dashboard." },
  { q: "What can I sell?", a: "Any digital good: UI kits, templates, fonts, code, e-books, audio, stock photos, icons, and more." },
  { q: "How do downloads work?", a: "After checkout, downloads appear in your Orders page. In this demo, the download button is a placeholder." },
  { q: "What's your refund policy?", a: "Every purchase is covered by a 14-day money-back guarantee." },
  { q: "Do you take a platform fee?", a: "Yes — MailMarket charges a 5% fee on each transaction." },
  { q: "Can I use products commercially?", a: "Yes, every listing includes a commercial license by default." },
  { q: "Is my data secure?", a: "This demo stores data only in your browser's localStorage. Nothing leaves your device." },
];

function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold">Frequently asked questions</h1>
        <p className="mt-2 text-muted-foreground">Everything you need to know about MailMarket.</p>
      </header>
      <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-border/60 bg-card p-2">
        {QA.map((item, i) => (
          <AccordionItem key={i} value={`i${i}`} className="border-border/40">
            <AccordionTrigger className="px-4 text-left font-medium hover:no-underline">{item.q}</AccordionTrigger>
            <AccordionContent className="px-4 text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}