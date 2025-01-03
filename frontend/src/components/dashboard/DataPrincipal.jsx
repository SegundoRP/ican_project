import DataPrincipalOrdenes from "./tablas/DataPrincipalOrdenes";
import DataPrincipalRepartidevs from "./tablas/DataPrincipalRepartidevs";


export default function DataPrincipal({dictDashboard}) {
  return (
    <section className="flex flex-col lg:grid grid-cols-4 gap-5">
    <div className="bg-white p-5 rounded-xl lg:col-span-3">
      <h2 className="text-xl font-bold text-gray-900 border-b-4 border-yellow-200 mb-7 inline-block">
        {dictDashboard.TablesOrders.Title}
      </h2>
      <DataPrincipalOrdenes dictionary={dictDashboard}/>
    </div>

    <div className="bg-white p-5 rounded-xl">
      <DataPrincipalRepartidevs dictionary={dictDashboard}/>
    </div>
  </section>
  )
}
