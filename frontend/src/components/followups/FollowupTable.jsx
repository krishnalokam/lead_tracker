const FollowupTable = ({ data, onComplete }) => {
  if (data.length === 0) {
    return <p>No records found</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      // If followup_date is null, return today's date
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    // Format the date string if it exists
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <table width="100%" cellPadding="8" border="1" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Followup Date</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((f) => (
          <tr key={f.id}>
            <td>{formatDate(f.followup_date)}</td>
            <td>{f.notes || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FollowupTable;
