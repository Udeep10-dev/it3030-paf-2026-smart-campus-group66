import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import AppRouter from "./routes/AppRouter";
import "./styles/app.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
