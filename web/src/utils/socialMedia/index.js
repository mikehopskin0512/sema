import { TWITTER_URL, LINKEDIN_URL } from "../constants/socials"
/*
  Redirects the user to twitter with a prepared tweet
  STRING - text - The main content
  STRING - url - Link of an image or article, will be placed at the end of your content
  comma separated STRING - hashtags
  STRING - via - A twitter user handle
*/
export const shareWithTwitter = ({ text = '', url = '', via ='', hashtags = '' }) => {
  let link =  `${TWITTER_URL}/intent/tweet?url=${url}&text=${text}&via=${via}&hashtags=${hashtags}`;
  window.open(link, '_blank');
}

export const shareWithLinkedIn = ({ url = '', title = '', summary = '', source = '' }) => {
  let link =  `${LINKEDIN_URL}/shareArticle?url=${url}&summary=${summary}&title=${title}&source=${source}`
  window.open(link, '_blank')
}

// export const shareWithFacebook = () => {

// }
