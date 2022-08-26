import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
type Protocol = 'TCP/UDP/SCTP' | 'ICMP' | 'IP';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('protocolForm') ngForm?: NgForm;
  protocolOptions: ReadonlyArray<{ value: Protocol, label: string }> = [
    {value: 'TCP/UDP/SCTP', label: 'TCP/UDP/SCTP'},
    {value: 'ICMP', label: 'TCP/UDP/SCTP'},
    {value: 'IP', label: 'TCP/UDP/SCTP'}
  ];
  form: { protocol: Protocol, 'tcp-portrange': string, 'udp-portrange': string, 'sctp-portrange': string,
    iprange?: string, fdqn?: string, icmpcode?: number, icmptype?: number, 'protocol-number'?: number } = {
    protocol: 'TCP/UDP/SCTP',
    'tcp-portrange': '',
    'udp-portrange': '',
    'sctp-portrange': '',
  }

  sub?: Subscription;

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')
    setTimeout(()=>{
      this.sub = this.ngForm?.controls['tcp-portrange'].valueChanges.subscribe(console.log);
    })
    // interval().subscribe(()=>console.log(this.ngForm?.value))
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }
}
