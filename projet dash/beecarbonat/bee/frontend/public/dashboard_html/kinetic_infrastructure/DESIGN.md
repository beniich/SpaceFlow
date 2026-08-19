---
name: Kinetic Infrastructure
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ddc1b1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a58c7d'
  outline-variant: '#564336'
  surface-tint: '#ffb787'
  primary: '#ffb787'
  on-primary: '#502400'
  primary-container: '#f38020'
  on-primary-container: '#592900'
  inverse-primary: '#964900'
  secondary: '#ddfcff'
  on-secondary: '#00363a'
  secondary-container: '#00f1fe'
  on-secondary-container: '#006a70'
  tertiary: '#c5c6cb'
  on-tertiary: '#2e3134'
  tertiary-container: '#9d9fa4'
  on-tertiary-container: '#34363a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc7'
  primary-fixed-dim: '#ffb787'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#723600'
  secondary-fixed: '#74f5ff'
  secondary-fixed-dim: '#00dbe7'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#e1e2e7'
  tertiary-fixed-dim: '#c5c6cb'
  on-tertiary-fixed: '#191c1f'
  on-tertiary-fixed-variant: '#44474b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  sidebar-width: 260px
  header-height: 64px
---

## Brand & Style
This design system establishes a high-performance, futuristic atmosphere for professional facility management. The brand personality is precise, authoritative, and technologically advanced, designed to make complex data feel manageable and cutting-edge.

The aesthetic blends **Glassmorphism** with **Technical Minimalism**. It utilizes deep obsidian backgrounds and translucent surfaces to create a sense of infinite depth, while neon accents draw immediate focus to critical operational metrics. The UI should evoke the feeling of a mission control center—stable, responsive, and powerful.

## Colors
The palette is rooted in an "Onyx & Neon" scheme. 

- **Primary (#f38020):** A vivid orange used exclusively for primary actions, critical alerts, and active states. It provides high contrast against the dark base.
- **Secondary (#00f2ff):** Electric cyan used for technical highlights, data visualization trends, and "online" status indicators.
- **Base (#05070a):** The "Onyx" foundation. Use this for the deepest background layer.
- **Surface (#1a1a1a):** The primary container color. When used with glassmorphism, this should be semi-transparent with a heavy backdrop blur.

## Typography
The typography system prioritizes legibility in high-density data environments. 

- **Inter** is the workhorse font, used for all interface elements and body text to ensure a professional, neutral tone.
- **JetBrains Mono** (monospaced) is used for technical labels, sensor readings, and coordinate data to reinforce the engineering SaaS aesthetic.
- **All-caps** should be applied to `label-sm` for section headers and metadata to provide a clear hierarchy against body text.

## Layout & Spacing
The layout follows a **structured grid system** inspired by technical dashboards. 

- **Grid:** Use a 12-column fluid grid for the main content area.
- **Side Navigation:** A fixed left-hand sidebar (260px) houses the primary navigation, utilizing a semi-transparent glass effect.
- **Consistency:** All margins and paddings must be multiples of the 4px base unit to maintain a tight, engineered feel.
- **Density:** Use "Compact" spacing for data tables and "Spacious" spacing for analytical overview cards.

## Elevation & Depth
Depth is created through transparency and light, rather than traditional heavy shadows.

- **Surface Layers:** The background is the lowest layer. Cards and modals sit above this with a `backdrop-filter: blur(12px)` and a `background: rgba(26, 26, 26, 0.7)`.
- **Borders:** Surfaces are defined by 1px "inner-glow" borders. Use a subtle gradient or a low-opacity version of the accent colors (Orange or Cyan) for the border to simulate a light-catch on glass.
- **Glow Effects:** Critical components (like active buttons or alert states) use a `box-shadow` with a large spread and low opacity matching the component's color to create a "neon" aura.

## Shapes
The shape language is "Soft-Technical." Elements use a subtle 0.25rem (4px) radius to maintain a clean, professional edge without appearing sharp or aggressive. Large containers (cards) may use up to 0.5rem (8px) to distinguish them from smaller UI widgets. Interactive elements like toggle switches and status chips should remain pill-shaped for immediate recognition.

## Components
- **Buttons:** Primary buttons are solid Orange (#f38020) with white or black text. Secondary buttons are ghost-style with a subtle orange border and a hover glow effect.
- **Frosted Glass Cards:** Use for all dashboard widgets. Must include a 1px border (`rgba(255,255,255,0.1)`) and a background blur.
- **Interactive Charts:** Lines should be Cyan or Orange. Areas under the lines should use a vertical gradient fading from the accent color to transparent.
- **Inputs:** Darker than the card surface (#0a0a0a) with a 1px bottom border. On focus, the border glows Cyan.
- **Status Chips:** Small, monospaced text. Use a "pulse" animation (small glowing dot) next to the text for live sensor data.
- **Navigation:** Icons should be thin-stroke (1.5px) and transition from gray to Cyan on active states.