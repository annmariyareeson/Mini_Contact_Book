import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CONTACTS
  // ==========================================

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/contacts/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setContacts(data);

      if (data.length > 0) {
        setSelectedContact(data[0]);
      } else {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError("Unable to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ==========================================
  // DELETE CONTACT
  // ==========================================

  const handleDelete = async () => {
    if (!selectedContact) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedContact.name}?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/contacts/${selectedContact.id}/`);

      const remainingContacts = contacts.filter(
        (contact) => contact.id !== selectedContact.id
      );

      setContacts(remainingContacts);

      if (remainingContacts.length > 0) {
        setSelectedContact(remainingContacts[0]);
      } else {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Unable to delete contact.");
    }
  };

  // ==========================================
  // SEARCH + ALPHABETICAL SORT
  // ==========================================

  const filteredContacts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return contacts
      .filter((contact) => {
        return (
          contact.name?.toLowerCase().includes(searchText) ||
          contact.email?.toLowerCase().includes(searchText) ||
          contact.company?.toLowerCase().includes(searchText) ||
          contact.phone?.includes(searchText)
        );
      })
      .sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
  }, [contacts, search]);

  // ==========================================
  // GROUP CONTACTS BY FIRST LETTER
  // ==========================================

  const groupedContacts = useMemo(() => {
    return filteredContacts.reduce((groups, contact) => {
      const letter =
        contact.name?.charAt(0).toUpperCase() || "#";

      if (!groups[letter]) {
        groups[letter] = [];
      }

      groups[letter].push(contact);

      return groups;
    }, {});
  }, [filteredContacts]);

  // ==========================================
  // AVATAR HELPERS
  // ==========================================

  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  const getAvatarClass = (name) => {
    const classes = [
      "avatar-purple",
      "avatar-blue",
      "avatar-green",
      "avatar-orange",
    ];

    const index =
      (name?.charCodeAt(0) || 0) % classes.length;

    return classes[index];
  };

  return (
    <div className="contact-app">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="top-header">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <div>
            <h1>Mini Contact Book</h1>
            <p>Stay connected, stay organized</p>
          </div>

        </div>


        <div className="header-actions">

          <div className="header-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>


          <div className="user-profile">

            <div className="user-avatar">
              A
            </div>

            <div className="user-info">
              <strong>My Account</strong>
              <span>Personal contacts</span>
            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </header>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="main-content">

        {/* ====================================
            LEFT CONTACT LIST
        ==================================== */}

        <section className="contacts-panel">

          <div className="contacts-heading">

            <div>

              <span className="section-label">
                ADDRESS BOOK
              </span>

              <h2>My Contacts</h2>

              <p>
                {contacts.length}{" "}
                {contacts.length === 1
                  ? "contact"
                  : "contacts"}
              </p>

            </div>


            <button
              className="add-button"
              onClick={() => navigate("/add-contact")}
            >
              <span>＋</span>
              Add Contact
            </button>

          </div>


          {/* SEARCH */}

          <div className="contact-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          {/* CONTACT LIST */}

          <div className="contact-list">

            {/* LOADING */}

            {loading && (
              <div className="state-message">

                <div className="loading-circle"></div>

                <p>
                  Loading contacts...
                </p>

              </div>
            )}


            {/* ERROR */}

            {!loading && error && (
              <div className="state-message error-message">

                <div className="state-icon">
                  !
                </div>

                <p>
                  {error}
                </p>

                <button onClick={fetchContacts}>
                  Try Again
                </button>

              </div>
            )}


            {/* EMPTY */}

            {!loading &&
              !error &&
              filteredContacts.length === 0 && (

                <div className="empty-state">

                  <div className="empty-icon">
                    ♧
                  </div>

                  <h3>
                    No contacts found
                  </h3>

                  <p>
                    Try another search or add
                    a new contact.
                  </p>

                  <button
                    className="add-button"
                    onClick={() =>
                      navigate("/add-contact")
                    }
                  >
                    ＋ Add Contact
                  </button>

                </div>
              )}


            {/* GROUPED CONTACTS */}

            {!loading &&
              !error &&
              Object.keys(groupedContacts)
                .sort()
                .map((letter) => (

                  <div
                    className="contact-group"
                    key={letter}
                  >

                    <div className="alphabet">
                      {letter}
                    </div>


                    {groupedContacts[letter].map(
                      (contact) => {

                        const isSelected =
                          selectedContact?.id ===
                          contact.id;

                        return (

                          <button
                            key={contact.id}
                            className={`contact-item ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedContact(
                                contact
                              )
                            }
                          >

                            <div
                              className={`contact-avatar ${getAvatarClass(
                                contact.name
                              )}`}
                            >
                              {getInitial(
                                contact.name
                              )}
                            </div>


                            <div className="contact-summary">

                              <strong>
                                {contact.name}
                              </strong>

                              <span>
                                {contact.company ||
                                  "No company"}
                              </span>

                            </div>


                            <span className="contact-arrow">
                              ›
                            </span>

                          </button>

                        );
                      }
                    )}

                  </div>
                ))}
          </div>

        </section>


        {/* ====================================
            RIGHT CONTACT DETAILS
        ==================================== */}

        <section className="details-panel">

          {!selectedContact ? (

            <div className="no-selection">

              <div className="no-selection-icon">
                ♧
              </div>

              <h2>
                Select a contact
              </h2>

              <p>
                Choose someone from your
                contact list to view their details.
              </p>

            </div>

          ) : (

            <>

              {/* DETAILS HEADER */}

              <div className="details-header">

                <div>

                  <span className="section-label">
                    CONTACT DETAILS
                  </span>

                  <p>
                    Personal information
                  </p>

                </div>


                <div className="details-actions">

                  <button
                    className="small-icon-button"
                    title="Edit contact"
                    onClick={() =>
                      navigate(
                        `/edit-contact/${selectedContact.id}`
                      )
                    }
                  >
                    ✎
                  </button>


                  <button
                    className="small-icon-button danger-icon"
                    title="Delete contact"
                    onClick={handleDelete}
                  >
                    ♲
                  </button>

                </div>

              </div>


              {/* PROFILE */}

              <div className="profile-section">

                <div
                  className={`large-avatar ${getAvatarClass(
                    selectedContact.name
                  )}`}
                >
                  {getInitial(
                    selectedContact.name
                  )}
                </div>


                <div className="profile-info">

                  <h2>
                    {selectedContact.name}
                  </h2>

                  <p>
                    {selectedContact.company ||
                      "Personal Contact"}
                  </p>

                  <span className="contact-badge">
                    Contact
                  </span>

                </div>

              </div>


              {/* CONTACT INFORMATION */}

              <div className="information-card">

                {/* EMAIL */}

                <div className="info-row">

                  <div className="info-icon">
                    ✉
                  </div>

                  <div className="info-content">

                    <span>
                      Email address
                    </span>

                    <strong>
                      {selectedContact.email ||
                        "Not provided"}
                    </strong>

                  </div>

                </div>


                {/* PHONE */}

                <div className="info-row">

                  <div className="info-icon">
                    ☎
                  </div>

                  <div className="info-content">

                    <span>
                      Phone number
                    </span>

                    <strong>
                      {selectedContact.phone ||
                        "Not provided"}
                    </strong>

                  </div>

                </div>


                {/* COMPANY */}

                <div className="info-row">

                  <div className="info-icon">
                    ▦
                  </div>

                  <div className="info-content">

                    <span>
                      Company
                    </span>

                    <strong>
                      {selectedContact.company ||
                        "Not provided"}
                    </strong>

                  </div>

                </div>

              </div>


              {/* ACTION BUTTONS */}

              <div className="quick-actions">

                <button
                  className="primary-action"
                  onClick={() =>
                    navigate(
                      `/edit-contact/${selectedContact.id}`
                    )
                  }
                >
                  ✎ Edit Contact
                </button>


                <button
                  className="secondary-action delete-action"
                  onClick={handleDelete}
                >
                  ♲ Delete Contact
                </button>

              </div>

            </>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
