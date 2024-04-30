import Navbar from "@/components/Navbar";
import Introduccion from "@/components/Introduccion";
import Servicios from "@/components/Servicios";
import Nosotros from "@/components/Nosotros";

export default function Home() {
  return (
    <main className="">
      <Navbar /> 
      <Introduccion />
      <Servicios />
      <Nosotros />
    </main>
  );
}
