import { switchMap, take, takeUntil, filter } from 'rxjs/operators';
import { Injectable, Optional } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, BehaviorSubject, never, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  pauser: Subject<void> = new Subject();
  private softwareUpdateSource: Subject<void> = new Subject<void>();
  softwareUpdate$: Observable<void> = this.softwareUpdateSource.asObservable();

  constructor(@Optional() private updates: SwUpdate) {
    if(updates && updates.isEnabled){
        interval(1000)
          .pipe(takeUntil(this.pauser))
          .subscribe(() => updates.checkForUpdate());
        
      this.updates.available.pipe(
        filter(update => !(update.current.appData as {dataGroup: string}).dataGroup),
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
