import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">M</div>
            <span className="font-display text-lg font-bold">MailMarket</span>
          </div>
          <p className="text-sm text-muted-foreground">A modern marketplace for digital products. Demo build for testing purposes only.</p>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Marketplace</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/marketplace" className="hover:text-foreground">Browse all</Link></li>
            <li><Link to="/marketplace" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/marketplace" className="hover:text-foreground">Trending</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Become a seller</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Account</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/orders" className="hover:text-foreground">Orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} MailMarket — demo project.</p>
          <p>Built with React, TanStack & Tailwind.</p>
        </div>
      </div>
    </footer>
  );
}