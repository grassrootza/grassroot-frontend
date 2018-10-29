const quillImgSrcReg = /<img[^>]+src/g;
// const quillImgSrcReg = /<img.+src=\".+\">/g;
const fullImgSrcReg = /<img[^>]+>/g;

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

/**
 * Creates a Parchment Embed format to add custom small images.
 * A Parchment Embed allows us to create custom content in Quill with a custom format.
 * Our custom format is called 'small-image'.
 *
 * @export
 * @param embed - the Parchment.Embed class which our custom Embed inherits from
 * @returns - the class which must be registered in Quill to render the new format
 */
export function createCustomImageEmbed(embed: any, maxWidth: number = 640) {
  const embedBlot = class SmallImage extends embed {
    static blotName = 'small-image'; 
    static className = 'small-image';
    static tagName = 'img';
    static create(value) {
      let node = super.create(value);
      node.setAttribute('style', `max-width: ${maxWidth}px`);
      node.setAttribute('src', value);
      return node;
    }
  }
  return embedBlot;
}

/**
 * Creates a custom handler for embedding images. Every image will be added
 * with a max-width: 640px style to avoid rendering issues in emails
 *
 * @export
 * @param editor
 * @returns
 */
export function getCustomImageHandler(editor) {
  return () => {
    let fileInput: HTMLInputElement;
    fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute(
      'accept',
      'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
    );
    fileInput.addEventListener('change', () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        var reader = new FileReader();
        reader.onload = e => {
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'small-image', (e.target as any).result);
        }
        reader.readAsDataURL(fileInput.files[0]);
      }
    });
    fileInput.click();
  }
}
