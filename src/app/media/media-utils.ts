const quillImgSrcReg = /<img.+src=/;
const fullImgSrcReg = /<img.+>/g;

export const limitImageSizesInRichText = (emailHtml: string, maxWidth: number = 640): string => {
  let foundImg = emailHtml.search(quillImgSrcReg) != -1;
  if (foundImg) {
    emailHtml = emailStyleHeader + emailHtml;
    emailHtml = emailHtml.replace(quillImgSrcReg, '<img style=\"max-width: ' + maxWidth + 'px !important\" src=');
  }
  return emailHtml;
};

export const emailStyleHeader = '<style>img { ' +
  'max-width: 640px ' +
  '}' +
  '@media (max-width: 600px) {' +
  'img {' +
  'max-width: 320px' +
  '}' +
  '}' +
  '</style>';

export const replaceImagesInRichText = (emailHtml: string): string => {
  return emailHtml.replace(fullImgSrcReg, "<br><i>[inline image]</i></br>");
};
