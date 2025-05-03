'use client';

import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/common";

export default function RequireAuth({children}) {
  const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);

  if (isLoading) {
    return(
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      redirect('/auth/login');
    }
    return null;
  }

  return <>{children}</>;
}
