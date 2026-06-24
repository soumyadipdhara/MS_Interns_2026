import React from 'react'
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Employees() {
  const navigate = useNavigate();  
  const [employees, setEmployees] = useState([]);
  const loadEmployees = async () => {
  try {
    const res = await API.get("/employees/");
    setEmployees(res.data);
  } catch (error) {
    console.error("Failed to load employees:", error);
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
}, []);  
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    joining_date: new Date().toISOString().split("T")[0],
    status: "",
  });

const addEmployee = async () => {
  try {
    await API.post("/employees/", form);

    setForm({
      name: "",
      email: "",
      department: "",
      designation: "",
      joining_date: new Date().toISOString().split("T")[0],
      status: "",
    });

    loadEmployees();
  } catch (error) {
    console.error(
      "Failed to create employee:",
      error
    );
  }
};
const deleteEmployee = async (id) => {
  try {
    await API.delete(`/employees/${id}`);
    loadEmployees();
  } catch (error) {
    console.error(
      "Failed to delete employee:",
      error
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-evenly gap-8 bg-[#82A3A1]">
      <div className="bg-white shadow-lg rounded-3xl px-16 py-10 w-100">
        <h1 className="text-3xl font-bold text-center mb-6">
          Add Employee
        </h1>

        <div className="mb-4 flex flex-col">

          <input
            type="text"
            placeholder="Employee Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full mb-2 px-3 py-2 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full mb-2 px-3 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
              })
            }
            className="w-full mb-2 px-3 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Designation"
            value={form.designation}
            onChange={(e) =>
              setForm({
                ...form,
                designation: e.target.value,
              })
            }
            className="w-full mb-2 px-3 py-2 border rounded-lg"
          />
         <label className="mb-1 text-sm text-gray-600">
         Joining Date
        </label>     
          <input
            type="date"
            value={form.joining_date}
            onChange={(e) =>
              setForm({
                ...form,
                joining_date: e.target.value,
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
            <option value="" disabled>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={addEmployee}
            className="bg-slate-800 text-white py-2 rounded-lg w-1/3 hover:bg-slate-700 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-3xl px-16 py-10 w-150">
        <h1 className="text-3xl font-bold text-center mb-6">
          Employee List
        </h1>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500">
            No employees available
          </p>
        ) : (
          <ul className="space-y-2">
            {employees.map((employee) => (
              <li
                key={employee.id}
                className="p-3 rounded-lg bg-slate-100 border border-gray-200"
              >
                <h3 className="font-semibold text-2xl">
                  {employee.name}
                </h3>

                <p>ID: {employee.id}</p>

                <p>Email: {employee.email}</p>

                <p>Department: {employee.department}</p>

                <p>Designation: {employee.designation}</p>

                <p>Joining Date: {employee.joining_date}</p>

                <p>Status: {employee.status}</p>

                <button
                  onClick={() =>
  deleteEmployee(employee.id)
}
                  className="mt-2 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Employees;