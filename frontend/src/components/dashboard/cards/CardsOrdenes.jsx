import {
    HiOutlineShoppingCart,
    HiOutlineTrendingUp,
    HiOutlineShoppingBag,
    HiOutlineShieldCheck,
  } from "react-icons/hi";

export default function CardsOrdenes() {
  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-1 xl:grid-rows-3 gap-5 text-center">
      <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-green-50 hover:transition-all hover:cursor-pointer hover:text-green-500">
        <HiOutlineShoppingCart
          size={40}
          className="text-green-500 bg-green-100 rounded-full p-2"
        />
        <h3 className="text-2xl font-semibold">Ordenes</h3>
        <h3 className="text-6xl 2xl:text-7xl font-semibold">320</h3>
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
  );
}
