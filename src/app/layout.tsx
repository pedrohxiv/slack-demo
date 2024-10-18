import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";

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
              {children}
              <Toaster />
              <Modals />
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
};

export default RootLayout;
