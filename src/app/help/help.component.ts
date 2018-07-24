import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: [ './help.component.css' ]
})
export class HelpComponent implements OnInit {

  public helpContent = {
    'What do I do first?' : 'If this is your first time ever using Grassroot, get started by clicking \'create\' on the home page and creating a group. If you already have one, go to the groups page and start calling meetings, votes, or whichever actions you like',
    'I have a group, why don\'t I see it on the home page?' : 'The home page only shows your favourite (starred) groups. To make a group a favourite, go to the \'groups\' page and click the star next to its name',
    'What are the costs of using Grassroot?': 'Grassroot is a non-profit, and the platform is free to use for groups of up to 300 people and up to 8 meetings, votes or action items per month. Above that size, users need a Grassroot Extra account to continue adding members or creating tasks. A Grassroot Extra account also unlocks features likes campaigns and movements, and many additional features on existing groups. To sign up, just click "Grassroot Extra" from the user menu in the top right.',
    'How do I use Grassroot on my mobile?': 'You can make use of the Grassroot Android app or dial *134*1994# to access Grassroot for free on the USSD platform. On USSD: Follow prompts to call meetings, votes, actions, or set your profile; Select "My groups" or option 4 to create or modify groups; or select "More" or option 6 to view the second screen on the USSD menu with options for safety groups and viewing public meetings.',
    'How do I create a group?': 'Go to the top right corner of the home page and click on the drop down menu titled "Create New"',
    'How do I call meetings/votes/actions?': 'Go to the "Groups" page and click on the button with a drop down menu labelled "Actions" on desired group or click on the green circles with the "+" sign on them, located on the bottom of cards labelled, "Meetings", "Votes" and "Action items" in the group dashboard withing a group page',
    'How do I add/remove members to/from a group?': 'Go to the desired group page and: To add members, click on "Add member" on the card, "Member management", To remove members, go to the row with the individual member\'s name and click on the drop down menu labelled "Manage"',
    'How do I make someone organizer?': 'Go to your group page and select the tab labelled, "Members", select the relevant person and click on the drop down menu labelled, "Manage" and select "edit". A card with that person\'s details will pop up along with a drop down menu with the heading, "Role".',
    'How do I change member’s permissions?': 'On your group page, go to the tab labelled, "Settings" and select "Advanced permissions". Use the check boxes provided to select which permissions a person with each role gets and click on the "Save" after completion.',
    'How do I edit my details? (Profile)': 'Click on the drop down menu on the top left corner of the home page, select "My profile" and you will be taken a page where you can edit your details.',
    'What is LiveWire/how do I send a LiveWire alert?': 'LiveWire is a free to use press statement generator that allows ordinary members of the public to share stories with the media. It is accessible by dialing *134*1994*411# or on the Grassroot website: Click on the drop down menu labelled, "Actions" and select "Issue LiveWire". Fill in every field on the card that has popped up and click, "send".',
    'What is a broadcast?': 'A broadcast is a high powered information sharing mechanism that allows you to send a message via SMS, email, Facebook and Twitter all at once.',
    'What is a campaign?': 'A Grassroot campaign is a sequence of actions that you can perform on the platform to achieve a particular objective. Mainly used by big organizations and advocacy group. With a Grassroot campaign, you can: Build a membership base; Facilitate the signing of a petition; or Provide information.'
  };

  public helpTopics = Object.keys(this.helpContent);

  constructor() { }

  ngOnInit() {

  }
}
