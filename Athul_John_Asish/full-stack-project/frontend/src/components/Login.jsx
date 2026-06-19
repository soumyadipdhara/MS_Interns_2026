import { useState } from "react"
import React from 'react'
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [islogin,setLogin]=useState(true)

    const base ="w-1/2 p-2.5 text-base cursor-pointer rounded-t-lg";
    const active="bg-slate-800 text-white"
    const inactive="bg-gray-100 text-black"

    const navigate = useNavigate();
    const [form, setForm] = useState({
    username: "",
    password: "",
  });
    const [registerform, registerSetForm] = useState({
    username: "",
    password: "",
    email: "",
  });
    const login = async () => {
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      navigate("/employees");
    } catch {
      alert("Invalid Credentials");
    }
  };
    const register = async () => {
    await API.post("/auth/register", registerform);

    alert("Registered");
    setLogin(true);    
    navigate("/");
  };
  return (
    <div className="bg-[#82A3A1]">
    <div className="flex flex-col">
    {/* <div><h1 className="text-center font-bold text-4xl text-[#011936] bg-[#C0DFA1] pt-3 pb">
    WorkSphere - Employee & Task Tracking Platform
  </h1>
</div> */}
 <div className="flex justify-center items-center h-screen w-screen">    
        <div className="bg-white p-5 rounded-lg w-100">
            <div className="flex justify-between mb-5">
                <button onClick={()=>setLogin(true)} className={`${base}
                 ${islogin?active:inactive}`}>Login</button>
                <button onClick={()=>setLogin(false)} className={`${base}
                 ${!islogin?active:inactive}`}>Signup</button>
            </div>
            {islogin?<>
            <div className="flex flex-col">
                <h2 className="mb-5 text-[22px] font-medium ">Login form</h2>
                <input  placeholder="Username" onChange={(e) =>
                setForm({
                ...form,
                username: e.target.value,
                })
                }
                className="p-2.5 mb-2.5 rounded-lg border border-gray-300"></input>
                <input type="password" placeholder="Password" onChange={(e) =>
                setForm({
                ...form,
                password: e.target.value,
                })
                }className="p-2.5 mb-2.5 rounded-lg border border-gray-300"></input>
                <button className="bg-slate-800 text-white p-2.5 
                rounded-lg mt-3 cursor-pointer" onClick={login}>Login</button>
                <div className="flex justify-center mt-3 gap-2 mb-2">
                    <p className="text-center">Not a Member?  </p>
                    <button onClick={()=>setLogin(false)} className="text-blue-500 underline cursor-pointer"
                    >Signup now</button>
                </div>
                
            </div>
            </>:
        <>
        <div className="flex flex-col">
                <h2 className="mb-5 text-[22px] font-medium">Registration</h2>
                <input type="username" placeholder="Username" 
                className="p-2.5 mb-2.5 rounded-lg border border-gray-300"
                onChange={(e) =>
                registerSetForm({
                ...registerform,
                username: e.target.value,
                })}></input>
                <input type="email" placeholder="Email" 
                className="p-2.5 mb-2.5 rounded-lg border border-gray-300"
                onChange={(e) =>
                registerSetForm({
                ...registerform,
                email: e.target.value,
                })}></input>
                <input type="password" placeholder="Password" 
                className="p-2.5 mb-2.5 rounded-lg border border-gray-300"
                onChange={(e) =>
                registerSetForm({
                ...registerform,
                password: e.target.value,
                })}></input>
                <button onClick={register}
                className="bg-slate-800 text-white p-2.5 rounded-lg mt-3 cursor-pointer">Sign up</button>
            </div>
        </>
            }
        </div>
        </div>
    </div>
    </div>
  )
}

export default Login