import {
    DivaService
  } from './services/diva.service';
  import {
    DataService
  } from './services/data.service';
import { Subject } from 'rxjs';
  export const diva = new DivaService();
  export let data = new DataService();
  export const globalClick = new Subject();