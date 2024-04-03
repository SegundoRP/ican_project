import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center p-4">
      <div className="sm:py-5 sm:flex sm:text-start sm:items-center">
        <div>
          <Image
            src="/logo_footer.jpg"
            alt=""
            width={300}
            height={300}
            className="w-full sm:w-auto"
          />
        </div>
        <div>
          <h3 className="text-4xl sm:text-5xl font-bold">REPARTIDEV</h3>
          <p className="text-pretty py-7 px-4 sm:w-1/2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo
            est mollitia voluptate qui incidunt nihil reiciendis. Necessitatibus
            inventore voluptatum aliquid quae, quaerat debitis ratione eaque
            soluta? Commodi nam cupiditate blanditiis!
          </p>
          <div className="flex gap-1 pb-3">
            <input
              type="text"
              placeholder="Ingresa tu email"
              className="text-center rounded-lg text-gray-900"
            />
            <button class="w-full sm:w-auto rounded-md bg-yellow-300 px-5 py-2.5 text-gray-900 font-bold transition-all duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:-translate-y-1 active:scale-x-90 active:scale-y-110">
              Enviar
            </button>
          </div>
        </div>
      </div>
      <span className="text-gray-400">Copyright© 2024 Repartidev-</span>
      <span className="text-gray-400">Hecho con el ❤️</span>
    </footer>
  );
}
