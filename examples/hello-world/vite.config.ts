import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Plugin } from "vite"
import { execSync } from "child_process"

const version = execSync("git describe --abbrev=0 --always").toString().trim()
const commit = execSync("git rev-parse --short HEAD").toString().trim()

function injectBuildInfoPlugin(): Plugin {
  return {
    name: "vite-plugin-inject-build-info",
    transformIndexHtml(html) {
      const buildInfo = {
        version,
        commit,
        buildTime: new Date().toISOString(),
      }
      return html.replace(
        "</head>",
        `  <script>window.buildInfo = ${JSON.stringify(buildInfo)};</script>\n</head>`,
      )
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectBuildInfoPlugin()],

})
