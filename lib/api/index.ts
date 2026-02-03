/**
 * API Layer - Barrel Export
 */

// Client
export { APIClient, APIError, createAPIClient, type RequestOptions } from './client'

// Nightcrawler API
export {
  nightcrawler,
  type LookupStrategy,
  type LookupOptions,
  type NightcrawlerDMARCResponse,
  type NightcrawlerSPFResponse,
  type NightcrawlerDKIMResponse,
  type NightcrawlerMXResponse,
  type NightcrawlerMTASTSResponse,
  type NightcrawlerTLSRPTResponse,
  type NightcrawlerBIMIResponse,
  type NightcrawlerBlacklistResponse,
  type NightcrawlerScoreResponse,
} from './nightcrawler'

// Parsers
export {
  parseDMARCResponse,
  parseSPFResponse,
  parseDKIMResponse,
  parseMXResponse,
  parseMTASTSResponse,
  parseTLSRPTResponse,
  parseBIMIResponse,
  type DKIMSelector,
} from './parsers'

// Service Detection
export {
  detectServicesFromSPF,
  detectProviderFromMX,
  detectAllServices,
  type ServiceDetectionInput,
  detectCompetitorFromDMARC,
  detectCompetitorFromSPF,
  detectCompetitorFromMX,
  detectCompetitor,
  type CompetitorDetectionInput,
} from './services'
