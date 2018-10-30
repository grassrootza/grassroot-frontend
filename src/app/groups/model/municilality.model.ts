export class Municilality {
    constructor(public name:string,
                public id:number,
                public type_name:string){}

    public static createInstance(municipality:Municilality): Municilality{
        return new Municilality(municipality.name,
                                municipality.id,
                                municipality.type_name);
    }
}
