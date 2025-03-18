import TopToaster from "@/components/Toaster";
import TopLoader from "@/components/TopLoader";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Polling App",
  description: "voted polling app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <TopLoader/>
        <TopToaster/>
        {children}
      </body>
    </html>
  );
}
 