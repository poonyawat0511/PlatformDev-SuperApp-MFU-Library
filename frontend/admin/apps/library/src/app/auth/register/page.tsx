"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "./action"; // Import the register function

// Define the types for the response from the register function
interface RegisterResponse {
  Message: string;
}

// Define the type for the component's state
interface RegisterState {
  message: string;
}

export default function RegisterPage() {
  const [state, setState] = useState<RegisterState>({ message: "" });
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      // Call the register function and expect it to return RegisterResponse
      const result: RegisterResponse = await register(formData);

      if (result.Message === "Registration successful") {
        // After successful registration, redirect to login page
        router.push("/login");
      } else {
        // Show error message
        setState({ message: result.Message });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setState({
        message: "An error occurred during registration. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-2 text-sm text-gray-600"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              type="email"
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
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
