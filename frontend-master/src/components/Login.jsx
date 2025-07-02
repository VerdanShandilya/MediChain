import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loadar from "../components/Loadar";
import LoginImage from "../assets/images/LoginImage.jpg";
import GoogleIcon from "../assets/images/googleIcon.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState("Hospital");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);

      const response = await axios.post(
        `https://medi-chain-9x1d.vercel.app/api/login`,
        { email, password, type }
      );
      const data = await response.data;
      localStorage.setItem("user", JSON.stringify(data));

      if (data.type === "Hospital") {
        window.location.href = "/hospital/viewInventory";
      }
      if (data.type === "Vendor") {
        window.location.href = "/vendor/dispatch";
      }
      if (data.type === "Government") {
        window.location.href = "/government/dashboard";
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row max-w-4xl bg-white shadow-3xl rounded-3xl overflow-hidden">
        <div className="md:w-1/2 p-4 flex items-center justify-center">
          <img
            src={LoginImage}
            alt="Login"
            className="w-full max-w-sm h-auto"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          >
            <option value="Vendor">Vendor</option>
            <option value="Hospital">Hospital</option>
            <option value="Government">Government</option>
          </select>
          <input
            type="text"
            placeholder="Email"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-center mb-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
          {loading ? (
            <Loadar />
          ) : (
            <div className="flex justify-center items-center gap-2">
              <button
                className="p-3 text-sm bg-blue-500 text-white rounded-lg w-1/4 "
                onClick={handleLogin}
              >
                Sign In
              </button>
              <div className="text-center mt-3 ">
                <h3 className="text-sm">Or</h3>
              </div>
              <img
                src={GoogleIcon}
                alt="Google Sign In"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Zoom}
        limit={1}
      />
    </div>
  );
}
