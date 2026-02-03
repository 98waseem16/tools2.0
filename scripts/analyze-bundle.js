#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 *
 * Analyzes the Next.js build output to identify:
 * - Large bundles that could be code-split
 * - Duplicate dependencies
 * - Opportunities for tree-shaking
 * - Route-level bundle sizes
 */

const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.join(__dirname, '../.next')
const BUILD_MANIFEST = path.join(BUILD_DIR, 'build-manifest.json')

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (error) {
    return 0
  }
}

function analyzeBuildManifest() {
  console.log('\n🔍 Analyzing Next.js Bundle...\n')

  if (!fs.existsSync(BUILD_MANIFEST)) {
    console.error('❌ Build manifest not found. Run `npm run build` first.')
    process.exit(1)
  }

  const manifest = JSON.parse(fs.readFileSync(BUILD_MANIFEST, 'utf-8'))

  // Analyze pages
  const pages = manifest.pages || {}
  const pageAnalysis = []

  for (const [route, files] of Object.entries(pages)) {
    let totalSize = 0

    files.forEach((file) => {
      const filePath = path.join(BUILD_DIR, file)
      totalSize += getFileSize(filePath)
    })

    pageAnalysis.push({
      route,
      size: totalSize,
      fileCount: files.length,
    })
  }

  // Sort by size
  pageAnalysis.sort((a, b) => b.size - a.size)

  // Display results
  console.log('📊 Page Bundle Sizes:\n')
  console.log('Route'.padEnd(50), 'Size'.padEnd(15), 'Files')
  console.log('-'.repeat(75))

  pageAnalysis.forEach(({ route, size, fileCount }) => {
    const sizeFormatted = formatBytes(size)
    const warning = size > 250 * 1024 ? '⚠️ ' : '  '
    console.log(
      `${warning}${route.padEnd(50)} ${sizeFormatted.padEnd(15)} ${fileCount}`
    )
  })

  // Calculate totals
  const totalSize = pageAnalysis.reduce((sum, p) => sum + p.size, 0)
  const avgSize = totalSize / pageAnalysis.length

  console.log('-'.repeat(75))
  console.log(`Total: ${formatBytes(totalSize)}`)
  console.log(`Average: ${formatBytes(avgSize)}`)
  console.log(`Pages: ${pageAnalysis.length}`)

  // Warnings
  console.log('\n⚠️  Warnings:\n')

  const largeBundles = pageAnalysis.filter((p) => p.size > 250 * 1024)
  if (largeBundles.length > 0) {
    console.log(
      `${largeBundles.length} page(s) exceed 250KB - consider code splitting:`
    )
    largeBundles.forEach((p) => {
      console.log(`  - ${p.route} (${formatBytes(p.size)})`)
    })
  } else {
    console.log('✅ All pages are under 250KB')
  }

  // Recommendations
  console.log('\n💡 Recommendations:\n')

  if (largeBundles.length > 0) {
    console.log('1. Use dynamic imports for large components:')
    console.log('   import dynamic from "next/dynamic"')
    console.log('   const HeavyComponent = dynamic(() => import("./HeavyComponent"))')
  }

  console.log('2. Check for duplicate dependencies:')
  console.log('   npm ls <package-name>')

  console.log('3. Use tree-shaking friendly imports:')
  console.log('   import { Button } from "./components/ui/Button" ✅')
  console.log('   import { Button } from "./components" ❌')

  console.log('4. Analyze with official tool:')
  console.log('   npm install -g @next/bundle-analyzer')
  console.log('   ANALYZE=true npm run build')

  console.log('\n✅ Analysis complete!\n')
}

// Analyze static assets
function analyzeStaticAssets() {
  const staticDir = path.join(BUILD_DIR, 'static')

  if (!fs.existsSync(staticDir)) {
    return
  }

  console.log('\n📦 Static Assets:\n')

  const chunks = path.join(staticDir, 'chunks')
  if (fs.existsSync(chunks)) {
    const chunkFiles = fs.readdirSync(chunks)
    let totalSize = 0

    chunkFiles.forEach((file) => {
      const filePath = path.join(chunks, file)
      const size = getFileSize(filePath)
      totalSize += size

      if (size > 100 * 1024) {
        // Show chunks > 100KB
        console.log(`  ${file.padEnd(50)} ${formatBytes(size)}`)
      }
    })

    console.log(`\nTotal chunks size: ${formatBytes(totalSize)}`)
  }
}

// Run analysis
analyzeBuildManifest()
analyzeStaticAssets()
