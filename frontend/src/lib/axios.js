import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://13.60.180.235:5001/api",
  withCredentials: true,
});
