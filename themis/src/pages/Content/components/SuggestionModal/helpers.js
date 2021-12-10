import { SEMA_ENG_GUIDE_UI_URL } from '../../constants';

export const truncate = (content, maxLength) => {
  const contentLength = content?.length;
  const shouldTruncate = contentLength > maxLength;
  return shouldTruncate ? `${content.substring(0, Math.min(maxLength, contentLength))
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
