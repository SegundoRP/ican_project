import Bienvenido from "@/components/dashboard/Bienvenido";
import Cards from "@/components/dashboard/cards/Cards";


export default function pageDashboard() {
  return (
    <main className="p-4 bg-slate-300">
      <Bienvenido/>
      <Cards/>
    </main>
  )
}


