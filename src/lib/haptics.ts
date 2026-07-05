/**
 * Platform-aware haptic feedback.
 *
 * On native (Capacitor Android/iOS): triggers device vibration.
 * On web: no-op (most browsers don't support vibration API and it would
 *   surprise users on desktop).
 */
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { isNative } from './platform';

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const STYLE_MAP: Record<HapticStyle, ImpactStyle> = {
  light: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  heavy: ImpactStyle.Heavy,
  success: ImpactStyle.Light,
  warning: ImpactStyle.Medium,
  error: ImpactStyle.Heavy,
};

export async function haptic(style: HapticStyle = 'light'): Promise<void> {
  if (!isNative()) return;
  await Haptics.impact({ style: STYLE_MAP[style] });
}
