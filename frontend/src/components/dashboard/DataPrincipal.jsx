import DataPrincipalOrdenes from "./tablas/DataPrincipalOrdenes";
import DataPrincipalRepartidevs from "./tablas/DataPrincipalRepartidevs";


export default function DataPrincipal() {
  return (
    <section className="flex flex-col lg:grid grid-cols-4 gap-5">
    <div className="bg-white p-5 rounded-xl lg:col-span-3">
      <h2 className="text-xl font-bold text-gray-900 border-b-4 border-yellow-200 mb-7 inline-block">
        Ordenes
      </h2>
      <DataPrincipalOrdenes/>
    </div>

    <div className="bg-white p-5 rounded-xl">
      <DataPrincipalRepartidevs/>
    </div>
  </section>
  )
}
