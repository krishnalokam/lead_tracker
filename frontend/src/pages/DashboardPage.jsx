import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import axios from "../api/axiosInstance";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/dashboard/summary")
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        // Handle error silently or show a message
        console.error("Unable to load dashboard data");
      });
  }, []);

  if (!data) {
    return (
      <Layout title="Dashboard">
        <p>Loading...</p>
      </Layout>
    );
  }

  const today = data.todayFollowups || 0;
  const upcoming = data.upcomingFollowups || 0;
  const missed = data.missedFollowups || 0;
  const totalFollowups = today + upcoming + missed;

  const todayPercent = totalFollowups ? (today / totalFollowups) * 100 : 0;
  const upcomingPercent = totalFollowups
    ? (upcoming / totalFollowups) * 100
    : 0;
  const missedPercent = totalFollowups ? (missed / totalFollowups) * 100 : 0;

  const pieBackground =
    totalFollowups === 0
      ? "#e5e7eb"
      : `conic-gradient(
          #22c55e 0 ${todayPercent}%,
          #eab308 ${todayPercent}% ${todayPercent + upcomingPercent}%,
          #ef4444 ${todayPercent + upcomingPercent}% 100%
        )`;

  return (
    <Layout title="Dashboard">
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "center",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: pieBackground,
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
          }}
        />

        <div style={{ minWidth: "260px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
            Follow-up distribution
          </h3>
          <p style={{ margin: 0, marginBottom: "16px", color: "#6b7280" }}>
            Total leads: <strong>{data.totalLeads}</strong>
          </p>

          <LegendItem
            color="#22c55e"
            label="Today"
            value={today}
            total={totalFollowups}
          />
          <LegendItem
            color="#eab308"
            label="Upcoming"
            value={upcoming}
            total={totalFollowups}
          />
          <LegendItem
            color="#ef4444"
            label="Missed"
            value={missed}
            total={totalFollowups}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <DashboardCard
          title="Total Leads"
          value={data.totalLeads || 0}
          color="#2563eb"
          onClick={() => navigate("/leads")}
        />
        <DashboardCard
          title="Today's Follow-ups"
          value={today}
          color="#22c55e"
          onClick={() => navigate("/today")}
        />
        <DashboardCard
          title="Upcoming Follow-ups"
          value={upcoming}
          color="#eab308"
          onClick={() => navigate("/upcoming")}
        />
        <DashboardCard
          title="Missed Follow-ups"
          value={missed}
          color="#ef4444"
          onClick={() => navigate("/missed")}
        />
      </div>
    </Layout>
  );
};

const LegendItem = ({ color, label, value, total }) => {
  const percent = total ? Math.round((value / total) * 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <span
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "4px",
          backgroundColor: color,
          marginRight: "10px",
        }}
      />
      <span style={{ flex: 1 }}>{label}</span>
      <span
        style={{
          fontWeight: 600,
          marginRight: "8px",
        }}
      >
        {value}
      </span>
      <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
        {percent}%
      </span>
    </div>
  );
};

const DashboardCard = ({ title, value, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: `2px solid ${color}20`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = `${color}20`;
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "8px",
          fontWeight: "500",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: color,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default DashboardPage;
