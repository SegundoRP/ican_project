"use client";

import {
  Button,
  Modal,
} from "flowbite-react";
import { useState } from "react";
import FormNuevaOrden from "../Forms/FormNuevaOrden";
import { HiClipboardCheck } from "react-icons/hi";

export default function NuevaOrden() {

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        color="blue"
        className="font-semibold p-1"
        onClick={() => setOpenModal(true)}
      >
        
        <p className="flex items-center justify-between gap-1"><HiClipboardCheck className="size-5"/> Nueva Orden</p>
      </Button>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-2xl text-center font-bold text-gray-900">
              Registrar Nueva Orden
            </h3>
            <div className="">
              <FormNuevaOrden/>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}