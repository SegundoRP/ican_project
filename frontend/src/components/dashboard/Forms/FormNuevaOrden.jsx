import { useForm } from "react-hook-form";


export default function FormNuevaOrden({dict}) {

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
          <label htmlFor="fecha">{dict.TablesOrders.Form.Date}</label>
          <input
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            type="date"
            name="fecha"
            id="fecha"
            {...register("fecha",{required:true})}
          />
          {errors.fecha?.type === 'required' && <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.Required}</span>}
        </div>

        <div className="grid">
          <label htmlFor="orden">{dict.TablesOrders.Form.TypeOrder}</label>
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
          <label htmlFor="telefono">{dict.TablesOrders.Form.Phone}</label>
          <input
            className="rounded-lg border-gray-300 bg-gray-100 border-1 text-sm text-gray-600 mt-2"
            type="number"
            name="telefono"
            id="telefono"
            placeholder="997514992"
            {...register("telefono",{required:true,maxLength:9,minLength:9})}
          />
          {errors.telefono?.type === 'required' && <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.Required}</span>}
          {errors.telefono?.type === 'maxLength' && <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.MaxLength}</span>}
          {errors.telefono?.type === 'minLength' && <span className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.MinLength}</span>}
        </div>

        <div className="grid">
          <label htmlFor="condominios">{dict.TablesOrders.Form.Building}</label>
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
          <label htmlFor="torre">{dict.TablesOrders.Form.Tower}</label>
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
          <label htmlFor="piso">{dict.TablesOrders.Form.Floor}</label>
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
        <label className="text-sm ml-1" htmlFor="terminosycondiciones">{dict.TablesOrders.Form.TC.Accept} <a href="" className="text-blue-600">{dict.TablesOrders.Form.TC.TC}</a></label>
        {errors.terminos?.type === 'required' && <p className="text-red-600 p-1 text-xs">{dict.TablesOrders.Form.Errors.AcceptTC}</p>}
        </div>
        <div>
          <button
            className="bg-blue-600 p-3 rounded-lg text-white text-sm font-semibold"
            type="submit"
          >{dict.TablesOrders.Form.Button}</button>
        </div>
      </form>
  )
}
