const s = 'simple-icons:';
const l = 'logos:';

// url, icon, background color, content color
export const websites: Record<string, [string, string, string?, string?]> = {
  Amazon: ['www.amazon.com', s + 'amazon', 'FF9900', 'FFFFFF'],
  GitHub: ['github.com', s + 'github', '181717', 'FFFFFF'],
  Google: ['www.google.com', l + 'google-icon'],
  Microsoft: ['www.microsoft.com', l + 'microsoft-icon'],
  Netflix: ['www.netflix.com', s + 'netflix', '000000', 'E50914'],
  Pinterest: ['www.pinterest.com', s + 'pinterest', 'BD081C', 'FFFFFF'],
  Reddit: ['www.reddit.com', s + 'reddit', 'FF4500', 'FFFFFF'],
  quora: ['www.quora.com', s + 'quora', 'B92B27', 'FFFFFF'],
  Ubiquiti: ['ui.com', s + 'ubiquiti', '0559C9', 'FFFFFF'],
  Wikipedia: ['www.wikipedia.org', s + 'wikipedia', 'FFFFFF', '000000'],
  YouTube: ['www.youtube.com', s + 'youtube', undefined, 'FF0000'],
};
