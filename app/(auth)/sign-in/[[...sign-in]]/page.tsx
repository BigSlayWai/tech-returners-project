import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      {/* Hero Overlay */}
      <div className="hero-overlay bg-opacity-60"></div>

      {/* Hero Content */}
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-lg">
          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="mb-6 text-gray-600">
            Sign in to access your account and continue your journey.
          </p>

          {/* Clerk Sign In Component */}
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none",
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md",
                formFieldInput:
                  "border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}