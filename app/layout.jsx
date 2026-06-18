import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { Noto_Sans_Tamil, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { defaultLocale, loadMessages, localeCookieName, locales } from "@/lib/i18n"

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
  const cookieStore = await cookies()
  const storedLocale = cookieStore.get(localeCookieName)?.value
  const locale = locales.includes(storedLocale) ? storedLocale : defaultLocale
  const messages = await loadMessages(locale)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${poppins.variable} ${notoSansTamil.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
		<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
