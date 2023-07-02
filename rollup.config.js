import { spawn } from 'child_process';
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

import fs from "fs";

const production = !process.env.ROLLUP_WATCH;

const indexTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon.png" />
    <link rel="stylesheet" href="/build/bundle.css" />
    <link
      rel="stylesheet"
      href="/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
    />
    <link rel="stylesheet" href="/assets/styles/tailwind.css" />
    <title>Admin</title>

    <script>
      if (process === undefined) {
        var process = { env: {<<process-env-status>>} };
      }
    </script>
    <script defer src="<<live-preview-link>>/build/bundle.js"></script>
  </head>

  <body class="text-slate-700 antialiased">
    <noscript>
      <strong>We're sorry but this site doesn't work properly without
        JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
  </body>
</html>
`;

if (production) {
  fs.writeFileSync(
    "./public/index.html",
    indexTemplate
      .replace("<<process-env-status>>", "PRODUCTION: true")
      .replace(/<<live-preview-link>>/g, "/admin-dashboard")
  );
  fs.writeFileSync(
    "./public/200.html",
    indexTemplate
      .replace("<<process-env-status>>", "PRODUCTION: true")
      .replace(/<<live-preview-link>>/g, "/admin-dashboard")
  );
  fs.writeFileSync(
    "./public/404.html",
    indexTemplate
      .replace("<<process-env-status>>", "PRODUCTION: true")
      .replace(/<<live-preview-link>>/g, "/admin-dashboard")
  );
} else {
  fs.writeFileSync(
    "./public/index.html",
    indexTemplate
      .replace("<<process-env-status>>", "")
      .replace(/<<live-preview-link>>/g, "")
  );
  fs.writeFileSync(
    "./public/200.html",
    indexTemplate
      .replace("<<process-env-status>>", "")
      .replace(/<<live-preview-link>>/g, "")
  );
  fs.writeFileSync(
    "./public/404.html",
    indexTemplate
      .replace("<<process-env-status>>", "")
      .replace(/<<live-preview-link>>/g, "")
  );
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: !production,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
			preprocess: sveltePreprocess({
        sourceMap: !production,
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ['svelte']
    }),
    commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
