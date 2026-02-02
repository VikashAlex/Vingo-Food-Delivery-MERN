import axios from 'axios'
import { io } from "socket.io-client";
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
});
const formatINRCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}
const socket = io(
  import.meta.env.VITE_APP_API_BASE_URL,
  { withCredentials: true }
);

export { AxiosInstance, formatINRCurrency,socket }