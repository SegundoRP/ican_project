import {
    HiOutlineUserGroup,
    HiOutlineTrendingUp,
    HiOutlineShoppingBag,
    HiOutlineShieldCheck,
  } from "react-icons/hi";

export default function CardsRepartidevs() {
  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-1 2xl:grid-rows-3 gap-5 text-center">
      <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-blue-50 hover:transition-all hover:cursor-pointer hover:text-blue-500">
        <HiOutlineUserGroup
          size={40}
          className="text-blue-500 bg-blue-100 rounded-full p-2"
        />
        <h3 className="text-2xl font-semibold">Repartidevs</h3>
        <h3 className="text-6xl 2xl:text-7xl font-semibold">100</h3>
        <h3 className="text-green-500 font-bold flex items-center justify-center">
          +10% <HiOutlineTrendingUp />
        </h3>
      </div>

      <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-amber-50 hover:transition-all hover:cursor-pointer hover:text-amber-500">
        <HiOutlineShoppingBag
          size={40}
          className="text-amber-500 bg-amber-100 rounded-full p-2"
        />
        <h3 className="text-2xl font-semibold">Pedidos</h3>
        <h3 className="text-6xl 2xl:text-7xl font-semibold">220</h3>
        <h3 className="text-green-500 font-bold flex items-center justify-center">
          +10% <HiOutlineTrendingUp />
        </h3>
      </div>

      <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-teal-50 hover:transition-all hover:cursor-pointer hover:text-teal-500">
        <HiOutlineShieldCheck
          size={40}
          className="text-teal-500 bg-teal-100 rounded-full p-2"
        />
        <h3 className="text-2xl font-semibold">Servicios</h3>
        <h3 className="text-6xl 2xl:text-7xl font-semibold">100</h3>
        <h3 className="text-green-500 font-bold flex items-center justify-center">
          +10% <HiOutlineTrendingUp />
        </h3>
      </div>
    </section>
  )
}
