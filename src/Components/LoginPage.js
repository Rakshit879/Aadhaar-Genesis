import React, { useState } from "react";
import { auth, db } from "../firebaseConfig"; // Import Firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate } from "react-router-dom";
import "../Styles/LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);

        const userDoc = await getDoc(doc(db, "users", email)); // Fetch role from Firestore
        if (userDoc.exists()) {
            const role = userDoc.data().role || "user";
            console.log("User role:", role);
            navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
        } else {
            setError("User data not found in Firestore.");
        }
    } catch (err) {
        console.error("Firebase Authentication error:", err.message);
        setError("Invalid email or password.");
    }
};


    return (
        <div id="login_div">
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form id="login_form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>     
        </div>
    );
}

export default LoginPage;
