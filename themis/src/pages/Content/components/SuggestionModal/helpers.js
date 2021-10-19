import { MAX_CHARACTER_LENGTH, SEMA_ENG_GUIDE_UI_URL } from '../../constants';

export const truncate = (content) => {
  const contentLength = content?.length;
  const shouldTruncate = contentLength > MAX_CHARACTER_LENGTH;
  return shouldTruncate ? `${content.substring(0, Math.min(MAX_CHARACTER_LENGTH, contentLength))
  }...` : content;
};

export const getCollectionUrl = (id, slug) => `${SEMA_ENG_GUIDE_UI_URL}/${id}/${slug}`;

export const engGuidesToStr = (engGuides) => {
  const links = engGuides?.map(({ name, engGuide, slug }) => {
    const url = getCollectionUrl(engGuide, slug);
    return `\n\n📄 [${name}](${url})`;
  }).join(' ');
  return links || '';
};
