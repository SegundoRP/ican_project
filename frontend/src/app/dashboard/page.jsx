import Cards from "@/components/dashboard/cards/Cards";
import { Avatar, Datepicker } from "flowbite-react";


export default function pageDashboard() {
  return (
    <main className="p-4 bg-slate-300">
      <section className="my-2 sm:my-4">
        <div className="grid place-content-center sm:flex sm:items-center sm:gap-4">
          <Avatar img="https://unavatar.io/segundorp" rounded size="lg" />
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold">Bienvenido Segundo</h2>
            <Datepicker
              className="flex justify-center"
              language="es-ES"
              labelTodayButton="Hoy"
              labelClearButton="Limpar"
              autoHide={false}
              weekStart={1}
            />
          </div>
        </div>
      </section>
      <Cards/>
    </main>
  )
}


