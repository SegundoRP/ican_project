"use client";

import { Rating, Avatar } from "flowbite-react";

const dataRankingRepartidev = [
  {
    id: 1,
    nombre: "Ricardo Huaytan",
    email: "rhuaytan@gmail.com",
    estrellas: 4,
    avatar: "ricardo2930",
  },
  {
    id: 2,
    nombre: "Steven Fuertes",
    email: "sfuertes@gmail.com",
    estrellas: 4,
    avatar: "stevenfuertes",
  },
  {
    id: 3,
    nombre: "Juan Perez",
    email: "jperez@gmail.com",
    estrellas: 4,
    avatar: "midudev",
  },
  {
    id: 4,
    nombre: "Ricardo Huaytan",
    email: "rhuaytan@gmail.com",
    estrellas: 4,
    avatar: "ricardo2930",
  },
  {
    id: 5,
    nombre: "Steven Fuertes",
    email: "sfuertes@gmail.com",
    estrellas: 4,
    avatar: "stevenfuertes",
  },
  {
    id: 6,
    nombre: "Juan Perez",
    email: "jperez@gmail.com",
    estrellas: 4,
    avatar: "midudev",
  },
  {
    id: 7,
    nombre: "Ricardo Huaytan",
    email: "rhuaytan@gmail.com",
    estrellas: 4,
    avatar: "ricardo2930",
  },
  {
    id: 8,
    nombre: "Steven Fuertes",
    email: "sfuertes@gmail.com",
    estrellas: 4,
    avatar: "stevenfuertes",
  },
  {
    id: 9,
    nombre: "Juan Perez",
    email: "jperez@gmail.com",
    estrellas: 4,
    avatar: "midudev",
  },
  {
    id: 10,
    nombre: "Juan Perez",
    email: "jperez@gmail.com",
    estrellas: 4,
    avatar: "midudev",
  },
];

export default function DataRankingRepartidev() {
  return (
    <section className="flex justify-between overflow-scroll hover:overflow-scroll">
    <div className="flex gap-3">
      {dataRankingRepartidev.map((e) => (
        <div
          key={e.id}
          className="bg-gray-100 py-3 px-5 rounded-lg mb-4 text-center"
        >
          <Avatar img={`https://unavatar.io/${e.avatar}`} rounded size="md" />
          <h3 key={e.id} className="">
            {e.nombre}
          </h3>
          <p key={e.id} className="text-gray-500 text-sm">
            {e.email}
          </p>
          <Rating className="mt-2">
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star filled={false} />
          </Rating>
        </div>
      ))}
    </div>
  </section>
  )
}

