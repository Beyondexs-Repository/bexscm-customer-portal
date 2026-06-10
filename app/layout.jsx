import { cookies } from "next/headers"
import { NextIntlClientProvider } from "next-intl"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { defaultLocale, loadMessages, localeCookieName, locales } from "@/lib/i18n"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Crate Inc. Web App",
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
      className={`${poppins.variable} h-full antialiased`}
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
