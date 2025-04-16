'use client';

import { useResetPasswordConfirm } from '@/hooks';
import { Form } from '@/components/forms';

export default function PasswordResetConfirmForm({dictionary, uid, token}) {
  const { new_password, re_new_password, isLoading, onChange, onSubmit } = useResetPasswordConfirm(uid, token);
  const dictionaryPasswordResetConfirm = dictionary.PasswordResetConfirm;

  const config = [
    {
      labelText: dictionaryPasswordResetConfirm.NewPassword,
      labelId: 'new_password',
      type: 'password',
      value: new_password,
      required: true
    },
    {
      labelText: dictionaryPasswordResetConfirm.ConfirmNewPassword,
      labelId: 're_new_password',
      type: 'password',
      value: re_new_password,
      required: true
    },
  ];

  return(
    <Form
      config={config}
      isLoading={isLoading}
      btnText={dictionaryPasswordResetConfirm.Confirm}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
