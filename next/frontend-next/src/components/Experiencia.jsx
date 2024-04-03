import Image from "next/image";

export default function Experiencia() {
  return (
    <section
      id="experiencia"
      className="text-center bg-gray-900 px-4 py-12 sm:my-20 sm:p-12 sm:rounded-r-full sm:shadow-2xl sm:shadow-gray-900/50"
    >
      <div className="text-start">
        <h2 className="text-4xl sm:text-6xl font-bold text-gray-100">
          Nuestros Trabajos
        </h2>
        <h3 className="text-4xl sm:text-6xl text-gray-600 border-b-8 border-yellow-300 inline-block">
          recientes
        </h3>
        <p className=" py-5 sm:w-1/2 sm:text-xl text-gray-100 sm:py-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias eos
          quam repudiandae, esse accusamus explicabo! Dolore, architecto.
          Exercitationem vero beatae consectetur, dolore necessitatibus cum
          iusto quis veritatis vel unde neque.
        </p>
      </div>
      <div className="grid justify-between text-gray-100 items-center gap-10 sm:gap-20 sm:flex sm:p-0">
        <div>
          <Image src="/work-experience.jpg" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">Imagen 0001</h5>
        </div>

        <div>
          <Image src="/work-experience.jpg" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">Imagen 0001</h5>
        </div>

        <div>
          <Image src="/work-experience.jpg" alt="" width={1600} height={1600} />
          <h5 className="sm:p-5 font-semibold">Imagen 0001</h5>
        </div>
      </div>
    </section>
  );
}
