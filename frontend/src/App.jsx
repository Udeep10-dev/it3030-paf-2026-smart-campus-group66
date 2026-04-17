import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import "./styles/app.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
