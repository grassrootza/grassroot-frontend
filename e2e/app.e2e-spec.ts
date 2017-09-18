import { GrassrootFrontendPage } from './app.po';

describe('grassroot-frontend App', () => {
  let page: GrassrootFrontendPage;

  beforeEach(() => {
    page = new GrassrootFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
