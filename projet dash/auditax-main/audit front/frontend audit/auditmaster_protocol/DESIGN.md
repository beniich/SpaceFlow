---
name: AuditMaster Protocol
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#45474c'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#00190e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00301e'
  on-tertiary-container: '#00a472'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  mono-status:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  sidebar-width: 280px
  gutter: 24px
  margin-page: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for uncompromising integrity and forensic precision. It serves auditors and compliance officers who operate in high-stakes environments where clarity is synonymous with security. 

The aesthetic blends **Corporate Modernism** with **Technical Minimalism**. It prioritizes a "glass-box" philosophy—nothing is hidden, and every data point is traceable. The UI evokes an emotional response of absolute stability through heavy vertical alignment, generous whitespace in content areas, and high-contrast status indicators that mirror cryptographic verification logs.

## Colors
The palette is divided into two functional zones: Navigation and Operations. 

- **Structural Foundation:** The sidebar utilizes "Deep Cobalt" (#1e293b) to create a definitive anchor for the application hierarchy, signifying authority.
- **Surface & Canvas:** The main workspace uses "Slate Content Background" (#f1f5f9) to reduce eye strain during prolonged audits, while "Professional Gray Borders" (#e2e8f0) define structural boundaries without adding visual noise.
- **Action & Verification:** "Electric Blue" (#3b82f6) is reserved exclusively for interactive elements and primary workflows. "Emerald Success" (#10b981) is used for "Verified" or "Pass" states, providing a high-visibility signal of compliance.

## Typography
This design system employs a dual-typeface strategy to distinguish between UI orchestration and raw evidence.

- **Inter:** Used for all navigational elements, form labels, and standard prose. It provides a neutral, highly readable foundation that feels institutional and modern.
- **JetBrains Mono:** Utilized for technical logs, hash strings, financial figures, and cryptographic statuses. The monospaced nature emphasizes the "rigor" of the platform, suggesting that every digit is aligned and accounted for.
- **Hierarchy:** Use all-caps labels for section headers to evoke a sense of "Official Documentation."

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains at a fixed 280px width to ensure navigation labels are never truncated, while the content area utilizes a fluid grid with a maximum container width of 1440px to maintain readability.

Verticality is the primary driver of workflow. Content is stacked in a "Step-by-Step" hierarchy using a 4px baseline rhythm. Large margins (40px) surround the main work area to create a "sanctuary" for deep focus, reflecting the precision required for audit tasks.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering and Low-Contrast Outlines** rather than aggressive shadows. 

The background is the lowest layer (#f1f5f9). Work containers (Cards) are set in pure white (#ffffff) with a 1px solid border (#e2e8f0). To indicate focus or active states, use a subtle 4px blur shadow with 5% opacity. This "flat-plus" approach ensures the UI feels like a digital ledger—stable, tactile, and permanent—rather than a series of floating elements.

## Shapes
The shape language is conservative and disciplined. A "Soft" (0.25rem) radius is applied to standard components like input fields and buttons to prevent the UI from feeling hostile, but large cards and containers maintain crisp, sharp definitions. This subtle rounding suggests a modern tool, while the predominantly straight lines reinforce the "rigor" of the audit process.

## Components
- **Minimalist Cards:** No heavy shadows. Use 1px borders (#e2e8f0). Header areas within cards should have a subtle gray bottom-border to separate metadata from content.
- **Cryptographic Status Indicators:** Use JetBrains Mono text inside a small, high-contrast pill. For example, a "Verified" status uses a light emerald background with dark emerald text and a leading "check" icon.
- **Workflows:** Use vertical "steppers" on the left side of complex forms to indicate progress. The active step is marked with the Electric Blue accent.
- **Buttons:** Primary buttons use solid Electric Blue (#3b82f6) with white text. Secondary buttons use a white fill with a Professional Gray border (#e2e8f0).
- **Data Tables:** High-density grids with no vertical lines. Use horizontal zebra-striping (Slate #f1f5f9) and JetBrains Mono for all numeric values to ensure column alignment.
- **Audit Trails:** A specialized component using monospaced text and a vertical timeline thread to show a chronological record of changes.