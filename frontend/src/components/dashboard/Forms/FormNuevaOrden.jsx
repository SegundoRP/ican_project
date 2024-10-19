import { useForm } from "react-hook-form";


export default function FormNuevaOrden() {

  const { register, handleSubmit , formState:{errors} } = useForm();

  const onSubmit = (data) => {
    return data
  };

  return (
<form
        className="grid p-1 space-y-5 text-sm font-medium text-gray-900"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid">
          <label htmlFor="fecha">Fecha</label>
          <input
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            type="date"
            name="fecha"
            id="fecha"
            {...register("fecha",{required:true})}
          />
          {errors.fecha?.type === 'required' && <span className="text-red-600 p-1 text-xs">El campo es requerido</span>}
        </div>

        <div className="grid">
          <label htmlFor="orden">Tipo de Orden</label>
          <select
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            id="orden"
            {...register("tipodeorden",{required:true})}
          >
            <option value="pedido">Pedido</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        <div className="grid">
          <label htmlFor="telefono">Teléfono</label>
          <input
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            type="tel"
            name="telefono"
            id="telefono"
            placeholder="997514992"
            {...register("telefono",{required:true,maxLength:9,minLength:9})}
          />
          {errors.telefono?.type === 'required' && <span className="text-red-600 p-1 text-xs">El campo es requerido</span>}
          {errors.telefono?.type === 'maxLength' && <span className="text-red-600 p-1 text-xs">El campo debe tener máximo 9 caracteres</span>}
          {errors.telefono?.type === 'minLength' && <span className="text-red-600 p-1 text-xs">El campo debe tener mínimo 9 caracteres</span>}
        </div>

        <div className="grid">
          <label htmlFor="condominios">Condominio</label>
          <select
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            id="condominios"
            {...register("condominio",{required:true})}
          >
            <option value="Olivos">Olivos</option>
            <option value="Esmeralda">Esmeralda</option>
            <option value="Rubies">Rubies</option>
            <option value="Gardenias">Gardenias</option>
          </select>
        </div>
        <div className="grid">
          <label htmlFor="torre">N° de Torre</label>
          <select
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            id="torre"
            {...register("torre",{required:true})}
          >
            <option value="001">001</option>
            <option value="002">002</option>
            <option value="003">003</option>
            <option value="004">004</option>
          </select>
        </div>
        <div className="grid">
          <label htmlFor="piso">N° de Piso</label>
          <select
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            id="piso"
            {...register("piso",{required:true})}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
        <input className="rounded" type="checkbox" id="terminosycondiciones" {...register("terminos",{required:true})}/>
        <label className="text-sm ml-1" htmlFor="terminosycondiciones">Acepto los <a href="" className="text-blue-600">Terminos y Condiciones</a></label>
        {errors.terminos?.type === 'required' && <p className="text-red-600 p-1 text-xs">Aceptar los términos y condiciones</p>}
        </div>
        <div>
          <button
            className="bg-blue-600 p-3 rounded-lg text-white text-sm font-semibold"
            type="submit"
          >Registrar</button>
        </div>
      </form>
  )
}
