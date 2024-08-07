// src/components/Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";

const Home = () => {
  const [students, setStudents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchStudentNumber, setSearchStudentNumber] = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false);

  const [newStudent, setNewStudent] = useState({
    studentNumber: "",
    firstName: "",
    LastName: "",
    Address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "",
  });

  useEffect(() => {
    // Fetch students from the Express API when the component mounts
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/students");
        setStudents(response.data.students);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []); // empty dependency array means this effect runs once on mount
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/students/${selectedStudent._id}`
      );
      // Fetch updated students after deletion
      const response = await axios.get("http://localhost:3000/students");

      setStudents(response.data.students);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting student:", error);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setNewStudent(student);
    setShowEditModal(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/students/${selectedStudent._id}`,
        newStudent
      );
      // Fetch updated students after edit
      const response = await axios.get("http://localhost:3000/students");
      setStudents(response.data.students);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing student:", error);
      setShowEditModal(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    // Reset the newStudent state to clear the form
    setNewStudent({
      studentNumber: "",
      firstName: "",
      LastName: "",
      Address: "",
      city: "",
      phoneNumber: "",
      email: "",
      program: "",
    });
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleConfirmAdd = async () => {
    try {
      // Make a POST request to add a new student
      await axios.post("http://localhost:3000/students", newStudent);
      const response = await axios.get("http://localhost:3000/students");
      setStudents(response.data.students);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding student:", error);
      setShowAddModal(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewStudent({
      studentNumber: "",
      firstName: "",
      LastName: "",
      Address: "",
      city: "",
      phoneNumber: "",
      email: "",
      program: "",
    });
  };

  const handleInputChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };
  const handleFindClick = async () => {
    try {
      const foundStudent = students.find(
        (student) => student.studentNumber === searchStudentNumber
      );
  
      if (foundStudent) {
        setFoundStudent(foundStudent);
        setShowNotFoundPopup(false); // Hide the not found pop-up if previously shown
      } else {
        setFoundStudent(null);
        setShowNotFoundPopup(true);
      }
    } catch (error) {
      console.error("Error finding student:", error);
      setFoundStudent(null);
      setShowNotFoundPopup(true);
    }
  };

  return (
    <div>
      <h1>Student Records</h1>
      <button onClick={handleAddClick}>Add Student</button>
      <label>
        Find Student by Student Number:
        <input
          type="text"
          value={searchStudentNumber}
          onChange={(e) => setSearchStudentNumber(e.target.value)}
        />
      </label>
      <button onClick={handleFindClick}>Find</button>
      {/* Conditionally render the found student details or the table */}
    {foundStudent ? (
      <div>
        <h2> Student Data Found</h2>
        <p>Student Number: {foundStudent.studentNumber}</p>
        <p>First Name: {foundStudent.firstName}</p>
        <p>Last Name: {foundStudent.lastName}</p>
        <p>Address: {foundStudent.address}</p>
        <p>City: {foundStudent.city}</p>
        <p>Phone Number: {foundStudent.phoneNumber}</p>
        <p>Email: {foundStudent.email}</p>
        <p>Program: {foundStudent.program}</p>
        <button onClick={() => setFoundStudent(null)}>Back</button>
      </div>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Program</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentNumber}</td>
              <td>{student.firstName}</td>
              <td>{student.LastName}</td>
              <td>{student.Address}</td>
              <td>{student.city}</td>
              <td>{student.phoneNumber}</td>
              <td>{student.email}</td>
              <td>{student.program}</td>
              <td>
                <button onClick={() => handleEditClick(student)}>Edit</button>
                <button onClick={() => handleDeleteClick(student)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>You are about to delete a student record. Are you sure?</p>
            <button onClick={handleConfirmDelete}>Confirm</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Student</h2>
            <label>
              Student Number:
              <input
                type="text"
                name="studentNumber"
                value={newStudent.studentNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={newStudent.firstName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="LastName"
                value={newStudent.LastName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="Address"
                value={newStudent.Address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={newStudent.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={newStudent.phoneNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Program:
              <input
                type="text"
                name="program"
                value={newStudent.program}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleConfirmEdit}>Save Changes</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Student</h2>
            <label>
              Student Number:
              <input
                type="text"
                name="studentNumber"
                value={newStudent.studentNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={newStudent.firstName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="LastName"
                value={newStudent.LastName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="Address"
                value={newStudent.Address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={newStudent.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={newStudent.phoneNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Program:
              <input
                type="text"
                name="program"
                value={newStudent.program}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleConfirmAdd}>Add Student</button>
            <button onClick={handleCancelAdd}>Cancel</button>
          </div>
        </div>
      )}
      {showNotFoundPopup && (
          <div className="popup">
            <p>Student data not found.</p>
            <button onClick={() => setShowNotFoundPopup(false)}>OK</button>
          </div>
        )}
    </div>
  );
};

export default Home;
