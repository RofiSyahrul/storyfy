import type { HighlightName } from '$lib/types/highlights';

export interface SubmitHighlightPayload {
  name: HighlightName;
  slug: string | null;
}
