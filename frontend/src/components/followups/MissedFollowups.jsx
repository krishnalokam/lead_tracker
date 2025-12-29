import { useEffect, useState } from "react";
import { getMissedFollowups, updateFollowupStatus } from "../../api/followupApi";

const MissedFollowups = () => {
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getMissedFollowups();
    setFollowups(res.data);
  };

  const markCompleted = async (id) => {
    await updateFollowupStatus(id, "COMPLETED");
    fetchData();
  };

  return (
    <div>
      <h3>Missed Follow-ups</h3>

      {followups.length === 0 && <p>No missed follow-ups</p>}

      {followups.map((f) => (
        <div key={f.id}>
          <strong>{f.name}</strong> ({f.phone})<br />
          Missed on: {f.followup_date}<br />
          <button onClick={() => markCompleted(f.id)}>
            Mark Completed
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MissedFollowups;
