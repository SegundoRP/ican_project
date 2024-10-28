"use client";

import {
    HiOfficeBuilding,
    HiOutlineShoppingCart,
    HiOutlineUserGroup,
    HiUsers,
    HiOutlineTrendingUp,
  } from "react-icons/hi";

export default function Cards({dictDashboard}) {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7 text-center">
        <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-orange-50 hover:transition-all hover:cursor-pointer hover:text-orange-500">
          <HiUsers
            size={40}
            className="text-orange-500 bg-orange-100 rounded-full p-2"
          />
          <h3 className="text-2xl font-semibold ">{dictDashboard.Users.Title}</h3>
          <h3 className="text-7xl font-semibold ">{dictDashboard.Users.Quantity}</h3>
          <h3 className="text-green-500 font-bold flex items-center justify-center">
            +{dictDashboard.Users.Indicator}% <HiOutlineTrendingUp/>
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-green-50 hover:transition-all hover:cursor-pointer hover:text-green-500">
          <HiOutlineShoppingCart
            size={40}
            className="text-green-500 bg-green-100 rounded-full p-2"
          />
          <h3 className="text-2xl font-semibold">{dictDashboard.Orders.Title}</h3>
          <h3 className="text-7xl font-semibold">{dictDashboard.Orders.Quantity}</h3>
          <h3 className="text-green-500 font-bold flex items-center justify-center">
            +{dictDashboard.Orders.Indicator}% <HiOutlineTrendingUp/>
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-blue-50 hover:transition-all hover:cursor-pointer hover:text-blue-500">
          <HiOutlineUserGroup
            size={40}
            className="text-blue-500 bg-blue-100 rounded-full p-2"
          />
          <h3 className="text-2xl font-semibold">{dictDashboard.Repartidevs.Title}</h3>
          <h3 className="text-7xl font-semibold">{dictDashboard.Repartidevs.Quantity}</h3>
          <h3 className="text-green-500 font-bold flex items-center justify-center">
            +{dictDashboard.Repartidevs.Indicator}% <HiOutlineTrendingUp/>
          </h3>
        </div>

        <div className="bg-white rounded-xl p-5 grid gap-2 hover:bg-teal-50 hover:transition-all hover:cursor-pointer hover:text-teal-500">
          <h3 className="text-xl font-semibold">{dictDashboard.Buildings.Title}</h3>
          <h3 className="text-5xl font-semibold">{dictDashboard.Buildings.Quantity}</h3>
          <div className=" grid grid-cols-2 sm:grid-cols-2 gap-2 items-center justify-between text-center">
            <div className="flex gap-1 items-center bg-blue-100 p-2 rounded-xl cursor-pointer">
              <HiOfficeBuilding className="text-blue-500" />
              <span className="text-blue-500 font-medium text-base lg:text-sm">
              {dictDashboard.Buildings.Names.Name01}
              </span>
            </div>
            <div className="flex gap-1 items-center bg-red-100 p-2 rounded-xl cursor-pointer">
              <HiOfficeBuilding className="text-red-500" />
              <span className="text-red-500 font-medium text-base lg:text-sm">
              {dictDashboard.Buildings.Names.Name02}
              </span>
            </div>
            <div className="flex gap-1 items-center bg-green-100 p-2 rounded-xl cursor-pointer">
              <HiOfficeBuilding className="text-green-500" />
              <span className="text-green-500 font-medium text-base lg:text-sm">
              {dictDashboard.Buildings.Names.Name03}
              </span>
            </div>
            <div className="flex gap-1 items-center bg-orange-100 p-2 rounded-xl cursor-pointer">
              <HiOfficeBuilding className="text-orange-500" />
              <span className="text-orange-500 font-medium text-base lg:text-sm">
              {dictDashboard.Buildings.Names.Name04}
              </span>
            </div>
          </div>
        </div>
      </section>
  )
}
