import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "http://127.0.0.1:8000/api/contacts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "object") {
          const messages = Object.values(data).flat();
          setError(messages.join(" "));
        } else {
          setError("Failed to add contact.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow}></div>

      <div style={styles.container}>
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e293b";
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#111827";
            e.currentTarget.style.borderColor = "#263244";
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Card */}
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.icon}>
              +
            </div>

            <div>
              <h1 style={styles.title}>Add Contact</h1>
              <p style={styles.subtitle}>
                Add a new person to your contact book
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.error}>
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#263244";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#263244";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Phone */}
            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#263244";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Company */}
            <div style={styles.field}>
              <label style={styles.label}>
                Company <span style={styles.optional}>(Optional)</span>
              </label>

              <input
                type="text"
                name="company"
                placeholder="Company or organization"
                value={formData.company}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#263244";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Buttons */}
            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                style={styles.cancelButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1e293b";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111827";
                  e.currentTarget.style.color = "#cbd5e1";
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3b82f6";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? "Adding..." : "Add Contact"}
              </button>
            </div>
          </form>
        </div>

        <p style={styles.footer}>
          Mini Contact Book
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#05070b",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  backgroundGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(37, 99, 235, 0.10) 0%, rgba(37, 99, 235, 0) 70%)",
    top: "-180px",
    right: "-150px",
    pointerEvents: "none",
  },

  container: {
    width: "100%",
    maxWidth: "650px",
    position: "relative",
    zIndex: 1,
  },

  backButton: {
    background: "#111827",
    color: "#cbd5e1",
    border: "1px solid #263244",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "18px",
    transition: "all 0.2s ease",
  },

  card: {
    background: "#0b0f16",
    border: "1px solid #1d2635",
    borderRadius: "18px",
    padding: "34px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "30px",
  },

  icon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    color: "#60a5fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "300",
  },

  title: {
    margin: "0 0 5px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: 0,
    color: "#7f8da3",
    fontSize: "14px",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#fca5a5",
    padding: "12px 14px",
    borderRadius: "9px",
    fontSize: "14px",
    marginBottom: "22px",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    color: "#e5e7eb",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  optional: {
    color: "#64748b",
    fontWeight: "400",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#080c12",
    color: "#ffffff",
    border: "1px solid #263244",
    borderRadius: "9px",
    padding: "13px 14px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "28px",
    paddingTop: "24px",
    borderTop: "1px solid #1a2230",
  },

  cancelButton: {
    background: "#111827",
    color: "#cbd5e1",
    border: "1px solid #263244",
    borderRadius: "9px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  submitButton: {
    background: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 6px 18px rgba(59, 130, 246, 0.18)",
  },

  footer: {
    textAlign: "center",
    color: "#475569",
    fontSize: "12px",
    marginTop: "20px",
  },
};

export default AddContact;