/** Express API origin. Empty when the page is already served from port 5000 (same server). */
window.API_BASE =
  location.port === "5000"
    ? ""
    : `${location.protocol}//${location.hostname}:5000`;

/** Use for paths like `uploads/file.jpg` so they load from Express, not Live Server. */
window.mediaUrl = function (path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const p = String(path).replace(/^\/+/, "").replace(/\\/g, "/");
  const base = window.API_BASE || "";
  return base ? `${base}/${p}` : `/${p}`;
};
