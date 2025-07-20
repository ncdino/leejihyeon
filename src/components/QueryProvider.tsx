"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

function QueryProvider({ children }: Props) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools
        initialIsOpen={process.env.NODE_ENV === "development"}
      /> */}
    </QueryClientProvider>
  );
}

export default QueryProvider;
