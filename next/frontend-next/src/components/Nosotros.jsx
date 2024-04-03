import Image from "next/image";

export default function Nosotros() {
  return (
    <section
      id="nosotros"
      className="grid px-4 py-12 sm:my-20 gap-5 items-center sm:gap-10 sm:p-14 sm:flex"
    >
      <div>
        <Image
          src="/team.jpeg"
          alt=""
          width={1600}
          height={1600}
          className="sm:rounded-r-full sm:shadow-2xl sm:shadow-gray-900/50"
        />
      </div>
      <div>
        <h2 className="text-4xl sm:text-6xl font-bold text-gray-900">
          Sobre Nosotros
        </h2>
        <h3 className="text-4xl sm:text-6xl text-gray-600 border-b-8 border-yellow-300 inline-block">
          para ti
        </h3>
        <p className="text-pretty py-5 sm:text-xl sm:tracking-wide">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima rem
          possimus molestiae dolor, non eius repellendus voluptatibus tenetur
          dignissimos doloremque ullam illo distinctio, natus voluptate rerum.
          Commodi blanditiis vel a.
        </p>
        <button class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-yellow-300 px-6 font-bold text-gray-900 shadow-2xl shadow-gray-900/50">
          <div class="mr-0 w-0 -translate-x-[100%] opacity-0 transition-all duration-200 group-hover:mr-1 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <span>Saber más</span>
        </button>
      </div>
    </section>
  );
}
