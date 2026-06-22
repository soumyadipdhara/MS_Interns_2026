import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
    <div 
     className="flex items-center justify-center p-3 pb-2 mx-auto text-cyan-100 
      bg-[#011936]"
    //className="flex px-4 border-b md:shadow-lg items-center relative"
    >
    <div className="flex gap-2 ">
      <button onClick={() => navigate("/employees")}
        className="border-b-2 border-transparent
         hover:text-white hover:border-blue-500 mx-1.5 
 cursor-pointer">
        Employees
      </button>

      <button onClick={() => navigate("/tasks")}
        className="border-b-2 border-transparent
         hover:text-white hover:border-blue-500 mx-1.5  cursor-pointer">
        Tasks
      </button>
    </div>
      <button onClick={logout}
    //   className="ml-auto text-lg font-bold md:py-0 py-4 cursor-pointer"
      className="ml-auto cursor-pointer border-b-2 border-transparent
         hover:text-red-400 hover:border-blue-500 mx-1.5">
        Logout
      </button>
    </div>
    </>
  );
}