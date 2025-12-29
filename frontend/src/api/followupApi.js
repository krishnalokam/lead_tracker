import axios from "./axiosInstance";

export const getTodayFollowups = () =>
  axios.get("/followup/today");

export const getUpcomingFollowups = () =>
  axios.get("/followup/upcoming");

export const getMissedFollowups = () =>
  axios.get("/followup/missed");

export const updateFollowupStatus = (id, status, followup_date, notes) =>
  axios.put(`/followup/${id}/status`, { status, followup_date, notes });
