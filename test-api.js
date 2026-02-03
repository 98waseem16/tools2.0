// Quick API test script
// Run with: node test-api.js

const apiKey = 'MjM2OTE5YWFiM2'

// Test different possible base URLs
const testUrls = [
  'https://api.sendmarc.com/nightcrawler/lookup/dmarc/google.com',
  'https://api.sendmarc.com/nightcrawler/explain/dmarc/google.com',
  'https://nightcrawler.sendmarc.com/api/lookup/dmarc/google.com',
  'https://api.nightcrawler.sendmarc.com/lookup/dmarc/google.com',
  'https://sendmarc.com/api/nightcrawler/lookup/dmarc/google.com',
]

async function testUrl(url) {
  try {
    console.log(`\nTesting: ${url}`)
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(`  Status: ${response.status} ${response.statusText}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`  Success! Response:`, JSON.stringify(data, null, 2).slice(0, 200))
      return true
    } else {
      const text = await response.text()
      console.log(`  Error response:`, text.slice(0, 200))
    }
  } catch (error) {
    console.log(`  Failed: ${error.message}`)
  }
  return false
}

async function runTests() {
  console.log('='.repeat(60))
  console.log('Nightcrawler API URL Test')
  console.log('='.repeat(60))
  console.log(`API Key: ${apiKey.slice(0, 5)}...`)

  for (const url of testUrls) {
    const success = await testUrl(url)
    if (success) {
      console.log(`\n✅ Found working URL: ${url}`)
      console.log(`   Base URL would be: ${url.split('/lookup')[0].split('/explain')[0]}`)
      break
    }
  }

  console.log('\n' + '='.repeat(60))
}

runTests()
