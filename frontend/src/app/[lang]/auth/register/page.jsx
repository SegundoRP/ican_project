'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRegisterMutation } from '@/redux/features/authApiSlice'
import { toast } from 'react-toastify';
import Spinner from '@/components/common/Spinner';

export default function PageRegister({params}) {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [dictionary, setDictionary] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  useEffect(() => {
    const loadDictionary = async () => {
      const {lang} = params;
      const dict = await import(`@/app/dictionaries/${lang}.json`).then((m) => m.default);
      setDictionary(dict);
    };
    loadDictionary();
  }, [params]);

  const { first_name, last_name, email, password, re_password } = formData;

  if (!dictionary) return null;

  const dictionaryRegister = dictionary.RegisterPage;

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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src=""
            className="mx-auto h-10 w-auto"
            width={40}
            height={40}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {dictionaryRegister.Title}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={event => onSubmit(event)}>
            <div>
              <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-900">
                {dictionaryRegister.Form.Name}
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  name="first_name"
                  type="first_name"
                  onChange={onChange}
                  value={first_name}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-900">
                {dictionaryRegister.Form.LastName}
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  name="last_name"
                  type="last_name"
                  onChange={onChange}
                  value={last_name}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                {dictionaryRegister.Form.Email}
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  name="email"
                  type="email"
                  onChange={onChange}
                  value={email}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                {dictionaryRegister.Form.Password}
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  name="password"
                  type="password"
                  onChange={onChange}
                  value={password}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="re_password" className="block text-sm/6 font-medium text-gray-900">
                {dictionaryRegister.Form.ConfirmPassword}
              </label>
              <div className="mt-2">
                <input
                  id="re_password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  name="re_password"
                  type="password"
                  onChange={onChange}
                  value={re_password}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? <Spinner sm /> : dictionaryRegister.Form.Register}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {dictionaryRegister.Form.AlreadyHaveAccount}{' '}
            <Link href="/auth/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500">
              {dictionaryRegister.Form.Login}
            </Link>
          </p>
        </div>
      </div>
  );
}
