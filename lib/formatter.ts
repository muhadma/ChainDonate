export function initialsFromAddress(addr: string) {
  const parts = addr.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4);
  return parts.slice(-2).toUpperCase();
}

export function colorFromAddr(addr: string) {
  let hash = 0;
  for (let i = 0; i < addr.length; i++) {
    hash = addr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"000000".slice(0, 6 - c.length) + c}`;
}

export function timeAgoFrom(dateStr: string) {
  const d = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}
