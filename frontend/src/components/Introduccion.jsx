import Image from "next/image";

export default function Intro({dict}) {
  return (
    <section className="grid items-center text-center p-5 py-10 gap-5 lg:grid-cols-2">
      <div className="grid gap-10">
        <div>
          <h1 className="text-5xl sm:text-6xl text-gray-800 font-extrabold md:text-7xl 2xl:text-9xl bg-yellow-300 p-3 inline-block">{dict.Introduction.Titles.Title}</h1>
          <h2 className="text-4xl py-5 font-semibold text-gray-700 md:text-5xl 2xl:text-7xl">
          {dict.Introduction.Titles.SubTitle1}
          </h2>
          <h3 className="text-4xl border-b-8 border-yellow-300 inline-block text-gray-500 md:text-5xl 2xl:text-7xl">
          {dict.Introduction.Titles.SubTitle2}
          </h3>
        </div>
        <p className="text-pretty md:text-lg xl:text-xl tracking-wide text-gray-500 lg:mx-8 2xl:mx-16">
        {dict.Introduction.Content}
        </p>
        <div>
          <button className="group inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-yellow-300 px-6 font-bold text-gray-900 shadow-2xl shadow-gray-900/50">
            <div className="mr-0 w-0 -translate-x-[100%] opacity-0 transition-all duration-200 group-hover:mr-1 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <span>{dict.Introduction.Button}</span>
          </button>
        </div>
      </div>

      <div className="">
        <Image
          src="/delivery001.webp"
          alt=""
          width={3600}
          height={3600}
          className="w-auto lg:rounded-l-full shadow-2xl shadow-gray-900/50"
        />
      </div>
    </section>
  );
}

