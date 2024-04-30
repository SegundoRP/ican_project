import Navbar from "@/components/Navbar";
import Introduccion from "@/components/Introduccion";
import Servicios from "@/components/Servicios";
import Nosotros from "@/components/Nosotros";
import Experiencia from "@/components/Experiencia";
import Testimonios from "@/components/Testimonios";


export default function Home() {
  return (
    <main className="">
      <Navbar /> 
      <Introduccion />
      <Servicios />
      <Nosotros />
      <Experiencia />
      <Testimonios />

    </main>
  );
}
