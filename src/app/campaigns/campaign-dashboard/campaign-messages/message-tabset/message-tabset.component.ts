import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Language} from "../../../../utils/language";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import "rxjs/add/operator/debounceTime"
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'campaign-message-tabset',
  templateUrl: './message-tabset.component.html',
  styleUrls: ['./message-tabset.component.css']
})
export class MessageTabsetComponent implements OnInit, OnChanges {

  @Input() titleKey: string;
  @Input() blockIndex: number;
  @Input() placeHolderKey: string;
  @Input() explanationKey: string;

  @Input() responseOptions: string[];

  @Input() languages: Language[];
  @Input() priorMessages: Map<string, string>;

  @Input() maxMessageLength: number = 160;

  private _campaignMsgs: Map<string, string>;
  @Output() messagesUpdated = new EventEmitter<Map<string, string>>();

  formGroup: FormGroup;
  formGroupSetup: boolean = false;
  public charsLeft: number[] = [];

  public currentTabId = "";

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this._campaignMsgs = new Map<string, string>();
    this.formGroup = this.fb.group({});

    this.languages.forEach(language => {
        let value = (this.priorMessages && this.priorMessages.has(language.threeDigitCode)) ? this.priorMessages.get(language.threeDigitCode) : '';
        this.formGroup.addControl(language.threeDigitCode, this.fb.control(value, Validators.required));
        this.charsLeft[language.threeDigitCode] = this.maxMessageLength - value.length;
        this.formGroupSetup = true;
      }
    );

    this.currentTabId = "tab-" + this.blockIndex + "-" + this.languages[0].threeDigitCode;

    this.formGroup.valueChanges.debounceTime(300)
      .subscribe(term => {
        this.emitMessages(term);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['languages'] && !changes['languages'].firstChange) {
      let oldLanguages = changes['languages'].previousValue;
      let removedLanguages = oldLanguages.filter(lang => this.languages.indexOf(lang) == -1);
      let addedLanguages = this.languages.filter(lang => oldLanguages.indexOf(lang) == -1);
      // console.log('adding languages? : ', addedLanguages);
      addedLanguages.forEach(lang => this.formGroup.addControl(lang.threeDigitCode, this.fb.control('', Validators.required)));
      removedLanguages.forEach(lang => {
        // console.log("removing control with name: ", lang.threeDigitCode);
        // console.log("does this control exist?: ", this.formGroup.get(lang.threeDigitCode));
        this.formGroup.removeControl(lang.threeDigitCode);
        this._campaignMsgs.delete(lang.threeDigitCode);
      });
    }

    if (changes['priorMessages'] && !changes['priorMessages'].firstChange && this.formGroupSetup) {
      this.setMessages(this.priorMessages);
    }
  }

  tabChange($event: NgbTabChangeEvent) {
    // console.log("changing tab to: ", $event.nextId);
    this.currentTabId = $event.nextId;
  }

  private setMessages(messages: Map<string, string>) {
    this.languages.forEach(language => {
        let value = (this.priorMessages && this.priorMessages.has(language.threeDigitCode)) ? this.priorMessages.get(language.threeDigitCode) : '';
        // console.log('setting value for control: ', value);
        this.formGroup.controls[language.threeDigitCode].setValue(value);
        this.charsLeft[language.threeDigitCode] = this.maxMessageLength - value.length;
      }
    );
  }

  private emitMessages(values: any) {
    Object.keys(values).forEach(key => this._campaignMsgs.set(key, values[key]));
    this.messagesUpdated.emit(this._campaignMsgs);
  }

  updateCharCount(event, languageCode) {
    this.charsLeft[languageCode] = this.maxMessageLength - event.target.value.length;
  }

}
