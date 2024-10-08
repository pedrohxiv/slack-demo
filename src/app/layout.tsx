import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";

import { ConvexClientProvider } from "@/components/providers/convex";
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
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
};

export default RootLayout;
