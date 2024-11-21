"use client";

import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryDevtoolsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const QueryClients = new QueryClient();

  return (
    <QueryClientProvider client={QueryClients}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryDevtoolsProvider;
