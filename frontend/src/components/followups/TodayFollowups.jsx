import { useEffect, useState } from "react";
import { getTodayFollowups, updateFollowupStatus } from "../../api/followupApi";

const TodayFollowups = () => {
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getTodayFollowups();
    setFollowups(res.data);
  };

  const markCompleted = async (id) => {
    await updateFollowupStatus(id, "COMPLETED");
    fetchData();
  };

  return (
    <div>
      <h3>Today's Follow-ups</h3>

      {followups.length === 0 && <p>No follow-ups today</p>}

      {followups.map((f) => (
        <div key={f.id}>
          <strong>{f.name}</strong> ({f.phone})<br />
          {f.notes}<br />
          <button onClick={() => markCompleted(f.id)}>
            Mark Completed
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TodayFollowups;
