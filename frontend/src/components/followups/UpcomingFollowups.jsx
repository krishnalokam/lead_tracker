import { useEffect, useState } from "react";
import { getUpcomingFollowups } from "../../api/followupApi";

const UpcomingFollowups = () => {
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    getUpcomingFollowups().then((res) => {
      setFollowups(res.data);
    });
  }, []);

  return (
    <div>
      <h3>Upcoming Follow-ups</h3>

      {followups.length === 0 && <p>No upcoming follow-ups</p>}

      {followups.map((f) => (
        <div key={f.id}>
          <strong>{f.name}</strong> — {f.followup_date}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default UpcomingFollowups;
