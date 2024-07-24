"use client";

import { Navbar, Dropdown, Breadcrumb, Avatar } from "flowbite-react";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineUserGroup,
  HiLogout,
} from "react-icons/hi";

export default function SidebarHome() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 justify-between items-center">
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="">
          <span className="text-blue-700 text-xl font-bold ">
            Dashboard Logo
          </span>
        </Navbar.Brand>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="avatar_user"
              img="https://unavatar.io/segundorp"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm font-bold">Segundo Rebaza</span>
            <span className="block truncate text-sm font-medium">
              segundorp@gmail.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item icon={HiOutlineChartBar}>
            <a href="/dashboard">Dashboard</a>
          </Dropdown.Item>
          <Dropdown.Item icon={HiOutlineShoppingCart}>
            <a href="/dashboard/ordenes">Ordenes</a>
          </Dropdown.Item>
          <Dropdown.Item icon={HiOutlineUserGroup}>
            <a href="/dashboard/repartidevs">Repartidevs</a>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={HiLogout} className="text-red-500">
            <a href="">Cerrar Sesión</a>
          </Dropdown.Item>
        </Dropdown>
      </Navbar>

      <div className="flex justify-center bg-white sm:flex sm:justify-start sm:pl-16 pb-4">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/dashboard" icon={HiOutlineHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/dashboard" icon={HiOutlineChartBar}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item href="" icon={HiOutlineUser}>
            Segundo Rebaza
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
}
