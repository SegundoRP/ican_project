import { useState } from "react";
import { useRouter } from "next/navigation"
import { useResetPasswordConfirmMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";

export default function useResetPasswordConfirm(uid, token) {
  const router = useRouter();
  const [resetPasswordConfirm, { isLoading }] = useResetPasswordConfirmMutation();
  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: ''
  });

  const { new_password, re_new_password } = formData;

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  const onSubmit = (event) => {
    event.preventDefault();

    resetPasswordConfirm({ uid, token, new_password, re_new_password })
      .unwrap()
      .then((data) => {
        toast.success('Cambio de contraseña exitosa');
        router.push('/auth/login');
      })
      .catch((error) => {
        toast.error('Falló el cambio de contraseña');
      });
  }

  return {
    new_password,
    re_new_password,
    isLoading,
    onChange,
    onSubmit,
  }
}
