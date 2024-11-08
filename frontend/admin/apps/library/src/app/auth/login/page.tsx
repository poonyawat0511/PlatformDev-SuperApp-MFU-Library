"use client";

import { FormEvent, useState } from "react";
import { login } from "./action";

interface LoginResult {
  Message: string;
}

export default function LoginPage() {
  const [state, setState] = useState<{ message: string }>({ message: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const result: LoginResult = await login(formData);

      if (result.Message === "Login successful") {
        // Redirect to the dashboard or any other protected page
        window.location.href = "/";
      } else {
        setState({ message: result.Message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setState({
        message: "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ 
        backgroundImage: `url('https://i.ibb.co/WpZBbjs/mfu-bg2.png')`, 
        backgroundSize: 'cover', // ทำให้ภาพขยายเต็มจอ
        backgroundPosition: 'center', // ให้ภาพอยู่ตรงกลาง
        backgroundRepeat: 'no-repeat' 
      }}
    >
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://i.ibb.co/hRMG4kt/mfu-logo.png"
            alt="mfu-logo"
            className="h-20 w-auto"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-black" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="w-full px-3 py-2 border border-black-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-black" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          {state.message && (
            <div className="text-red-500 text-sm">{state.message}</div>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full hover-gray transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-black-100">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-600 hover:underline hover:text-blue-500"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
