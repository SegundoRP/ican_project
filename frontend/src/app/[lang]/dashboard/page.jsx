import Bienvenido from "@/components/dashboard/Bienvenido";
import Cards from "@/components/dashboard/cards/Cards";
import DataPrincipal from "@/components/dashboard/DataPrincipal";


export default function pageDashboard() {
  return (
    <main className="p-4 bg-slate-300">
      <Bienvenido/>
      <Cards/>
      <DataPrincipal/>
    </main>
  )
}


