import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, setUser, finishInitialLoad } from '@/redux/features/authSlice';
import { useVerifyMutation } from '@/redux/features/authApiSlice';

export default function useVerify() {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(async () => {
        dispatch(setAuth());

        // Fetch user data after successful verification
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/me/`, {
            credentials: 'include',
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch(setUser(userData));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, [dispatch, verify]);
}
