import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Language, findByThreeDigitCode} from "../../../../utils/language";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { debounceTime } from 'rxjs/operators'
import {NgbTabChangeEvent, NgbTabset} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'campaign-message-tabset',
  templateUrl: './message-tabset.component.html',
  styleUrls: ['./message-tabset.component.css']
})
export class MessageTabsetComponent implements OnInit, OnChanges {

  @ViewChild('t')
  private t: NgbTabset;

  @Input() titleKey: string;
  @Input() blockIndex: number;
  @Input() placeHolderKey: string;
  @Input() explanationKey: string;

  @Input() responseOptions: string[];

  @Input() languages: Language[];
  @Input() openLanguage: Language;

  @Input() priorMessages: Map<string, string>;

  @Input() maxMessageLength: number = 160;

  private _campaignMsgs: Map<string, string>;
  @Output() messagesUpdated = new EventEmitter<Map<string, string>>();
  @Output() languageChanged = new EventEmitter<Language>();

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

    this.formGroup.valueChanges.pipe(debounceTime(300))
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
        this.formGroup.removeControl(lang.threeDigitCode);
        this._campaignMsgs.delete(lang.threeDigitCode);
      });
    }

    if (changes['openLanguage'] && !changes['openLanguage'].firstChange) {
      this.currentTabId = 'tab-' + this.blockIndex + '-' + this.openLanguage.threeDigitCode;
      const newTabId = this.blockIndex + this.openLanguage.threeDigitCode;
      this.t.select(newTabId);
    }

    if (changes['priorMessages'] && !changes['priorMessages'].firstChange && this.formGroupSetup) {
      this.setMessages(this.priorMessages);
    }
  }

  tabChange($event: NgbTabChangeEvent) {
    this.currentTabId = $event.nextId;
    const langCode = this.currentTabId.substr(this.currentTabId.length - 3);
    const newLang = findByThreeDigitCode(langCode);
    this.languageChanged.emit(newLang);
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
