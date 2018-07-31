import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { JoinCodeInfo } from "../../model/join-code-info";
import { environment } from "environments/environment";

@Component({
    selector: 'app-join-word-row',
    templateUrl: './join-word-row.component.html',
    styleUrls: ['./group-join-methods.component.css'] // else a lot of needless duplication
})
export class GroupJoinWordRowComponent implements OnInit {
    
    @Input() wordInfo: JoinCodeInfo;
    @Input() groupName: string;
    @Input() groupJoinCode: string;
    @Output() removeWord: EventEmitter<any>;

    joinText: string = '';
    justCopied: boolean = false;

    constructor(private translateService: TranslateService) { 
        this.removeWord = new EventEmitter();
    }

    ngOnInit() {
        let params = {
            'shortCode': environment.groupShortCode,
            'groupName': this.groupName,
            'joinWord': this.wordInfo.word,
            'shortUrl': this.wordInfo.shortUrl,
            'ussdCode': environment.ussdPrefix + this.groupJoinCode + '#'
        };

        this.translateService.get("group.joinMethods.joinWordCbText", params).subscribe(text => {
            this.joinText = text;
        });
    }

    clipboardWorked(event){
        console.log('clipboard worked: ', event);
        this.justCopied = true;
        this.wordInfo.copied = true;
        setTimeout(() => this.wordInfo.copied = false, 2000);
    }

    clipboardFailed(event) {
        console.log('clipboard failed: ', event);
    }

}