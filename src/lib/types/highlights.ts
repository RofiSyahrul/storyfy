export const HIGHLIGHT_TOP_ARTISTS = 'top-artists' as const;
export const HIGHLIGHT_TOP_TRACKS = 'top-tracks' as const;

export const HIGHLIGHT_NAMES = [HIGHLIGHT_TOP_ARTISTS, HIGHLIGHT_TOP_TRACKS] as const;

export type HighlightName = (typeof HIGHLIGHT_NAMES)[number];
