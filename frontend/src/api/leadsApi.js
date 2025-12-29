import axios from "./axiosInstance";

export const getLeads = (fromDate, toDate, search, page, pageSize) => {
  const params = {};
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  if (search) params.search = search;
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  return axios.get("/leads", { params });
};

export const getDuplicateLeads = (date, phone, page, pageSize) => {
  const params = {};
  if (date) params.date = date;
  if (phone) params.phone = phone;
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  return axios.get("/leads/duplicates", { params });
};

export const updateLeadFollowup = (id, followup_date, notes, status) =>
  axios.put(`/leads/${id}/followup`, { followup_date, notes, status });

