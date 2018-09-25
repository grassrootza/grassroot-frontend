import { Injectable, Optional } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(@Optional() private updates:SwUpdate) {
      if(updates && updates.isEnabled){
          interval(6 * 60 * 60)
          .subscribe(() => updates.checkForUpdate()
          .then(() => {
            console.log('checking for updates.......................')
            this.checkForUpdates();
          }));
      }
   }
  
  public checkForUpdates(): void {
     console.log("CALLING CHECK FOR UPDATES")
      //this.updates.available.subscribe(evt => {this.promptUser()});
    this.updates.available.subscribe(evt => {
      
      if(confirm('New version available.. Load?')){
        this.promptUser();
      }
    });
  }

  private promptUser(): void {
    console.log('updating to new version............................');
    this.updates.activateUpdate().then(() => document.location.reload()); 
  }
}
