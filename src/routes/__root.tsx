import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BankProvider } from "@/lib/bank-store";
import { Toaster } from "@/components/ui/sonner";

const siteUrl = "https://www-apex-digital-banking-com.vercel.app";
const brandLogoUrl = `${siteUrl}/apex-logo.svg`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Apex Digital Bank — Online & Mobile Banking" },
      {
        name: "description",
        content:
          "Bank with Apex Digital Bank: checking, high-yield savings, transfers, mobile deposit and card controls.",
      },
      { name: "author", content: "Apex Digital Bank" },
      { property: "og:title", content: "Apex Digital Bank — Online & Mobile Banking" },
      {
        property: "og:description",
        content: "Premium digital banking: balances, transfers, deposits and card controls.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:site_name", content: "Apex Digital Bank" },
      { property: "og:image", content: brandLogoUrl },
      { property: "og:image:alt", content: "Apex Digital Bank logo" },
      { property: "og:image:type", content: "image/svg+xml" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Apex Digital Bank — Online & Mobile Banking" },
      { name: "twitter:description", content: "Premium digital banking from Apex Digital Bank." },
      { name: "twitter:image", content: brandLogoUrl },
      { name: "twitter:image:alt", content: "Apex Digital Bank logo" },
      { name: "theme-color", content: "#101f3f" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/apex-logo.svg", type: "image/svg+xml" },
      { rel: "shortcut icon", href: "/apex-logo.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apex-logo.svg" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "canonical", href: siteUrl },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BankProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster position="top-center" richColors />
      </BankProvider>
    </QueryClientProvider>
  );
}
