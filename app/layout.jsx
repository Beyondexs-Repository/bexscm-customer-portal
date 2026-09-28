import { Noto_Sans_Tamil, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { defaultLocale } from "@/lib/i18n"
import { AppProvider } from "@/app/context/app-context"
import { StaticIntlProvider } from "@/components/static-intl-provider"
import { StoreProvider } from "@/redux/StoreProvider"
// import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget"

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
  title: "Bex SCM",
  description: "Bex SCM - Fresh Produce Delivered to Your Doorstep",
};

export default function RootLayout({children}) {
  return (
    <html
      lang={defaultLocale}
      suppressHydrationWarning
      className={`${poppins.variable} ${notoSansTamil.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StoreProvider>
          <StaticIntlProvider>
            <AppProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                {/* <ChatbotWidget /> */}
                <Toaster richColors position="top-center" />
              </ThemeProvider>
            </AppProvider>
          </StaticIntlProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
