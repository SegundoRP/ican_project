"use client";

import DataTable from "react-data-table-component";
import { FloatingLabel } from "flowbite-react";
import { useState } from "react";
import NuevaOrden from "../modals/NuevaOrden";

const customStyles = {
  rows: {
    style: {
      minHeight: "52px",
    },
  },
  headCells: {
    style: {
      color: "#000",
      fontSize: "14px",
      fontWeight: 600,
      backgroundColor: "#EEE",
      justifyContent: "center",
    },
  },
  cells: {
    style: {
      paddingLeft: "0px",
      paddingRight: "18px",
      justifyContent: "center",
    },
  },
};

const columns = [
  {
    name: "Orden",
    selector: (row) => row.orden,
    sortable: true,
  },
  {
    name: "Tipo",
    selector: (row) => row.tipo,
    sortable: true,
  },
  {
    name: "Fecha",
    selector: (row) => row.fecha,
    sortable: true,
  },
  {
    name: "Precio",
    selector: (row) => row.precio,
    sortable: true,
  },
  {
    name: "Condominio",
    selector: (row) => row.condominio,
    sortable: true,
  },
  {
    name: "Repartidev",
    selector: (row) => row.repartidev,
    sortable: true,
  },
  {
    name: "Estado",
    selector: (row) =>
      row.estado ? (
        <p className="bg-green-100 text-green-600 p-2 rounded-lg">Completado</p>
      ) : (
        <p className="bg-red-100 text-red-600 p-2 rounded-lg">Pendiente</p>
      ),
    sortable: true,
  },
];

const dataOrdenes = [
  {
    id: 1,
    orden: "OP-01",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Ricardo Huaytan",
    estado: false,
  },
  {
    id: 2,
    orden: "OP-02",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Steven Fuertes",
    estado: false,
  },
  {
    id: 3,
    orden: "OP-03",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
  {
    id: 4,
    orden: "OP-04",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Gardenias",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 5,
    orden: "OP-05",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
  {
    id: 6,
    orden: "OP-06",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Rubies",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 7,
    orden: "OP-07",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 8,
    orden: "OP-08",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Rubies",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
  {
    id: 9,
    orden: "OP-09",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
  {
    id: 10,
    orden: "OP-10",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 11,
    orden: "OP-11",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
  {
    id: 12,
    orden: "OP-12",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Gardenias",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 13,
    orden: "OP-13",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
  {
    id: 14,
    orden: "OP-14",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Rubies",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 15,
    orden: "OP-15",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Esmeraldas",
    repartidev: "Steven Fuertes",
    estado: true,
  },
  {
    id: 16,
    orden: "OP-16",
    tipo: "Pedido",
    fecha: "08/05/2024",
    precio: "S/.9.99",
    condominio: "Rubies",
    repartidev: "Ricardo Huaytan",
    estado: true,
  },
];

export default function DataPrincipalOrdenes() {

  const [register, setRegister] = useState(dataOrdenes);

  const handleChange = (e) => {
    const filterData = dataOrdenes.filter((register) => {
      return register.orden
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setRegister(filterData);
  };

  return (
    <section>
      <div className=" grid sm:flex sm:items-center sm:justify-between mb-4">
        <FloatingLabel
          variant="outlined"
          label="Buscar Pedido"
          onChange={handleChange}
        />
        <NuevaOrden/>
      </div>

      <DataTable
        columns={columns}
        data={register}
        pagination
        customStyles={customStyles}
        fixedHeader
      />
    </section>
  )
}
