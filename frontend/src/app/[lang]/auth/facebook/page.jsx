'use client';

import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice";
import { useSocialAuth } from "@/hooks";
import { Spinner } from "@/components/common";

export default function PageFacebook({params}) {
  const [facebookAuthenticate] = useSocialAuthenticateMutation();
  useSocialAuth(facebookAuthenticate, 'facebook');

  return (
    <div className="my-8">
      <Spinner lg />
    </div>
  );
}
