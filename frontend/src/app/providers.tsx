"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

/**
 * Providers component that wraps the application with React Query
 * This component must be a client component ("use client")
 */
export default function Providers({ children }: { children: ReactNode }) {
  // Create a QueryClient instance with default options
  // Using useState to ensure the client is created only once per component instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache time: unused data is kept in cache for 10 minutes
            gcTime: 10 * 60 * 1000, // Previously called cacheTime
            // Retry failed requests 1 time
            retry: 1,
            // Refetch on window focus (useful for keeping data fresh)
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: true,
          },
          mutations: {
            // Retry failed mutations 0 times (mutations should not retry by default)
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - only shown in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

