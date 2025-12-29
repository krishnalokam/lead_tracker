import axios from "./axiosInstance";

export const getLeads = () => axios.get("/leads");

export const getDuplicateLeads = (date, phone) => {
  const params = {};
  if (date) params.date = date;
  if (phone) params.phone = phone;
  return Object.keys(params).length > 0 
    ? axios.get("/leads/duplicates", { params })
    : axios.get("/leads/duplicates");
};

export const updateLeadFollowup = (id, followup_date, notes, status) =>
  axios.put(`/leads/${id}/followup`, { followup_date, notes, status });

