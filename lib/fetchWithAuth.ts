export const fetchWithAuth = async (url: RequestInfo, options = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    // refresh access token
    const refreshRes = await fetch("/api/refresh-token", {
      method: "GET",
      credentials: "include",
    });
    

  if (refreshRes.ok) {
    // Retry the original request
    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  } else {
    // Refresh also failed → logout or redirect
    window.location.href = "/auth/sign-in";
    throw new Error("Unauthorized and refresh failed");
  }
  }
  return res;
};
