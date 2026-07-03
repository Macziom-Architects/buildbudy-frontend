/**
 * BuildBudy's product catalogue is scraped from 50+ independent seller
 * domains (see buildbudy_products.json / src/lib/data/products.json), and
 * that list keeps growing as new products are added. Next.js's
 * `images.remotePatterns` allowlist is capped at 50 entries, so hardcoding
 * (or even auto-deriving) a per-hostname list is a moving target that will
 * eventually hit the ceiling and crash the build again.
 *
 * Disabling built-in image optimization removes the hostname allowlist
 * requirement entirely — every external image URL is allowed, regardless of
 * which seller domain it comes from — while `SafeImage`
 * (src/components/ui/SafeImage.jsx) still guards every render against a
 * 404/broken URL by swapping in a local placeholder on error.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
