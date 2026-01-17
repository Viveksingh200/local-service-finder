import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex p-4 justify-center bg-gray-200">
      <div className="flex bg-white p-10 px-14 rounded-xl items-center">
        {/* logo */}

        {/* heading */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-center gap-1">
            <h2 className="font-bold text-3xl mx-auto">Welcome Back</h2>
            <p className="text-gray-400 md:text-sm   text-xs">
              Enter your phone number and password to access your account
            </p>
          </div>

          {/* input form */}
          <div className="flex flex-col mt-1">
            <label htmlFor="" className="">
              Phone Number
            </label>
            <input
              type="text"
              className="px-4 py-2 mt-2 border-2 border-gray-200 rounded-md outline-none focus:ring focus:ring-blue-600 "
            />
            <label htmlFor="" className="pt-2">
              Password
            </label>
            <input
              type="password"
              className="px-4 py-2 mt-2 border-2 border-gray-200 rounded-md outline-none focus:ring focus:ring-blue-600"
            />
          </div>

          <button className="bg-blue-600 rounded-lg px-4 py-2 text-white text-lg tracking-wide font-semibold cursor-pointer">Log In</button>

          <p className="text-xs text-gray-500 self-center">Don&apos;t Have An Account? Register Now.</p>
        </div>
        {/* footer */}
        <div className="pl-10 lg:block hidden">
          {/* Login banner */}
          <img src="/login-banner.png" alt="" className="h-120 w-120" />
        </div>
      </div>
    </div>
  );
};

export default Login;
