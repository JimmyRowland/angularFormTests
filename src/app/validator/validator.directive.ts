import { Directive, Input, OnChanges, Injector } from "@angular/core";
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  NgControl
} from "@angular/forms";

@Directive({
  selector: "[validator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidatorDirective,
      multi: true
    }
  ]
})
export class ValidatorDirective implements Validator, OnChanges {
  @Input()
  validator: ValidatorFn = () => null;

  private onChange: Function = () => {};

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validator(control);
  }

  registerOnValidatorChange(onChange: Function) {
    this.onChange = onChange;
  }

  ngOnChanges() {
    this.onChange();
  }

  ngOnDestroy() {
    this.validator = () => null;
  }
}
