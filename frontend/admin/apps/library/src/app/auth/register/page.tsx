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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://i.ibb.co/WpZBbjs/mfu-bg2.png')`,
        backgroundSize: '80%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-2 text-sm text-black"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-black" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm text-black"
              htmlFor="password"
            >
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
            className="w-full bg-black text-white py-2 rounded-full hover:bg-black-100 transition duration-300"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-black-100">
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
