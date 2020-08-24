import { Component, OnInit, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { Style } from '../utilities/Style';
import { KeyValuePair } from '../utilities/keyValuePair';
@Component({
  selector: 'g-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input() style: Style;
  @Input() autocomplete: " ";
  @Input() bg: string;
  @Input() border: string;
  _value: any;
  @Input() set value(val: any) {
    this._value = val;
  }
  get value(): any {
    return this._value;
  }
  @Input() set id(i: any) {
    this._id = i;
  }
  get id(): any {
    return this._id;
  }
  @Input() name: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() req: boolean;
  @Input() color: string;
  @Input() iconLeft: string;
  @Input() clear: boolean;
  @Input() width: string;
  @Input() type: string;
  @Input() sEr: string;
  @Input() length: number;
  @Input() onErr: boolean = true;
  @Input() onSubmit: boolean = false;

  @Input() size: string;
  @Input() radius: string;
  @Input() theme: string;
  @Input() collection: boolean;
  @Output() inputValue = new EventEmitter<KeyValuePair>();
  @Output() out = new EventEmitter<string>();
  @Output() iClick = new EventEmitter<KeyValuePair>();

  style1 = true;
  style2 = false;

  dt = "";
  onIcon = "mic1";
  offIcon = "mic1Off";
  on = "block";
  off = "none";
  public dateFrom: string = "2016-10-01";

  _iconRight: string; // not used
  _toggle: string;  // not used
  @Input() set iconRight(value: string) {
    this._iconRight = value;
  }
  get iconRight(): string {
    return this._iconRight;
  }
  @Input() direction: string;

  hold: boolean = true;
  _e: string = "0";
  _t: string = "text";
  _s: Style = new Style();

  _b: string;
  _c: string;
  _id: string;
  _radius: string;
  start: boolean = true;
  _rI: boolean = false;
  _lI: boolean = false;
  _label: boolean;
  _w: string;
  _iC: string;
  _l: number;
  _sp: string = "8px";
  lg = 'l';
  mg = 'm';
  rg = 'r';
  clr: boolean = true;
  err: string;
  icon: string;
  _lbl = 'none';
  _th = 'light';
  hasIcon = false;
  hasVal = false;
  light = true;
  plC = '#bdbdbd';
  b = '';
  txt = true;
  dt2 = false;
  dt3 = false;
  brw = navigator.userAgent;
  _sE: boolean = false;
  _cid: string = '';
  _r: string = 'req';
  ngOnInit() {
    if (this.type == undefined) { this.type = "text"; }
    if (this.start) {
      this.b = navigator.userAgent;
      if (this.direction != undefined && this.direction.indexOf('validate') > -1) {
        this._e = "block";
      }
      else if(this.onErr){  this._e = "block"; }
      else { this._e = "none"; }
      if (!this.req) { this._r = 'not req'; }
      if (this.theme != undefined && this.theme.indexOf('d') > -1) {
        this.light = false;
        this.plC = '#9e9e9e';
      }
      if (this.placeholder != undefined) {
        this.color = 'gainsboro';
        this.plC = '#9e9e9e';
      }
      else {
          this.color = 'inherit';
          this.plC = 'inherit'; 
      }
      if (this._value != undefined) {
        this.hasVal = true;
        this.style1 = false; this.style2 = true;
        if(this.type.indexOf('tel') > -1 && this.value.length == 10){
          this.value = '(' + this.value.substring(0,3) + ') ' + this.value.substring(3,6) + '-'+ this.value.substring(6,10);
        }
      }
      if (this.style == undefined) { this.style = this._s; }

      this._id = this.id || this.makeid();
      this._cid = this.makeid();
      this.rg = this.makeid();
      this.mg = this.makeid();
      this.lg = this.makeid();
      this.err = this.makeid();

      if (this.color == undefined) { this.color = this.style.fontColor; }

      if (this.label != undefined) {
        this._lbl = 'inline-block';
      }
      else if (this.placeholder != undefined) {
        this.label = this.placeholder;
      }
      this._b = this.border || this.style.border;
      this._c = this.bg || this.style.backgroundColor;
      if (this.name == undefined && this.label == undefined) {
        this.name = this._id;
      }
      else if (this.name == undefined && this.label != undefined) {
        this.name = this.label;
      }
      if (this.border != undefined) { this._b = this.border; }

      this._radius = this.radius || this.style.borderRadius;
      if (this.clear == false) { this.clr = false; } else { this.clr = true; }
      if (this.b.indexOf("Firefox") > -1 && this.type.indexOf('date') != -1) {
        this.clr = false;
      }
      if (this.type == "date") {
        this._t = "date";
        this.txt = false;
        this.dt2 = true;
        //this.clr = true;
        if (this._value != undefined) {
          if (this.b.indexOf('Edg/') > -1) {
            this.dt2 = false;
            this.dt3 = true;
            this.dateFrom = this.convertDate(this.dateFrom);
          }
          else {
            this.dt2 = true;
            this.dt3 = false;
            this.dte = this._value;
          }
        }
        else { this.dte = null; }
      }

      if (this.size != undefined && this.size != this.style.size) {
        this.style.size = this.size;
      }

      if (this.type != undefined) {
        this._t = this.type;
      }
      else if (this.type == undefined && this._t == undefined) {
        this.type = "text";
      }
      this.setIconSize(this.size);

      // length and width
      if ((this.b.indexOf("Edg/") > -1 || this.b.indexOf("Net") > -1) && this._t.indexOf("date") > -1) {
        this._w = this.width || '99%';
      }
      else { this._w = this.width || '99%'; }

      if (this.type == "date") {
        this._l = 10;
        this._w = '8rem';
        this._sp = "12px";
      }
      if (this.type == "tel") {
        this._l = 14;
      }
      else {
        this._l = this.length || 250;
      }
    }
    this.start = false;
  }
  d = 0;
  s = "";
  cro = 0;
  er = "";
  onKeyUp(e: any) {
    let ele = <HTMLInputElement>document.getElementById(this._id);

    if (this.onErr) {
      if (this.type == "number") {
        if (isNaN(parseFloat(ele.value))) { this.showErr("Please enter only numeric values."); }
        else {
          this.cl();
        }
      }
      else if (this.type == "alpha") {

        if (ele.value.match(/[0-9]+/g) != null) {
          this.showErr("Please enter alpha characters only (A-Z or a-z).");
        }
        else {
          this.cl();
        }
      }
      else if (this._t == "email") {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (ele.value.length > 128 || !EMAIL_REGEXP.test(ele.value)) {
          this.showErr("Please enter a valid email address.");
        } else if (ele.value.indexOf('.') < 0 || ele.value.lastIndexOf('.') == ele.value.length - 1) {
          this.showErr("Please enter a valid email address.");
        }
        else {
          this.hidden = true;
          this.dsply = 'none';
          this.cl();
        }
      }
      else if (this._t == "tel" || this._t.indexOf('hone') > -1) {
        const isN = /^[0-9]$/i.test(e.key);
        if (!isN && e.key != "Backspace") {
          let np = ele.value.match(/\d/g).length===10;
          if(!np) {
            this.showErr("Please enter only numeric values.");
          }
        }
        else {
          let y = ele.value.match(/[0-9]+/g).toString();
          if (y.length > 10) {
            event.preventDefault();
          }
          else if (y.length == 10 && e.key != "Backspace") {
            ele.value = '(' + y.substr(0, 3) + ') ' + y.substr(3, 3) + '-' + y.substr(6, 4);
            event.preventDefault();
            this.cl();
          }
          else if (y.length > 10) {
            event.preventDefault();
          }
        }
      }
      else if (this._t == "date") {
        let msg = "Please enter a valid date.";
        if (ele.value.length == 10) {
          
          if(!this.isValidDate(ele.value)){
            this.showErr(msg);
          }
          else{
            this.s = "correct";
            this.cl();
          }
        }
        if (ele.value.indexOf("-") > 4) {
          this.showErr(msg);
          return;
        }
      }
    }
  }
  onKeydown(e: any) {
    let ele = <HTMLInputElement>document.getElementById(this._id);

    if (ele != null) {
      if (ele.value != undefined && ele.value != this.placeholder) { this.style2 = true; this.style1 = false; }
    }
    if (ele != null) {
      if (ele.value != undefined && ele.value != this.placeholder) { this.style2 = true; this.style1 = false; }
    }
    if (this.length != undefined && ele.value.length > this.length) {
      event.preventDefault();
      return;
    }
    var temp = "-";

if(ele.value.length > 9 && this.type.indexOf("date") == 0){
  event.preventDefault; 
}
if(ele.value.length == 10 && this.type.indexOf("date") == 0){
  this.d = ele.value.length; 
  event.preventDefault; 
}
    if (e.keyCode === 13 || e.key === 13) {
      this.allSet();
    }
    else {
      if (ele != null) {
        if (ele.value == this.placeholder && !this.hasVal) {
          ele.value = "";
        }
      }
    }
  }
  onOut() {
    let el = <HTMLSpanElement>document.getElementById(this._cid);
    let e = <HTMLInputElement>document.getElementById(this._id);
    let non = "none"
    el.style.boxShadow = non;
    this.out.emit(e.value);
  }
  onIn() {
    let el = <HTMLSpanElement>document.getElementById(this._cid);
    let colour = "0 0 8px rgb(207,216,220,1)";
    el.style.boxShadow = colour;
  }
  onMouseDown(e: any) {
    let ele = <HTMLInputElement>document.getElementById(this._id);
    if (ele != null) {
      if (ele.value == this.placeholder && !this.hasVal) {
        ele.value = "";
        ele.selectionStart = 1;
      }
      ele.style.color = 'inherit';
    }
  }
  public save() {
    let ele = <HTMLInputElement>document.getElementById(this._id);
    let valued = true;
    var result = ele.value.replace(/ /g, "");

    if (this.type == "date" && this.onErr) {
      if (!this.isValidDate(ele.value)) {
        this.showErr("This is not a valid date.");
        return;
      }
    }
    if ((this.placeholder != undefined && ele.value == this.placeholder) || (result.length == 0)) {
      valued = false;
    }
    if ((this.req && ele.value == '') || (this.req && !valued)) {
      this.onErr = true;
      this.showErr("This field is required.");
    }
    else {
      this.cl();
      let val = new KeyValuePair();
      val.key = val.key = this._id; val.value = ele.value; val.name = this.label;
      if (!valued) {
        val.value = "";
      }
    }
  }
  onChg(){ 
    let e = <HTMLInputElement>document.getElementById(this._id);
    if(!this.isValidDate(e.value)){
      this.showErr("Please enter a valid date.");
    }
    else{
      this.cl();
    }
  }
  errMsg = "";
  hidden = true;
  _summary = "";
  dsply = 'block';
  dte: Date = new Date();
  isValidDate(dt: string) {

    dt = dt.split("-").join("");
    let y = dt.substring(0,4);
    var yN: number = +y;
    let m = dt.substring(4, 6); 
    var mN: number = +m;
    let d = dt.substring(6, 8); 
    var dN: number = +d;
    let valid = true;
 
    if(yN < 1000 || yN > 3000){
      valid = false;  
      return valid;
    }
    if(mN == 0 || mN > 12){
      valid = false;
      return valid;
    }
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(yN % 400 == 0 || (yN % 100 != 0 && yN % 4 == 0)){
      monthLength[1] = 29;
    }
    if(!(dN > 0 && dN <= monthLength[mN - 1])){
      valid = false;
    }
    return valid;
  }
  private showErr(errM: string) {
    this.hidden = false;
    this.dsply = 'block';
    this._summary = this._summary + "   " + errM;
    this.errMsg = errM;
    let l = <HTMLDivElement>document.getElementById(this.err);
    l.innerHTML = errM;
  }
  cl() {
    this.hidden = true;
    this.dsply = 'none';
    this.errMsg = '';
    this.showErr(this.errMsg);
  }

  allSet() {
    let ele = <HTMLInputElement>document.getElementById(this._id);
    let val = new KeyValuePair();
    val.key = this._id; val.value = ele.value; val.name = this.label;
    let e = <HTMLParagraphElement>document.getElementById("err");
    let v = e.innerHTML.length;
    if(v > 0){ val.valid = false; }
    this.inputValue.emit(val);
  }
  reset() {
    let e = <HTMLInputElement>document.getElementById(this._id);
    if (e != null) {
      e.value = this.placeholder || "";
    }
    if (this._t.indexOf('date') > -1) { this.style2 = false; this.style1 = true; }
    else { this.style2 = false; this.style1 = true; }
    this.hidden = false;
    this.dsply = 'block';
    let val = new KeyValuePair();
    val.key = this._id; val.value = ""; val.name = this.label;
    this.cl();
    this.inputValue.emit(val);
  }
  convertDate(dt: any) {
    let m = '';
    let d = '';
    dt = new Date(this._value);
    let t = dt.getFullYear();
    let u = dt.getMonth();
    return t.toString() + "-" + m + d;
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  iS = .1;
  szI = 24;
  top = '1px';
  padding = ".55rem .6rem .6rem .8rem";
  ipadding = ".4rem .4rem .36rem 0rem";

  setIconSize(s: string) {
    if (this.type == undefined && this._t == undefined) { this.type = "text"; }
    var x = navigator.userAgent;
    switch (s) {
      case 'small': {
        this.szI = 20;
        this.iS = 1;
        this.top = "2px";
        this.padding = ".14rem .3rem .1rem .1rem"
        if ((this.type.indexOf('date') > -1 || this._t.indexOf('date') > -1)) {
          this.padding = ".1rem .3rem .16rem .1rem"
        }
        else {
          this.padding = ".16rem .3rem .12rem .1rem"
        }
        break;
      }
      case 'medium': {
        this.iS = 1;
        this.szI = 28;
        this.top = "3.5px";
        if ((this.type.indexOf('date') > -1 || this._t.indexOf('date') > -1) && x.indexOf("Chrome") > -1) {
          this.padding = ".35rem 0rem .36rem .4rem";
        }
        else {
          this.padding = ".4rem .6rem .4rem .4rem";
        }
        break;
      }
      case 'large': {
        this.iS = .11;
        this.szI = 32;
        this.top = "3.5px";
        if ((this.type.indexOf('date') > -1 || this._t.indexOf('date') > -1) && x.indexOf("Chrome") > -1) {
          this.padding = ".5rem .75rem .6rem .1rem";
        }
        else {
          this.padding = ".55rem .75rem .65rem .42rem";
        }
        break;
      }
      default: {
        this.iS = 1;
        this.szI = 28;
        this.top = "3.5px";
        if (this.type.indexOf('date') > -1 || this._t.indexOf('date')) {
          this.padding = ".4rem .6rem .4rem .3rem";
        }
        else {
          this.padding = ".4rem .6rem .4rem .4rem";
        }
        break;
      }
    }
  }
}
