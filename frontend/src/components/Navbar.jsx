'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { logout as setLogout } from "@/redux/features/authSlice";

export default function Navbar({dict}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    logout(undefined)
      .unwrap
      .then(() => {
        dispatch(setLogout());
      })
      .finally(() => {
        router.push('/');
      })
  };

  const authLinks = ( <div>Auth links</div> )
  const guestLinks = ( <div>Auth links</div> )

  return (
    <header className="grid bg-gray-900 px-1 py-4 sm:p-10 sticky top-0">
      <div className="flex justify-around sm:justify-between sm:gap-3 items-center text-center">
        <div>
          <h2 className="text-yellow-300 text-4xl font-bold">Logo</h2>
        </div>
        <div className="">
          <button
            role="link"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 sm:px-6 font-semibold text-gray-200"
          >
            <span className="absolute h-0 w-0 rounded-full bg-blue-600 transition-all duration-300 group-hover:h-56 group-hover:w-full"></span>
            <Link
              href="/dashboard"
              className="relative border-b-2 border-gray-100 text-md sm:text-lg"
            >
              {dict.Navbar.Buttons.Login}
              {isAuthenticated ? authLinks : guestLinks}
            </Link>
          </button>
          <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 sm:px-6 font-semibold text-gray-200">
            <span className="absolute h-0 w-0 rounded-full bg-green-600 transition-all duration-300 group-hover:h-56 group-hover:w-full"></span>
            <Link
              href="#"
              className="relative border-b-2 border-gray-100 text-md text-center sm:text-lg"
            >
              {dict.Navbar.Buttons.Register}
              {isAuthenticated ? authLinks : guestLinks}
            </Link>
          </button>
        </div>
      </div>

      <nav className="text-md gap-6 flex mt-6 justify-between sm:justify-start items-center sm:gap-10 font-bold text-lg text-gray-100 sm:mt-10">
        <button
          role="link"
          className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="">{dict.Navbar.Menu.Home}</Link>
        </button>
        <button
          role="link"
          className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="#nosotros">{dict.Navbar.Menu.Team}</Link>
        </button>
        <button
          role="link"
          className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="#servicios">{dict.Navbar.Menu.Services}</Link>
        </button>
        <button
          role="link"
          className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="#experiencia">{dict.Navbar.Menu.Contact}</Link>
        </button>
      </nav>
    </header>
  );
}
