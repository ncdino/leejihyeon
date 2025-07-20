import localFont from "next/font/local";

export const paperlogy = localFont({
  src: [
    {
      path: "../../public/fonts/Paperlogy-4Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Paperlogy-7Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-paperlogy",
});
