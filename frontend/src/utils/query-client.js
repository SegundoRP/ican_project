import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Global error handler
const handleError = (error) => {
  const message = error?.response?.data?.detail ||
                 error?.response?.data?.message ||
                 error?.response?.data?.error ||
                 error.message ||
                 'An error occurred';

  // Handle specific error codes
  if (error?.response?.status === 401) {
    toast.error('Session expired. Please login again.');
    // Check if we're not already on login page to avoid redirect loop
    if (!window.location.pathname.includes('/login')) {
      // Store current location for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/auth/login';
    }
  } else if (error?.response?.status === 403) {
    toast.error('You do not have permission to perform this action.');
  } else if (error?.response?.status === 429) {
    toast.error('Too many requests. Please slow down.');
  } else if (error?.response?.status === 404) {
    toast.error('Resource not found.');
  } else if (error?.response?.status === 400) {
    // Handle validation errors
    if (error?.response?.data && typeof error.response.data === 'object') {
      const errors = Object.entries(error.response.data)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(', ')}`;
          }
          return `${field}: ${messages}`;
        })
        .join('\n');
      toast.error(errors || message);
    } else {
      toast.error(message);
    }
  } else if (error?.response?.status >= 500) {
    toast.error('Server error. Please try again later.');
  } else {
    toast.error(message);
  }
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache time: 10 minutes
      cacheTime: 1000 * 60 * 10,
      // Retry failed requests 3 times (but not for 4xx errors)
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          // Don't retry client errors
          return false;
        }
        return failureCount < 3;
      },
      // Retry delay doubles each time
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Global error handler for queries
      onError: handleError,
    },
    mutations: {
      // Global error handler for mutations
      onError: handleError,
    },
  },
});

// Global error handler for queries
queryClient.setMutationDefaults(['global'], {
  mutationFn: async () => {
    // This is a placeholder
  },
});

// Helper function to invalidate queries
export const invalidateQueries = (queryKey) => {
  return queryClient.invalidateQueries(queryKey);
};

// Helper function to prefetch data
export const prefetchQuery = (queryKey, queryFn) => {
  return queryClient.prefetchQuery(queryKey, queryFn);
};
