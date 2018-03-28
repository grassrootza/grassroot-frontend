import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {UserService} from '../../../user/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {GroupService} from '../../group.service';
import {Group} from '../../model/group.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Permission} from '../../model/permission.model';
import {AlertService} from "../../../utils/alert-service/alert.service";
import {GroupRole} from "../../model/group-role";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import {MediaService} from "../../../media/media.service";


declare var $:any;

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.css']
})
export class GroupSettingsComponent implements OnInit {

  public group: Group = null;
  public groupForm: FormGroup;

  public ordinaryMemberPermissions: Permission[] = [];
  public committeeMemberPermissions: Permission[] = [];
  public groupOrganizerPermissions: Permission[] = [];
  public permissionsToDisplay: string[] = [];
  public permissionsFetched: boolean = false;

  public topicInterestsStats: any;
  public topicInterestInFirstColumn: number;
  public newTopicName: string = "";

  public roles: string[] = [GroupRole.ROLE_GROUP_ORGANIZER, GroupRole.ROLE_COMMITTEE_MEMBER, GroupRole.ROLE_ORDINARY_MEMBER];

  private settingsChanged: boolean = false;
  private permissionsChanged: boolean = false;

  imageErrors: String[] = [];
  imgDragAreaClass: string = 'dragarea';

