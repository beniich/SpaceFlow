import { Color } from "three";

const STOPS = [
  { t: 0.0,  color: [0.0, 0.45, 0.95] },
  { t: 0.25, color: [0.4, 0.35, 0.8]  },
  { t: 0.5,  color: [0.9, 0.4,  0.2]  },
  { t: 0.75, color: [1.0, 0.25, 0.15] },
  { t: 1.0,  color: [1.0, 0.15, 0.05] },
];

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

export function valueToColor(value, min = 0, max = 100) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const s1 = STOPS[i];
    const s2 = STOPS[i + 1];
    if (t >= s1.t && t <= s2.t) {
      const lt = (t - s1.t) / (s2.t - s1.t);
      const c = lerpColor(s1.color, s2.color, lt);
      return new Color(c[0], c[1], c[2]);
    }
  }
  return new Color(0, 0, 1);
}

export function getHeatLabel(value) {
  if (value < 25) return { label: "Cold", tone: "cool" };
  if (value < 50) return { label: "Normal", tone: "moderate" };
  if (value < 75) return { label: "Warm", tone: "warm" };
  return { label: "Critical", tone: "hot" };
}
