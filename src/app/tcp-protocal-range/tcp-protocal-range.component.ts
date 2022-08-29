import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, ControlContainer, FormBuilder, Validators, Validator } from '@angular/forms';
import { delay, Subscriber, Subscription } from 'rxjs';

type Protocol = 'TCP' | 'UDP' |  'SCTP'

@Component({
  selector: 'app-tcp-protocal-range',
  templateUrl: './tcp-protocal-range.component.html',
  styleUrls: ['./tcp-protocal-range.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TcpProtocalRangeComponent implements AfterViewInit, OnDestroy {
  // can remove
  @Input()
  form: {'tcp-portrange': string, 'udp-portrange': string, 'sctp-portrange': string} = {'tcp-portrange': '', 'udp-portrange': '', 'sctp-portrange': ''}

  @Input('loaded')
  set setForm(loaded: boolean | null){
    if(loaded){
      const controls = [...this.getPortRangeArray(this.form['tcp-portrange'], 'TCP'), ...this.getPortRangeArray(this.form['udp-portrange'], 'UDP'), ...this.getPortRangeArray(this.form['sctp-portrange'], 'SCTP')]
      for(const control of controls){
        this.portRanges.push(control)
      }
    }
  }

  @Output() onProtocolRangesUpdate = new EventEmitter<{value: {'tcp-portrange': string, 'udp-portrange': string, 'sctp-portrange': string}, errors: any}>()

  sub?: Subscription;

  protocolOptions: ReadonlyArray<Protocol> = ['TCP' , 'UDP' ,  'SCTP']
  showSourcePort = false

  portRanges = this.fb.array([this.getNewDestinationPortControl()],Validators.required)

  constructor(private fb: FormBuilder) { }

  ngAfterViewInit(): void {
    this.sub = this.portRanges?.valueChanges.pipe(delay(0)).subscribe(() =>{
        if(this.portRanges?.valid){
          this.onProtocolRangesUpdate.emit({value: {
              'tcp-portrange': this.getPortRange('TCP'),
              'udp-portrange': this.getPortRange('UDP'),
              'sctp-portrange': this.getPortRange('SCTP'),
            }, errors: {}})
        }
      }
    );
  }

  getNewDestinationPortControl({protocol, destLow, destHigh, sourceLow, sourceHigh}: {protocol: Protocol, destLow?: number, destHigh?: number, sourceLow?: number, sourceHigh?: number} = {protocol: 'TCP'}){
    return this.fb.group({protocol: new FormControl<Protocol>(protocol, [Validators.required]),
      destLow: new FormControl<number| undefined>(destLow, [Validators.required]),
      destHigh: new FormControl<number| undefined>(destHigh, [Validators.required]),
      sourceLow: new FormControl<number| undefined>(sourceLow),
      sourceHigh: new FormControl<number| undefined>(sourceHigh) })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onAddDestinationPort(){
    this.portRanges.push(this.getNewDestinationPortControl())
  }

  onRemoveDestinationPort(index: number){
    this.portRanges.removeAt(index);
  }

  getPortRange(protocol: Protocol){
    return this.portRanges.value.filter((range) => range.protocol === protocol)
      .map(portRange => {
        const dest = `${portRange.destLow}-${portRange.destHigh}`;
        return this.showSourcePort? `${dest}:${portRange.sourceLow}-${portRange.sourceHigh}`: dest}
      ).join(' ')
  }

  getPortRangeArray(range: string, protocol: Protocol){
    return range.split(' ').filter(range=> range).map(range => range.split(/[-:]/).map(port => Number(port)))
      .map(([destLow, destHigh, sourceLow, sourceHigh])=> this.getNewDestinationPortControl({protocol, destLow, destHigh, sourceLow, sourceHigh}))
  }

}
