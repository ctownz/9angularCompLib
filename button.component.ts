import { Component, OnInit, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { Style } from '../utilities/Style';
import { KeyValuePair } from '../utilities/keyValuePair';
import Utils from '../utilities/helpers';

@Component({
  selector: 'g-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() style: Style;
  @Input() bg: string;
  @Input() border: string;
  @Input() radius: string;
  @Input() size: string;
  @Input() color: string;
  public _id: string;
  get id(): string {
    return this._id || Utils.makeid();
  }
  @Input('id')
  set id(id: string) {
    this._id = id;
  }
  public name: string; 
  primary: string;
  secondary: string;
  success: string = '#2e7d32';
  error: string = '#f44336';
  font: string;
  type: string; // button, submit, reset
  padding: string;
  mainColor = "";
  
  _t: Style;
  _s: Style = new Style();
  start = true;
  debug = "";
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
      this.mainColor = this.style.primary;
      if(this.border != undefined){
        this.style.border = this.border;
      }
      if(this.radius != undefined){
        this.style.borderRadius = this.radius;
      }
      if( this.size == undefined) {
        this.size = this.style.size;
      }
      this.padding = this.setSize(this.size);
      this.start = false;
    }
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

  hoveredDivId;
  hovered = false;

  public showDivWithHoverStyles(divId: string) {
      this.style.primary = Utils.adjust(this.style.primary, 60);
  }

  public showAllDivsWithDefaultStyles() {
    this.style.primary = this.mainColor;
  }

  public keyPress(){
      this.style.primary = Utils.adjust(this.style.primary, -50);
  }

  public keyUp() {
    this.style.primary = this.mainColor;
  }
}
