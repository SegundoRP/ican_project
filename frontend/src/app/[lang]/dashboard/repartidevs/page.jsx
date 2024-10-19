import CardsRepartidevs from '@/components/dashboard/cards/CardsRepartidevs'
import DataPaginaRepartidevs from '@/components/dashboard/tablas/DataPaginaRepartidevs'
import DataRankingRepartidev from '@/components/dashboard/tablas/DataRankingRepartidev'
import React from 'react'

export default async function pageRepartidevs({params}) {
  
  const {lang} = params
  const dictionary = await import (`@/app/dictionaries/${lang}.json`)
  .then((m) => m.default)
  const dictionaryDashboard = dictionary.DashboardPage.RepartidevsPage
  
  return (
    <main className="mt-28 p-4 sm:p-6 bg-slate-300">
      <section className="bg-white rounded-xl mb-4 p-5">
        <DataRankingRepartidev/>
      </section>
      <section className="flex flex-col gap-5 lg:grid 2xl:grid-cols-7">
        <article className="bg-white p-5 rounded-xl lg:grid 2xl:col-span-6">
          <div>
            <header className="flex justify-center sm:justify-start text-3xl font-bold text-gray-900 border-b-4 border-yellow-200 mb-6 sm:inline-block">
              {dictionaryDashboard.Title}
            </header>
            <DataPaginaRepartidevs dictionary={dictionaryDashboard}/>
          </div>
        </article>
        <CardsRepartidevs dictionary={dictionaryDashboard.Cards}/>
      </section>
    </main>
  )
}
