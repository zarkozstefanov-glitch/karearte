import "./globals.css";
import { Playfair_Display, Manrope, Caveat, Permanent_Marker } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import { Preloader, preloaderScript } from "@/components/Preloader";
export { viewport } from "@/lib/meta";

const display = Playfair_Display({ subsets: ["latin", "cyrillic"], style: ["normal", "italic"], weight: ["500", "600", "700"], variable: "--f-display", display: "swap" });
const body = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--f-body", display: "swap" });
const hand = Caveat({ subsets: ["latin", "cyrillic"], weight: ["500", "700"], variable: "--f-hand", display: "swap" });
const brush = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--f-brush", display: "swap" });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${display.variable} ${body.variable} ${hand.variable} ${brush.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0E1430" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + preloaderScript }} />
      </head>
      <body>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
