import axios from "./axiosInstance";

export const getTodayFollowups = (search, page, pageSize) => {
  const params = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  return axios.get("/followup/today", { params });
};

export const getUpcomingFollowups = (search, page, pageSize) => {
  const params = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  return axios.get("/followup/upcoming", { params });
};

export const getMissedFollowups = (search, page, pageSize) => {
  const params = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  return axios.get("/followup/missed", { params });
};

export const updateFollowupStatus = (id, status, followup_date, notes) =>
  axios.put(`/followup/${id}/status`, { status, followup_date, notes });
