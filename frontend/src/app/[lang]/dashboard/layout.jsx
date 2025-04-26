import Menu from "@/components/dashboard/menu/Menu";
import { RequireAuth } from "@/components/utils";

export default async function Layout({ children,params }) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  const dictionaryDashboard = dictionary.DashboardPage.Home

    return (
      <main className="">
        <RequireAuth>{children}</RequireAuth>
        <Menu dictDashboard={dictionaryDashboard}/>
      </main>
    );
  }
