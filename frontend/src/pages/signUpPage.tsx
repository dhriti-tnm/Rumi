import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await register(form.name, form.username, form.email, form.password);
      navigate("/login", {state: {message:"Registered Successfully!"}});
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h2 className="text-xl font-bold">Register</h2>

        <input type="text" placeholder="Name" className="w-full border p-2" onChange={(e) => setForm({ ...form, name: e.target.value })}/>
        <input type="email" placeholder="Email" className="w-full border p-2" onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <input type="text" placeholder="Username" className="w-full border p-2" onChange={(e) => setForm({ ...form, username: e.target.value })}/>
        <input type="password" placeholder="Password" className="w-full border p-2" onChange={(e) => setForm({ ...form, password: e.target.value })}/>

        <button className="bg-green-500/80 hover:bg-green-500 text-white w-full p-2">
          Register
        </button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;