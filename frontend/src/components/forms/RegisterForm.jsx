'use client';

import { useRegister } from '@/hooks';
import { Form } from '@/components/forms';
import { useState, useEffect } from 'react';

export default function RegisterForm({dictionary}) {
  const {
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  } = useRegister();

  const dictionaryRegister = dictionary;

  const config = [
    {
      labelText: dictionaryRegister.Form.Name,
      labelId: 'first_name',
      type: 'text',
      value: first_name,
      required: true,
    },
    {
      labelText: dictionaryRegister.Form.LastName,
      labelId: 'last_name',
      type: 'text',
      value: last_name,
      required: true,
    },
    {
      labelText: dictionaryRegister.Form.Email,
      labelId: 'email',
      type: 'email',
      value: email,
      required: true,
    },
    {
      labelText: dictionaryRegister.Form.Password,
      labelId: 'password',
      type: 'password',
      value: password,
      required: true,
    },
    {
      labelText: dictionaryRegister.Form.ConfirmPassword,
      labelId: 're_password',
      type: 'password',
      value: re_password,
      required: true,
    },
    
  ]

  return(
    <Form
      config={config}
      isLoading={isLoading}
      btnText={dictionaryRegister.Form.Button}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  )
}