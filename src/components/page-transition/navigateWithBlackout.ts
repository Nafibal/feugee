/**
 * The link-side entry point of the Blackout (ADR 0007): every internal
 * <Link> passes its onNavigate event and href here. The PageTransition
 * provider registers the real implementation on mount; before it mounts
 * (and during SSR) this is a no-op, so navigation simply proceeds.
 */
export interface BlackoutNavigateEvent {
  preventDefault: () => void;
}

type Navigator = (event: BlackoutNavigateEvent, href: string) => void;

let navigate: Navigator | null = null;

export const setBlackoutNavigator = (next: Navigator | null): void => {
  navigate = next;
};

export const navigateWithBlackout = (
  event: BlackoutNavigateEvent,
  href: string,
): void => {
  navigate?.(event, href);
};
