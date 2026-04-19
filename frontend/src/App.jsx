import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import AppRouter from "./routes/AppRouter";
import "./styles/app.css";

function App() {
  return (

      <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
  

      <Navbar />
      <AppRouter />
      </AuthProvider>
  );
}

export default App;
