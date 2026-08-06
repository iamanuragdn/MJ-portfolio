const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Relative storage paths (/api/files/...) get the backend prefix; external URLs pass through.
export const mediaUrl = (u) => {
  if (!u) return u;
  return u.startsWith("http") ? u : `${BACKEND_URL}${u}`;
};
