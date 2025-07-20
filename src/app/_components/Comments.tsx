"use client";

import Giscus from "@giscus/react";
import { useThemeStore } from "../_store/themeStore";

export default function Comments() {
  const { theme } = useThemeStore();
  return (
    <div className="mt-12">
      <Giscus
        id="comments"
        repo="ncdino/leejihyeon-dev-comment"
        repoId="R_kgDOPPXJLg"
        category="Announcements"
        categoryId="DIC_kwDOPPXJLs4CtLpq"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="ko"
      />
    </div>
  );
}
