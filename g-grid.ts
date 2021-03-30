import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AnyType } from './anyType';
import { prop } from '../utilities/prop';
import { StrDictionary } from '../utilities/StrDictionary';
import { Style } from '../utilities/Style';
import { TableHeading } from '../grid/table-heading.type';
import Utils from '../utilities/helpers';

@Component({
  selector: 'g-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  constructor() { }
  @Input() hdr: string[];
  @Input() columns: string[];
  @Input() title: string;
  @Input() color: string;
  @Input() hdrBgColor: string;
  @Input() hdrTxtColor: string;
  @Input() data: Object[];
  @Input() export: boolean = true;
  @Output() pageChg: EventEmitter<any> = new EventEmitter();

  style: Style;
  start: boolean = true;
  aId: string;
  dId: string;
  th: TableHeading;
  tableHeadings: TableHeading[];
  dataTypes: StrDictionary[];

  gridItemsConst: Object[];
  shouldShow = false;
  rowCount: number;
  columnCount: number;
  search: string;
  i: number;
  named: string;
  filters: string;
  hidden = "showme";
  hideFilter = "showme";
  isSelected = "isSelected";
  notSelected = "notSelected";
  public isSelectedNA = false;
  hover = 1;
  hoverC = '';
  // filtering
  dataType: string;
  filterButtonCaption: string;
  fNm = '';

  colTypes: StrDictionary[];

  // pagination
  p: number = 1;
  nbrItems = 10;
  pageSize = 10;
  iSize = "7";
  pageNumbers: number[] = [1];
  curPage: number = 1;
  lastPage: number = 1;
  numberToDisplay = 12; // this is the number of page buttons on the pagination footer
  totalNumberPages = 0;
  lastDisplayed = 0;
  public rowsOnPage = 10;
  public sortBy = "idx";
  public sortOrder = " ";

  //sorting
  orderby: string;
  last: string;
  key: string = ' ';
  keyDefault: string = 'idx';
  reverse: boolean = false;
  direction: boolean;

  // Column Styling
  tdNbr = "tdNbrStyle";
  tdNV = "tdNV";
  tdDate = "tdDateStyle";
  hasData = false;
  headings: string[];
  sMsg: string = "No data found";
  noData: boolean = false;
  tblWidth: string = "750px";
  eq: string;
  gr: string;
  lt: string;
  ge: string;
  le: string;
  // icons, sort
  ai: string;
  di:string;

  tblId: string;

ngOnInit(): void {
    if (this.start) {
      this.tblId = makeid();
      this.fNm = makeid();
      this.eq = makeid();
      this.gr = makeid();
      this.lt = makeid();
      this.ge = makeid();
      this.le = makeid();
      this.ai = makeid();
      this.di = makeid();
      
      if (this.data == undefined) {
        this.noData = true;
      }
      else {
        this.format();
      }
      if (this.style == undefined) {
        this.style = new Style();
      }
      else { this.style = new Style(); }
      if (this.color != undefined) {
        this.style.primary = this.color;
      }
      else { this.color = this.style.primary }

      if (this.hdrBgColor == undefined) {
        this.hdrBgColor = '#cdcdcd';
      }
      if (this.hdrTxtColor == undefined && this.hdrBgColor == 'transparent') {
        this.hdrTxtColor = '#647687';
      }


      this.hoverC = setLtrDkr(this.hdrBgColor, 30);
      this.aId = makeid();
      this.dId = makeid();
      this.ddlId = makeid();
      this.filIds = makeid();
      this.start = false;
    }

  }

  strLen = 1;
  nbrLen = 1;
  dtLen = 1;
  strSize = "1";
  nbrSize = "1";
  dtSize = "1";
  w: string[] = new Array();
  public format() {
    this.gridItems = this.data;

    this.rowCount = this.gridItems.length;

    if (this.rowCount < this.numberToDisplay) {
      this.numberToDisplay = this.rowCount;
    }
    this.arrPageNbrs();
    var i = 0;
    this.key = 'idx';
    this.sortOrder = 'asc';
    this.direction = true;
    this.filters = 'noFilters';
    this.filterButtonCaption = 'Add Filters';

    // table headings (this just gets the property names.)

    this.headings = Object.keys(this.gridItems[0]);  // ok but add code to check for gridItems length in case nothing has been returned

    this.columnCount = this.headings.length + 1;

    var keysMapN = new Object;
    var tblHdr = [{ tableHeadingKey: "A", tableHeadingVal: "B" }];

    var k = Object.keys(this.gridItems[0]);
    let vg: AnyType[] = new Array();
    let re = /\-/gi;

    let sZ: string[] = new Array();
    let len = 0;

    // this.g.sort((a, b) => (a.props[x].value > b.props[x].value) ? 1 : ((b.props[x].value > a.props[x].value) ? -1 : 0));
    let colLen = 0;
    let result = this.g.map(a => a.props[0].value);
    
    for (i = 0; i < this.gridItems.length; i++) {
      let itm: AnyType = new AnyType();
      itm.iid = i; itm.name = k[i];
      var v = Object.values(this.gridItems[i])
      let aP: prop[] = new Array();
      let tW = 0;
      for (let j = 0; j < Object.values(this.gridItems[i]).length; j++) {
        let p: prop = new prop();
        p.key = k[j];
        p.value = v[j];
        p.charLen = "8";
        if (p.value.toString().length <= 1) {
          sZ.push('2rem');
          tW += 4;
        }
        else if (p.value.toString().length > 10 && p.value.toString().length < 90) {
          sZ.push('6rem');
          tW += 8;

        }
        else if (p.value.toString().length < 10) {
          sZ.push('4rem');
          tW += 8;

        }
        else {
          colLen = p.value.toString().length * .25;
          sZ.push(colLen.toString() + 'rem');
          tW += p.value.toString().length * 2.5;

        }
        this.tblWidth = tW.toString() + 'rem';
        p.type = typeof (v[j]);
       
        if (Object.prototype.toString.call(v[j]) === '[object Date]') {
          p.type = "date";
          p.style = this.tdDate;
          p.value = p.value.toLocaleString(); // debug
        }
        else if (Number(p.value) || Number(p.value.replace(re, ""))) {
          if (p.key == "idx") {
            p.style = this.tdNV;
          }
          else {
            p.style = this.tdNbr;

          }
        }
        else if(typeof p.value == "string" ){
          p.style = "tdStrStyle";
        }
        let str = "";
        if (p.type.indexOf('number') > -1) {
          str = p.value.toString();
          len = str.length;
          if (len > this.nbrLen) {
            this.nbrLen = len;
            this.nbrLen.toString();
          }
          p.charLen = len.toString();
          this.w.push(this.nbrLen.toString());
        }
        else if (p.type.indexOf('string') > -1) {
          len = Number(p.value.length);
          if (p.value.length > 30) {
            len = Number(p.value.length) + 4;
          }
          else { 
            if(len > 3 ){
              len += 3;
            }   
        }
          p.charLen = len.toString();
         this.w.push(p.charLen);
        }
        else if(p.type.indexOf('date') > -1){
          p.charLen = p.value.length.toString();
        }
        else {
          len = Number(p.value.length);
          if (len > this.dtLen) {
            this.dtLen = len;
            this.dtLen.toString();
          }
          p.charLen = len.toString();
          this.w.push(p.charLen); 
        }

        aP.push(p);
      }
      itm.props = aP;
      vg.push(itm);
    }

    this.g = vg;
    this.gConst = vg;

    if (this.columns == undefined) { this.hdr = Object.keys(this.gridItems[0]) }
    else { this.hdr = this.columns; }
    for (i = 0; i < Object.keys(this.gridItems[0]).length; i++) {
      let col = "Col" + i.toString();

      if (i === Object.keys(this.gridItems[0]).length - 1) {
        col = "idx";
      }
      var tN = new TableHeading;
      tN.idx = i;
      tN.tableHeadingKey = col;
      tN.type = this.g[0].props[i].type;

      if (Object.keys(this.gridItems[0])[i] != "idx") {
        if (this.hdr != undefined) {
          tN.tableHeadingVal = this.hdr[i];
        }
        else { tN.tableHeadingVal = Object.keys(this.gridItems[0])[i]; }
        tblHdr.push(tN);
        keysMapN[Object.keys(this.gridItems[0])[i]] = col;
      }
    }

    let wT = 0;
    this.tableHeadings = tblHdr.filter(obj => obj.tableHeadingKey !== "A");
    for (let m = 0; m < this.tableHeadings.length; m++) {
      this.tableHeadings[m].len = sZ[m];
      this.tableHeadings[m].size = this.w[m];

    }

    this.arrPageNbrs();

    this.gridItemsConst = this.gridItems;
    this.gridItemsConst = this.g;
    this.dataTypes = [{ key: "idx", value: "nbr" }];
    for (i = 0; i < Object.keys(this.gridItems[0]).length; i++) {
      if (this.gridItems[0][Object.keys(this.gridItems[0])[i]] != 'idx') {
        if (typeof this.gridItems[0][Object.keys(this.gridItems[0])[i]] == "string") {
          if (this.dateFilters(this.gridItems[0][Object.keys(this.gridItems[0])[i]], "string")) {
            this.addToDictionary(Object.keys(this.gridItems[0])[i], "tdDateStyle");
            for (var j = 0; j < this.gridItems.length; j++) {
              this.gridItems[j][Object.keys(this.gridItems[0])[i]] = new Date(this.gridItems[j][Object.keys(this.gridItems[0])[i]]);
            }
          }
          else {
            this.addToDictionary(Object.keys(this.gridItems[0])[i], "tdStrStyle");
          }
        }
        else if (typeof this.gridItems[0][Object.keys(this.gridItems[0])[i]] == "number") {
          this.addToDictionary(Object.keys(this.gridItems[0])[i], "tdNbrStyle");

        }
        else {
          this.addToDictionary(Object.keys(this.gridItems[0])[i], "other");
        }
      }
    }

  }

  // PAGINATION *******************************************
  public arrPageNbrs() {
    this.totalNumberPages = Math.ceil(this.g.length / this.nbrItems);
    this.pageNumbers = [1];
    if (this.totalNumberPages <= this.numberToDisplay) {
      for (let i = 2; i <= this.totalNumberPages; i++) {
        this.pageNumbers.push(i);
      }
      this.lastPage = this.pageNumbers.length;
    }
    else {
      for (let i = 2; i <= this.numberToDisplay; i++) {
        this.pageNumbers.push(i);
      }
      this.lastPage = this.totalNumberPages;
    }
  };

  public prev() {  // Previous
    this.curPage = this.curPage - 1;

    if (this.pageNumbers.indexOf(this.curPage) == -1) {
      this.pageNumbers = [this.curPage];

      let til = this.curPage + this.numberToDisplay;
      if (til > this.totalNumberPages) {
        til = this.totalNumberPages;
      }

      for (let i = this.curPage + 1; i <= til; i++) {
        this.pageNumbers.push(i);
      }

    }
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
  }

  public endUp() {
    this.curPage = this.lastPage;
    let n = this.totalNumberPages - (this.numberToDisplay - 1);
    if (n < 1) { n = 1; }
    this.pageNumbers = [n];

    for (let i = n + 1; i <= this.totalNumberPages; i++) {

      this.pageNumbers.push(i);


    }
    this.lastDisplayed = this.totalNumberPages;
  };

  public first(p) { for (var i in p) return p[i]; }

  public moveUp() {  // Next
    let prevPage = this.curPage;
    this.curPage = this.curPage + 1;
    let midPoint = this.numberToDisplay / 2;
    let firstEl = this.curPage - midPoint;
    let lastEl = this.curPage + 5;

    if (firstEl > 0) {
      this.pageNumbers = [firstEl];
      if (lastEl < this.totalNumberPages) {
        for (let i = firstEl + 1; i <= lastEl; i++) {
          this.pageNumbers.push(i);
        }
      }
      else if (this.totalNumberPages <= lastEl) {
        for (let i = firstEl + 1; i <= this.totalNumberPages; i++) {
          this.pageNumbers.push(i);
        }
      }
    }
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
  }

  public previousTen() { // ...
    let q = this.pageNumbers[0] - this.numberToDisplay;
    if (q <= 0) {
      q = 1;
    }
    this.pageNumbers = [q];
    for (let i = q + 1; i < this.numberToDisplay + q; i++) {
      this.pageNumbers.push(i);
    }
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
  }

  public nextTen() { // ...
    let n = this.pageNumbers.slice(-1)[0] + 1;
    this.pageNumbers = [this.curPage];
    if (this.curPage + this.numberToDisplay > this.totalNumberPages) {
      for (let i = this.curPage + 1; i <= this.totalNumberPages; i++) {
        this.pageNumbers.push(i);
      }
    }
    else {
      for (let i = this.curPage + 1; i <= this.curPage + this.numberToDisplay; i++) {
        this.pageNumbers.push(i);
      }
    }
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
  }
  // ITEMS PER PAGE 
  itemsPerPage(nbr: any) {
    // 2-6-21 CMT select changed to ddl to allow for styling
    if (nbr > this.g.length || nbr == 0) {
      this.nbrItems = this.g.length;
      this.pageSize = this.g.length;
    }
    else {
      this.nbrItems = nbr;
      this.pageSize = nbr;
    }
    this.curPage = 1;
    this.arrPageNbrs();
  }
  gridItems: Object[];
  g: AnyType[] = new Array();
  gConst: AnyType[];
  ddlId: string;
  filIds = '';
  sortVis = "none";
  ascDsc = 9;
  sorted = false;
  clrA = '#B0BEC5';
  clrD = '#B0BEC5';
  sArr: string[] = new Array(this.g.length);

  sort(key) {
    this.reverse = !this.reverse;
  }


  unsorted: "hoverSort";
  showSort() {
    if (this.sortVis.indexOf("none") > -1) {
      this.sortVis = "inline";
    }
    else {
      this.sortVis = "none";
    }

  }

  testIcon = "1009";  // Todo rmv
  
  aP = '<path d="M 12.033203 12.333984 L 12.033203 42.580078 L 22.054688 42.580078 L 22.054688 12.333984 L 12.033203 12.333984 z M 1.5195312 43.582031 L 16.941406 63.492188 L 33.070312 43.582031 L 1.5195312 43.582031 z "style="fill:whitesmoke;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.5" />';
  aPs = '<path d="M 12.033203 12.333984 L 12.033203 42.580078 L 22.054688 42.580078 L 22.054688 12.333984 L 12.033203 12.333984 z M 1.5195312 43.582031 L 16.941406 63.492188 L 33.070312 43.582031 L 1.5195312 43.582031 z "style="fill:#83919F;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.5" />';
  dP = '<path d="M 16.927734 0.37304688 L 0.79882812 20.283203 L 32.349609 20.283203 L 16.927734 0.37304688 z M 11.814453 21.285156 L 11.814453 51.529297 L 21.835938 51.529297 L 21.835938 21.285156 L 11.814453 21.285156 z "style="fill:whitesmoke;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333337" />';
  dPs = '<path d="M 16.927734 0.37304688 L 0.79882812 20.283203 L 32.349609 20.283203 L 16.927734 0.37304688 z M 11.814453 21.285156 L 11.814453 51.529297 L 21.835938 51.529297 L 21.835938 21.285156 L 11.814453 21.285156 z "style="fill:#83919F;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333337" />';
  // sort
  lS: number;
  sortByColumn(x: any, d: number, e: any) {
    this.resetArrows();
    if (d == 0) {
      let e = <HTMLSpanElement>document.getElementById(this.ai + x);
      this.g.sort((a, b) => (a.props[x].value > b.props[x].value) ? 1 : ((b.props[x].value > a.props[x].value) ? -1 : 0));

    e.innerHTML =
    "<svg width='" + 15 + "' height='" + 25 + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
    "<g transform='translate(" + 3 + ",0) scale(" + .3 + ")'>" +
      this.aP +
    "</g>" +
    "</svg>";
    }
    else if (d == 1) {
      let e = <HTMLSpanElement>document.getElementById(this.di + x);
      this.g.sort((a, b) => (a.props[x].value < b.props[x].value) ? 1 : ((b.props[x].value < a.props[x].value) ? -1 : 0));
      e.innerHTML =
      "<svg width='" + 15 + "' height='" + 25 + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
      "<g transform='translate(" + 3 + ",0) scale(" + .3 + ")'>" +
        this.dP +
      "</g>" +
      "</svg>";
    }

  }
  resetArrows(){
    var d = document.getElementsByName("des");
    var a = document.getElementsByName("asc");
  
    for(let i = 0; i < d.length; i++){
      d[i].innerHTML = "<svg width='" + 15 + "' height='" + 25 + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
      "<g transform='translate(" + 3 + ",0) scale(" + .3 + ")'>" +
        this.dPs +
      "</g>" +
      "</svg>";;
    }
    for(let i = 0; i < a.length; i++){
      a[i].innerHTML = "<svg width='" + 15 + "' height='" + 25 + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
      "<g transform='translate(" + 3 + ",0) scale(" + .3 + ")'>" +
        this.aPs +
      "</g>" +
      "</svg>";;
    }
  }
  
  reset() {
    this.resetArrows();
    this.sArr = [];
    this.g = this.gConst;
    this.sortVis = "none";
    this.g.sort((a, b) => (a.iid > b.iid) ? 1 : ((b.iid > a.iid) ? -1 : 0));
    this.sorted = false;
    this.clearFilters();
    this.startOver();
  }

  // filter
  vs = "";
  fil = false;
  dTest = new Date('6/10/2020');
  nbrFil: number;
  // filter dates
  filDts(s: any) {
    let eN = null; let gN = null; let lN = null; let gE = null; let lE = null;
    var a = document.getElementsByName(this.g[0].props[s].key);

    for (let i = 0; i < a.length; i++) {
      let c = <HTMLInputElement>a[i];
      if (c.id == 'eq' + this.g[0].props[s].key && c.value) {
        eN = Date.parse(c.value); 

        this.g = this.g.filter(p => Date.parse(p.props[s].value) == eN);
        break;
      }
      else if (c.id == 'gt' + this.g[0].props[s].key && c.value) {
        gN = Number(c.value);
      }
      else if (c.id == 'lt' + this.g[0].props[s].key && c.value) {
        lN = Number(c.value);
      }
      else if (c.id == 'ge' + this.g[0].props[s].key && c.value) {
        gE = Number(c.value);
      }
      else if (c.id == 'le' + this.g[0].props[s].key && c.value) {
        lE = Number(c.value);
      }
    }
    if (eN == null) {
      if (gE != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) >= gE);
      }
      if (lE != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) <= lE);
      }
      if (gN != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) > gN);
      }
      if (lN != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) < lN);
      }
    }

  }
  // filter numbers
  filNbrs(s: any) {

    let eN = null; let gN = null; let lN = null; let gE = null; let lE = null;  
    var a = document.getElementsByName(this.g[0].props[s].key);

    for (let i = 0; i < a.length; i++) {
      let c = <HTMLInputElement>a[i];
      if (c.id == 'eq' + this.g[0].props[s].key && c.value) {
        eN = Number(c.value);
        this.g = this.g.filter(p => Number(p.props[s].value) == eN);
        break;
      }
      else if (c.id == 'gt' + this.g[0].props[s].key && c.value) {
        gN = Number(c.value);
      }
      else if (c.id == 'lt' + this.g[0].props[s].key && c.value) {
        lN = Number(c.value);
      }
      else if (c.id == 'ge' + this.g[0].props[s].key && c.value) {
        gE = Number(c.value);
      }
      else if (c.id == 'le' + this.g[0].props[s].key && c.value) {
        lE = Number(c.value);
      }
    }
    if (eN == null) {
      if (gE != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) >= gE);
      }
      if (lE != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) <= lE);
      }
      if (gN != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) > gN);
      }
      if (lN != null) {
        this.g = this.g.filter(p => Number(p.props[s].value) < lN);
      }
    }
  }

  v = '';
  // main filter, strings
  onKey(value: string, s: any, e: any) {
   
    if (e.target.value.length == 0) {
      this.g = this.gConst;
    }
    else {
      if (this.g[0].props[s].type.indexOf("string") > -1) {
        let c = value.toLowerCase()
        this.g = this.g.filter(p => p.props[s].value.toLowerCase().indexOf(c) > -1);
      }
      else if (this.g[0].props[s].type.indexOf("number") > -1) {
        this.g = this.g.filter(p => p.props[s].value == value);
      }
    }
    this.startOver();
  }
  public startOver() {
    this.curPage = 1;
    this.arrPageNbrs();
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
  };

  filtersPnl() {
    if (this.filters == 'noFilters') {
      this.filters = 'filters';
    }
    else {
      this.clearFilters();
      this.filters = 'noFilters';
    }
  }

  clearFilters() {
    var f = document.getElementsByName(this.filIds);
    var temp = document.getElementsByName(this.fNm);
    var calc = document.getElementsByClassName("calc");
    for (let j = 0; j < temp.length; j++) {
      let c = <HTMLInputElement>temp[j];
      c.value = '';
    }
    for (var i = 0, item; item = f[i]; i++) {
      let e = <HTMLInputElement>f[i];
      e.value = "";
    }
    for (let k = 0; k < calc.length; k++) {
      let c = <HTMLInputElement>calc[k];
      c.value = '';
    }
    this.g = this.gConst;
    this.sorted = false;
    this.filters = "noFilters";
    this.startOver();
  }
  detectType(value: any) {
    switch (typeof value) {
      case 'string':
        return "str";
      case 'number':
        return "n";
      default:
        return "other";
    }
  }

  //  keeper
  addToDictionary(k: string, v: string) {
    var ds = new StrDictionary();
    ds.key = k;
    ds.value = v;
    this.dataTypes.push(ds);
  }
  resetAll() {
    this.key = 'idx';
  }

  dateFilters(value: string, s: any) {
    let newDate = new Date(value);

    if (Object.prototype.toString.call(newDate) === "[object Date]") {
      return true;
    }
    else {
      return true;
    }
  }
  downloadCSV() {
    var csvData = this.cSV();
    var blob = new Blob(csvData, { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
  
    if(navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, this.title);
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = this.title + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }
  // ToDo:  review once you have chrome working
  print() {
    let p = '<table style="border:2px solid gray;font-family:Arial;"><tr>';
    for (let i = 0; i < this.tableHeadings.length; i++) {
      p += '<td style="padding:6px;">' + this.tableHeadings[i].tableHeadingVal + '</td>';
    }

    for (let i = 0; i < this.g.length; i++) {
      p += '<tr>';
      for (let j = 0; j < this.g[i].props.length; j++) {
        p += '<td style="padding:6px;border:1.5px solid whitesmoke;">' + this.g[i].props[j].value + '</td>';
      }
    }
    p += '</tr><table>';

    let b = Utils.getBrowser();
    let w = window.open('', this.title, 'rel="noopener, left=10,top=10,width=600,height=900,toolbar=0,scrollbars=0,status=0,addressbar=0"');
    w.document.open();
    w.document.write(p);
    w.document.close();
    if (b.indexOf("Chrome") > -1) {
      setTimeout(function () {
        w.print();
        w.close();
      }, 10);
    }
    else {
      w.print();
      w.close();
    }
  }

  cSV() {
    let y = '';
    let x = [];
 
    for (let h = 0; h < this.tableHeadings.length; h++) {
      y = y + this.tableHeadings[h].tableHeadingVal + ',';
    }
    y = y.substring(0, y.length - 1) + '\r\n';
    x.push(y);
    for (let q = 0; q < this.g.length; q++) {
      y = '';
      for (let p = 0; p < this.g[q].props.length; p++) {
        y = y + this.g[q].props[p].value + ',';
      }
      y = y.substring(0, y.length - 1) + '\r\n';;
      x.push(y);
    }
    return x;
  }
  // do we need an export to json?

  /* CRUD */
/*   create() {
  }
  update() {
  }
  delete() {
  } */

}
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function setLtrDkr(col: string, amt: number) {
  var usePound = false;
  if (col[0] != "#") { col = '#9896A4'; amt = 30; }
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  else {
    if (amt < 0) {
      return '#c6c6c6';
    }
    else {
      return '#d3d3d3';
    }
  }

  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}
interface pg{
  
}
