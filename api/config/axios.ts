import axios from "axios";
import Constants from "expo-constants";

const configs = Constants?.expoConfig?.extra;
const malApiUrl = configs?.malApiUrl;
const backendUrl = configs?.backendUrl;
const clientId = configs?.clientId;

export const axiosInstanceBackend = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceMal = axios.create({
  baseURL: malApiUrl,
  headers: {
    "Content-Type": "application/json",
    "X-MAL-CLIENT-ID": clientId,
  },
});

// Call this once after login / token changes
export function setAuthToken(token: string | null) {
  if (token) {
    axiosInstanceBackend.defaults.headers.common["authorization"] =
      `Bearer ${token}`;
  } else {
    delete axiosInstanceBackend.defaults.headers.common["authorization"];
  }
}
