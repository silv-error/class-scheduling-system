import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(`https://jsonplaceholder.typicode.com${queryKey[0]}`);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
