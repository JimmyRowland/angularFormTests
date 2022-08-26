import { NgModule } from "@angular/core";
import { ValidatorDirective } from "./validator.directive";

@NgModule({
  declarations: [ValidatorDirective],
  exports: [ValidatorDirective]
})
export class ValidatorModule {}
