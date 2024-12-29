import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Provider from "@/redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ican project",
  description: "Connecting ",
};

export default function RootLayout({ children,lang }) {
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
