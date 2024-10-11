import Menu from "@/components/dashboard/menu/Menu"

export default async function Layout({ children,params }) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  const dictionaryDashboard = dictionary.DashboardPage.Home

    return (
        <main className="">
            <Menu dictDashboard={dictionaryDashboard}/>
              {children}
        </main>
    );
  }