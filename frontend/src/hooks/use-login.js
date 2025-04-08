import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  const onSubmit = (event) => {
    event.preventDefault();

    login({ email, password })
      .unwrap()
      .then((data) => {
        dispatch(setAuth());
        toast.success('Sesión iniciada');
        router.push('/dashboard');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Falló el inicio de sesión');
      });
  }

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  }
}
