import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuth, setUser } from '@/redux/features/authSlice';
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

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await login({ email, password }).unwrap();
      dispatch(setAuth());

      // Fetch user data after successful login
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/me/`, {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch(setUser(userData));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }

      toast.success('Sesión iniciada');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Falló el inicio de sesión');
    }
  }

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  }
}
