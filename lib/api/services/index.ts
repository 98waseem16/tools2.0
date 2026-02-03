/**
 * Service Detection - Barrel Export
 */

export {
  detectServicesFromSPF,
  detectProviderFromMX,
  detectAllServices,
  type ServiceDetectionInput,
} from './detector'

export {
  detectCompetitorFromDMARC,
  detectCompetitorFromSPF,
  detectCompetitorFromMX,
  detectCompetitor,
  type CompetitorDetectionInput,
} from './competitor'
