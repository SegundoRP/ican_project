import Image from "next/image";

export default function Footer({dict}) {
  return (
    <footer className="bg-black text-gray-400 text-center p-4">
      <div className="sm:p-5 sm:px-10 sm:grid grid-cols-2 md:text-start items-center">
        <div className="md:flex md:justify-center">
          {/* <Image
            src="/logo_footer.webp"
            alt=""
            width={300}
            height={300}
            className="w-full sm:w-auto"
          /> */}
        </div>
        <div>
          <h3 className="text-4xl sm:text-5xl font-bold">{dict.Footer.Title}</h3>
          <p className="text-pretty py-7">{dict.Footer.Content}</p>
          <div className="flex gap-1 pb-3">
            <input
              type="text"
              placeholder={dict.Footer.Input}
              className="text-center rounded-lg text-gray-900"
            />
            <button className="w-full sm:w-auto rounded-md bg-yellow-300 px-5 py-2.5 text-gray-900 font-bold transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110">
              {dict.Footer.Button}
            </button>
          </div>
        </div>
      </div>
      <span className="text-gray-400 text-sm font-medium sm:text-base">{dict.Footer.Copyright}</span>
    </footer>
  );
}
