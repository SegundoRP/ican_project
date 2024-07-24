"use client"

import { Rating, Avatar} from "flowbite-react";
import { HiPhoneOutgoing } from "react-icons/hi";

const dataRepartidevs = [
    {
      id:1,
      nombre:'Ricardo Huaytan',
      email:'rhuaytan@gmail.com',
      estrellas:4,
      avatar:'ricardo2930'
    },
    {
      id:2,
      nombre:'Steven Fuertes',
      email:'sfuertes@gmail.com',
      estrellas:4,
      avatar:'stevenfuertes'
    },
    {
      id:3,
      nombre:'Juan Perez',
      email:'jperez@gmail.com',
      estrellas:4,
      avatar:'midudev'
    },
    {
      id:4,
      nombre:'Ricardo Huaytan',
      email:'rhuaytan@gmail.com',
      estrellas:4,
      avatar:'ricardo2930'
    },
    {
      id:5,
      nombre:'Steven Fuertes',
      email:'sfuertes@gmail.com',
      estrellas:4,
      avatar:'stevenfuertes'
    },
    {
      id:6,
      nombre:'Juan Perez',
      email:'jperez@gmail.com',
      estrellas:4,
      avatar:'midudev'
    },
    {
      id:7,
      nombre:'Ricardo Huaytan',
      email:'rhuaytan@gmail.com',
      estrellas:4,
      avatar:'ricardo2930'
    },
    {
      id:8,
      nombre:'Steven Fuertes',
      email:'sfuertes@gmail.com',
      estrellas:4,
      avatar:'stevenfuertes'
    },
    {
      id:9,
      nombre:'Juan Perez',
      email:'jperez@gmail.com',
      estrellas:4,
      avatar:'midudev'
    },
    {
      id:10,
      nombre:'Juan Perez',
      email:'jperez@gmail.com',
      estrellas:4,
      avatar:'midudev'
    }
  ];

export default function DataPrincipalRepartidevs() {
  return (
    <section>
      <article className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold  text-gray-900 border-b-4 border-yellow-200 mb-2 inline-block">
          Repartidevs
        </h2>
        <a
          href="/repartidevs"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Ver Todos
        </a>
      </article>
      <article className="lg:h-screen overflow-scroll hover:overflow-scroll md:grid md:grid-cols-3 md:gap-x-10 md:gap-y-5 lg:gap-4 lg:grid lg:grid-cols-1">
        {dataRepartidevs.map((e) => (
          <ul
            key={e.id}
          >
            <li className="py-3 sm:py-4 2xl:px-4">
              <div className="flex gap-2 items-center">
                <div>
                    <Avatar img={`https://unavatar.io/${e.avatar}`} rounded size="md"/>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {e.nombre}
                  </p>
                  <p className="text-sm md:text-xs xl:text-sm text-gray-500">
                    {e.email}
                  </p>
                  <Rating className="mt-1">
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star />
                    <Rating.Star filled={false} />
                  </Rating>
                </div>
                <div className=" bg-teal-100 p-2 rounded-full cursor-pointer">
                  <a href="#" className="text-sm text-teal-500">
                    <HiPhoneOutgoing />
                  </a>
                </div>
              </div>
            </li>
          </ul>
        ))}
      </article>
    </section>
  )
}
