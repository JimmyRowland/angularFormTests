import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { interval, map, Subscription, tap } from 'rxjs';
import { ProtocolService } from './protocol.service';
type Protocol = 'TCP/UDP/SCTP' | 'ICMP' | 'IP';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  constructor(private protocolService: ProtocolService) {
  }

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

  subs: Subscription[] = [];

  get formString(){
    return JSON.stringify(this.form)
  }

  loaded = this.protocolService.protocol.pipe(map(()=>true))

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')
    this.subs.push(this.protocolService.protocol.pipe(tap(console.log)).subscribe(form => Object.assign(this.form, form)));
    setTimeout(()=>{
      this.subs.push(this.ngForm!.controls['tcp-portrange'].valueChanges.subscribe(console.log))
    })
    // interval().subscribe(()=>console.log(this.ngForm?.value))
  }
  ngOnDestroy(): void {
    for(const sub of this.subs){
      sub.unsubscribe();
    }
  }

  onProtocolRangesUpdate(value: {value: {'tcp-portrange': string, 'udp-portrange': string, 'sctp-portrange': string}, errors: any}): void{
    Object.assign(this.form, value.value);
  }
}
