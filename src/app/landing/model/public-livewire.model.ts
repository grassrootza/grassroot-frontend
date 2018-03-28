export class PublicLivewire {

  constructor(public headline: string,
              public creationTimeMillis: Date,
              public description: string,
              public imageKeys: string[]) {
  }

  public static createInstanceFromData(publicLivewireData: PublicLivewire) {
    return new PublicLivewire(
      publicLivewireData.headline,
      new Date(publicLivewireData.creationTimeMillis),
      publicLivewireData.description,
      publicLivewireData.imageKeys
    )
  }
}

export class PublicLivewirePage {

  constructor(public number: number,
              public totalPages: number,
              public totalElements: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: PublicLivewire[]) {
  }



}
