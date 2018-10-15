import * as moment from 'moment-mini-ts';
import { environment } from 'environments/environment.prod';

export class CampaignMediaRecord {
    constructor(public bucket: string,
        public key: string,
        public mimeType: string,
        public storedTime: string,
        public createdByUserName) {}

    getMomentStored() {
        return moment(this.storedTime);
    }

    isAudioFile() {
        return this.mimeType == 'audio/ogg; codecs=opus';
    }

    getSrcLink() {
        return environment.s3publicUrl + '/' + this.bucket + '/' + this.key;
    }

    getFriendlyType() {
        if (!this.mimeType)
            return 'media';
        else if (this.mimeType.startsWith('audio'))
            return 'audio';
        else if (this.mimeType.startsWith('image'))
            return 'image';
        else
            return 'media';
    }
}

export const getRecord = (mr: CampaignMediaRecord): CampaignMediaRecord => {
    return new CampaignMediaRecord(
        mr.bucket,
        mr.key,
        mr.mimeType,
        mr.storedTime,
        mr.createdByUserName
    );
}