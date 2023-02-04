import type { LayoutServerLoad } from './$types';

const DEFAULT_DESC = 'Make stories and highlights from your Spotify';
const DEFAULT_TITLE = 'Storyfy';
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/rofi/image/upload/c_scale,w_1200/v1675365107/storyfy/social.png';

const DEFAULT_KEYWORD =
  'stories, story, instagram story, highlights, highlight, instagram highlights, spotify, spotify top tracks';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    seo: {
      description: DEFAULT_DESC,
      image: DEFAULT_IMAGE,
      keyword: DEFAULT_KEYWORD,
      shouldBlockSearchIndex: false,
      title: DEFAULT_TITLE,
    },
    userProfile: locals.userProfile,
  };
};
