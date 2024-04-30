import Navbar from "@/components/Navbar";
import Introduccion from "@/components/Introduccion";
import Servicios from "@/components/Servicios";

export default function Home() {
  return (
    <main className="">
      <Navbar /> 
      <Introduccion />
      <Servicios />
    </main>
  );
}
