import Link from "next/link";
import Image from "next/image";

export default function navbar() {
  return (
    <header className="grid bg-gray-900 px-1 py-4 sm:p-10 z-1">
      <div className="flex sm:justify-between sm:gap-3 items-center text-center">
        <Image
          src="/next.svg"
          alt=""
          width={200}
          height={200}
          className="mr-8 w-1/4 sm:w-80"
        />
        <div className="">
          <button
            role="link"
            class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 sm:px-6 font-semibold text-gray-200"
          >
            <span class="absolute h-0 w-0 rounded-full bg-blue-600 transition-all duration-300 group-hover:h-56 group-hover:w-full"></span>
            <Link
              href="/login"
              class="relative border-b-2 border-gray-100 text-md sm:text-lg"
            >
              Iniciar Sesión
            </Link>
          </button>
          <button class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 sm:px-6 font-semibold text-gray-200">
            <span class="absolute h-0 w-0 rounded-full bg-green-600 transition-all duration-300 group-hover:h-56 group-hover:w-full"></span>
            <Link
              href="/login"
              class="relative border-b-2 border-gray-100 text-md text-center sm:text-lg"
            >
              Registrate
            </Link>
          </button>
        </div>
      </div>

      <nav className="text-md gap-6 flex mt-6 sm:justify-start items-center sm:gap-10 font-bold text-lg text-gray-100 sm:mt-10">
        <button
          role="link"
          class="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="">Home</Link>
        </button>
        <button
          role="link"
          class="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="#nosotros">Nosotros</Link>
        </button>
        <button
          role="link"
          class="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="#servicios">Servicios</Link>
        </button>
        <button
          role="link"
          class="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:w-full after:origin-bottom after:scale-x-0 after:bg-yellow-300 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
        >
          <Link href="#experiencia">Te Ayudamos</Link>
        </button>
      </nav>
    </header>
  );
}
