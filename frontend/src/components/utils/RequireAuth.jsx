'use client';

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/common";

export default function RequireAuth({ children }) {
  const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // avoid render while redirects
  }

  return <>{children}</>;
}
