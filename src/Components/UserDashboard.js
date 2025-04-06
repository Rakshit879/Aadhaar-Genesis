import React, { useState } from "react";
import "../Styles/UserDashboard.css";
import Logo from '../Resources/Logo.jpg';

import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const initialChildData = {
  name: "",
  gender: "",
  dob: "",
  timeOfBirth: "",
  weight: "",
  disability: "",
  category: "",
  hasBirthmark: "",
  birthmarkLocation: "",
  fatherName: "",
  motherName: "",
  address: "",
  certificateUrl: "",
  uniqueId: "",
  createdAt: null,
};

function UserDashboard() {
  const [uniqueId, setUniqueId] = useState("");
  const [childData, setChildData] = useState(initialChildData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSlotBooking, setShowSlotBooking] = useState(false);
  const [slotDateTime, setSlotDateTime] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    console.log("Logging out");
    navigate("/");
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const docRef = doc(db, "children", uniqueId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setChildData(docSnap.data());
        setError("");
      } else {
        setChildData(initialChildData);
        setError("No record found.");
      }
    } catch (err) {
      console.error("Error fetching document:", err);
      setChildData(initialChildData);
      setError("Error fetching data.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (childData.certificateUrl) {
      const googleDriveUrl = childData.certificateUrl;

      if (googleDriveUrl.includes("drive.google.com")) {
        const fileId = googleDriveUrl.split("/d/")[1]?.split("/")[0];
        const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "certificate.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const link = document.createElement("a");
        link.href = childData.certificateUrl;
        link.setAttribute("download", "certificate.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleConfirmSlot = () => {
    if (slotDateTime) {
      alert(
        `Slot has been booked for the following date and time for the person: ${childData.name || "Unknown"}\n\n${new Date(slotDateTime).toLocaleString()}`
      );
      setShowSlotBooking(false);
      setSlotDateTime("");
    } else {
      alert("Please select a date and time.");
    }
  };

  return (
    <div id="UserDashboard_div">
      <h1>Welcome to DOC2DOOR</h1>
      <div className="info">
        <div className="left">
          <img src={Logo} alt="Logo" height="100px" />
          <input
            type="text"
            placeholder="Enter the Unique ID"
            id="id_input"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
          />
          <button id="search_buttom" onClick={handleSearch}>Search</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="right">
          <div className="result">
            <p><strong>Name:</strong> {childData.name || "—"}</p>
            <p><strong>Gender:</strong> {childData.gender || "—"}</p>
            <p><strong>Date of Birth:</strong> {childData.dob || "—"}</p>
            <p><strong>Time of Birth:</strong> {childData.timeOfBirth || "—"}</p>
            <p><strong>Weight:</strong> {childData.weight || "—"}</p>
            <p><strong>Disability:</strong> {childData.disability || "—"}</p>
            <p><strong>Category:</strong> {childData.category || "—"}</p>
            <p><strong>Has Birthmark:</strong> {childData.hasBirthmark || "—"}</p>
            <p><strong>Birthmark Location:</strong> {childData.birthmarkLocation || "—"}</p>
            <p><strong>Father's Name:</strong> {childData.fatherName || "—"}</p>
            <p><strong>Mother's Name:</strong> {childData.motherName || "—"}</p>
            <p><strong>Address:</strong> {childData.address || "—"}</p>
            <p><strong>Unique ID:</strong> {childData.uniqueId || "—"}</p>
            <p><strong>Created At:</strong> {childData.createdAt ? childData.createdAt.toDate().toLocaleString() : "—"}</p>

            {childData.certificateUrl ? (
              <div>
                <button onClick={handleDownload} className="download-button">
                  Download Certificate
                </button>
              </div>
            ) : (
              <p>No certificate available for this baby.</p>
            )}

            <div className="logout-button" style={{ width: "120px", marginTop: "10px" }}>
              <button onClick={logout}>Logout</button>
            </div>

            {/* 📅 Book Slot Button */}
            <div style={{ padding: "0.3rem 0.7rem" }}>
              <button style={{ backgroundColor: "#fcf4d8"}} onClick={() => setShowSlotBooking(true)}>Book Slot</button>
            </div>

            {showSlotBooking && (
              <div style={{ marginTop: "10px" }}>
                <label>Select Date and Time:</label><br />
                <input
                  type="datetime-local"
                  value={slotDateTime}
                  onChange={(e) => setSlotDateTime(e.target.value)}
                />
                <br />
                <button onClick={handleConfirmSlot} style={{ marginTop: "8px",backgroundColor: "#fcf4d8" }}>
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
