import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { getLeads, updateLeadFollowup } from "../api/leadsApi";

const TotalLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ followup_date: "", notes: "", status: "PENDING" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await getLeads();
      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // If already in YYYY-MM-DD format, use it directly
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Parse date and format in local timezone to avoid day shift
    const date = new Date(dateString);
    // Use local date methods to avoid timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (lead) => {
    setEditingId(lead.id);
    setEditForm({
      followup_date: formatDateForInput(lead.followup_date),
      notes: lead.notes || "",
      status: lead.status || "PENDING",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ followup_date: "", notes: "", status: "PENDING" });
  };

  const handleSave = async (id) => {
    try {
      await updateLeadFollowup(
        id,
        editForm.followup_date || null,
        editForm.notes,
        editForm.status
      );
      await fetchLeads();
      setEditingId(null);
      setEditForm({ followup_date: "", notes: "", status: "PENDING" });
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update follow-up. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    // If already in YYYY-MM-DD format, use it directly
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Parse date and format in local timezone to avoid day shift
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search) ||
      lead.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return (
      <Layout title="Total Leads">
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Total Leads">
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by name, phone, or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 12px",
            width: "300px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Name
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Phone
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Email
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Source
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Follow-up Date
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Notes
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Status
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "20px", textAlign: "center" }}>
                  {search ? "No leads found matching your search." : "No leads found."}
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: editingId === lead.id ? "#fef3c7" : "#ffffff",
                  }}
                >
                  <td style={{ padding: "12px" }}>{lead.name}</td>
                  <td style={{ padding: "12px" }}>{lead.phone || "-"}</td>
                  <td style={{ padding: "12px" }}>{lead.email || "-"}</td>
                  <td style={{ padding: "12px" }}>{lead.source || "-"}</td>
                  <td style={{ padding: "12px" }}>
                    {editingId === lead.id ? (
                      <input
                        type="date"
                        value={editForm.followup_date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, followup_date: e.target.value })
                        }
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      formatDate(lead.followup_date)
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {editingId === lead.id ? (
                      <textarea
                        value={editForm.notes}
                        onChange={(e) =>
                          setEditForm({ ...editForm, notes: e.target.value })
                        }
                        placeholder="Enter notes..."
                        rows="2"
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          width: "200px",
                          resize: "vertical",
                        }}
                      />
                    ) : (
                      <span style={{ maxWidth: "200px", display: "inline-block" }}>
                        {lead.notes || "-"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {editingId === lead.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="MISSED">MISSED</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            lead.status === "COMPLETED"
                              ? "#d1fae5"
                              : lead.status === "MISSED"
                              ? "#fee2e2"
                              : "#dbeafe",
                          color:
                            lead.status === "COMPLETED"
                              ? "#065f46"
                              : lead.status === "MISSED"
                              ? "#991b1b"
                              : "#1e40af",
                        }}
                      >
                        {lead.status || "PENDING"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {editingId === lead.id ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleSave(lead.id)}
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#10b981",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#6b7280",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(lead)}
                        style={{
                          padding: "4px 12px",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ color: "#6b7280" }}>
            Showing {paginatedLeads.length} of {filteredLeads.length} leads
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: "6px 12px",
              backgroundColor: page === 1 ? "#e5e7eb" : "#2563eb",
              color: page === 1 ? "#9ca3af" : "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "0 12px" }}>
            Page {page} of {Math.ceil(filteredLeads.length / pageSize) || 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= filteredLeads.length}
            style={{
              padding: "6px 12px",
              backgroundColor:
                page * pageSize >= filteredLeads.length ? "#e5e7eb" : "#2563eb",
              color:
                page * pageSize >= filteredLeads.length ? "#9ca3af" : "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor:
                page * pageSize >= filteredLeads.length ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TotalLeadsPage;

