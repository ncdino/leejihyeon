import { visit } from "unist-util-visit";
import { slug } from "github-slugger";

export interface Toc {
  text: string;
  slug: string;
  level: number;
}

export function remarkExtractToc(toc: Toc[]) {
  return () => {
    return (tree: any) => {
      visit(tree, "heading", (node) => {
        const depth = node.depth;
        if (depth > 3) return; // 일단 h1~3만

        const text = node.children
          .filter(
            (child: any) => child.type === "text" || child.type === "inlineCode"
          )
          .map((child: any) => child.value)
          .join("");

        const id = slug(text);
        toc.push({ text, slug: id, level: depth });

        node.data = {
          ...node.data,
          id,
          hProperties: {
            id,
          },
        };
      });
    };
  };
}
