import React from 'react'
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Tasks() {
const role = localStorage.getItem("role");  
const navigate = useNavigate();
const [todos,setTodos]=useState([]);
const [employees, setEmployees] = useState([]);
const [editingTask, setEditingTask] = useState(null);
const [sortBy, setSortBy] = useState("default");
const [employeeFilter, setEmployeeFilter] = useState("all");
useEffect(() => {
  setCurrentPage(1);
}, [sortBy, employeeFilter]);
const [form, setForm] = useState({
  title: "",
  description: "",
  status: "",
  dueDate: new Date().toISOString().split("T")[0],
  priority: "",
  employee_id: "",
});
const saveTaskEdit = async () => {
  try {
    await API.put(
      `/tasks/${editingTask.id}`,
      editingTask
    );

    setEditingTask(null);
    loadTasks();
  } catch (error) {
    console.error(error);
  }
};
const [currentPage, setCurrentPage] = useState(1);
const tasksPerPage = 2;

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
const filteredTodos = todos.filter(
  (todo) =>
    employeeFilter === "all" ||
    todo.employee_id ===
      Number(employeeFilter)
);

const sortedTodos = [...filteredTodos];

if (sortBy === "due") {
  sortedTodos.sort((a, b) => {
    if (a.status === "Completed" && b.status !== "Completed")
      return 1;

    if (a.status !== "Completed" && b.status === "Completed")
      return -1;

    return (
      new Date(a.due_date) -
      new Date(b.due_date)
    );
  });
}
else if (sortBy === "priority") {
  sortedTodos.sort((a, b) => {
    if (a.status === "Completed" && b.status !== "Completed")
      return 1;

    if (a.status !== "Completed" && b.status === "Completed")
      return -1;

    const priorityRank = {
      high: 2,
      low: 1,
    };

    return (
      priorityRank[b.priority] -
      priorityRank[a.priority]
    );
  });
}
else {
  sortedTodos.sort((a, b) => {
    if (a.status === "Completed" && b.status !== "Completed")
      return 1;

    if (a.status !== "Completed" && b.status === "Completed")
      return -1;

    return 0;
  });
}
const totalPages = Math.ceil(
  sortedTodos.length / tasksPerPage
);

const indexOfLastTask =
  currentPage * tasksPerPage;

const indexOfFirstTask =
  indexOfLastTask - tasksPerPage;

const currentTasks = sortedTodos.slice(
  indexOfFirstTask,
  indexOfLastTask
);
    return (
  <div className='min-h-screen flex  
  items-start justify-evenly gap-8 bg-[#82A3A1] pt-5'>
   {role === "admin" && ( 
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
   
    
    </div>  )}
      <div className='bg-white shadow-lg rounded-3xl px-8 py-10 w-150'>
         <h1 className='text-3xl font-bold text-center mb-6'>Task List</h1>
      <div className="flex justify-start gap-3 mb-4">

  <select
    value={sortBy}
    onChange={(e) =>
      setSortBy(e.target.value)
    }
    className="border rounded-lg px-3 py-2"
  >
    <option value="default" >
      Sort By
    </option>

    <option value="due">
      Due Date
    </option>

    <option value="priority">
      Priority
    </option>
  </select>

  <select
    value={employeeFilter}
    onChange={(e) =>
      setEmployeeFilter(
        e.target.value
      )
    }
    className="border rounded-lg px-3 py-2"
  >
    <option value="all">
      All Employees
    </option>

    {employees.map((employee) => (
      <option
        key={employee.id}
        value={employee.id}
      >
        {employee.name}
      </option>
    ))}
  </select>

</div>
  {todos.length === 0 ? (
    <p className="text-center text-gray-500">
      No tasks available
    </p>
  ) :(<ul className='space-y-2'>
      {
        currentTasks.map((todo)=>(
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
  {role === "admin" && (
  <div className="flex flex-col gap-2">

            <button
            onClick={() => setEditingTask(todo)}
            className="p-2 rounded-lg bg-blue-500 text-white
            hover:bg-blue-600 cursor-pointer ml-2"
          >
            Edit
          </button>
            <button onClick={() => deleteTask(todo.id)}
            className='ml-2 border-none p-2 rounded-lg bg-red-500
            cursor-pointer hover:bg-red-600'
            >
              delete
            </button>
            </div>)}
          </li>
        ))
      }

      
    </ul>)}
    <div className="flex justify-center gap-4 mt-6">
  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
    className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50 cursor-pointer"
  >
    Previous
  </button>

  <span className="flex items-center">
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
    className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50 cursor-pointer"
  >
    Next
  </button>
</div>
      </div>
      {editingTask && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-2xl w-[500px]">
      <h2 className="text-2xl font-bold mb-4">
        Edit Task
      </h2>

      <div className="space-y-3">

        <input
          type="text"
          value={editingTask.title}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              title: e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          value={editingTask.description}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              description: e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <select
          value={editingTask.priority}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              priority: e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        >
          <option value="low">Low</option>
          <option value="high">High</option>
        </select>

        <select
          value={editingTask.status}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              status: e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <input
          type="date"
          value={editingTask.due_date}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              due_date: e.target.value,
            })
          }
          className="w-full border rounded-lg p-2"
        />

        <select
          value={editingTask.employee_id}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              employee_id: Number(
                e.target.value
              ),
            })
          }
          className="w-full border rounded-lg p-2"
        >
          {employees
            .filter(
              (emp) => emp.status === "Active"
            )
            .map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.name}
              </option>
            ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={saveTaskEdit}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>

          <button
            onClick={() =>
              setEditingTask(null)
            }
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

  </div>    

    )
}
export default Tasks