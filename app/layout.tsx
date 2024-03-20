import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import ReactQueryProvider from "./home/reactQueryClientProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getSessionFn, getUserInfo } from "@/routes/user-routes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyDB",
  description: "The no nonsense database access tool",
  icons: {
    icon: [
      {
        url: "/database-zap-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/database-zap-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  verification: { google: "11fvDahTCcb6CXTP5sJpERfxESJ7yS4NxEe2DePY1ME" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user/session"],
    queryFn: () => getSessionFn(),
  });
  const session = await getServerSession();
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider session={session}>
              <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
              </HydrationBoundary>
            </SessionProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
