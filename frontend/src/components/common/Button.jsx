const Button = ({ label, onClick, type = "primary" }) => {
  const styles = {
    primary: {
      background: "#2563eb",
      color: "#fff",
    },
    success: {
      background: "#16a34a",
      color: "#fff",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        ...styles[type],
      }}
    >
      {label}
    </button>
  );
};

export default Button;
