import {
  AfterViewInit,
  Directive,
  ElementRef, forwardRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {
  AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl,
  Validators
} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "environments/environment";

declare const grecaptcha : any;

declare global {
  interface Window {
    grecaptcha : any;
    reCaptchaLoad : () => void
  }
}

export const RECAPTCHA_URL = new InjectionToken('RECAPTCHA_URL');

@Injectable()
export class RecaptchaAsyncValidator {

  constructor( private httpClient : HttpClient, @Inject(RECAPTCHA_URL) private url ) {
  }

  validateToken(token : string) {
    return (_ : AbstractControl ) => {
      return this.httpClient.get(this.url, { params: { token } }).map(res => {
        console.log("response on token: ", res);
        if(!res || !res['success']) {
          return { tokenInvalid: true }
        }
        return null;
      });
    }
  }
}

export interface RecaptchaConfig {
  theme? : 'dark' | 'light';
  type? : 'audio' | 'image';
  size? : 'compact' | 'normal';
  tabindex? : number;
}

@Directive({
  selector: '[appRecaptcha]',
  exportAs: 'appRecaptcha',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecaptchaDirective),
      multi: true
    },
    RecaptchaAsyncValidator]
})
export class RecaptchaDirective implements OnInit, AfterViewInit, ControlValueAccessor {

  key: string = environment.recaptchaPublicKey;

  @Input() config: RecaptchaConfig = {};
  @Input() lang: string;
  private widgetId: number;

  private onChange : (value: string) => void;
  private onTouched: (value: string) => void;

  private control: FormControl;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private element: ElementRef,
              private ngZone: NgZone,
              private injector: Injector,
              private tokenValidator: RecaptchaAsyncValidator) {
    console.log("initiating app captcha directive");
  }

  ngOnInit() {
    this.registerRecaptchaCallback();
    this.addScript();
  }

  ngAfterViewInit() {
    this.control = this.injector.get(NgControl).control;
    this.setValidator();
  }

  registerRecaptchaCallback() {
    if (isPlatformBrowser(this.platformId)) {
      window.reCaptchaLoad = () => {
        const config = {
          ...this.config,
          'sitekey': this.key,
          'callback': this.onSuccess.bind(this),
          'expired-callback': this.onExpired.bind(this)
        };
        this.widgetId = this.render(this.element.nativeElement, config);
      };
    }
  }

  private render(element: HTMLElement, config ): number {
    return grecaptcha.render(element, config);
  }

  addScript() {
    if (isPlatformBrowser(this.platformId)) {
      let script = document.createElement('script');
      const lang = this.lang ? '&hl=' + this.lang : '';
      script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  setValidator() {
    this.control.setValidators(Validators.required);
    setTimeout(() => this.control.updateValueAndValidity(), 0); // to avoid change after cycle
  }

  onSuccess(token: string) {
    this.ngZone.run(() => {
      this.verifyToken(token);
      this.onChange(token);
      this.onTouched(token);
    })
  }

  verifyToken(token: string) {
    this.control.setAsyncValidators(this.tokenValidator.validateToken(token));
    this.control.updateValueAndValidity();
  }

  onExpired() {
    this.ngZone.run(() => {
      this.onChange(null);
      this.onTouched(null);
    });
  }

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


}
