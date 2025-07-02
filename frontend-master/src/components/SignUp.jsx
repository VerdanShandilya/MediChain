import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loadar from "../components/Loadar";
import SignUpImage from "../assets/images/signupImage.jpg";
import GoogleIcon from "../assets/images/googleIcon.png";

export default function SignUp() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [type, setType] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password || !location || !contact || !type) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `https://medichain-0usn.onrender.com/api/signup`,
        { name, email, password, location, contact, type }
      );
      console.log(data);
      navigate("/api/login");
      

      toast.success("Sign Up Successful!");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row max-w-4xl bg-white shadow-3xl rounded-3xl overflow-hidden">
        <div className="md:w-1/2 p-4 flex items-center justify-center">
          <img
            src={SignUpImage}
            alt="Sign Up"
            className="w-full max-w-sm h-auto"
          />
        </div>
        <div className="md:w-1/2 p-4">
          <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4 "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contact"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-300 rounded-2xl mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            id="role"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select your category</option>
            <option value="Hospital">Hospital</option>
            <option value="Vendor">Vendor</option>
          </select>
          <p className="text-center mb-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Sign In
            </Link>
          </p>
          {loading ? (
            <Loadar />
          ) : (
            <div className="flex justify-center items-center gap-2">
              <button
                className="p-3 text-sm bg-blue-500 text-white rounded-lg w-1/4"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
              <div className="text-center mt-3">
            <h3 className="text-sm">Or</h3>
          </div>
              <img
                src={GoogleIcon}
                alt="Google Sign Up"
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
