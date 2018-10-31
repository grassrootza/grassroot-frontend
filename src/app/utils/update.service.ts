import { take, takeUntil, filter, tap, map } from 'rxjs/operators';
import { Injectable, Optional } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  pauser: Subject<void> = new Subject();
  private softwareUpdateSource: Subject<void> = new Subject<void>();
  private dataGroupUpdateSource: Subject<string> = new Subject<string>();
  softwareUpdate$: Observable<void> = this.softwareUpdateSource.asObservable();
  dataGroupUpdate$: Observable<string> = this.dataGroupUpdateSource.asObservable();

  constructor(@Optional() private updates: SwUpdate) {
    if(updates && updates.isEnabled){
      // This interval is to check for software updates not for dataGroup updates.
      // The interval that checks the dataGroups is set in sw-custom
      interval(6 * 60 * 60)
        .pipe(takeUntil(this.pauser))
        .subscribe(() => updates.checkForUpdate());
      
      // updates might come in the form of software or dataGroup updates
      // in this pipeline we do the corresponding treatment for both by checking
      // whether the dataGroup property comes undefined or not from the update event
      this.updates.available.pipe(
        map(update => {
          const appData = update.current.appData as { dataGroup: string };
          return appData ? appData.dataGroup : undefined;
        }),
        tap(dataGroup => {
          if (dataGroup) {
            this.dataGroupUpdateSource.next(dataGroup)
          }
        }),
        filter(dataGroup => !dataGroup),
        take(1)
      ).subscribe(() => {
        this.stopFetching();
        this.updates.activateUpdate().then(() => this.softwareUpdateSource.next());
      });
    }
   }
  
  public checkForUpdates(): void {
    this.updates.checkForUpdate();
  }

  private stopFetching() {
    this.pauser.next();
    this.pauser.complete();
  }
}
