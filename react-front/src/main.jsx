import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./features/store.js";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
