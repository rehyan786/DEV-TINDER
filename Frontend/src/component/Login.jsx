import React from 'react'
import { useState } from "react";
import axios from 'axios';
 


 

const Login = () => {
  const [Email, setEmail] = useState("");
const [Password, setPassword] = useState("");


const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/login",
      {
        Email,
        Password
      },
      {
        withCredentials: true
      }
    );
    console.log(res);
   
    // alert("Login successful!");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};





  
  return (
    <div>
       <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
 
        <h1 className="text-lg font-medium text-gray-900 text-center mb-1">Sign in</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Welcome back</p>
 
        <div className="space-y-4">
 
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={Email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200
                text-gray-900 placeholder-gray-300 focus:outline-none
                focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
            />
          </div>
 
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={Password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200
                text-gray-900 placeholder-gray-300 focus:outline-none
                focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
            />
          </div>
 
          <button
           onClick={handleLogin}
           
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700
              active:scale-95 text-white text-sm font-medium transition-all"
          >
            Login
          </button>
 
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login