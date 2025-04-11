import { useState } from "react";
import { useResetPasswordMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";

export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [email, setEmail] = useState('');

  const onChange = (event) => {
    setEmail(event.target.value);
  }

  const onSubmit = (event) => {
    event.preventDefault();

    resetPassword(email)
      .unwrap()
      .then((data) => {
        toast.success('Solicitud enviada, revisa tu correo con el link');
      })
      .catch((error) => {
        toast.error('Falló la solicitud de cambio de contraseña');
      });
  }

  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  }
}
