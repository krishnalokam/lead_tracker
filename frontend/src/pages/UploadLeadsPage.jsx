import { useState } from "react";
import axios from "../api/axiosInstance";

const UploadLeadsPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setMessage("");
    setError("");
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      { name: "John Doe", phone: "1234567890", email: "john.doe@example.com" },
      { name: "Jane Smith", phone: "9876543210", email: "jane.smith@example.com" },
      { name: "Bob Johnson", phone: "5551234567", email: "bob.johnson@example.com" },
    ];

    const headers = ["name", "phone", "email"];
    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) => 
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_leads.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("/leads/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(
        res.data?.message ||
          `Upload successful. Inserted: ${res.data?.inserted ?? "-"}, Skipped: ${
            res.data?.skipped ?? "-"
          }`
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to upload leads. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px" }}>Upload Leads</h2>
      <p style={{ marginBottom: "12px", color: "#4b5563" }}>
        Upload a CSV file with columns: <strong>name</strong>, <strong>phone</strong>,{" "}
        <strong>email</strong>.
      </p>
      
      <div style={{ marginBottom: "16px" }}>
        <button
          type="button"
          onClick={downloadSampleCSV}
          style={{
            padding: "8px 16px",
            backgroundColor: "#10b981",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          📥 Download Sample CSV
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "default" : "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "16px",
            padding: "8px 12px",
            backgroundColor: "#ecfdf3",
            color: "#166534",
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadLeadsPage;


