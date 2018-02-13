import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../../user/user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {GroupService} from '../../group.service';
import {Group} from '../../model/group.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Permission} from '../../model/permission.model';
import {AlertService} from "../../../utils/alert.service";
import {GroupRole} from "../../model/group-role";

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

  public roles: string[] = [GroupRole.ROLE_GROUP_ORGANIZER, GroupRole.ROLE_COMMITTEE_MEMBER, GroupRole.ROLE_ORDINARY_MEMBER];

  private settingsChanged: boolean = false;
  private permissionsChanged: boolean = false;

  imageErrors: String[] = [];
  imgDragAreaClass: string = 'dragarea';
  MAX_IMAGE_SIZE = 2; // in mb (allow for photos)
  IMAGE_EXTENSIONS = "png, jpg, jpeg, gif";

  @Output() uploadStatus = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private formBuilder: FormBuilder,
              private alertService: AlertService) {
    this.initGroupForm();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      let groupUid = params['id'];
      this.groupService.loadGroupDetailsCached(groupUid, false)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;

            this.getPermissionsForRole(this.group.groupUid);
            this.populateFormData(this.group, [], [], []);
          },
          error => {
            console.log("Error loading groups", error.status)
          }
        );
    });

    this.groupService.fetchGroupPermissionsToDisplay().subscribe(resp => {
      this.permissionsToDisplay = resp;
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
      }
    );

  }

  populateFormData(group: Group, ordinaryMemberPermissions: Permission[], committeeMemberPermissions: Permission[], groupOrganizerPermissions: Permission[]){
    if(group != null){
      this.groupForm.controls['name'].setValue(group.name);
      this.groupForm.controls['description'].setValue(group.description);
      this.groupForm.controls['privacy'].setValue(group.discoverable ? "PUBLIC" : "PRIVATE");
      this.groupForm.controls['reminderInMinutes'].setValue(group.reminderMinutes);
    }

    for(let i = 0 ; i < this.permissionsToDisplay.length ; i++){
      if(ordinaryMemberPermissions.length > 0){
        this.groupForm.get("ordinaryMemberPermissions").get(this.permissionsToDisplay[i]).setValue(this.ordinaryMemberPermissions[i].permissionEnabled);
      }
      if(committeeMemberPermissions. length > 0){
        this.groupForm.get("committeeMemberPermissions").get(this.permissionsToDisplay[i]).setValue(this.committeeMemberPermissions[i].permissionEnabled);
      }
      if(groupOrganizerPermissions. length > 0){
        this.groupForm.get("groupOrganizerPermissions").get(this.permissionsToDisplay[i]).setValue(this.groupOrganizerPermissions[i].permissionEnabled);
      }
    }

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
      this.populateFormData(null, this.ordinaryMemberPermissions, this.committeeMemberPermissions, this.groupOrganizerPermissions);

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

  public getFormattedUserPermissions(permission: string): string{
    let perm = permission.slice(17).toLowerCase();
    perm = perm.charAt(0).toUpperCase() + perm.slice(1);
    return perm.split("_").join(" ");
  }


  shouldDisplayPermissionsTable(): boolean {
    return this.permissionsToDisplay.length > 0 && this.committeeMemberPermissions.length > 0 && this.groupOrganizerPermissions.length > 0 && this.ordinaryMemberPermissions.length > 0;
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
          this.updatePermissions();
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
        },
        error => {
          console.log("error uploading image, error: ", error);
        })
    }
  }

  private isValidImage(image) {
    this.isValidFileType(image);
    this.isValidFileSize(image);
    return this.imageErrors.length === 0;
  }

  private isValidFileType(image) {
    let extensions = (this.IMAGE_EXTENSIONS.split(',')).map(x => x.toLocaleUpperCase().trim());
    let ext = image.name.toUpperCase().split('.').pop() || image.name;
    let exists = extensions.includes(ext);
    if (!exists) {
      this.imageErrors.push("Error (image file type): " + image.name);
    }
  }

  private isValidFileSize(image) {
    let fileSizeinMB = image.size / (1024 * 1000);
    let size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.MAX_IMAGE_SIZE)
      this.imageErrors.push("Error (file size): " + image.name + ": exceed file size limit of " + this.MAX_IMAGE_SIZE + "MB ( " + size + "MB )");
  }

}
