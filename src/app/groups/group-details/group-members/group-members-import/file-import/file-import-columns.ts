export class FileImportColumns {

  constructor(public unknown: number = -1,
              public name: number = -1,
              public phone: number = -1,
              public email: number = -1,
              public province: number = -1,
              public role: number = -1,
              public affiliation: number = -1,
              public firstName: number = -1,
              public surname: number = -1) {
  }

}

export const DEFAULT_COL_ORDER: FileImportColumns = new FileImportColumns(0, 1, 2, 3, 4, 5, 6, 7, 8);
