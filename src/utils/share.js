// Shared social-share helper. Builds per-network share-intent URLs and opens
// them, so the About section and the detail page don't each carry their own copy
// of the intent map.

const buildLinks = (url, text) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    email: `mailto:?subject=${t}&body=${u}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
  };
};

// Open a specific network's share intent. `email` navigates (mailto), everything
// else opens a popup/new tab.
export const shareTo = (network, { url, text } = {}) => {
  const links = buildLinks(url, text);
  const link = links[network];
  if (!link) return;
  if (network === "email") {
    window.location.href = link;
    return;
  }
  window.open(link, "_blank", "noopener,noreferrer");
};

// Try the native share sheet first (mobile / supported browsers); fall back to a
// default network intent so the button always does something.
export const shareNative = async ({ url, text, fallback = "twitter" } = {}) => {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: text, text, url });
      return;
    } catch (err) {
      // User cancelled or share failed — fall through to the intent fallback.
      if (err && err.name === "AbortError") return;
    }
  }
  shareTo(fallback, { url, text });
};
