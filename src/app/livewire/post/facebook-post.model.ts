import { MediaFunction } from "../../media/media-function.enum";
export class FacebookPost {
    constructor(public postingUserUid:string,
    public facebookPageId:string,
    public message:string,
    public linkUrl:string,
    public linkName:string,
    public imageKey:string,
    public imageMediaType:MediaFunction,
    public imageCaption:string){}
}
