# GrassrootFrontend

To install Angular 4 dev environment follow these steps :

- install nodejs 6.9.0 or higher  
  if using ubuntu, run terminal command: **_sudo apt-get install -y nodejs_**  
  by installing nodejs you get node package manager (npm)
  
- check npm version: run terminal command **_npm -v_**  
it should be 3.0.0 or higher

- install typescript: run terminal command _**sudo npm install -g typescript**_ 

- install angular CLI: run terminal command **_sudo npm install -g @angular/cli@1.0.0-rc.4_**
 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Internationalization
All translated strings are stored in assets/i18n folder. For structure of json file use en.json as reference. <br />
After you have created new translation, you should add your language to the list of supported languages. See app.component.ts line that looks like this `translateService.addLangs(['en']);`. 
<br />
Ex. You want to add croatian language translation to site, these are the steps you should follow:
- add hr.json file to assets/i18n
- edit line in app.component.ts `translateService.addLangs(['en']);` so it would look like this `translateService.addLangs(['en', 'hr']);`
- edit line in app.component.ts `translateService.use(browserLang.match(/en/) ? browserLang : 'en');` so it would look like this `translateService.use(browserLang.match(/en|hr/) ? browserLang : 'en');`
<br/><br/>
For using translated string in html you can use `translate pipe` (ex. {{ 'groups.row.action.meeting' | translate }}). For other ways of using translation see [Official guide](https://github.com/ngx-translate/core).


## Date time picker
Installed NG Bootstrap - Angular Datetime picker component specific to Bootstrap 4. To see working example visit [link](https://www.npmjs.com/package/@zhaber/ng-bootstrap-datetimepicker)
