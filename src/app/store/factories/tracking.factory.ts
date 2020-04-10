import { TrackingService } from '../services/tracking.service';
export function TrackingProviderFactory(provider: TrackingService) {
  return () => provider.configure();
}
