'use client';

import { Avatar, Datepicker } from "flowbite-react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Spinner } from "@/components/common";

export default function Bienvenido({dictDashboard}) {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    )
  }

  return (
    <section className="mt-24 sm:mt-28 mb-5 sm:mb-10">
      <div className="grid place-content-center sm:flex sm:items-center sm:gap-4">
        <Avatar img="https://unavatar.io/segundorp" rounded size="lg" />
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold">{dictDashboard.Greeting} <span className="text-blue-600 font-extrabold">{user?.first_name}</span></h2>
          <Datepicker
            className="flex justify-center"
            language="es-ES"
            labelTodayButton="Hoy"
            labelClearButton="Limpiar"
            autoHide={false}
            weekStart={1}
          />
        </div>
      </div>
    </section>
  )
}
