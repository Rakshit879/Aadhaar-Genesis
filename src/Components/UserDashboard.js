import React, { useState } from "react";
import "../Styles/UserDashboard.css";
import Logo from '../Resources/Logo.jpg';

import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Default empty child data
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
  certificateUrl: "", // Document URL added for downloading
  uniqueId: "",
  createdAt: null,
};

function UserDashboard() {
  const [uniqueId, setUniqueId] = useState("");
  const [childData, setChildData] = useState(initialChildData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  
      // Check if the URL is a Google Drive link
      if (googleDriveUrl.includes("drive.google.com")) {
        const fileId = googleDriveUrl.split("/d/")[1]?.split("/")[0]; // Extract the FILE_ID
        const downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
        
        const link = document.createElement("a");
        link.href = downloadUrl; // Set the modified URL for direct download
        link.setAttribute("download", "certificate.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const link = document.createElement("a");
        link.href = childData.certificateUrl; // Use the original URL for non-Google Drive files
        link.setAttribute("download", "certificate.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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

            {/* Download Document Button */}
            {childData.certificateUrl ? (
              <div>
                <button onClick={handleDownload} className="download-button">
                  Download Certificate
                </button>
              </div>
            ) : (
              <p>No certificate available for this baby.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;