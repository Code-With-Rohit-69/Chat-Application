import React, { useContext, useState } from "react";
import assets from "../assets/assets.js";
import "../components/animation.css";
import { AuthContext } from "../../context/AuthContext.jsx";

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    if (currState === "Login") {
      const credentials = { email, password };
      await login(currState, credentials);
    } else {
      const credentials = { name: fullName, email, password, bio };
      await login(currState, credentials);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col sm:flex-row items-center justify-center gap-8 backdrop-blur-2xl p-4">
      {/* Left Side - Logo */}
      <div className="flex-1 flex justify-center items-center relative">
        <img
          src={assets.logo_big}
          className="logo_big w-[min(60vw,200px)] sm:w-[min(30vw,180px)] max-w-full absolute"
          alt="Logo"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[400px] border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg duration-700"
        >
          <h2 className="font-medium text-xl flex justify-between items-center ">
            {currState}
            {isDataSubmitted && (
              <img
                onClick={() => setIsDataSubmitted(false)}
                src={assets.arrow_icon}
                className="w-5 cursor-pointer"
                alt="arrow"
              />
            )}
          </h2>

          {currState === "Sign up" && !isDataSubmitted && (
            <input
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              required
            />
          )}

          {!isDataSubmitted && (
            <>
              <input
                type="email"
                placeholder="Email address"
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </>
          )}

          {currState === "Sign up" && isDataSubmitted && (
            <textarea
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Provide a short bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              required
            ></textarea>
          )}

          <button
            className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
            type="submit"
          >
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" />
            <p className="">Agree to the terms of use & privacy policy.</p>
          </div>

          <div className="flex flex-col gap-2">
            {currState === "Sign up" ? (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  className="font-medium text-violet-500 cursor-pointer"
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                >
                  Login
                </span>
                `
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Create an account?
                <span
                  className="font-medium text-violet-500 cursor-pointer"
                  onClick={() => {
                    setCurrState("Sign up");
                  }}
                >
                  Sign up
                </span>
                `
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
