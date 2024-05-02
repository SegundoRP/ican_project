import Image from "next/image";

export default function Experiencia() {
  return (
    <section
      id="experiencia"
      className="text-center bg-gray-900 px-4 py-12 sm:my-20 sm:p-12 lg:rounded-r-full sm:shadow-2xl sm:shadow-gray-900/50"
    >
      <div className="text-start">
        <h2 className="text-5xl md:text-6xl 2xl:text-7xl font-bold text-gray-100">
          Nuestros Trabajos
        </h2>
        <h3 className="text-4xl md:text-5xl 2xl:text-6xl text-gray-400 border-b-8 border-yellow-300 inline-block">
          recientes
        </h3>
        <p className=" py-5 lg:w-1/2 sm:text-xl text-gray-100 sm:py-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias eos
          quam repudiandae, esse accusamus explicabo! Dolore, architecto.
          Exercitationem vero beatae consectetur, dolore necessitatibus cum
          iusto quis veritatis vel unde neque.
        </p>
      </div>
      <div className="grid gap-5 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 text-gray-100 items-center sm:gap-4 lg:gap-7">
        <div>
          <Image src="/work-experience.webp" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">Imagen 0001</h5>
        </div>

        <div>
          <Image src="/work-experience.webp" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">Imagen 0001</h5>
        </div>

        <div>
          <Image src="/work-experience.webp" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">Imagen 0001</h5>
        </div>
      </div>
    </section>
  );
}
