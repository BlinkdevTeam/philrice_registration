"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { WalkinForm } from "../types/walkin";

export default function PrintIDCard({
  participant,
}: {
  participant: WalkinForm;
}) {
  const fullName = `${participant.firstName} ${participant.lastName}`.trim();
  const affiliation =
    participant.philriceName || participant.affiliationName || "N/A";

  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const affRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [nameFontPx, setNameFontPx] = useState<number>(22);
  const [affFontPx, setAffFontPx] = useState<number>(12);

  // Generic fit function: shrink font until element fits in its clientWidth (single line)
  const fitTextToWidth = (
    el: HTMLElement | null,
    initialPx: number,
    minPx: number
  ) => {
    if (!el) return initialPx;
    // Temporarily force single-line for fitting
    const prevWhite = el.style.whiteSpace;
    el.style.whiteSpace = "nowrap";

    let size = initialPx;
    el.style.fontSize = `${size}px`;

    // fast shrink loop; stop at minPx
    while (el.scrollWidth > el.clientWidth && size > minPx) {
      // decrement step: adaptively faster if needed
      const overflow = el.scrollWidth - el.clientWidth;
      const step = overflow > 100 ? Math.ceil(overflow / 20) : 1;
      size = Math.max(minPx, size - step);
      el.style.fontSize = `${size}px`;
    }

    // restore whiteSpace to original (allow wrap) for non-name elements if desired
    el.style.whiteSpace = prevWhite;
    return size;
  };

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const fitAll = () => {
      const nameEl = nameRef.current;
      const affEl = affRef.current;
      if (nameEl) {
        const newNamePx = fitTextToWidth(nameEl, 18, 10);
        setNameFontPx(newNamePx);
      }
      if (affEl) {
        // For affiliation we usually allow up to 2 lines — but to keep it simple we shrink to fit single-line width,
        // then restore wrapping so it can occupy multiple lines if still needed.
        // We'll measure against the same clientWidth as name (or affEl.clientWidth).
        const newAffPx = fitTextToWidth(affEl, 12, 8);
        setAffFontPx(newAffPx);
      }
    };

    // Initial fit
    fitAll();

    // Re-fit on resize using ResizeObserver (handles responsive)
    const ro = new ResizeObserver(() => {
      fitAll();
    });
    ro.observe(node);

    // Clean up
    return () => ro.disconnect();
  }, [fullName, affiliation]);

  return (
    <div
      ref={containerRef}
      className="id-card relative bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden w-64 h-96"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/PHILRICE_ID.jpg"
          alt="ID Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-white h-full p-5">
        <div className="absolute bottom-[1.5rem] left-5 flex items-center w-full">
          {/* QR Code */}
          <div className="mt-4 bg-white p-2 rounded-lg">
            {participant.qrdata ? (
              <QRCodeCanvas
                value={participant.qrdata}
                size={65}
                bgColor="#ffffff"
                fgColor="#006872"
                level="M"
                includeMargin={false}
              />
            ) : (
              <p className="text-xs text-gray-600">No QR data</p>
            )}
          </div>

          {/* Name and Affiliation */}
          <div className="flex flex-col justify-between items-center text-center max-w-[240px] w-full pr-4 gap-4">
            {/* Full Name with dynamic font */}
            <h2
              ref={nameRef}
              className="font-bold uppercase text-[#006872] text-center leading-tight"
              style={{
                fontSize: `${nameFontPx}px`,
                lineHeight: 2,
                whiteSpace: "nowrap", // measure single-line; component will still render with this but font scaled to fit
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={fullName}
            >
              {fullName}
            </h2>

            {/* Affiliation - allow wrapping but shrink to fit width first */}
            <p
              ref={affRef}
              className="text-center opacity-90 break-words"
              style={{
                fontSize: `${affFontPx}px`,
              }}
              title={affiliation}
            >
              {affiliation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
