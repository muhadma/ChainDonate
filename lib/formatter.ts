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

export function parseDateMs(dateStr: string) {
  const trimmed = dateStr.trim();
  let normalized = trimmed;

  if (/^\d{4}-\d{2}-\d{2} /.test(normalized)) {
    normalized = normalized.replace(" ", "T");
  }

  if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized)) {
    normalized = `${normalized}Z`;
  } else if (/[+-]\d{2}\d{2}$/.test(normalized)) {
    normalized = normalized.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  } else if (/[+-]\d{2}$/.test(normalized)) {
    normalized = normalized.replace(/([+-]\d{2})$/, "$1:00");
  }

  const parsed = new Date(normalized).getTime();
  if (!Number.isNaN(parsed)) return parsed;

  return new Date(trimmed).getTime();
}

export function timeAgoFrom(dateStr: string) {
  const d = parseDateMs(dateStr);
  const now = Date.now();
  if (Number.isNaN(d)) return "Unknown time";
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}
