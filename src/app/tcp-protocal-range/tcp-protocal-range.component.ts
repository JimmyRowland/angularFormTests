import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  ControlContainer,
} from '@angular/forms';
import { Subscriber, Subscription, delay } from 'rxjs';

type Protocol = 'TCP' | 'UDP' | 'SCTP';
type PortRange = {
  protocol: Protocol;
  destLow?: number;
  destHigh?: number;
  sourceLow?: number;
  sourceHigh?: number;
};
type PortRanges = Array<PortRange>;
@Component({
  selector: 'app-tcp-protocal-range',
  templateUrl: './tcp-protocal-range.component.html',
  styleUrls: ['./tcp-protocal-range.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class TcpProtocalRangeComponent implements AfterViewInit, OnDestroy {
  @Input()
  form!: {
    'tcp-portrange': string;
    'udp-portrange': string;
    'sctp-portrange': string;
  };

  @ViewChild('portForm') ngForm?: NgForm;

  sub?: Subscription;

  portRanges: PortRanges = [];
  protocolOptions: ReadonlyArray<Protocol> = ['TCP', 'UDP', 'SCTP'];
  showSourcePort = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.sub = this.ngForm?.control.valueChanges
      .subscribe((portRangesObject) => {
        if (this.ngForm?.valid) {
          const portRanges = Object.values(portRangesObject) as PortRanges;
          console.log(portRanges)
          this.form['tcp-portrange'] = this.getPortRange('TCP', portRanges);
          this.form['udp-portrange'] = this.getPortRange('UDP', portRanges);
          this.form['sctp-portrange'] = this.getPortRange('SCTP', portRanges);
          console.log(this.form)
        }
      });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onAddDestinationPort() {
    this.portRanges.push({ protocol: 'TCP' });
  }

  onRemoveDestinationPort(index: number) {
    this.portRanges.splice(index, 1);
  }

  getPortRange(protocol: Protocol, portRanges: PortRanges) {
    return portRanges
      .filter((portRange) => portRange.protocol === protocol)
      .map((portRange) => {
        const dest = `${portRange.destLow}-${portRange.destHigh}`;
        return this.showSourcePort
          ? `${dest}:${portRange.sourceLow}-${portRange.sourceHigh}`
          : dest;
      })
      .join(' ');
  }
}
