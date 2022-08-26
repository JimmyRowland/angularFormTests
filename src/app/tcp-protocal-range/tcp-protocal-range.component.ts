import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, ControlContainer } from '@angular/forms';
import { Subscriber, Subscription } from 'rxjs';

type Protocol = 'TCP' | 'UDP' |  'SCTP'

@Component({
  selector: 'app-tcp-protocal-range',
  templateUrl: './tcp-protocal-range.component.html',
  styleUrls: ['./tcp-protocal-range.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class TcpProtocalRangeComponent implements AfterViewInit, OnDestroy {
  @Input()
  form!: {'tcp-portrange': string, 'udp-portrange': string, 'sctp-portrange': string}

  @ViewChild('portForm') ngForm?: NgForm;

  sub?: Subscription;



  portRanges: Array<{protocol: Protocol, destLow?: number, destHigh?: number, sourceLow?: number, sourceHigh?: number }> = []
  protocolOptions: ReadonlyArray<Protocol> = ['TCP' , 'UDP' ,  'SCTP']
  showSourcePort = false

  constructor() { }

  ngAfterViewInit(): void {
    this.sub = this.ngForm?.control.valueChanges.subscribe(() =>{
        if(this.ngForm?.valid){
          this.form['tcp-portrange'] = this.getPortRange('TCP');
          this.form['udp-portrange'] = this.getPortRange('UDP');
          this.form['sctp-portrange'] = this.getPortRange('SCTP');
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

}
