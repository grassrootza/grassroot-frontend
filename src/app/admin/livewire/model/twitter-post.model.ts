import { MediaFunction } from "../../../media/media-function.enum";
export class TwitterPost {
  constructor(public postingUserUid:string,
    public message:string,
    public imageMediaFunction:MediaFunction,
    public imageKey:string){}
}
