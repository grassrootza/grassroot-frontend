import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GroupService} from '../../../../group.service';
import {GroupMembersImportExcelSheetAnalysis} from '../../../../model/group-members-import-excel-sheet-analysis.model';
import {GroupAddMemberInfo} from '../../../../model/group-add-member-info.model';

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.css']
})
export class FileImportComponent implements OnInit {

  private groupUid: string = "";

  errors: Array<string> =[];
  dragAreaClass: string = 'dragarea';
  @Input() fileExt: string = "xls, xlsx, csv";
  @Input() maxFiles: number = 1;
  @Input() maxSize: number = 5; // 5MB
  @Output() uploadStatus = new EventEmitter();


  sheetHasHeader = true;
  nameColumn = 0;
  phoneColumn = 0;
  emailColumn = -1;
  provinceColumn = -1;
  roleColumn = -1;


  groupMembersImportExcelSheetAnalysis: GroupMembersImportExcelSheetAnalysis = null;
  groupAddMembersInfo: GroupAddMemberInfo[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private groupService: GroupService) {

  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.groupUid = params['id'];
    });
  }

  changeFile(){
    this.groupMembersImportExcelSheetAnalysis = null;
    this.groupAddMembersInfo = [];
  }

  saveColumnOrder(){
    const params = {
      tempPath: this.groupMembersImportExcelSheetAnalysis.tmpFilePath,
      nameColumn: this.nameColumn,
      phoneColumn: this.phoneColumn,
      emailColumn: this.emailColumn,
      provinceColumn: this.provinceColumn,
      roleColumn: this.roleColumn,
      header: this.sheetHasHeader
    };
    this.groupService.confirmImportMembers(params).subscribe(resp => {
      this.groupAddMembersInfo = resp;
    })
  }

  onFileChange(event){
    let files = event.target.files;
    this.saveFiles(files);
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    let files = event.dataTransfer.files;
    this.saveFiles(files);
  }

  saveFiles(files){
    this.errors = []; // Clear error
    // Validate file size and allowed extensions
    if (files.length > 0 && (!this.isValidFiles(files))) {
      this.uploadStatus.emit(false);
      return;
    }
    if (files.length > 0) {
      let formData: FormData = new FormData();
      for (let j = 0; j < files.length; j++) {
        formData.append("file", files[j], files[j].name);
      }
      const params = {
        groupUid: this.groupUid
      };

      this.groupService.importMembersAnalyze(formData, params).
        subscribe(response => {
          this.groupMembersImportExcelSheetAnalysis = response;
      },
        error => {
          console.log("error file upload")
        })
    }
  }

  private isValidFiles(files){
    // Check Number of files
    if (files.length > this.maxFiles) {
      this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
      return;
    }
    this.isValidFileExtension(files);
    return this.errors.length === 0;
  }

  private isValidFileExtension(files){
    // Make array of file extensions
    let extensions = (this.fileExt.split(','))
      .map(function (x) { return x.toLocaleUpperCase().trim() });
    for (let i = 0; i < files.length; i++) {
      // Get file extension
      let ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      // Check the extension exists
      let exists = extensions.includes(ext);
      if (!exists) {
        this.errors.push("Error (Extension): " + files[i].name);
      }
      // Check file size
      this.isValidFileSize(files[i]);
    }
  }

  private isValidFileSize(file) {
    let fileSizeinMB = file.size / (1024 * 1000);
    let size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize)
      this.errors.push("Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
  }


}
