import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Provider from "@/redux/provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Setup } from "@/components/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ican project",
  description: "Connecting ",
};

export default async function RootLayout({ children, params }) {
  const { lang } = params;
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  const dictionaryLanding = dictionary.LandingPage

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Provider>
          <Setup />
          <Navbar dict={dictionaryLanding}/>
          <div>{children}</div>
          <Footer dict={dictionaryLanding}/>
        </Provider>
      </body>
    </html>
  );
}
