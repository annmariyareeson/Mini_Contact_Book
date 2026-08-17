import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AddContact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter the contact name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter the email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter the phone number.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/contacts/", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding contact:", err);

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, message]) => `${field}: ${message}`)
            .join(" ");

          setError(messages || "Failed to add contact.");
        } else {
          setError("Failed to add contact.");
        }
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #050505 0%, #111111 50%, #1a1a1a 100%)",
        color: "#ffffff",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "1px solid #444",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "25px",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            background: "#111111",
            border: "1px solid #2d2d2d",
            borderRadius: "18px",
            padding: "35px",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Add Contact
          </h1>

          <p
            style={{
              color: "#999999",
              marginBottom: "30px",
            }}
          >
            Add a new contact to your contact book.
          </p>

          {error && (
            <div
              style={{
                background: "rgba(255, 70, 70, 0.12)",
                border: "1px solid #8b3030",
                color: "#ff8b8b",
                padding: "12px 15px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Name *
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter contact name"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Email *
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="phone"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Phone *
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label
                htmlFor="company"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Company
              </label>

              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: "9px",
                  border: "1px solid #444",
                  background: "#1c1c1c",
                  color: "#ffffff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: "9px",
                  border: "none",
                  background: "#ffffff",
                  color: "#000000",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {loading ? "Adding..." : "Add Contact"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  boxSizing: "border-box",
  background: "#181818",
  color: "#ffffff",
  border: "1px solid #333333",
  borderRadius: "9px",
  outline: "none",
  fontSize: "15px",
};

export default AddContact;