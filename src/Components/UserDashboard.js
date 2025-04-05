import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "../Styles/UserDashboard.css"; // Add styles for the user dashboard if needed

const UserDashboard = () => {
  const [searchId, setSearchId] = useState(""); // Holds the unique ID input
  const [babyDetails, setBabyDetails] = useState(null); // Holds the fetched details
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To handle errors

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the document from Firestore using the provided unique ID
      const docRef = doc(db, "children", searchId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBabyDetails(docSnap.data());
        setError(null);
      } else {
        setError("No record found for the provided ID.");
        setBabyDetails(null);
      }
    } catch (error) {
      console.error("Error fetching baby details: ", error);
      setError("An error occurred while fetching the details.");
      setBabyDetails(null);
    }

    setLoading(false);
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <p>Enter the unique ID to fetch the details of a registered baby.</p>

      {/* Search Input */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Unique ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Baby Details */}
      {babyDetails && (
        <div className="baby-details">
          <h3>Baby Details</h3>
          <p><strong>Name:</strong> {babyDetails.name}</p>
          <p><strong>Date of Birth:</strong> {babyDetails.dob}</p>
          <p><strong>Time of Birth:</strong> {babyDetails.timeOfBirth}</p>
          <p><strong>Gender:</strong> {babyDetails.gender}</p>
          <p><strong>Weight:</strong> {babyDetails.weight} kg</p>
          <p><strong>Father's Name:</strong> {babyDetails.fatherName}</p>
          <p><strong>Mother's Name:</strong> {babyDetails.motherName}</p>
          <p><strong>Address:</strong> {babyDetails.address}</p>
          <p><strong>Category:</strong> {babyDetails.category}</p>
          <p><strong>Disability:</strong> {babyDetails.disability || "None"}</p>
          <p><strong>Birthmark:</strong> {babyDetails.hasBirthmark === "Yes"
            ? `Yes, located at ${babyDetails.birthmarkLocation}`
            : "No"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;