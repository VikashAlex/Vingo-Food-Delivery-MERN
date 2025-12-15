import axios from 'axios'
const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});
const formatINRCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

export { AxiosInstance, formatINRCurrency }