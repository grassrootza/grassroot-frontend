import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Language} from "../../../../utils/language";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import "rxjs/add/operator/debounceTime"


@Component({
  selector: 'campaign-message-tabset',
  templateUrl: './message-tabset.component.html',
  styleUrls: ['./message-tabset.component.css']
})
export class MessageTabsetComponent implements OnInit, OnChanges {

  @Input() titleKey: string;
  @Input() blockIndex: number;
  @Input() placeHolderKey: string;
  @Input() responseOptions: string[];

  @Input() languages: Language[];

  private _campaignMsgs: Map<string, string>;
  @Output() messagesUpdated = new EventEmitter<Map<string, string>>();

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this._campaignMsgs = new Map<string, string>();
    this.formGroup = this.fb.group({});
    this.languages.forEach(language =>
      this.formGroup.addControl(language.threeDigitCode, this.fb.control('', Validators.required))
    );

    this.formGroup.valueChanges.debounceTime(300)
      .subscribe(term => {
        this.emitMessages(term);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['languages'].firstChange) {
      let oldLanguages = changes['languages'].previousValue;
      let removedLanguages = oldLanguages.filter(lang => this.languages.indexOf(lang) == -1);
      let addedLanguages = this.languages.filter(lang => oldLanguages.indexOf(lang) == -1);
      addedLanguages.forEach(lang => this.formGroup.addControl(lang.threeDigitCode, this.fb.control('', Validators.required)));
      removedLanguages.forEach(lang => {
        console.log("removing control with name: ", lang.threeDigitCode);
        console.log("does this control exist?: ", this.formGroup.get(lang.threeDigitCode));
        this.formGroup.removeControl(lang.threeDigitCode);
        this._campaignMsgs.delete(lang.threeDigitCode);
      });
    }
  }

  private emitMessages(values: any) {
    Object.keys(values).forEach(key => this._campaignMsgs.set(key, values[key]));
    this.messagesUpdated.emit(this._campaignMsgs);
  }

}
