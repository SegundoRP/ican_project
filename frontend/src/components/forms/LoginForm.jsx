'use client';

import { useLogin } from '@/hooks';
import { Form } from '@/components/forms';

export default function LoginForm({dictionary}) {
  const {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  } = useLogin();

  const dictionaryRegister = dictionary.RegisterPage;
  const dictionaryLogin = dictionary.LoginPage;

  const config = [
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
      link: {
        linkText: dictionaryLogin.ForgotPassword,
        linkUrl: dictionaryLogin.LinkUrl,
      },
      required: true,
    }
  ]

  return(
    <Form
      config={config}
      isLoading={isLoading}
      btnText={dictionaryLogin.Form.Button}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  )
}
