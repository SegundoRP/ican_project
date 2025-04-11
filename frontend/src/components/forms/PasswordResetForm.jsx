'use client';

import { useResetPassword } from "@/hooks";
import { Form } from '@/components/forms';

export default function PasswordResetForm({dictionary}) {
  const { email, isLoading, onChange, onSubmit } = useResetPassword();

  const dictionaryPasswordReset = dictionary.PasswordReset;
  const dictionaryRegisterPage = dictionary.RegisterPage;

  const config = [
    {
      labelText: dictionaryRegisterPage.Form.Email,
      labelId: 'email',
      type: 'email',
      value: email,
      required: true
    }
  ];

  return(
    <Form
      config={config}
      isLoading={isLoading}
      btnText={dictionaryPasswordReset.RequestPasswordReset}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
