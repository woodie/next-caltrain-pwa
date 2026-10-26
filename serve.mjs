// Local static server for `npm run server`, mirroring app.yaml's handlers:
// webapp/ at the site root and the frozen feed at /feed/schedule.json.
// Keep it in step with app.yaml.
import { createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const PORT = Number(process.env.PORT) || 8000

const TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webapp': 'application/x-web-app-manifest+json',
  '.webmanifest': 'application/manifest+json',
}

// Same order as app.yaml: exceptions first, then the webapp/ catch-all.
function filePath (urlPath) {
  if (urlPath === '/') return 'webapp/index.html'
  if (urlPath === '/feed/schedule.json') return 'feed/schedule.json'
  return join('webapp', normalize(urlPath))
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const file = resolve(ROOT, filePath(urlPath))
  const inside = file.startsWith(resolve(ROOT, 'webapp') + sep) ||
    file === resolve(ROOT, 'feed/schedule.json')
  let found = false
  try {
    found = inside && statSync(file).isFile()
  } catch {}
  console.log(`${req.method} ${urlPath} ${found ? 200 : 404}`)
  if (!found) {
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('Not found\n')
    return
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    'cache-control': 'no-cache',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => {
  console.log(`Serving app.yaml routes at http://localhost:${PORT}/`)
})
