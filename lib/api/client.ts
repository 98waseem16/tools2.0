/**
 * Base API Client
 * Handles authentication, error handling, and rate limiting
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

export class APIClient {
  private baseURL: string
  private apiKey: string
  private defaultTimeout: number = 30000 // 30 seconds

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = apiKey
  }

  /**
   * Make an API request
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
    } = options

    const url = `${this.baseURL}${endpoint}`

    // Setup abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.error('[API Client] Error response:', {
            url,
            status: response.status,
            statusText: response.statusText,
            errorData,
          })
        }

        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      // Parse JSON response
      const data = await response.json()
      return data as T
    } catch (error) {
      clearTimeout(timeoutId)

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.error('[API Client] Request failed:', {
          url,
          error: error instanceof Error ? error.message : 'Unknown',
          errorType: error instanceof Error ? error.name : typeof error,
        })
      }

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError('Request timeout', 408)
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new APIError('Network error: Unable to reach API', 0)
      }

      // Re-throw APIError
      if (error instanceof APIError) {
        throw error
      }

      // Unknown error
      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }
}

/**
 * Create configured API client instance
 */
export function createAPIClient(): APIClient {
  const baseURL = process.env.NIGHTCRAWLER_API_URL || process.env.NEXT_PUBLIC_NIGHTCRAWLER_API_URL
  const apiKey = process.env.NIGHTCRAWLER_API_KEY || process.env.NEXT_PUBLIC_NIGHTCRAWLER_API_KEY

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[API Client] Config:', {
      baseURL: baseURL || 'NOT SET',
      apiKeySet: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
    })
  }

  if (!baseURL) {
    throw new Error('NIGHTCRAWLER_API_URL environment variable is not set')
  }

  if (!apiKey) {
    throw new Error('NIGHTCRAWLER_API_KEY environment variable is not set')
  }

  return new APIClient(baseURL, apiKey)
}
