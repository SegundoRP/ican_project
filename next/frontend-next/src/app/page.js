import Experiencia from "@/components/Experiencia";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import Nosotros from "@/components/Nosotros";
import Servicios from "@/components/Servicios";
import Testimonios from "@/components/Testimonios";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Intro />
      <Servicios />
      <Nosotros />
      <Experiencia />
      <Testimonios />
      <Footer />
    </main>
  );
}