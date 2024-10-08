"use client";

export default function ProfilePage() {
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8082/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Force a full page reload to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Page</h2>
        <p>This is your profile page.</p>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
