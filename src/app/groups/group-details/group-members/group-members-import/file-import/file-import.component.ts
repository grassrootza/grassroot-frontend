import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../../group.service';
import {GroupMembersImportExcelSheetAnalysis} from '../../../../model/group-members-import-excel-sheet-analysis.model';
import {GroupAddMemberInfo} from '../../../../model/group-add-member-info.model';
import {GroupModifiedResponse} from '../../../../model/group-modified-response.model';
import {FileImportResult} from "./file-import-result";
import {AlertService} from "../../../../../utils/alert.service";
import { saveAs } from 'file-saver/FileSaver';

declare var $: any;

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.css']
})
export class FileImportComponent implements OnInit {

  public MAX_NON_ERROR_DISPLAY = 100;

  private groupUid: string = "";

  errors: Array<string> =[];
  dragAreaClass: string = 'dragarea';
  @Input() fileExt: string = "xls, xlsx, csv";
  @Input() maxFiles: number = 1;
  @Input() maxSize: number = 5; // 5MB

  @Output() uploadStatus = new EventEmitter();
  uploadComplete: boolean = false;

  sheetHasHeader = true;
  nameColumn = 0;
  phoneColumn = 0;
  emailColumn = -1;
  provinceColumn = -1;
  affilColumn = -1;
  firstNameColumn = -1;
  surnameColumn = -1;
  roleColumn = -1;

  sheetAnalysis: GroupMembersImportExcelSheetAnalysis = null;
  fileImportResult: FileImportResult;

  groupAddMembersInfo: GroupAddMemberInfo[] = [];
  displayedAddMembers: GroupAddMemberInfo[] = [];
  groupModifiedResponse: GroupModifiedResponse = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private groupService: GroupService,
              private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.groupUid = params['id'];
    });
  }

  changeFile() {
    this.sheetAnalysis = null;
    this.groupAddMembersInfo = [];
    this.uploadComplete = false;
  }

  analyzeHeaders(formData: FormData, params: any) {
    this.alertService.showLoading();
    this.groupService.importHeaderAnalyze(formData, params).subscribe(response => {
      this.sheetAnalysis = response;
      this.nameColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("name"));
      this.phoneColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("phone") || cell.toLowerCase().startsWith("cell"));
      this.emailColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("email"));
      this.provinceColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("province"));
      this.affilColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("affil"));
      this.firstNameColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("first"));
      this.surnameColumn = this.sheetAnalysis.firstRowCells.findIndex(cell => cell.toLowerCase().startsWith("surname") || cell.toLowerCase().startsWith("last name"));
      this.alertService.hideLoading();
    }, error => {
      this.alertService.hideLoading();
      console.log("error file upload")
    })
  }

  saveColumnOrder(){
    const params = {
      tempPath: this.sheetAnalysis.tmpFilePath,
      nameColumn: this.nameColumn,
      phoneColumn: this.phoneColumn,
      emailColumn: this.emailColumn,
      provinceColumn: this.provinceColumn,
      roleColumn: this.roleColumn,
      firstNameColumn: this.firstNameColumn,
      surnameColumn: this.surnameColumn,
      affiliationColumn: this.affilColumn,
      header: this.sheetHasHeader
    };

    this.analyzeMembers(params);
  }

  analyzeMembers(params: any) {
    this.alertService.showLoading();
    this.groupService.importAnalyzeMembers(params).subscribe(resp => {
      this.fileImportResult = resp;
      this.groupAddMembersInfo = resp.processedMembers;
      this.displayedAddMembers = this.groupAddMembersInfo.length > this.MAX_NON_ERROR_DISPLAY ?
        this.groupAddMembersInfo.slice(0, this.MAX_NON_ERROR_DISPLAY) : this.groupAddMembersInfo;
      this.alertService.hideLoading();
    })
  }

  backToExcelAnalysis() {
    this.groupAddMembersInfo = [];
  }

  cancelImport(){
    this.sheetAnalysis = null;
    this.fileImportResult = null;
    this.groupAddMembersInfo = [];
    this.sheetHasHeader = true;
    this.nameColumn = 0;
    this.phoneColumn = 0;
    this.emailColumn = -1;
    this.provinceColumn = -1;
    this.roleColumn = -1;
  }

  exit() {
    this.cancelImport();
    this.router.navigate(['/group', this.groupUid, 'members']);
    return false;
  }

  confirmImport() {
    this.groupService.confirmAddMembersToGroup(this.groupUid, this.groupAddMembersInfo, "FILE_IMPORT").subscribe(resp => {
      this.groupModifiedResponse = resp;
      this.uploadComplete = true;
    })
  }

  downloadErrorFile() {
    this.groupService.downloadImportErrors(this.fileImportResult.errorFilePath).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "import-errors.xls");
    }, error => {
      console.log("error getting the file: ", error);
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
    this.uploadComplete = false; // clear, in case user is doing multiple
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
      this.analyzeHeaders(formData, params);
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
