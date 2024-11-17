export default function Servicios({dict}) {
    return (
      <section
        id="servicios"
        className="text-center bg-gray-900 py-12 sm:my-20 lg:rounded-l-full sm:shadow-2xl sm:shadow-gray-900/50"
      >
        <h2 className="text-5xl md:text-6xl 2xl:text-7xl font-bold text-gray-100">
          {dict.Services.Titles.Title}
        </h2>
        <h3 className="text-4xl md:text-5xl 2xl:text-6xl text-gray-400 border-b-8 border-yellow-300 inline-block">
        {dict.Services.Titles.SubTitle}
        </h3>
        <div className="grid gap-5 md:grid md:grid-cols-2 2xl:grid-cols-4 justify-between p-5 items-center md:gap-5 lg:gap-10 2xl:gap-20 sm:flex sm:p-14">
          <div className="bg-gray-200 rounded-xl p-5">
            <h4 className="sm:text-2xl font-semibold border-b-4 border-yellow-300 inline-block">
            {dict.Services.ServicesContent.Service01.Title}
            </h4>
            <p className="text-pretty py-5">
            {dict.Services.ServicesContent.Service01.Content}
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-5">
            <h4 className="sm:text-2xl font-semibold border-b-4 border-yellow-300 inline-block">
            {dict.Services.ServicesContent.Service02.Title}
            </h4>
            <p className="text-pretty py-5">
            {dict.Services.ServicesContent.Service02.Content}
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-5">
            <h4 className="sm:text-2xl font-semibold border-b-4 border-yellow-300 inline-block">
            {dict.Services.ServicesContent.Service03.Title}
            </h4>
            <p className="text-pretty py-5">
            {dict.Services.ServicesContent.Service03.Content}
            </p>
          </div>

          <div className="bg-gray-200 rounded-xl p-5">
            <h4 className="sm:text-2xl font-semibold border-b-4 border-yellow-300 inline-block">
            {dict.Services.ServicesContent.Service04.Title}
            </h4>
            <p className="text-pretty py-5">
            {dict.Services.ServicesContent.Service04.Content}
            </p>
          </div>
        </div>
      </section>
    );
  }
