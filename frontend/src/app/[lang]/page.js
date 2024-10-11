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
  const dictionaryLanding = dictionary.LandingPage
  
  return (
    <main className="">
      <Navbar dict={dictionaryLanding}/> 
      <Introduccion dict={dictionaryLanding}/>
      <Servicios dict={dictionaryLanding}/>
      <Nosotros dict={dictionaryLanding}/>
      <Experiencia />
      <Testimonios />
      <Footer />
    </main>
  );
}
