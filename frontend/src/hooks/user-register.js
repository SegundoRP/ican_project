import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useRegisterMutation } from '@/redux/features/authApiSlice'
import { toast } from 'react-toastify';

export default function useRegister() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  const onSubmit = (event) => {
    event.preventDefault();

    register({ first_name, last_name, email, password, re_password })
      .unwrap()
      .then((data) => {
        toast.success('Please check your email to verify your account');
        router.push('/auth/login');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to register account');
      });
  }

  return {
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  }
}