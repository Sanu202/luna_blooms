export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  localStorage.removeItem("expiresAt");
}

export async function recordSessionLogout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  await fetch("http://localhost:3000/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getExpiryTime() {
  const expiresAt = localStorage.getItem("expiresAt");

  if (!expiresAt) {
    return null;
  }

  const expiryTime = new Date(expiresAt).getTime();

  return Number.isNaN(expiryTime) ? null : expiryTime;
}

export function isSessionExpired() {
  const expiryTime = getExpiryTime();

  return expiryTime === null || Date.now() >= expiryTime;
}
