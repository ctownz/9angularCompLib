import { Component, OnInit, Input, ContentChildren } from '@angular/core';
import { Sym, Svgs } from '../paths/sym';
import Utils from '../utilities/helpers';

@Component({
  selector: 'g-icon',
  templateUrl: './icon.component.html'
})
export class IconComponent implements OnInit {
    @Input() color: string;
    @Input() size: any;
    @Input() id: string;
    @Input() s: string;
    @Input() f: string;
    _i = '';
  
    @Input() set i(value: string) {
        this._i = value;
     }
     get i(): string {
         return this._i;
     }
    gicon = this.i;
    
    start:boolean = true;
    constructor() { 
    }
    
      strPath: string;
      ic: string;
    
      ngOnInit() {
        this.wrap(this.size);
        if(this.start && this.id == undefined){ 
          this.ic = this.color || '#b0bec5'; 
          this.id = Utils.makeid(); this.start = false;
        }
        this.gicon = Svgs.Codes[this._i];

      }
      ngAfterViewInit() {
        this.setIcon();
      }
      clr: string = "gray";
      setIcon(){
        let ele2 = document.getElementById(this.id);
        if (this.gicon != undefined && ele2 != undefined) {
          if (this.ic != undefined && this.gicon.indexOf('#') == -1) {
            var re = /gray/gi;
            var str = this.gicon;
            this.strPath = str.replace(re, this.ic);
    
            if(this.strPath.indexOf("_w") > -1) {this.t = 10; }
            ele2.innerHTML =
              "<svg width='" + this.w + "' height='" + this.w + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
              "<g transform='translate(" + this.t + ",0) scale(" + this.g + ")'>" +
              "<path class=" + this.strPath +
              "</g>" +
              "</svg>";
          }
          else {
            this.strPath = this.gicon;
            ele2.innerHTML = this.strPath;
          }
        }
      }
    
      w = "24px";
      g = .09;
      t = 0;
    
      wrap(s: any){
          switch (this.size) {
            case 'xxsmall': {
              this.w = "12px";
              this.g =  .12;
              break;
            }
            case 12: {
              this.w = "12px";
              this.g =  .11;
              break;
            }
            case 'xsmall': {
              this.w = "16px";
              this.g =  .15;
              break;
            }
            case '16': {
              this.w = "16px";
              this.g =  .15;
              break;
            }
            case 16: {
              this.w = "16px";
              this.g =  .15;
              break;
            }
            case 'small': {
              this.w = "24px";
              this.g =  .108;
              break;
            }
            case 20: {
              this.w = "20px";
              this.g =  .16;
              break;
            }
            case 'medium': {
              this.w = "28px";
              this.g =  .35;
              break;
            }
    
            case 20: {
              this.w = "20px";
              this.g =  .155;
              break;
            }
            case '24': {
              this.w = "24px";
              this.g =  .185;
              break;
            }
            case 24: {
              this.w = "24px";
              this.g =  .185;
              break;
            }
            case '28': {
              this.w = "28px";
              this.g =  .19;
              break;
            }
            case 28: {
              this.w = "28px";
              this.g =  .19;
              break;
            }
            case '30': {
              this.w = "30px";
              this.g =  .22;
              break;
            }
            case 30: {
              this.w = "30px";
              this.g =  .22;
              break;
            }
            case '32': {
              this.w = "32px";
              this.g =  .254;
              break;
            }
            case 32: {
              this.w = "32px";
              this.g =  .254;
              break;
            }
            case 36: {  
              this.w = "36px";
              this.g =  .270;  
              break;
            }
            case 40: {
              this.w = "40px";
              this.g =  .270;  
              break;
            }
            case '40': {
              this.w = "40px";
              this.g =  .270;  
              break;
            }
            case 41: {
              this.w = "40px";
              this.g =  .95;  
              break;
            }
            case '48': {
              this.w = "48px";
              this.g =  .377;
              break;
            }
            case 48: {
              this.w = "48px";
              this.g =  .377;
              break;
            }
            case '64': {
              this.w = "64px";
              this.g =  .509;
              break;
            }
            case 64: {
              this.w = "64px";
              this.g =  .509;
              break;
            }
            case '96': {
              this.w = "96px";
              this.g =  .77;
              break;
            }
            case 96: {
              this.w = "96px";
              this.g =  .77;
              break;
            }
            case '128': {
              this.w = "128px";
              this.g =  1;
              break;
            }
            case 128: {
              this.w = "128px";
              this.g =  1;
              break;
            }
            case 'large': {
              this.w = "92px";
              this.g =  .5;
              break;
            }
            case 'xlarge': {
              this.w = "60px";
              this.g =  .23;
              break;
            }
            case 'xxlarge': {
              this.w = "72px";
              this.g =  .28;
              break;
            }
            default: {
              this.w = "22px";//container
              this.g =  .185;
              break;
            }
          }
        }
    }