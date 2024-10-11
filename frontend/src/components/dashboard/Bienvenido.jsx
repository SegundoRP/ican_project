import { Avatar, Datepicker } from "flowbite-react";


export default function Bienvenido({dictDashboard}) {
  return (
    <section className="mt-24 sm:mt-28 mb-5 sm:mb-10">
        <div className="grid place-content-center sm:flex sm:items-center sm:gap-4">
          <Avatar img="https://unavatar.io/segundorp" rounded size="lg" />
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold">{dictDashboard.Welcome.Greeting} <span className="text-blue-600 font-extrabold">{dictDashboard.Welcome.User}</span></h2>
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
  )
}
