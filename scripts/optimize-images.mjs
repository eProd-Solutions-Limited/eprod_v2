// One-off image optimizer: downscales oversized raster assets to a web-sane size
// and recompresses them in place. Originals are backed up first (this repo has no git).
//
// Usage:  node scripts/optimize-images.mjs
//
// Safe by design:
//  - never enlarges an image
//  - only overwrites when the new file is smaller
//  - copies the untouched original to ./perf-image-backup/<relative-path> first

import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BACKUP_DIR = path.join(root, 'perf-image-backup')
const MAX_EDGE = 1920 // longest side; matches next.config deviceSizes cap
const DIRS = [path.join(root, 'src', 'assets'), path.join(root, 'public')]
const EXfTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

async function walk(dir) {
  let out = []
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (full === BACKUP_DIR) continue
      out = out.concat(await walk(full))
    } else if (EXfTS.has(path.extname(e.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}

async function reencode(buf, ext) {
  const img = sharp(buf, { failOn: 'none' }).rotate()
  const meta = await img.metadata()
  if ((meta.width ?? 0) > MAX_EDGE || (meta.height ?? 0) > MAX_EDGE) {
    img.resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
  }
  if (ext === '.png') {
    return img.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
  }
  if (ext === '.webp') {
    return img.webp({ quality: 80 }).toBuffer()
  }
  return img.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer()
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`
}

const files = (await Promise.all(DIRS.map(walk))).flat()
let savedTotal = 0
let changed = 0

for (const file of files) {
  const ext = path.extname(file).toLowerCase()
  const original = await fs.readFile(file)
  let out
  try {
    out = await reencode(original, ext)
  } catch (err) {
    console.warn(`skip (decode error): ${path.relative(root, file)} — ${err.message}`)
    continue
  }
  if (out.length >= original.length) continue // never make it bigger

  // Back up the untouched original once.
  const rel = path.relative(root, file)
  const backupPath = path.join(BACKUP_DIR, rel)
  await fs.mkdir(path.dirname(backupPath), { recursive: true })
  try {
    await fs.access(backupPath)
  } catch {
    await fs.writeFile(backupPath, original)
  }

  await fs.writeFile(file, out)
  const saved = original.length - out.length
  savedTotal += saved
  changed++
  console.log(`${rel}: ${fmt(original.length)} -> ${fmt(out.length)}  (-${fmt(saved)})`)
}

console.log(`\nOptimized ${changed} image(s). Total saved: ${(savedTotal / 1024 / 1024).toFixed(1)} MB`)
console.log(`Originals backed up in: ${path.relative(root, BACKUP_DIR)}`)
