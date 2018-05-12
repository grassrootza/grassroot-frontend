import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: [ './help.component.css' ]
})
export class HelpComponent implements OnInit {

  public helpContent = {
    'What do I do first?' : 'If this is your first time ever using Grassroot, get started by clicking \'create\' on the home page and creating a group. If you already have one, go to the groups page and start calling meetings, votes, etc',
    'I have a group, why don\'t I see it on the home page?' : 'The home page only shows your favourite (starred) groups. To make a group a favourite, go to the \'groups\' page and click the star next to its name' 
  };

  public helpTopics = Object.keys(this.helpContent);

  constructor() { }

  ngOnInit() {

  }
}
