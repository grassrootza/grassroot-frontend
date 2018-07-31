import { JoinCodeInfo } from "./join-code-info";
import { Group } from "./group.model";

export class GroupMinimal {

    constructor(public groupUid: string,
        public name: string,
        public description: string,
        public joinCode: string,
        public paidFor: boolean,
        public userPermissions: string[],
        public userRole: string,
        public topics: string[],
        public joinWords: JoinCodeInfo[],
        public joinWordsLeft: number,
        public joinTopics: string[]) {
            
    }

    public hasPermission(permission: string) {
        return this.userPermissions.indexOf(permission) >= 0;
    }
    
    public isJoinTopic(topic: string): boolean {
        return this.joinTopics && this.joinTopics.length > 0 && this.joinTopics.indexOf(topic) != -1;
    }

}

export const extractFromFull = (group: Group): GroupMinimal => {
    return new GroupMinimal(
        group.groupUid,
        group.name,
        group.description,
        group.joinCode,
        group.paidFor,
        group.userPermissions,
        group.userRole,
        group.topics,
        group.joinWords,
        group.joinWordsLeft,
        group.joinTopics
    );
}