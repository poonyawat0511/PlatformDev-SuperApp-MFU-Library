"use server";

interface RegisterFormData {
  email: string;
  password: string;
  username: string;
}

interface RegisterResponse {
  Message: string;
}

export async function register(formData: FormData): Promise<RegisterResponse> {
  // Extract values from formData with type assertions
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  // Make a POST request to the registration endpoint
  const response = await fetch("http://localhost:8082/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, username }),
  });

  // Parse the response as JSON
  const result = await response.json();

  // Return appropriate response message based on the success of the request
  if (response.ok) {
    return { Message: "Registration successful" };
  } else {
    return { Message: result.message || "Registration failed" };
  }
}
