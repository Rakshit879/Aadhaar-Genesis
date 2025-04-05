import React, { useState, useEffect } from "react";
import "../Styles/AdminDashboard.css";
import { db } from "../firebaseConfig";
import { collection, addDoc, doc, setDoc,getDocs } from "firebase/firestore"; // Make sure this import is present

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [childRecords, setChildRecords] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    timeOfBirth: "",
    gender: "",
    weight: "",
    fatherName: "",
    motherName: "",
    address: "",
    category: "",
    disability: "",
    hasBirthmark: "No",
    birthmarkLocation: "",
    certificateUrl: "",
  });

  useEffect(() => {
    const fetchChildren = async () => {
      if (activeTab === "view") {
        const querySnapshot = await getDocs(collection(db, "children"));
        const childrenData = querySnapshot.docs.map(doc => doc.data());
        setChildRecords(childrenData);
      }
    };
  
    fetchChildren();
  }, [activeTab]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First, create the document with an auto-generated ID
      const docRef = await addDoc(collection(db, "children"), {
        ...formData,
        createdAt: new Date(),
        uniqueId: "" // placeholder, we'll update this
      });

      // Then, update the same document to include its own ID as 'uniqueId'
      await setDoc(doc(db, "children", docRef.id), {
        ...formData,
        createdAt: new Date(),
        uniqueId: docRef.id
      });

      alert(`Child registered successfully ✅\nID: ${docRef.id}`);

      // Reset form
      setFormData({
        name: "",
        dob: "",
        timeOfBirth: "",
        gender: "",
        weight: "",
        fatherName: "",
        motherName: "",
        address: "",
        category: "",
        disability: "",
        hasBirthmark: "No",
        birthmarkLocation: "",
        certificateUrl:"",
      });

      setActiveTab("view");
    } catch (error) {
      console.error("Error saving to Firestore: ", error);
      alert("Failed to register child ❌");
    }
  };


  return (
    <div className="dashboard-container">
      {/* Tabs */}
      <div className="tab-buttons">
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "active" : ""}>
          Home
        </button>
        <button onClick={() => setActiveTab("register")} className={activeTab === "register" ? "active" : ""}>
          Register New Child
        </button>
        <button onClick={() => setActiveTab("view")} className={activeTab === "view" ? "active" : ""}>
          View All Data
        </button>
      </div>
      <h1 style={{ fontSize: "2.8rem", fontWeight: "bold", color: "#2b2d42" }}>
        DocXyy Hospital Dashboard
      </h1>
      <p>Welcome, Admin! This is your control panel for child registrations.</p>

      {/* Tab Content */}
      <div>
        {activeTab === "home" && <DashboardHome />}
        {activeTab === "register" && (
          <RegisterChildForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
        {activeTab === "view" && <ChildList childRecords={childRecords} />}
      </div>
    </div>
  );
};

const DashboardHome = () => (
  <div className="dashboard-home">
    <h2>Project Overview</h2>
    <p>
      DocXyy Hospital is committed to providing exceptional neonatal care with compassion, precision, and excellence.
      Our state-of-the-art facilities and highly trained medical professionals ensure every newborn receives the best possible start in life.
    </p>
    <p>
      This administrative dashboard is designed to streamline the process of child registration, record-keeping, and
      follow-up care. It empowers hospital staff to register newborns quickly, securely store vital information, and
      access child data with ease for future medical reference and documentation.
    </p>
    <p>
      With features such as detailed birth records, categorization by demographic factors, and tracking of birthmarks
      or disabilities, this platform supports informed medical care and administrative efficiency. Together, we strive
      to ensure that every child receives timely and personalized attention from the very first moment.
    </p>
  </div>
);


const RegisterChildForm = ({ formData, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="child-form" >
    <label>
      Child's Name
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
    </label>
    <label>
      Date of Birth
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
    </label>
    <label>
      Time of Birth
      <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleChange} required />
    </label>
    <label>
      Gender
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </label>
    <label>
      Weight (kg)
      <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
    </label>
    <label>
      Father's Name
      <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
    </label>
    <label>
      Mother's Name
      <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required />
    </label>
    <label>
      Address
      <textarea name="address" value={formData.address} onChange={handleChange} required />
    </label>
    <label>
      Category
      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="General">General</option>
        <option value="OBC">OBC</option>
        <option value="SC">SC</option>
        <option value="ST">ST</option>
        <option value="Other">Other</option>
      </select>
    </label>
    <label>
      Any Disability (optional)
      <input type="text" name="disability" value={formData.disability} onChange={handleChange} />
    </label>
    <label>
      Has Birthmark?
      <select name="hasBirthmark" value={formData.hasBirthmark} onChange={handleChange} required>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </label>
    {formData.hasBirthmark === "Yes" && (
      <label>
        Birthmark Location
        <input type="text" name="birthmarkLocation" value={formData.birthmarkLocation} onChange={handleChange} required />
      </label>
    )}
    <label>
      Certificate Url
      <input type="text" name="certificateUrl" value={formData.certificateUrl} onChange={handleChange} required/>
    </label>
    <button type="submit">Submit</button>
  </form>
);

const ChildList = ({ childRecords }) => (
  <div>
    <h3>Registered Children</h3>
    {childRecords.length === 0 ? (
      <p>No records found.</p>
    ) : (
      <table className="child-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Time</th>
            <th>Gender</th>
            <th>Weight</th>
            <th>Father</th>
            <th>Mother</th>
            <th>Address</th>
            <th>Category</th>
            <th>Disability</th>
            <th>Birthmark</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {childRecords.map((child, index) => (
            <tr key={index}>
              <td>{child.name}</td>
              <td>{child.dob}</td>
              <td>{child.timeOfBirth}</td>
              <td>{child.gender}</td>
              <td>{child.weight}</td>
              <td>{child.fatherName}</td>
              <td>{child.motherName}</td>
              <td>{child.address}</td>
              <td>{child.category}</td>
              <td>{child.disability || "None"}</td>
              <td>{child.hasBirthmark === "Yes" ? `Yes, ${child.birthmarkLocation}` : "No"}</td>
              <td>{child.certificateUrl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default AdminDashboard;