  @Output() uploadStatus = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private mediaService: MediaService) {
    this.initGroupForm();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      let groupUid = params['id'];

      Observable.forkJoin(
        this.groupService.loadGroupDetailsCached(groupUid, false),
        this.groupService.fetchRawTopicInterestsStats(groupUid),
        this.groupService.fetchGroupPermissionsToDisplay()
      ).subscribe(data => {
        this.group = data[0];
        this.topicInterestInFirstColumn = Math.ceil(data[0].topics.length / 2);

        this.topicInterestsStats = data[1];

        this.permissionsToDisplay = data[2];

        this.getPermissionsForRole(this.group.groupUid);
        this.populateFormData(this.group);
      });
    });
  }

  initGroupForm(){
    this.groupForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': ['', Validators.required],
      'privacy': ["PUBLIC", Validators.required],
      'reminderInMinutes': [0, Validators.required],
      'ordinaryMemberPermissions': this.permissionsForm(GroupRole.ROLE_ORDINARY_MEMBER),
      'committeeMemberPermissions': this.permissionsForm(GroupRole.ROLE_COMMITTEE_MEMBER),
      'groupOrganizerPermissions': this.permissionsForm(GroupRole.ROLE_GROUP_ORGANIZER),
    });

  }

  permissionsForm(userRole: string){

    return this.formBuilder.group(
      {
        "GROUP_PERMISSION_SEE_MEMBER_DETAILS": false,
        "GROUP_PERMISSION_CREATE_GROUP_MEETING": false,
        "GROUP_PERMISSION_CREATE_GROUP_VOTE": false,
        "GROUP_PERMISSION_CREATE_LOGBOOK_ENTRY": false,
        "GROUP_PERMISSION_ADD_GROUP_MEMBER": false,
        "GROUP_PERMISSION_DELETE_GROUP_MEMBER": false,
        "GROUP_PERMISSION_UPDATE_GROUP_DETAILS": userRole == 'ROLE_GROUP_ORGANIZER' ? [{value: false, disabled: true}] : false,
        "GROUP_PERMISSION_CHANGE_PERMISSION_TEMPLATE": userRole == 'ROLE_GROUP_ORGANIZER' ? [{value: false, disabled: true}] : false,
        "GROUP_PERMISSION_CLOSE_OPEN_LOGBOOK": false,
        "GROUP_PERMISSION_VIEW_MEETING_RSVPS": false,
        "GROUP_PERMISSION_READ_UPCOMING_EVENTS": false,
        "GROUP_PERMISSION_SEND_BROADCAST": false,
        "GROUP_PERMISSION_CREATE_CAMPAIGN": false
      }
    );

  }

  populateFormData(group: Group){
    if(group != null){
      this.groupForm.controls['name'].setValue(group.name);
      this.groupForm.controls['description'].setValue(group.description);
      this.groupForm.controls['privacy'].setValue(group.discoverable ? "PUBLIC" : "PRIVATE");
      this.groupForm.controls['reminderInMinutes'].setValue(group.reminderMinutes);
    }
  }

  populatePermissionsTableFormData(ordinaryMemberPermissions: Permission[], committeeMemberPermissions: Permission[], groupOrganizerPermissions: Permission[]) {
    for(let i = 0 ; i < this.permissionsToDisplay.length ; i++){
      if(ordinaryMemberPermissions.length > 0  && this.nsPermCheck("ordinaryMemberPermission", this.permissionsToDisplay[i])){
        this.groupForm.get("ordinaryMemberPermissions").get(this.permissionsToDisplay[i]).setValue(this.ordinaryMemberPermissions[i].permissionEnabled);
      }
      if(committeeMemberPermissions. length > 0 && this.nsPermCheck("committeeMemberPermissions", this.permissionsToDisplay[i])){
        this.groupForm.get("committeeMemberPermissions").get(this.permissionsToDisplay[i]).setValue(this.committeeMemberPermissions[i].permissionEnabled);
      }
      if(groupOrganizerPermissions. length > 0 && this.nsPermCheck("groupOrganizerPermissions", this.permissionsToDisplay[i])){
        this.groupForm.get("groupOrganizerPermissions").get(this.permissionsToDisplay[i]).setValue(this.groupOrganizerPermissions[i].permissionEnabled);
      }
    }

  }

  nsPermCheck(role: string, permission: string): boolean {
    return !!this.groupForm.get(role) && !!this.groupForm.get(role).get(permission);
  }

  getPermissionsForRole(groupUid: string){
    this.groupService.fetchGroupPermissionsForRole(groupUid, this.roles).subscribe( perms => {

      for (let role of this.roles) {
        if (role == GroupRole.ROLE_ORDINARY_MEMBER)
          this.ordinaryMemberPermissions = perms.getParameters(role);
        else if (role == GroupRole.ROLE_COMMITTEE_MEMBER)
          this.committeeMemberPermissions = perms.getParameters(role);
        else if (role == GroupRole.ROLE_GROUP_ORGANIZER)
          this.groupOrganizerPermissions = perms.getParameters(role);
      }
      this.populatePermissionsTableFormData(this.ordinaryMemberPermissions, this.committeeMemberPermissions, this.groupOrganizerPermissions);
      this.permissionsFetched = true;
    });
  }

  getPermissionForRoleFormValues(role: GroupRole): Permission[] {
    let permissions: Permission[] = [];
    if (role == GroupRole.ROLE_ORDINARY_MEMBER) {
      this.permissionsToDisplay.forEach(p => {
        let perm = this.ordinaryMemberPermissions.find(perm => perm.permission === p);
        perm.permissionEnabled = this.groupForm.get("ordinaryMemberPermissions").get(p).value;
        permissions.push(perm);
      });
    } else if (role == GroupRole.ROLE_COMMITTEE_MEMBER) {
      this.permissionsToDisplay.forEach(p => {
        let perm = this.committeeMemberPermissions.find(perm => perm.permission === p);
        perm.permissionEnabled = this.groupForm.get("committeeMemberPermissions").get(p).value;
        permissions.push(perm);
      });
    } else if (role == GroupRole.ROLE_GROUP_ORGANIZER) {
      this.permissionsToDisplay.forEach(p => {
        let perm = this.groupOrganizerPermissions.find(perm => perm.permission === p);
        perm.permissionEnabled = this.groupForm.get("groupOrganizerPermissions").get(p).value;
        permissions.push(perm);
      });
    }
    return permissions;
  }

  settingsChangedTrigger(){
    this.settingsChanged = true;
  }

  permissionsChangedTrigger(){
    this.permissionsChanged = true;
  }

  updateGroup(){
    if(this.groupForm.valid){
      if(this.settingsChanged){
        let name = this.groupForm.controls['name'].value;
        let description = this.groupForm.controls['description'].value;
        let isPublic = this.groupForm.controls['privacy'].value == "PUBLIC";
        let reminderInMinutes = this.groupForm.controls['reminderInMinutes'].value;
        this.groupService.updateGroupSettings(this.group.groupUid, name, description, isPublic, reminderInMinutes).subscribe(resp => {
          if (this.permissionsChanged) {
            this.updatePermissions();
          } else {
            this.alertService.alert("group.settings.updateDone");
          }
          this.settingsChanged = false;
        });
      }

      if(!this.settingsChanged && this.permissionsChanged){
        this.updatePermissions();
      }

    }
  }

  public updatePermissions(){
    let updatedPermissionsByRole = {
      "ROLE_ORDINARY_MEMBER": this.getPermissionForRoleFormValues(GroupRole.ROLE_ORDINARY_MEMBER),
      "ROLE_COMMITTEE_MEMBER": this.getPermissionForRoleFormValues(GroupRole.ROLE_COMMITTEE_MEMBER),
      "ROLE_GROUP_ORGANIZER": this.getPermissionForRoleFormValues(GroupRole.ROLE_GROUP_ORGANIZER)
    };

    this.groupService.updateGroupPermissionsForRole(updatedPermissionsByRole, this.group.groupUid).subscribe(resp => {
      this.permissionsChanged = false;
      this.getPermissionsForRole(this.group.groupUid);
      this.alertService.alert("group.settings.updateDone");
    });
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.imgDragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.imgDragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.imgDragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.imgDragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    this.imgDragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    this.saveImage(files);
  }

  onImageSelected(event) {
    this.saveImage(event.target.files);
  }

  saveImage(images) {
    this.imageErrors = []; // Clear error
    // Validate file size and allowed extensions
    if (images.length > 0 && (!this.isValidImage(images[0]))) {
      this.uploadStatus.emit(false);
      return;
    }

    if (images.length > 0) {
      let image = images[0];
      let formData: FormData = new FormData();
      formData.append("image", image, image.name);
      console.log("attempting to upload image ... name: ", image.name);
      this.groupService.uploadGroupImage(this.group.groupUid, formData).
        subscribe(response => {
          console.log("response: ", response);
          this.group.profileImageUrl = response;
        },
        error => {
          console.log("error uploading image, error: ", error);
        })
    }
  }

  private isValidImage(image) {
    this.imageErrors = this.mediaService.isValidImage(image, true);
    return this.imageErrors.length === 0;
  }

  public getNumberOfMembersWithTopic(topic) {
    if(this.topicInterestsStats) {
      let count = this.topicInterestsStats[topic];
      return count !== undefined ? count : 0;
    }

  }

  public deleteTopic(topic: string) {
    let topics:string[] = this.group.topics;
    let indexOfTopicToRemove: number = topics.indexOf(topic);
    if(indexOfTopicToRemove != -1) {
      topics.splice(indexOfTopicToRemove, 1);
    }
    this.groupService.setGroupTopics(this.group.groupUid, topics).subscribe(resp => {
      this.topicInterestInFirstColumn = Math.ceil(topics.length / 2)
    });
  }

  newTopicNameChanged(event) {
    this.newTopicName = event.target.value;
  }

  addNewTopic() {
    let topics = this.group.topics;
    topics.push(this.newTopicName);
    this.groupService.setGroupTopics(this.group.groupUid, topics).subscribe(resp => {
      this.topicInterestInFirstColumn = Math.ceil(topics.length / 2)
      this.newTopicName = "";
      $("#newTopicNameInput").val("");

    });
  }

}
