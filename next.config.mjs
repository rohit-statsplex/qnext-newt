/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
// import { env } from "process";

/** @type {import("next").NextConfig} */
const config = {
  // experimental: {
  //   esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  // },
  reactStrictMode: true,
  env: {
    API_BASE: process.env.API_BASE,
    API_AUTH: process.env.API_AUTH,
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    unoptimized: true,
  },
};
export default config;
