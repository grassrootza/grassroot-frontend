import * as moment from 'moment-mini-ts';

export class DataSetCounts {

    constructor(
        public dataSetLabel: string,
        public description: string,
        public usersCount: number,
        public userSessionCount: number,
        public notificationsCount: number,
        public start: any,
        public end: any
    ) { }
}

export const getCountsEntity = (cts: DataSetCounts): DataSetCounts => {
    let counts = new DataSetCounts(
        cts.dataSetLabel,
        cts.description,
        cts.usersCount,
        cts.userSessionCount,
        cts.notificationsCount,
        moment(cts.start),
        moment(cts.end)
    );
    return counts;
}