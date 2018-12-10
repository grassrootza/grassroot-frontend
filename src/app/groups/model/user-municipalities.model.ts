import { Municipality } from "./municipality.model";

export class UserMunicipalities {
    constructor(public municipaliiesMap:Map<string,Municipality>,
                public notYetCachedUids:string[]){}

    public static createInstance(userMunicipalies:UserMunicipalities):UserMunicipalities{
        return new UserMunicipalities(userMunicipalies.municipaliiesMap,userMunicipalies.notYetCachedUids);
    }
}
