export class ConfigVariable {
    constructor(
        public creationTime:any,
        public key:string,
        public lastUpdatedTime:any,
        public value:string,
        public description:string
    ){}

    public static createInstance(configVar:ConfigVariable): ConfigVariable{
        return new ConfigVariable(
            configVar.creationTime,
            configVar.key,
            configVar.lastUpdatedTime,
            configVar.value,
            configVar.description
        );
    }
}
