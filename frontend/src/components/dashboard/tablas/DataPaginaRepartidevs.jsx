"use client";

import DataTable from "react-data-table-component";
import { useState } from "react";
import { FloatingLabel } from "flowbite-react";
import { HiOutlinePhoneOutgoing } from "react-icons/hi";
import NuevoRepartidev from "../modals/NuevoRepartidev";

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
        backgroundColor: "#EEEE",
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
      name: "Nombres",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Apellidos",
      selector: (row) => row.apellido,
      sortable: true,
    },
    {
      name: "DNI",
      selector: (row) => row.dni,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Cód",
      selector: (row) => row.codigo,
      sortable: true,
    },
    {
      name: "Condominio",
      selector: (row) => row.condominio,
      sortable: true,
    },
    {
      name: "Torre",
      selector: (row) => row.torre,
      sortable: true,
    },
    {
      name: "Contacto",
      selector: (row) => (
        <a
          href="#"
          className="bg-green-100 text-green-500 p-2 rounded-lg flex gap-2 items-center"
        >
          {<HiOutlinePhoneOutgoing/>}
          {row.contacto}
        </a>
      ),
      sortable: true,
    },
  ];
  
  const data = [
    {
      id: 1,
      nombre: "Steven",
      apellido: "Fuertes",
      dni: "46706230",
      email: "sfuertes@gmail.com",
      codigo: "SF-001",
      condominio: "Esmeraldas",
      torre: "1",
      contacto: "997514995",
    },
    {
      id: 2,
      nombre: "Ricardo",
      apellido: "Huaytan",
      dni: "46706230",
      email: "rhuaytan@gmail.com",
      codigo: "RH-001",
      condominio: "Esmeraldas",
      torre: "3",
      contacto: "997514995",
    },
    {
      id: 3,
      nombre: "Segundo",
      apellido: "Pajares",
      dni: "46706230",
      email: "spajares@gmail.com",
      codigo: "SP-001",
      condominio: "Esmeraldas",
      torre: "2",
      contacto: "998125666",
    },
    {
      id: 4,
      nombre: "Leonel",
      apellido: "Messi",
      dni: "46062230",
      email: "lmessi@gmail.com",
      codigo: "LM-001",
      condominio: "Gardenias",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 5,
      nombre: "Tony",
      apellido: "Kross",
      dni: "45859966",
      email: "tkross@gmail.com",
      codigo: "TK-001",
      condominio: "Esmeraldas",
      torre: "2",
      contacto: "998125666",
    },
    {
      id: 6,
      nombre: "Juan",
      apellido: "Perez",
      dni: "46706230",
      email: "jperez@gmail.com",
      codigo: "JP-001",
      condominio: "Rubies",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 7,
      nombre: "Maria",
      apellido: "Lopez",
      dni: "46706230",
      email: "mlopez@gmail.com",
      codigo: "ML-001",
      condominio: "Esmeraldas",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 8,
      nombre: "Carlos",
      apellido: "Gonzales",
      dni: "46706230",
      email: "cgonzales@gmail.com",
      codigo: "CG-001",
      condominio: "Rubies",
      torre: "2",
      contacto: "998125666",
    },
    {
      id: 9,
      nombre: "Ana",
      apellido: "Porras",
      dni: "46706230",
      email: "aporras@gmail.com",
      codigo: "AP-001",
      condominio: "Esmeraldas",
      torre: "2",
      contacto: "998125666",
    },
    {
      id: 10,
      nombre: "Gomez",
      apellido: "Gomez",
      dni: "46706230",
      email: "ggomez@gmail.com",
      codigo: "GG-001",
      condominio: "Esmeraldas",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 11,
      nombre: "Pedro",
      apellido: "Rodriguez",
      dni: "46706230",
      email: "prodriguez@gmail.com",
      codigo: "PR-001",
      condominio: "Esmeraldas",
      torre: "2",
      contacto: "998125666",
    },
    {
      id: 12,
      nombre: "Lucia",
      apellido: "Diaz",
      dni: "46706230",
      email: "ldiaz@gmail.com",
      codigo: "LD-001",
      condominio: "Gardenias",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 13,
      nombre: "Fernando",
      apellido: "Sanchez",
      dni: "46706230",
      email: "fsanchez@gmail.com",
      codigo: "FS-001",
      condominio: "Esmeraldas",
      torre: "2",
      contacto: "998125666",
    },
    {
      id: 14,
      nombre: "Daniel",
      apellido: "Torres",
      dni: "46706230",
      email: "dtorres@gmail.com",
      codigo: "DT-001",
      condominio: "Rubies",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 15,
      nombre: "Melissa",
      apellido: "Vera",
      dni: "46706230",
      email: "mvera@gmail.com",
      codigo: "MV-001",
      condominio: "Esmeraldas",
      torre: "3",
      contacto: "998125666",
    },
    {
      id: 16,
      nombre: "Arturo",
      apellido: "Paredes",
      dni: "46706230",
      email: "aparedes@gmail.com",
      codigo: "AP-001",
      condominio: "Rubies",
      torre: "2",
      contacto: "998125666",
    },
  ];

export default function DataPaginaRepartidevs() {
    const [register, setRegister] = useState(data);

    const handleChange = (e) => {
      const filterData = data.filter((register) => {
        return register.nombre
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setRegister(filterData);
    };
  return (
    <section>
      <article className="grid sm:flex sm:items-center sm:justify-between mb-4">
        <FloatingLabel
          variant="outlined"
          label="Buscar Repartidev"
          onChange={handleChange}
        />
        <NuevoRepartidev/>
      </article>

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
