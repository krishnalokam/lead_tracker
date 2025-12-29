import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 16px",
  textDecoration: "none",
  fontWeight: "bold",
  borderBottom: isActive ? "3px solid #2563eb" : "none",
  color: isActive ? "#2563eb" : "#111827",
  transition: "color 0.2s ease",
});

const Navbar = () => {
  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "flex-start",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <NavLink to="/" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/leads" style={linkStyle}>
          Total Leads
        </NavLink>
        <NavLink to="/today" style={linkStyle}>
          Today
        </NavLink>
        <NavLink to="/upcoming" style={linkStyle}>
          Upcoming
        </NavLink>
        <NavLink to="/missed" style={linkStyle}>
          Missed
        </NavLink>
        <NavLink to="/duplicates" style={linkStyle}>
          Duplicate Leads
        </NavLink>
        <NavLink to="/upload" style={linkStyle}>
          Upload Leads
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
