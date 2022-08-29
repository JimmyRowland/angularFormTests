import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, ControlContainer } from '@angular/forms';
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
      this.portRanges.push(...this.getPortRangeArray(this.form['tcp-portrange'], 'TCP'), ...this.getPortRangeArray(this.form['udp-portrange'], 'UDP'), ...this.getPortRangeArray(this.form['sctp-portrange'], 'SCTP'))
    }
  }

  @ViewChild('portForm') ngForm?: NgForm;

  @Output() onProtocolRangesUpdate = new EventEmitter<{value: {'tcp-portrange': string, 'udp-portrange': string, 'sctp-portrange': string}, errors: any}>()

  sub?: Subscription;

  portRanges: Array<{protocol: Protocol, destLow?: number, destHigh?: number, sourceLow?: number, sourceHigh?: number }> = []
  protocolOptions: ReadonlyArray<Protocol> = ['TCP' , 'UDP' ,  'SCTP']
  showSourcePort = false

  constructor() { }

  ngAfterViewInit(): void {
    this.sub = this.ngForm?.control.valueChanges.pipe(delay(0)).subscribe(() =>{
        if(this.ngForm?.valid){
          this.onProtocolRangesUpdate.emit({value: {
              'tcp-portrange': this.getPortRange('TCP'),
              'udp-portrange': this.getPortRange('UDP'),
              'sctp-portrange': this.getPortRange('SCTP'),
            }, errors: {}})
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onAddDestinationPort(){
    this.portRanges.push({protocol: 'TCP'})
  }

  onRemoveDestinationPort(index: number){
    this.portRanges.splice(index, 1)
  }

  getPortRange(protocol: Protocol){
    return this.portRanges.filter((range) => range.protocol === protocol)
      .map(portRange => {
        const dest = `${portRange.destLow}-${portRange.destHigh}`;
        return this.showSourcePort? `${dest}:${portRange.sourceLow}-${portRange.sourceHigh}`: dest}
      ).join(' ')
  }

  getPortRangeArray(range: string, protocol: Protocol){
    return range.split(' ').filter(range=> range).map(range => range.split(/[-:]/).map(port => Number(port)))
      .map(([destLow, destHigh, sourceLow, sourceHigh])=> ({protocol, destLow, destHigh, sourceLow, sourceHigh}))
  }

}
