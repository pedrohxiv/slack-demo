import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Modals } from "@/components/modals";
import { ConvexClientProvider } from "@/components/providers/convex";
import { JotaiProvider } from "@/components/providers/jotai";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Slack",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <ConvexAuthNextjsServerProvider>
      <html>
        <body>
          <ConvexClientProvider>
            <JotaiProvider>
              <NuqsAdapter>
                {children}
                <Toaster />
                <Modals />
              </NuqsAdapter>
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
};

export default RootLayout;
