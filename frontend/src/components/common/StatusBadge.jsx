const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "#ca8a04",
    COMPLETED: "#16a34a",
    MISSED: "#dc2626",
  };

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        background: colors[status],
        color: "#fff",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
