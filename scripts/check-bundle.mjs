// Post-build guard (last step of `npm run build`): the client bundle must contain exactly one copy of React.
// Two copies render a blank page ("Cannot read properties of null (reading 'useContext')"). This was seen
// intermittently during development, so the build fails loudly instead of shipping it.
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(import.meta.dirname, '..', 'dist', 'assets')
const defs = []
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
  const n = (fs.readFileSync(path.join(dir, f), 'utf8').match(/.useContext=function/g) ?? []).length
  if (n) defs.push(`${f} (${n})`)
}
if (defs.length !== 1) {
  console.error(`
✗ Bundle check failed: React's API is defined in ${defs.length} chunks: ${defs.join(', ') || 'none'}.
  Expected exactly one. Re-run the build; if it persists, check resolve.dedupe in vite.config.ts.
`)
  process.exit(1)
}
console.log(`bundle check: one React copy (${defs[0]})`)
