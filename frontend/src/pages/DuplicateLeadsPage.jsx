import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { getDuplicateLeads } from "../api/leadsApi";

const DuplicateLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [phoneInput, setPhoneInput] = useState(""); // Separate state for input
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Debounce phone filter - update phoneFilter after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhoneFilter(phoneInput);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [phoneInput]);

  // Fetch data when filters or page change
  useEffect(() => {
    fetchDuplicateLeads();
  }, [dateFilter, phoneFilter, page]);

  const fetchDuplicateLeads = async () => {
    try {
      setLoading(true);
      if (page === 1 && (dateFilter || phoneFilter)) {
        // Only reset page if filters changed (not on initial load)
      }
      const res = await getDuplicateLeads(
        dateFilter || null,
        phoneFilter || null,
        page,
        pageSize
      );
      setLeads(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching duplicate leads:", error);
    } finally {
      setLoading(false);
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

  // const formatDateTime = (dateString) => {
  //   if (!dateString) return "-";
  //   const date = new Date(dateString);
  //   return date.toLocaleString();
  // };

   const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Month names
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}, ${day}, ${year}`;
};


  // Backend handles pagination, so we use leads directly
  const paginatedLeads = leads;

  if (loading) {
    return (
      <Layout title="Duplicate Leads">
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Duplicate Leads">
      <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <label style={{ fontWeight: "600" }}>Filter by Created At:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1); // Reset to first page on filter change
            }}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <label style={{ fontWeight: "600" }}>Filter by Phone:</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              width: "200px",
            }}
          />
        </div>
        {(dateFilter || phoneFilter) && (
          <button
            onClick={() => {
              setDateFilter("");
              setPhoneFilter("");
              setPhoneInput("");
              setPage(1); // Reset to first page when clearing filters
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <span style={{ color: "#6b7280" }}>
          Total: {total} duplicate lead{total !== 1 ? "s" : ""}
          {(dateFilter || phoneFilter) && (
            <span>
              {" "}(filtered
              {dateFilter && ` by date: ${formatDate(dateFilter)}`}
              {phoneFilter && ` by phone: ${phoneFilter}`})
            </span>
          )}
        </span>
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
                Created At
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                Original Lead On
              </th>
              
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>
                  {dateFilter
                    ? "No duplicate leads found for the selected date."
                    : "No duplicate leads found."}
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <td style={{ padding: "12px" }}>{lead.name}</td>
                  <td style={{ padding: "12px" }}>{lead.phone || "-"}</td>
                  <td style={{ padding: "12px" }}>{lead.email || "-"}</td>
                  <td style={{ padding: "12px" }}>{lead.source || "-"}</td>
                  <td style={{ padding: "12px" }}>{formatDateTime(lead.created_at)}</td>
                  <td style={{ padding: "12px" }}>{formatDateTime(lead.lead_created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
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
            Showing {paginatedLeads.length} of {total} duplicate leads
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
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            style={{
              padding: "6px 12px",
              backgroundColor: page >= totalPages ? "#e5e7eb" : "#2563eb",
              color: page >= totalPages ? "#9ca3af" : "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
        </div>
      )}
    </Layout>
  );
};

export default DuplicateLeadsPage;

