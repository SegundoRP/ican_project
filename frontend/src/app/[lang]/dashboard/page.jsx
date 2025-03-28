import Bienvenido from "@/components/dashboard/Bienvenido";
import Cards from "@/components/dashboard/cards/Cards";
import DataPrincipal from "@/components/dashboard/DataPrincipal";


export default async function pageDashboard({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  const dictionaryDashboard = dictionary.DashboardPage.Home

  return (
    <main className="p-4 bg-slate-300">
      <Bienvenido dictDashboard={dictionaryDashboard.Welcome}/>
      <Cards dictDashboard={dictionaryDashboard.Cards}/>
      <DataPrincipal dictDashboard={dictionaryDashboard.DataTablesHome}/>
    </main>
  )
}


