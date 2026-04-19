import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter";
import "./styles/app.css";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </>
  );
}

export default App;
