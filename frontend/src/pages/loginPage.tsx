import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => {
        setMessage(null);
      }, 4000);
    }
  }, [location.state]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {message && (
        <div className="fixed top-5 right-5 bg-green-100 text-green-700 px-4 py-2 rounded shadow-lg transition-all duration-300">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h2 className="text-xl font-bold">Login</h2>

        <input type="text" placeholder="Username" className="w-full border p-2" onChange={(e) => setForm({ ...form, username: e.target.value })} />

        <input type="password" placeholder="Password" className="w-full border p-2" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="bg-blue-500/80 hover:bg-blue-500 text-white w-full p-2">
          Login
        </button>

        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;