import React from 'react'
import { useState, useEffect } from "react";

function Tasks() {
const [todos,setTodos]=useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: new Date().toISOString().split("T")[0],
  });

  const addTodo = () => {
    if (form.title.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title: form.title,
          description: form.description,
          status: form.status,
          dueDate: form.dueDate,
          completed: false,
        },
      ]);

      setForm({
        title: "",
        description: "",
        status: "Pending",
        dueDate: new Date().toISOString().split("T")[0],
      });
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
    value={form.status}
    onChange={(e) =>
      setForm({
        ...form,
        status: e.target.value,
      })
    }
    className="w-full mb-2 px-3 py-2 border rounded-lg"
  >
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    {/* <option value="Completed">Completed</option> */}
  </select>

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
            <input type='checkbox'
            checked={todo.status=="Completed"}
            onChange={()=>setTodos(
              todos.map((t)=>(
                t.id==todo.id?{...t,
                  status:t.status==="Completed"?"Pending":"Completed",}:t
                
              ))
            )}
            className='mr-2 h-5 w-5 text-blue-600'/>
            <div className={`grow ${todo.status=="Completed"? 
            "line-through text-gray-500":"text-gray-800"}`}>
    <h3 className="font-semibold text-3xl">
      {todo.title}
    </h3>

    <p className="text-sm text-gray-600">
      {todo.description}
    </p>

    <p className="text-sm">
      status: {todo.status}
    </p>

    <p className="text-sm">
      Due: {todo.dueDate}
    </p>
  </div>
            <button onClick={()=>setTodos(
              todos.filter((t)=>t.id!=todo.id)
            )}
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