'use client'

/**
 * SPF Include Tree Component
 * Tree visualization of SPF include hierarchy
 */

import { useState } from 'react'
import type { SPFIncludeNode } from '@/lib/types'

interface SPFIncludeTreeProps {
  tree: SPFIncludeNode | null
}

interface TreeNodeProps {
  node: SPFIncludeNode
  isLast?: boolean
}

function TreeNode({ node, isLast = false }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  return (
    <div className="relative">
      {/* Node Content */}
      <div className="flex items-center py-2">
        {/* Branch Lines */}
        {node.depth > 0 && (
          <div className="flex items-center mr-2">
            <div className={`w-6 h-px bg-gray-300 ${isLast ? '' : ''}`}></div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}

        {/* Domain and Info */}
        <div className="flex-1 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold text-gray-900">
                {node.domain}
              </span>
              {node.lookups > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {node.lookups} lookup{node.lookups !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {node.depth > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                include:{node.mechanism.value}
              </p>
            )}
          </div>

          {/* Depth Indicator */}
          <div className="text-xs text-gray-400">
            Level {node.depth}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-8 border-l-2 border-gray-200 pl-4">
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              isLast={index === node.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SPFIncludeTree({ tree }: SPFIncludeTreeProps) {
  if (!tree) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No include mechanisms found</p>
        <p className="text-sm text-gray-400 mt-1">
          Include tree shows the hierarchy of SPF includes
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Include Chain:</strong> This tree shows your direct include mechanisms.
          Each include may have its own nested includes (not shown).
        </p>
      </div>

      {/* Tree */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <TreeNode node={tree} />
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
        <p className="font-semibold mb-2">Understanding the Tree:</p>
        <ul className="space-y-1">
          <li>• <strong>Lookups:</strong> DNS queries consumed by this include</li>
          <li>• <strong>Level 0:</strong> Your domain's SPF record</li>
          <li>• <strong>Level 1+:</strong> Included domains</li>
          <li>• Click ▶/▼ to expand/collapse branches</li>
        </ul>
      </div>
    </div>
  )
}
