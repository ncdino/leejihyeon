"use client";

import { useState, useEffect, useRef } from "react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

export default function TOC({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (observer.current) {
        observer.current.disconnect();
      }

      const headingElements = Array.from(
        document.querySelectorAll(".prose h1, .prose h2, .prose h3")
      ) as HTMLElement[];

      const newHeadings = headingElements.map((heading) => ({
        level: Number(heading.tagName.substring(1)),
        text: heading.innerText,
        id: heading.id,
      }));
      setHeadings(newHeadings);

      if (headingElements.length > 0) {
        observer.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveId(entry.target.id);
              }
            });
          },
          { rootMargin: "0px 0px -80% 0px" }
        );

        headingElements.forEach((heading) =>
          observer.current?.observe(heading)
        );
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.current?.disconnect();
    };
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block fixed right-5 -translate-x-1/2 top-1/2 -translate-y-1/2 w-64 p-4">
      <div className="flex flex-row">
        <div className="border-2 mr-2 border-neutral-400 dark:border-neutral-600" />
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${heading.level === 2 ? "ml-2" : ""} ${
                heading.level === 3 ? "ml-4" : ""
              }`}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(`#${CSS.escape(heading.id)}`)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`transition-colors ${
                  activeId === heading.id
                    ? "font-bold text-neutral-950 dark:text-neutral-50"
                    : "text-neutral-500 hover:text-blue-800 dark:text-neutral-400 dark:hover:text-blue-400"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
