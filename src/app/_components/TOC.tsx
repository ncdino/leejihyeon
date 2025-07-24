"use client";

import { useEffect, useState } from "react";

export default function TOC() {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll("article h1, article h2, article h3")
    );

    const mapped = els.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: parseInt(el.tagName.replace("H", "")),
    }));

    setHeadings(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden lg:block fixed right-12 top-28 w-64 text-sm">
      <div className="font-bold mb-2">📚 목차</div>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`ml-${(h.level - 1) * 4} ${
              activeId === h.id ? "text-blue-500 font-bold" : ""
            }`}
          >
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
