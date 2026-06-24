import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    joining_date: new Date().toISOString().split("T")[0],
    status: "",
  });

  const [editingEmployee, setEditingEmployee] = useState(null);

  const loadEmployees = async () => {
    try {
      const res = await API.get(
        `/employees/?search=${search}`
      );
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
  }, [search]);

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

  const saveEdit = async () => {
    try {
      await API.put(
        `/employees/${editingEmployee.id}`,
        editingEmployee
      );

      setEditingEmployee(null);
      loadEmployees();
    } catch (error) {
      console.error(
        "Failed to update employee:",
        error
      );
    }
  };
const totalPages = Math.ceil(
  employees.length / employeesPerPage
);

const indexOfLastEmployee =
  currentPage * employeesPerPage;

const indexOfFirstEmployee =
  indexOfLastEmployee - employeesPerPage;

const currentEmployees = employees.slice(
  indexOfFirstEmployee,
  indexOfLastEmployee
);
useEffect(() => {
  setCurrentPage(1);
}, [search]);
  return (
    <div className="min-h-screen bg-[#82A3A1] p-8">
      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        {/* Add Employee */}

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Add Employee
          </h2>

          <div className="space-y-3">
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
              className="w-full border rounded-lg p-2"
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
              className="w-full border rounded-lg p-2"
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
              className="w-full border rounded-lg p-2"
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
              className="w-full border rounded-lg p-2"
            />

            <input
              type="date"
              value={form.joining_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  joining_date: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Status</option>
              <option value="Active">
                Active
              </option>
              <option value="Inactive">
                Inactive
              </option>
            </select>

            <button
              onClick={addEmployee}
              className="bg-slate-800 text-white py-2 rounded-lg w-1/2 cursor-pointer"
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Employees
            </h2>

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg px-3 py-2 w-64"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    {employee.id}
                  </TableCell>

                  <TableCell>
                    {employee.name}
                  </TableCell>

                  <TableCell>
                    {employee.email}
                  </TableCell>

                  <TableCell>
                    {employee.department}
                  </TableCell>
                  <TableCell>
                    {employee.designation}
                  </TableCell>

                  <TableCell>
                    {employee.status}
                  </TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setEditingEmployee(
                          employee
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteEmployee(
                          employee.id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {employees.length > 0 && (
  <Pagination className="mt-6">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        />
      </PaginationItem>

      <PaginationItem>
        <span className="px-4 font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </PaginationItem>

      <PaginationItem>
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1);
            }
          }}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)}

          {employees.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              No employees found
            </p>
          )}
        </div>
      </div>

      {/* Edit Dialog */}

      <Dialog
        open={!!editingEmployee}
        onOpenChange={() =>
          setEditingEmployee(null)
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Employee
            </DialogTitle>
          </DialogHeader>

          {editingEmployee && (
            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                value={editingEmployee.name}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={editingEmployee.email}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    email: e.target.value,
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={editingEmployee.department}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    department:
                      e.target.value,
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                value={editingEmployee.designation}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    designation:
                      e.target.value,
                  })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={editingEmployee.status}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>

              <button
                className="bg-slate-800 text-white py-2 rounded-lg  w-1/2
                hover:bg-slate-700 cursor-pointer"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Employees;