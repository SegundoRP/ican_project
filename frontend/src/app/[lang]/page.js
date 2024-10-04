import Navbar from "@/components/Navbar";
import Introduccion from "@/components/Introduccion";
import Servicios from "@/components/Servicios";
import Nosotros from "@/components/Nosotros";
import Experiencia from "@/components/Experiencia";
import Testimonios from "@/components/Testimonios";
import Footer from "@/components/Footer";



export default async function Home({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  
  return (
    <main className="">
      <Navbar dict={dictionary}/> 
      <Introduccion />
      <Servicios />
      <Nosotros />
      <Experiencia />
      <Testimonios />
      <Footer />
    </main>
  );
}
