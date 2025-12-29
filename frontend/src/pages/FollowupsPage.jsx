import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import FollowupTable from "../components/followups/FollowupTable";
import {
  getTodayFollowups,
  getUpcomingFollowups,
  getMissedFollowups,
  updateFollowupStatus,
} from "../api/followupApi";

const FollowupsPage = () => {
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [missed, setMissed] = useState([]);

  const loadData = async () => {
    setToday((await getTodayFollowups()).data);
    setUpcoming((await getUpcomingFollowups()).data);
    setMissed((await getMissedFollowups()).data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const markCompleted = async (id) => {
    await updateFollowupStatus(id, "COMPLETED");
    loadData();
  };

  return (
    <Layout title="Follow-ups Dashboard">
      <h2>Today</h2>
      <FollowupTable data={today} onComplete={markCompleted} />

      <h2>Upcoming</h2>
      <FollowupTable data={upcoming} onComplete={markCompleted} />

      <h2>Missed</h2>
      <FollowupTable data={missed} onComplete={markCompleted} />
    </Layout>
  );
};

export default FollowupsPage;
