import React from 'react'
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Tasks() {
const navigate = useNavigate();
const [todos,setTodos]=useState([]);
const [employees, setEmployees] = useState([]);
const [form, setForm] = useState({
  title: "",
  description: "",
  status: "",
  dueDate: new Date().toISOString().split("T")[0],
  priority: "",
  employee_id: "",
});


const loadTasks = async () => {
  try {
    const res = await API.get("/tasks/");
    setTodos(res.data);
  } catch (error) {
    console.error("Failed to load tasks:", error);
  }
};

useEffect(() => {
   const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    navigate("/");
    return;
  }

  loadEmployees();
  loadTasks();
}, []);

  const loadEmployees = async () => {
  try {
    const res = await API.get("/employees/");
    setEmployees(res.data);
  } catch (error) {
    console.error(error);
  }
};

const updateStatus = async (taskId, status) => {
  try {
    await API.put(
      `/tasks/${taskId}/status?status=${status}`
    );

    loadTasks();
  } catch (error) {
    console.error(error);
  }
};
const deleteTask = async (id) => {
  try {
    await API.delete(`/tasks/${id}`);
    loadTasks();
  } catch (error) {
    console.error(error);
  }
};

const addTodo = async () => {
  if (
  !form.title ||
  !form.priority ||
  !form.employee_id ||
  !form.status
) {
  alert("Please fill all fields");
  return;
}
  try {
    await API.post("/tasks/", {
      title: form.title,
      description: form.description,
      priority: form.priority,
      due_date: form.dueDate,
      employee_id: Number(form.employee_id),
      status:form.status,
    });

    setForm({
      title: "",
      description: "",
      status: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "",
      employee_id: "",
    });

    loadTasks();
  } catch (error) {
    console.error("Failed to create task:", error);
  }
};
    return (
  <div className='min-h-screen flex  
  items-center justify-evenly gap-8 bg-[#82A3A1] '>
  <div className='bg-white shadow-lg rounded-3xl px-16 py-10 w-100'>
    <h1 className='text-3xl font-bold text-center mb-6'>Add Tasks</h1>
    <div className="mb-4 flex flex-col">
      <input
    type="text"
    placeholder="Task Title"
    value={form.title}
    onChange={(e) =>
      setForm({
        ...form,
        title: e.target.value,
      })
    }
    className="w-full mb-2 px-3 py-2 border rounded-lg"
  />

  <input
    type="text"
    placeholder="Description"
    value={form.description}
    onChange={(e) =>
      setForm({
        ...form,
        description: e.target.value,
      })
    }
    className="w-full mb-2 px-3 py-2 border rounded-lg"
  />
<select
  value={form.priority}
  onChange={(e) =>
    setForm({
      ...form,
      priority: e.target.value,
    })
  }
  className="w-full mb-2 px-3 py-2 border rounded-lg"
>
  <option value="" disabled >
    Select Priority
  </option>
  <option value="low">Low</option>
  <option value="high">High</option>
</select>
<select
  value={form.employee_id}
  onChange={(e) =>
    setForm({
      ...form,
      employee_id: e.target.value,
    })
  }
  className="w-full mb-2 px-3 py-2 border rounded-lg"
>
  <option value="" disabled>
    Assign Employee
  </option>

  {employees
    .filter((emp) => emp.status === "Active")
    .map((employee) => (
      <option
        key={employee.id}
        value={employee.id}
      >
        {employee.name}
      </option>
    ))}
</select>
  <select
    value={form.status}
    onChange={(e) =>
      setForm({
        ...form,
        status: e.target.value,
      })
    }
    className="w-full mb-2 px-3 py-2 border rounded-lg"
  >
    <option value="" disabled >
    Select Status
  </option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    {/* <option value="Completed">Completed</option> */}
  </select>
  <label className="mb-1 text-sm text-gray-600">
  Due Date
</label>  
  <input
    type="date"
    value={form.dueDate}
    onChange={(e) =>
      setForm({
        ...form,
        dueDate: e.target.value,
      })
    }
    className="w-full mb-2 px-3 py-2 border rounded-lg"
  />
      <button onClick={addTodo} className='bg-slate-800 text-white  
      py-2 rounded-lg w-1/3
      hover:bg-slate-700 cursor-pointer'>Add</button>
    </div>
   
    
    </div>  
      <div className='bg-white shadow-lg rounded-3xl px-16 py-10 w-150'>
         <h1 className='text-3xl font-bold text-center mb-6'>Task List</h1>

  {todos.length === 0 ? (
    <p className="text-center text-gray-500">
      No tasks available
    </p>
  ) :(<ul className='space-y-2'>
      {
        todos.map((todo)=>(
          <li
          key={todo.id}
          className='flex items-center p-3 rounded-lg bg-slate-100
          border border-gray-200'
          >
        <input
        type="checkbox"
        checked={todo.status === "Completed"}
        onChange={() =>
          updateStatus(
            todo.id,
            todo.status === "Completed"
              ? "Pending"
              : "Completed"
          )
        }
        className="mr-2 h-5 w-5 text-blue-600"
      />
            <div className={`grow ${todo.status=="Completed"? 
            "line-through text-gray-500":"text-gray-800"}`}>
    <h3 className="font-semibold text-3xl">
      {todo.title}
    </h3>

    <p className="text-sm text-gray-600">
      {todo.description}
    </p>
    <p className="text-sm">
      Priority: {todo.priority}
    </p>
    <p className="text-sm">
  Assigned To: {
    employees.find(
      (emp) => emp.id === todo.employee_id
    )?.name || "Unknown"
  }
</p>
    <p className="text-sm font-medium">
      Status: {todo.status}
    </p>

    <p className="text-sm">
      Due: {todo.due_date}
    </p>
  </div>
            <button onClick={() => deleteTask(todo.id)}
            className='ml-2 border-none p-2 rounded-lg bg-red-500
            cursor-pointer hover:bg-red-600'
            >
              delete
            </button>
          </li>
        ))
      }

      
    </ul>)}
      </div>

  </div>    

    )
}
export default Tasks