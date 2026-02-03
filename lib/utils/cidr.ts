/**
 * CIDR calculation utilities
 */

export interface CIDRInfo {
  cidr: string
  ipAddress: string
  networkAddress: string
  broadcastAddress: string
  subnetMask: string
  wildcardMask: string
  firstUsableIP: string
  lastUsableIP: string
  totalHosts: number
  usableHosts: number
  prefixLength: number
}

/**
 * Convert IP address to 32-bit integer
 */
function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

/**
 * Convert 32-bit integer to IP address
 */
function intToIp(int: number): string {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff,
  ].join('.')
}

/**
 * Validate IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false

  return parts.every((part) => {
    const num = Number(part)
    return !isNaN(num) && num >= 0 && num <= 255 && part === String(num)
  })
}

/**
 * Validate CIDR notation
 */
export function isValidCIDR(cidr: string): boolean {
  const parts = cidr.split('/')
  if (parts.length !== 2) return false

  const [ip, prefix] = parts
  const prefixNum = Number(prefix)

  return isValidIPv4(ip) && !isNaN(prefixNum) && prefixNum >= 0 && prefixNum <= 32
}

/**
 * Calculate CIDR information from CIDR notation
 */
export function calculateCIDR(cidr: string): CIDRInfo {
  if (!isValidCIDR(cidr)) {
    throw new Error('Invalid CIDR notation')
  }

  const [ip, prefixStr] = cidr.split('/')
  const prefixLength = Number(prefixStr)

  // Calculate subnet mask
  const mask = (0xffffffff << (32 - prefixLength)) >>> 0
  const subnetMask = intToIp(mask)

  // Calculate wildcard mask
  const wildcardMask = intToIp(~mask >>> 0)

  // Calculate network address
  const ipInt = ipToInt(ip)
  const networkInt = (ipInt & mask) >>> 0
  const networkAddress = intToIp(networkInt)

  // Calculate broadcast address
  const broadcastInt = (networkInt | ~mask) >>> 0
  const broadcastAddress = intToIp(broadcastInt)

  // Calculate usable IP range
  const totalHosts = Math.pow(2, 32 - prefixLength)
  const usableHosts = prefixLength === 31 ? 2 : prefixLength === 32 ? 1 : totalHosts - 2

  const firstUsableIP = prefixLength === 31 || prefixLength === 32
    ? networkAddress
    : intToIp(networkInt + 1)

  const lastUsableIP = prefixLength === 31
    ? broadcastAddress
    : prefixLength === 32
    ? networkAddress
    : intToIp(broadcastInt - 1)

  return {
    cidr,
    ipAddress: ip,
    networkAddress,
    broadcastAddress,
    subnetMask,
    wildcardMask,
    firstUsableIP,
    lastUsableIP,
    totalHosts,
    usableHosts,
    prefixLength,
  }
}

/**
 * Calculate CIDR from IP range
 */
export function rangeToCIDR(startIP: string, endIP: string): string[] {
  if (!isValidIPv4(startIP) || !isValidIPv4(endIP)) {
    throw new Error('Invalid IP address')
  }

  const startInt = ipToInt(startIP)
  const endInt = ipToInt(endIP)

  if (startInt > endInt) {
    throw new Error('Start IP must be less than or equal to end IP')
  }

  const cidrs: string[] = []
  let current = startInt

  while (current <= endInt) {
    // Find the largest prefix length that fits
    let prefixLength = 32

    for (let i = 0; i < 32; i++) {
      const mask = (0xffffffff << i) >>> 0
      const networkInt = (current & mask) >>> 0
      const broadcastInt = (networkInt | ~mask) >>> 0

      if (networkInt === current && broadcastInt <= endInt) {
        prefixLength = 32 - i
      } else {
        break
      }
    }

    const cidr = `${intToIp(current)}/${prefixLength}`
    cidrs.push(cidr)

    // Move to next block
    const hostsInBlock = Math.pow(2, 32 - prefixLength)
    current = (current + hostsInBlock) >>> 0
  }

  return cidrs
}

/**
 * Calculate IP range from CIDR
 */
export function cidrToRange(cidr: string): { start: string; end: string } {
  const info = calculateCIDR(cidr)
  return {
    start: info.networkAddress,
    end: info.broadcastAddress,
  }
}

/**
 * Check if an IP is within a CIDR range
 */
export function isIPInCIDR(ip: string, cidr: string): boolean {
  if (!isValidIPv4(ip) || !isValidCIDR(cidr)) {
    return false
  }

  const info = calculateCIDR(cidr)
  const ipInt = ipToInt(ip)
  const networkInt = ipToInt(info.networkAddress)
  const broadcastInt = ipToInt(info.broadcastAddress)

  return ipInt >= networkInt && ipInt <= broadcastInt
}
