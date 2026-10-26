import axios from "axios";

// Read API Base URL from environment or fall back to localhost in dev
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");

// Automatically route any Axios calls to the configured API base URL
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes("http://localhost:5000")) {
    config.url = config.url.replace("http://localhost:5000", API_BASE_URL);
  }
  return config;
});

// Automatically route any window.fetch calls to the configured API base URL
const originalFetch = window.fetch;
window.fetch = function (resource, options) {
  if (typeof resource === "string" && resource.includes("http://localhost:5000")) {
    resource = resource.replace("http://localhost:5000", API_BASE_URL);
  } else if (resource instanceof Request && resource.url.includes("http://localhost:5000")) {
    resource = new Request(resource.url.replace("http://localhost:5000", API_BASE_URL), options || resource);
  }
  return originalFetch.call(this, resource, options);
};

export { API_BASE_URL };
