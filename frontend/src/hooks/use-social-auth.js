import { useRouter, useSearchParams  } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";
import { toast } from "react-toastify";

export default function useSocialAuth(authenticate, provider) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const effectRan = useRef(false);

  useEffect(() => {
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (state && code && !effectRan.current) {
      authenticate({ provider, state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          toast.success('Sesión iniciada');
          router.push('/dashboard');
        })
        .catch(() => {
          toast.error('Falló el inicio de sesión');
          router.push('/auth/login');
        })
    }

    return () => {
      effectRan.current = true;
    }
  }, [authenticate, dispatch, provider, router, searchParams])
}
