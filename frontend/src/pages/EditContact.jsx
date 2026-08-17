import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EditContact() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // LOAD CONTACT
  // ================================

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/contacts/${id}/`);

      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        company: response.data.company || "",
      });
    } catch (err) {
      console.error("Error loading contact:", err);
      setError("Unable to load contact.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // UPDATE CONTACT
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError(
        "Please fill in Name, Email and Phone."
      );
      return;
    }

    setSaving(true);

    try {
      await api.put(`/api/contacts/${id}/`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating contact:", err);

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          const firstValue = data[firstKey];

          if (Array.isArray(firstValue)) {
            setError(`${firstKey}: ${firstValue[0]}`);
          } else if (typeof firstValue === "string") {
            setError(firstValue);
          } else {
            setError("Failed to update contact.");
          }
        } else {
          setError("Failed to update contact.");
        }
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "Network error. Please make sure the backend is running."
        );
      } else {
        setError("Failed to update contact.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // LOADING SCREEN
  // ================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading contact...
          </h2>

          <p style={styles.loadingText}>
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <div style={styles.page}>

      {/* Background decoration */}
      <div style={styles.circleOne}></div>
      <div style={styles.circleTwo}></div>

      {/* Main card */}
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            disabled={saving}
            style={styles.backButton}
          >
            ←
          </button>

          <div style={styles.titleArea}>

            <div style={styles.iconBox}>
              ✎
            </div>

            <div>
              <span style={styles.label}>
                CONTACT BOOK
              </span>

              <h1 style={styles.title}>
                Edit Contact
              </h1>

              <p style={styles.subtitle}>
                Update your contact information
              </p>
            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>
              !
            </span>

            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={styles.formGroup}>

            <label style={styles.labelText}>
              Full Name
              <span style={styles.required}>*</span>
            </label>

            <div style={styles.inputWrapper}>

              <span style={styles.inputIcon}>
                👤
              </span>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* Email */}
          <div style={styles.formGroup}>

            <label style={styles.labelText}>
              Email Address
              <span style={styles.required}>*</span>
            </label>

            <div style={styles.inputWrapper}>

              <span style={styles.inputIcon}>
                @
              </span>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                disabled={saving}
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* Phone */}
          <div style={styles.formGroup}>

            <label style={styles.labelText}>
              Phone Number
              <span style={styles.required}>*</span>
            </label>

            <div style={styles.inputWrapper}>

              <span style={styles.inputIcon}>
                ☎
              </span>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                disabled={saving}
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* Company */}
          <div style={styles.formGroup}>

            <label style={styles.labelText}>
              Company
              <small style={styles.optional}>
                Optional
              </small>
            </label>

            <div style={styles.inputWrapper}>

              <span style={styles.inputIcon}>
                ▦
              </span>

              <input
                type="text"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
                disabled={saving}
                style={styles.input}
              />

            </div>

          </div>

          {/* Buttons */}
          <div style={styles.actions}>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={saving}
              style={styles.cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={styles.saveButton}
            >
              {saving ? (
                <>
                  <span style={styles.buttonSpinner}></span>
                  Saving...
                </>
              ) : (
                <>
                  ✓ Save Changes
                </>
              )}
            </button>

          </div>

        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerDot}>●</span>
          Your changes will be saved securely
        </div>

      </div>
    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 10% 10%, rgba(100,130,160,0.14), transparent 30%), radial-gradient(circle at 90% 90%, rgba(70,100,90,0.10), transparent 30%), #080b0f",
    color: "#f1f5f9",
    fontFamily: "Inter, Segoe UI, Arial, sans-serif",
  },

  circleOne: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    top: "-180px",
    left: "-150px",
    background: "rgba(95,125,150,0.08)",
  },

  circleTwo: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    right: "-200px",
    bottom: "-200px",
    background: "rgba(80,110,100,0.07)",
  },

  card: {
    width: "100%",
    maxWidth: "580px",
    position: "relative",
    zIndex: 2,
    padding: "34px",
    background: "#121820",
    border: "1px solid #27323d",
    borderRadius: "22px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "28px",
  },

  backButton: {
    width: "43px",
    height: "43px",
    flexShrink: 0,
    border: "1px solid #2d3945",
    borderRadius: "11px",
    background: "#161e26",
    color: "#a9b7c4",
    fontSize: "21px",
    cursor: "pointer",
  },

  titleArea: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  iconBox: {
    width: "50px",
    height: "50px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    background: "#1d2935",
    border: "1px solid #334454",
    color: "#a9c0d3",
    fontSize: "22px",
  },

  label: {
    display: "block",
    marginBottom: "4px",
    color: "#8fa9bf",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.6px",
  },

  title: {
    margin: 0,
    color: "#f3f6f8",
    fontSize: "25px",
    fontWeight: "750",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#788693",
    fontSize: "12px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "22px",
    padding: "12px 14px",
    border: "1px solid #573536",
    borderRadius: "11px",
    background: "#28191a",
    color: "#e2a0a0",
    fontSize: "12px",
  },

  errorIcon: {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#563234",
    color: "#ffb0b0",
    fontWeight: "800",
  },

  formGroup: {
    marginBottom: "20px",
  },

  labelText: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "8px",
    color: "#c9d2da",
    fontSize: "12px",
    fontWeight: "650",
  },

  required: {
    color: "#a4bdd0",
  },

  optional: {
    marginLeft: "auto",
    color: "#687581",
    fontSize: "10px",
  },

  inputWrapper: {
    width: "100%",
    height: "50px",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    background: "#0e151c",
    border: "1px solid #293642",
    borderRadius: "11px",
  },

  inputIcon: {
    width: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#73889a",
    fontSize: "16px",
  },

  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#edf2f5",
    fontSize: "13px",
    paddingRight: "14px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  cancelButton: {
    flex: 0.8,
    height: "48px",
    borderRadius: "11px",
    background: "#171f27",
    border: "1px solid #2c3945",
    color: "#9aa8b5",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  saveButton: {
    flex: 1.4,
    height: "48px",
    borderRadius: "11px",
    border: "none",
    background: "#718da7",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  buttonSpinner: {
    width: "15px",
    height: "15px",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #202a34",
    color: "#5f6d78",
    fontSize: "10px",
  },

  footerDot: {
    color: "#71937e",
    fontSize: "8px",
  },

  loadingCard: {
    width: "100%",
    maxWidth: "430px",
    padding: "45px 30px",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    background: "#121820",
    border: "1px solid #27323d",
    borderRadius: "20px",
    boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
  },

  spinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto 18px",
    border: "3px solid #293743",
    borderTopColor: "#8aa5bd",
    borderRadius: "50%",
  },

  loadingTitle: {
    margin: 0,
    color: "#e9eef2",
    fontSize: "18px",
  },

  loadingText: {
    marginTop: "8px",
    color: "#74818d",
    fontSize: "12px",
  },
};

export default EditContact;