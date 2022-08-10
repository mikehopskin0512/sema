import { FACEBOOK_APP_ID } from "../constants";
import { TWITTER_URL, LINKEDIN_URL, FACEBOOK_URL } from "../constants/socials";
/*
  Redirects the user to twitter with a prepared tweet
  STRING - text - The main content
  STRING - url - Link of an image or article, will be placed at the end of your content
  comma separated STRING - hashtags
  STRING - via - A twitter user handle
*/
export const shareWithTwitter = ({ text = '', url = '', via ='', hashtags = '' }) => {
  const link =  `${TWITTER_URL}/intent/tweet?url=${url}&text=${text}&via=${via}&hashtags=${hashtags}`;
  window.open(link, '_blank');
}

export const shareWithLinkedIn = ({ url = '' }) => {
  const link =  `${LINKEDIN_URL}/shareArticle?url=${url}`;
  window.open(link, '_blank');
}

export const shareWithFacebook = ({ url = '' }) => {
  const link = `${FACEBOOK_URL}/dialog/share?app_id=${FACEBOOK_APP_ID}&display=popup&href=${url}`;
  window.open(link, '_blank');
}
