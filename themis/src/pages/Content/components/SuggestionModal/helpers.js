export const truncate = (content, maxLength) => {
  const contentLength = content?.length;
  const shouldTruncate = contentLength > maxLength;
  return shouldTruncate ? `${content.substring(0, Math.min(maxLength, contentLength))
  }...` : content;
};

export const sourceUrlToLink = (name, url) => {
  const isInvalidSource = !name || !url;
  const link = `\n\n📄 [${name}](${url})`;
  return isInvalidSource ? '' : link;
};
