'use client';

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common";
import { toast } from "react-toastify";

export default function RequireAuth({children}) {
  const router = useRouter();
  console.log('app', useAppSelector(state => state.auth))
  const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);

  if (isLoading) {
    return(
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   toast.error('Must be logged in');
  //   router.push('/auth/login');
  // }

  return <>{children}</>;
}
