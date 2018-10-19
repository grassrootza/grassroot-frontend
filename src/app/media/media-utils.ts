const quillImgSrcReg = /<img[^>]+src/g;
// const quillImgSrcReg = /<img.+src=\".+\">/g;
const fullImgSrcReg = /<img[^>]+>/g;

export const limitImageSizesInRichText = (emailHtml: string, maxWidth: number = 640): string => {
  const foundImg = emailHtml.match(quillImgSrcReg);
  console.log('do we have a match? ', foundImg && foundImg.length > 0);
  console.log('found image length: ', foundImg && foundImg.length || 0);
  // console.log('inbound content: ', emailHtml);
  quillImgSrcReg.lastIndex = 0;
  const replacedHtml = emailHtml.replace(quillImgSrcReg, `<img style="max-width: ${maxWidth}px !important" src`);
  // console.log('replaced email: ', replacedHtml);
  return foundImg ? emailStyleHeader + replacedHtml : emailHtml;
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
