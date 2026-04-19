 main
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
 feature/member4-auth-notifications
import AppRouter from "./routes/AppRouter";
import "./styles/app.css";

function App() {
  return (
 main
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </>

    <AuthProvider>
      <Navbar />
      <AppRouter />
    </AuthProvider>
 feature/member4-auth-notifications
  );
}

export default App;
