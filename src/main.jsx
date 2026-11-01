import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import NotaBaru from "./pages/NotaBaru/index.jsx";
import Dashboard from "./pages/Dashboard/index.jsx";
import Pelanggan from "./pages/Pelanggan/index.jsx";
import Produk from "./pages/Produk/index.jsx";
import Penjualan from "./pages/Penjualan/index.jsx";
import PrintPage from "./pages/Penjualan/PrintPage.jsx";
import {SupabaseProvider} from "./services/SupabaseContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/nota-baru",
    element: <NotaBaru />,
  },
  {
    path: "/penjualan",
    element: <Penjualan />,
  },
  {
    path: "/Produk",
    element: <Produk />,
  },
  {
    path: "/Pelanggan",
    element: <Pelanggan />,
  },
  {
    path: "/print",
    element: <PrintPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SupabaseProvider>
      <RouterProvider router={router} />
    </SupabaseProvider>
  </StrictMode>,
);
