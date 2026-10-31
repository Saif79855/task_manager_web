import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import StoreProvider from "@/providers/StoreProvider";

export const metadata = {
  metadataBase: new URL("https://task-manager-web-smoky-zeta.vercel.app"),

  title: {
    default: "TaskFlow | Smart Task Manager",
    template: "%s | TaskFlow",
  },

  description:
    "TaskFlow helps you organize tasks, track progress, and manage your daily productivity with ease.",

  applicationName: "TaskFlow",

  keywords: [
    "Task Manager",
    "Task Management",
    "Productivity",
    "Todo App",
    "Task Tracking",
    "TaskFlow",
  ],

  authors: [{ name: "TaskFlow" }],

  verification: {
    google: "3XLrEfQI9v-KmjBgk6F4tK-x6gxvX1dcpm_OjNbaOjU",
  },

  openGraph: {
    title: "TaskFlow | Smart Task Manager",
    description:
      "Organize your work, manage tasks, and stay productive with TaskFlow.",
    siteName: "TaskFlow",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "TaskFlow | Smart Task Manager",
    description:
      "Organize your work, manage tasks, and stay productive with TaskFlow.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}

            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
            />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
