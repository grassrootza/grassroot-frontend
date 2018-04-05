const quillImgSrcReg = /<img[^>]src=/;

export const limitImageSizesInRichText = (emailHtml: string): string => {
  let foundImg = emailHtml.search(quillImgSrcReg) != -1;
  if (foundImg) {
    emailHtml = emailStyleHeader + emailHtml;
    emailHtml = emailHtml.replace(quillImgSrcReg, '<img style=\"max-width: 640px\" src=');
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
