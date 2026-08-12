# Project instructions

This is a Next.js App Router project using TypeScript.

## Animation requirements

- Use GSAP and ScrollTrigger.
- Use @gsap/react useGSAP for React animation cleanup.
- Animation must be deterministic.
- Do not use generative video.
- Do not redesign the page.
- Do not change existing branding unless explicitly requested.
- Use the reference video in public/reference/scroll-transition.mp4.
- Analyse the reference before implementing the animation.
- Use transforms, opacity, masks and clip-path.
- Do not continuously animate CSS width and height when scale can be used.
- Do not add bounce, elastic motion, rotation or unnecessary blur.
- Preserve native scrolling during the first implementation.
- Do not add Lenis until the native-scroll version is approved.

## Validation

Run:

npm run lint
npm run build

Create Playwright screenshots for comparison if Playwright is available.
Fix all console errors and hydration warnings before finishing.