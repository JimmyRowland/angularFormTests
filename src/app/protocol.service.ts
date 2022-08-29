import { Injectable } from '@angular/core';
import { delay, Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {

  constructor() { }
  protocol = new Observable(subscriber => subscriber.next({
    protocol: 'TCP/UDP/SCTP',
    'tcp-portrange': '1-2 3-4',
    'udp-portrange': '',
    'sctp-portrange': '',
  })).pipe(delay(200), share())
}
