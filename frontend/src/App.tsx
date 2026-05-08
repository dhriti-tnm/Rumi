import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/loginPage";
import Register from "./pages/signUpPage";
import Dashboard from "./pages/home";
import JournalPage from "./pages/journalPage";
import { ProtectedRoute } from "./routes/protectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journals"
          element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;