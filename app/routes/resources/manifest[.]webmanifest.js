import { json } from "@remix-run/node";

export let loader = () => {
  return json(
    {
      short_name: "inradius",
      name: "inradius",
      start_url: "/",
      display: "standalone",
      theme_color: "#000000",
      background_color: "#ffffff",
      icons: [
        {
          src: "../../favicon.svg",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon",
        },
        {
          src: "../../logo192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "../../logo512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json",
      },
    }
  );
};
