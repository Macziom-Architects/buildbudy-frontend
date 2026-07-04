"use client";

import { useState } from "react";
import Image from "next/image";

export const IMAGE_FALLBACK_SRC = "/image-placeholder.svg";

/**
 * Drop-in replacement for next/image that swaps to a local placeholder
 * whenever the remote image fails to load (404, DNS failure, unconfigured
 * host, CORS, etc.) instead of letting the broken image (or a Next.js
 * image-loader crash) take down the page.
 */
export default function SafeImage({ src, alt = "", fallbackSrc = IMAGE_FALLBACK_SRC, onError, ...props }) {
  const [errored, setErrored] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset the error state when a new src comes in (e.g. gallery thumbnail
  // click, carousel item change) — updating state during render, rather than
  // in an effect, per React's "adjusting state when a prop changes" pattern.
  if (src !== prevSrc) {
    setPrevSrc(src);
    setErrored(false);
  }

  function handleError(e) {
    setErrored(true);
    onError?.(e);
  }

  return (
    <Image
      {...props}
      src={errored ? fallbackSrc : (src || fallbackSrc)}
      alt={alt}
      onError={handleError}
    />
  );
}
