import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Heading, Text } from "mdast";
import type { VFile } from "vfile";

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

const extractTocPlugin: Plugin<[], Root> = () => {
  return (tree: Root, file: VFile) => {
    const toc: TocEntry[] = [];

    visit(tree, "heading", (node: Heading) => {
      const text = node.children
        .filter((child): child is Text => child.type === "text")
        .map((child) => child.value)
        .join("");

      const id = (node.data?.hProperties?.id as string) || "";

      if (text && id) {
        toc.push({
          level: node.depth,
          text,
          id,
        });
      }
    });

    file.data.toc = toc;
  };
};

export default extractTocPlugin;
