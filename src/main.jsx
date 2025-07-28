import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { Bounce, ToastContainer } from "react-toastify";
import { AuthProvider } from "./hooks/useContext";
import { AdminProvider } from "./hooks/useAdminContext";

// const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!CLERK_KEY) {
//   throw new Error("Missing Clerk Publishable Key");
// }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
    <ToastContainer autoClose={1400} hideProgressBar={true} theme="dark" transition={Bounce}/>
  </StrictMode>
);
