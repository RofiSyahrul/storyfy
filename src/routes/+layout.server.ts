import { DEFAULT_DESC, DEFAULT_IMAGE, DEFAULT_KEYWORD, DEFAULT_TITLE } from '$lib/constants/seo';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  return {
    seo: {
      description: DEFAULT_DESC,
      image: DEFAULT_IMAGE,
      keyword: DEFAULT_KEYWORD,
      shouldBlockSearchIndex: false,
      title: DEFAULT_TITLE,
    },
  };
};
