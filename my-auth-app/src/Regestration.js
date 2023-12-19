// src/components/Register.js
import React, { useState } from "react";

// Define regex patterns outside of the component
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { username, password, email } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!EMAIL_PATTERN.test(email)) newErrors.email = "Invalid email format";
    if (!PASSWORD_PATTERN.test(password))
      newErrors.password = "Password must be at least 8 characters and include at least one number and one letter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      // Handle success
      console.log("Registered successfully:", data);
      setIsSubmitting(false);
      // Redirect to login or show success message
    } catch (error) {
      setErrors({ form: error.message });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... other inputs ... */}
      <button type="submit" disabled={isSubmitting}>
        Register
      </button>
      {isSubmitting && <p>Registering...</p>}
    </form>
  );
}

export default Register;
