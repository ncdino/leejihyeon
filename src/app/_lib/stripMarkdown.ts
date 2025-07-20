// Preview에서 태그제거
// (html 태그, 마크다운 이미지, 헤더, 굵게, 이태릭체, 링크에서 텍스트 추출, 줄바꿈 -> 띄어쓰기)

export const stripMarkdown = (markdown: string): string => {
  return markdown
    .replace(/<[^>]*>?/gm, "")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "")
    .replace(/#+\s/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\n/g, " ");
};
