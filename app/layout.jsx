import { NextIntlClientProvider } from "next-intl"
import { Noto_Sans_Tamil, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { defaultLocale, loadMessages } from "@/lib/i18n"
import { AppProvider } from "@/app/context/app-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-tamil",
});

export const metadata = {
  title: "Crate Inc.",
  description: "Crate Inc. - Fresh Produce Delivered to Your Doorstep",
};

export default async function RootLayout({children}) {
  const messages = await loadMessages(defaultLocale)

  return (
    <html
      lang={defaultLocale}
      suppressHydrationWarning
      className={`${poppins.variable} ${notoSansTamil.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="top-center" />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
