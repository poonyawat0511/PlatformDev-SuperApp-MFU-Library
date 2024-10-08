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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm text-gray-600"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          {state.message && (
            <div className="text-red-500 text-sm">{state.message}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
