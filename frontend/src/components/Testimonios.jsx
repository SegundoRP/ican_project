export default function Testimonios() {

    const customers = [
      {
        "id":"01",
        "name":"Alvaro Rebaza",
        "avatar":"https://unavatar.io/segundorp",
        "testimony":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Facererepellendus provident, asperiores omnis suscipit vel accusantiu fuga autem maiores, corporis deserunt mollitia? Et iure excepturialiquam dolor minima minus accusamus."
      },
      {
        "id":"02",
        "name":"Ricardo Huaytan",
        "avatar":"https://unavatar.io/ricardo2930",
        "testimony":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Facererepellendus provident, asperiores omnis suscipit vel accusantiu fuga autem maiores, corporis deserunt mollitia? Et iure excepturialiquam dolor minima minus accusamus."
      },
      {
        "id":"02",
        "name":"Steven Fuertes",
        "avatar":"https://unavatar.io/stevenfuertes",
        "testimony":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Facererepellendus provident, asperiores omnis suscipit vel accusantiu fuga autem maiores, corporis deserunt mollitia? Et iure excepturialiquam dolor minima minus accusamus."
      }
    ]

    return (
      <section className="text-center px-4 py-12 sm:my-20 sm:text-center">
        <h2 className="text-5xl md:text-6xl 2xl:text-7xl font-bold text-gray-900">
          Nuestros Testimonios
        </h2>
        <h3 className="text-4xl md:text-5xl 2xl:text-6xl text-gray-600 border-b-8 border-yellow-300 inline-block">
          que dicen de nosotros
        </h3>
        <div className="grid text-center text-gray-500 md:grid-cols-3 justify-between p-4 items-center gap-3 lg:gap-7 xl:gap-10 lg:mx-20">

          {
            customers.map((e) => 
              
            <div key={e.id} className="border-dotted border-2 border-yellow-300 rounded-xl p-5">
              <p className="text-pretty py-5">
                {e.testimony}
              </p>
              <picture className="grid place-content-center">
                <img src={e.avatar} className="rounded-full w-16"></img>
              </picture>
              <h2 className="sm:p-5 font-semibold">{e.name}</h2>
          </div>
            )
          }
        </div>
      </section>
    );
  }
  