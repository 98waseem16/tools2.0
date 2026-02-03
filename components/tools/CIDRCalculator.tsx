'use client'

import { useState } from 'react'
import { Calculator, ArrowRight, Network } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import {
  calculateCIDR,
  rangeToCIDR,
  cidrToRange,
  isValidCIDR,
  isValidIPv4,
  type CIDRInfo,
} from '@/lib/utils/cidr'

type Mode = 'cidr-to-info' | 'range-to-cidr' | 'cidr-to-range'

export default function CIDRCalculator() {
  const [mode, setMode] = useState<Mode>('cidr-to-info')
  const [cidrInput, setCidrInput] = useState('')
  const [startIP, setStartIP] = useState('')
  const [endIP, setEndIP] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cidrInfo, setCidrInfo] = useState<CIDRInfo | null>(null)
  const [cidrList, setCidrList] = useState<string[]>([])
  const [ipRange, setIpRange] = useState<{ start: string; end: string } | null>(null)

  const handleCalculate = () => {
    setError(null)
    setCidrInfo(null)
    setCidrList([])
    setIpRange(null)

    try {
      if (mode === 'cidr-to-info') {
        if (!cidrInput.trim()) {
          setError('Please enter a CIDR notation')
          return
        }
        if (!isValidCIDR(cidrInput.trim())) {
          setError('Invalid CIDR notation (e.g., 192.168.1.0/24)')
          return
        }
        const info = calculateCIDR(cidrInput.trim())
        setCidrInfo(info)
      } else if (mode === 'range-to-cidr') {
        if (!startIP.trim() || !endIP.trim()) {
          setError('Please enter both start and end IP addresses')
          return
        }
        if (!isValidIPv4(startIP.trim()) || !isValidIPv4(endIP.trim())) {
          setError('Invalid IP address format')
          return
        }
        const cidrs = rangeToCIDR(startIP.trim(), endIP.trim())
        setCidrList(cidrs)
      } else if (mode === 'cidr-to-range') {
        if (!cidrInput.trim()) {
          setError('Please enter a CIDR notation')
          return
        }
        if (!isValidCIDR(cidrInput.trim())) {
          setError('Invalid CIDR notation')
          return
        }
        const range = cidrToRange(cidrInput.trim())
        setIpRange(range)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
    }
  }

  return (
    <div className="space-y-8">
      {/* Mode Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">Calculation Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setMode('cidr-to-info')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'cidr-to-info'
                ? 'border-sendmarc-blue-500 bg-sendmarc-blue-50'
                : 'border-sendmarc-gray-200 hover:border-sendmarc-gray-300'
            }`}
          >
            <Network className="w-5 h-5 text-sendmarc-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-sendmarc-gray-900">CIDR to Info</p>
            <p className="text-xs text-sendmarc-gray-600 mt-1">Calculate subnet details</p>
          </button>

          <button
            onClick={() => setMode('range-to-cidr')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'range-to-cidr'
                ? 'border-sendmarc-blue-500 bg-sendmarc-blue-50'
                : 'border-sendmarc-gray-200 hover:border-sendmarc-gray-300'
            }`}
          >
            <ArrowRight className="w-5 h-5 text-sendmarc-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-sendmarc-gray-900">Range to CIDR</p>
            <p className="text-xs text-sendmarc-gray-600 mt-1">Convert IP range</p>
          </button>

          <button
            onClick={() => setMode('cidr-to-range')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'cidr-to-range'
                ? 'border-sendmarc-blue-500 bg-sendmarc-blue-50'
                : 'border-sendmarc-gray-200 hover:border-sendmarc-gray-300'
            }`}
          >
            <Calculator className="w-5 h-5 text-sendmarc-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-sendmarc-gray-900">CIDR to Range</p>
            <p className="text-xs text-sendmarc-gray-600 mt-1">Get first/last IP</p>
          </button>
        </div>
      </Card>

      {/* Input Form */}
      <Card className="p-8">
        <div className="space-y-4">
          {(mode === 'cidr-to-info' || mode === 'cidr-to-range') && (
            <div>
              <label htmlFor="cidr" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
                CIDR Notation
              </label>
              <Input
                id="cidr"
                type="text"
                value={cidrInput}
                onChange={(e) => setCidrInput(e.target.value)}
                placeholder="192.168.1.0/24"
              />
            </div>
          )}

          {mode === 'range-to-cidr' && (
            <>
              <div>
                <label htmlFor="startIP" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
                  Start IP Address
                </label>
                <Input
                  id="startIP"
                  type="text"
                  value={startIP}
                  onChange={(e) => setStartIP(e.target.value)}
                  placeholder="192.168.1.0"
                />
              </div>

              <div>
                <label htmlFor="endIP" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
                  End IP Address
                </label>
                <Input
                  id="endIP"
                  type="text"
                  value={endIP}
                  onChange={(e) => setEndIP(e.target.value)}
                  placeholder="192.168.1.255"
                />
              </div>
            </>
          )}

          <Button onClick={handleCalculate} fullWidth>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>

          {error && (
            <div className="p-3 bg-sendmarc-error-light rounded-lg">
              <p className="text-sm text-sendmarc-error-dark">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {/* CIDR Info Results */}
      {cidrInfo && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">Subnet Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <span className="font-medium text-sendmarc-gray-700">CIDR Notation:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.cidr}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Network Address:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.networkAddress}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Broadcast Address:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.broadcastAddress}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Subnet Mask:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.subnetMask}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Wildcard Mask:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.wildcardMask}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">First Usable IP:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.firstUsableIP}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Last Usable IP:</span>
              </div>
              <div className="font-mono text-sendmarc-gray-900">{cidrInfo.lastUsableIP}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Total Hosts:</span>
              </div>
              <div className="text-sendmarc-gray-900">{cidrInfo.totalHosts.toLocaleString()}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Usable Hosts:</span>
              </div>
              <div className="text-sendmarc-gray-900">{cidrInfo.usableHosts.toLocaleString()}</div>

              <div>
                <span className="font-medium text-sendmarc-gray-700">Prefix Length:</span>
              </div>
              <div className="text-sendmarc-gray-900">/{cidrInfo.prefixLength}</div>
            </div>
          </div>
        </Card>
      )}

      {/* CIDR List Results */}
      {cidrList.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">
            CIDR Blocks ({cidrList.length})
          </h3>
          <div className="space-y-2">
            {cidrList.map((cidr, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-sendmarc-gray-50 rounded-lg">
                <span className="text-sm font-medium text-sendmarc-gray-700 w-8">{index + 1}.</span>
                <span className="text-sm font-mono text-sendmarc-gray-900">{cidr}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* IP Range Results */}
      {ipRange && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">IP Address Range</h3>
          <div className="flex items-center gap-4 justify-center">
            <div className="text-center">
              <p className="text-sm text-sendmarc-gray-600 mb-1">First IP</p>
              <p className="text-lg font-mono font-medium text-sendmarc-gray-900">{ipRange.start}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-sendmarc-gray-400" />
            <div className="text-center">
              <p className="text-sm text-sendmarc-gray-600 mb-1">Last IP</p>
              <p className="text-lg font-mono font-medium text-sendmarc-gray-900">{ipRange.end}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Help Text */}
      <Card variant="light" className="p-6">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-sendmarc-info-DEFAULT flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-sendmarc-gray-900">CIDR Calculator Usage</p>
            <ul className="text-sm text-sendmarc-gray-700 space-y-1 list-disc list-inside">
              <li>
                <strong>CIDR to Info:</strong> Calculate network details from CIDR notation (e.g.,
                192.168.1.0/24)
              </li>
              <li>
                <strong>Range to CIDR:</strong> Convert an IP range to CIDR blocks
              </li>
              <li>
                <strong>CIDR to Range:</strong> Get the first and last IP addresses in a CIDR block
              </li>
              <li>Use this tool for SPF record optimization and network planning</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
