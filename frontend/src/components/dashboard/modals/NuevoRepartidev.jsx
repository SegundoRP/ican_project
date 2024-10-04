"use client";

import {
  Button,
  Modal,
} from "flowbite-react";
import { useState } from "react";
import { HiOutlineIdentification } from "react-icons/hi";
import FormNuevoRepartidev from "../Forms/FormNuevoRepartidev";

export default function NuevoRepartidev() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
    <Button
      color="blue"
      className="font-semibold p-1"
      onClick={() => setOpenModal(true)}
    >
      <p className="flex items-center justify-between gap-1"><HiOutlineIdentification className="size-5"/> Nuevo Repartidev</p>
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
            Quiero ser Repartidev
          </h3>
          <div>
            <FormNuevoRepartidev/>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </>
  )
}
