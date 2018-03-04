const quillImgSrcReg = /<img[^>]src=/;

export const limitImageSizesInRichText = (emailHtml: string): string => {
  let foundImg = emailHtml.search(quillImgSrcReg) != -1;
  if (foundImg) {
    emailHtml = '<style scoped>.img-sized { ' +
      'max-width: 640px ' +
      '}' +
      '@media (max-width: 600px) {' +
      '.img-size {' +
      'max-width: 320px' +
      '}' +
      '}' +
      '</style>' + emailHtml;
    emailHtml = emailHtml.replace(quillImgSrcReg, '<img class="img-sized" src=');
  }
  return emailHtml;
};
