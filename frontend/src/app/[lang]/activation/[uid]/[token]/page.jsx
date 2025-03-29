'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActivationMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

export default function PageActivation({params}) {
  const router = useRouter();
  const [activation] = useActivationMutation();
  const [dictionary, setDictionary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // Avoid duplication toast
    effectRan.current = true;

    const { uid, token } = params;

    activation({ uid, token })
      .unwrap()
      .then(() => {
        toast.success('Account activated');
      })
      .catch(() => {
        toast.error('Failed to activate account');
      })
      .finally(() => {
        router.push('/auth/login');
      });

    const loadDictionary = async () => {
      try {
        const { lang } = params;
        const dict = await import(`@/app/dictionaries/${lang}.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [activation, router, params]);

  if (isLoading || !dictionary) {
    return (
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Cargando...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          {dictionary.ActivationPage?.Title}
        </h1>
      </div>
    </div>
  );
}
