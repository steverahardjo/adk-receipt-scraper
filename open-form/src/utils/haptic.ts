/**
 * Haptic feedback utility for mobile devices
 * Uses navigator.vibrate API when available
 */

export type HapticPattern = number | number[]

const HAPTIC_PATTERNS = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [15, 50, 15] as number[],
  error: [40, 50, 40] as number[],
  warning: [30, 50, 30] as number[],
  click: 5,
} as const

export const haptic = {
  /**
   * Trigger a haptic feedback with the given pattern
   */
  vibrate: (pattern: HapticPattern = HAPTIC_PATTERNS.light): void => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // Silently fail if vibrate is not supported
      }
    }
  },

  /**
   * Light haptic feedback for subtle interactions
   */
  light: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.light)
  },

  /**
   * Medium haptic feedback for standard interactions
   */
  medium: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.medium)
  },

  /**
   * Heavy haptic feedback for important actions
   */
  heavy: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.heavy)
  },

  /**
   * Success haptic feedback
   */
  success: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.success)
  },

  /**
   * Error haptic feedback
   */
  error: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.error)
  },

  /**
   * Warning haptic feedback
   */
  warning: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.warning)
  },

  /**
   * Click haptic feedback for button presses
   */
  click: (): void => {
    haptic.vibrate(HAPTIC_PATTERNS.click)
  },
}
