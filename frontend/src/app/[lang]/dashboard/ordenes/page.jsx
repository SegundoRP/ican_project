import CardsOrdenes from "@/components/dashboard/cards/CardsOrdenes";
import DataPrincipalOrdenes from "@/components/dashboard/tablas/DataPrincipalOrdenes";
import React from "react";

export default async function pageOrdenes({params}) {

  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  const dictionaryDashboard = dictionary.DashboardPage

  return (
    <main className="mt-28 p-4 sm:p-6 bg-slate-300">
      <section className="flex flex-col gap-5 lg:grid xl:grid-cols-7">
        <article className="bg-white p-5 rounded-xl lg:grid xl:col-span-6">
          <div>
            <header className="flex justify-center sm:justify-start text-3xl font-bold text-gray-900 border-b-4 border-yellow-200 mb-6 sm:inline-block">
              {dictionaryDashboard.OrdersPage.Title}
            </header>
            <DataPrincipalOrdenes dictionary={dictionaryDashboard.Home.DataTablesHome}/>
          </div>
        </article>
        <CardsOrdenes dictionary={dictionaryDashboard.OrdersPage.Cards}/>
      </section>
    </main>
  );
}
