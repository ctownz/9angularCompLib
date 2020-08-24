import { Component, OnInit, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { Style } from '../utilities/Style';
import { KeyValuePair } from '../utilities/keyValuePair';
import Utils from '../utilities/helpers';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'g-form',
  templateUrl: './g-form.component.html'
})
export class GFormComponent implements OnInit {
  @Input() values: any[];
  @Input() title: string;
  @Input() onErr: boolean = true;
  @Input() required: boolean;
  @Input() req: boolean = false;
  @Input() style: Style;
  @Input() bg: string;
  @Input() border: string;
  @Input() radius: string;
  @Input() size: string;
  @Input() color: string;
  @Input() length: number;
  @Input() width: string;
  @Input() next: string;
  _id: string;
  get id(): string {
    return this._id || Utils.makeid();
  }
  @Input('id')
  set id(id: string) {
    this._id = id;
  }
  // output
  @Output() results = new EventEmitter<KeyValuePair[]>();

  public save() {
    var arr_Out:KeyValuePair[] = new Array(this.values.length);

    arr_Out = []; 
    let f = <HTMLFormElement>document.getElementById(this._id);
    var elements = f.elements;
    let xy = '';
    for (let i = 0; i < elements.length; i++) {
      if(elements[i].className != "button"){
        let ut = <HTMLInputElement>elements[i];
        let y = this.values[i].id;
        alert(y);
        if(ut.value != undefined){
          xy = ut.value;
        }
        else{ xy = ''; }
        let ct: KeyValuePair = {
          id: y,
          value: xy
        }
        arr_Out.push(ct);
      }
    }
    alert(arr_Out[1].id);
    this.results.emit(arr_Out); 
  }
 
  name: string; 
  primary: string;
  secondary: string;
  success: string = '#2e7d32';
  error: string = '#f44336';

  type: string; 
 
  
  _t: Style;
  _s: Style = new Style();
  _r = false;
  ttl = false;
  start = true;
  debug = "";

mi = 0;
  ngOnInit() {
    
    if(this.start){ 
      if(this._id == undefined) {
        this._id = Utils.makeid();
      }
      if (this.style == undefined) { 
        this.style = this._s;
      }
      if(this.color === undefined) {
        this.color = this.style.btnColor;
      }
      if(this.bg != undefined){
        this.style.primary = this.bg;
      }
      if(this.style.primary.indexOf("#") == -1){
        this.style.primary = Utils.colorToHex(this.style.primary);
      }
     
      if(this.border != undefined){
        this.style.border = this.border;
      }
      if(this.radius != undefined){
        this.style.borderRadius = this.radius;
      }
      if( this.size == undefined) {
        this.size = this.style.size;
      }
      if( this.width == undefined) {
        this.width = '80%';
      }
      if( this.title != undefined) {
        this.ttl = true;
      }
      this.start = false;
    }
  }
  randomInt(min: number, max: number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }
  setSize(s: string) {
    switch (s) {
      case 'small': {
        return '.16rem .6rem .38rem .6rem';
      }
      case 'medium': {
        return '.53rem .8rem .63rem .8rem';
      }
      case 'large': {
        return '.65rem .95rem .735rem .95rem';
      }
      case 'full': {
        return '100%';
      }
      default: {
        return '.53rem .8rem .63rem .8rem';
      }
    }
  }
}


