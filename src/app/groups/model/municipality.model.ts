export class Municipality {
    constructor(public name:string,
                public id:number,
                public type_name:string){}

    public static createInstance(municipality:Municipality): Municipality{
        return new Municipality(municipality.name,
                                municipality.id,
                                municipality.type_name);
    }
}
