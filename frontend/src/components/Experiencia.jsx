import Image from "next/image";

export default function Experiencia({dict}) {
  return (
    <section
      id="experiencia"
      className="text-center bg-gray-900 px-4 py-12 sm:my-20 sm:p-12 lg:rounded-r-full sm:shadow-2xl sm:shadow-gray-900/50"
    >
      <div className="text-start">
        <h2 className="text-5xl md:text-6xl 2xl:text-7xl font-bold text-gray-100">
          {dict.Experience.Titles.Title}
        </h2>
        <h3 className="text-4xl md:text-5xl 2xl:text-6xl text-gray-400 border-b-8 border-yellow-300 inline-block">
        {dict.Experience.Titles.SubTitle}
        </h3>
        <p className=" py-5 lg:w-1/2 sm:text-xl text-gray-100 sm:py-8">
        {dict.Experience.Content}
        </p>
      </div>
      <div className="grid gap-5 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 text-gray-100 items-center sm:gap-4 lg:gap-7">
        <div>
          <Image src="/work-experience.webp" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">{dict.Experience.Experiences.Experience1}</h5>
        </div>

        <div>
          <Image src="/work-experience.webp" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">{dict.Experience.Experiences.Experience2}</h5>
        </div>

        <div>
          <Image src="/work-experience.webp" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">{dict.Experience.Experiences.Experience3}</h5>
        </div>
      </div>
    </section>
  );
}
