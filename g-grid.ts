import { Component, Input, OnInit } from '@angular/core';
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
  @Input() data: Object[];

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

  // filtering
  dataType: string;
  filterButtonCaption: string;

  colTypes: StrDictionary[];

  // pagination
  p: number = 1;
  nbrItems = 10;
  pageSize = 10;
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
  sMsg: string = "";

  // The ngOnInit() is a lifecycle hook
  ngOnInit(): void {
    if (this.start) {
      if (this.data == undefined) {
        this.sMsg = 'No data';
      }
      else {
        this.format();
     
      if (this.style == undefined) {
        this.style = new Style();
      }
      else { this.style = new Style(); }
      if (this.color != undefined) {
        this.style.primary = this.color;
      }
      else { this.color = this.style.primary }
      this.aId = makeid();
      this.dId = makeid();
      this.ddlId = makeid();
      this.filIds = makeid();
      this.start = false;
    }
  }
  }

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

    for (i = 0; i < this.gridItems.length; i++) {
      let itm: AnyType = new AnyType();
      itm.iid = i; itm.name = k[i];
      var v = Object.values(this.gridItems[i])
      let aP: prop[] = new Array();

      for (let j = 0; j < Object.values(this.gridItems[i]).length; j++) {
        let p: prop = new prop();
        p.key = k[j];
        p.value = v[j];
        p.type = typeof (v[j]);

        if (Object.prototype.toString.call(v[j]) === '[object Date]') {
          p.type = "date";
          p.style = this.tdDate;
          p.value = p.value.toLocaleString();
        }
        else if (Number(p.value) || Number(p.value.replace(re, ""))) {
          if (p.key == "idx") {
            p.style = this.tdNV;
          }
          else {
            p.style = this.tdNbr;
          }
        }
        else {
          p.type = typeof (v[j]);
          p.style = "tdStrStyle";
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
    this.tableHeadings = tblHdr.filter(obj => obj.tableHeadingKey !== "A");

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
    var x = <HTMLSelectElement>document.getElementById(this.ddlId);
    let y = (x.options.selectedIndex) * 10;

    if (y == 5) {
      this.nbrItems = this.g.length;
      this.pageSize = this.g.length;
    }
    else {
      this.nbrItems = y;
      this.pageSize = y;
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

  // sort

  sortByColumn(x: any, d: number, event: any) {
    let ele = <HTMLSpanElement>event.target;

    let ml = <HTMLSpanElement>document.getElementById(x);
    var rl = document.getElementsByClassName('Sam');
    for (let i = 0; i < rl.length; i++) {
      let rm = <HTMLSpanElement>rl[i];
      rm.style.color = "#B0BEC5";
    }

    ele.style.color = this.color;

    this.sArr.push(x);
    if (d == 0) {

      this.g.sort((a, b) => (a.props[x].value > b.props[x].value) ? 1 : ((b.props[x].value > a.props[x].value) ? -1 : 0));
    }
    else if (d == 1) {
      alert(d);
      this.g.sort((a, b) => (a.props[x].value < b.props[x].value) ? 1 : ((b.props[x].value < a.props[x].value) ? -1 : 0));
    }
    // }
    this.sorted = true;
  }
  reset() {
    this.g = this.gConst;
    this.sortVis = "none";
    this.g.sort((a, b) => (a.iid > b.iid) ? 1 : ((b.iid > a.iid) ? -1 : 0));
    this.sorted = false;
    this.clearFilters();
    this.startOver();
  }

  // filtering
  vs = "";
  fil = false;
  dTest = new Date('6/10/2020');
  onKey(value: string, s: any) {

    var fArr = this.g;
    if (this.g[0].props[s].type.indexOf("string") > -1) {
      let c = value.toLowerCase()
      this.g = this.g.filter(p => p.props[s].value.toLowerCase().indexOf(c) > -1);
    }
    else if (this.g[0].props[s].type.indexOf("number") > -1) {
      this.g = this.g.filter(p => p.props[s].value == value);
    }
    else {
      this.dTest = new Date(this.g[0].props[s].value);
      if (value.length >= 8) {

      }
      var d = new Date(value);
      alert(d.getDay());
      let dt = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

      var d = new Date(dt);

      if (Object.prototype.toString.call(d) === "[object Date]") {
        // alert(Object.prototype.toString.call(d) === "[object Date]");
        if (!isNaN(d.getTime())) {
          this.g = this.g.filter(p => new Date(p.props[s].value).getTime() == d.getTime());
        }
        else {
          // this.g = this.g.filter(p => new Date(p.props[s].value).getTime() == d.getTime());
        }

      }
    }
    this.startOver();
  }
  public startOver() { // <<
    this.curPage = 1;
    this.arrPageNbrs();
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
  };
  filDate(d: Date) {
    let fromDate = new Date('11/11/1940');
    let toDate = new Date('06/10/2020');
    let v = this.g.filter((item: any) => {
      item.date.getTime() >= fromDate.getTime() &&
        item.date.getTime() <= toDate.getTime();
    });
    let w = this.g.filter(p => new Date(p.props[10].value).getTime() == toDate.getTime());
  }
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
    for (var i = 0, item; item = f[i]; i++) {
      let e = <HTMLInputElement>f[i];
      e.value = "";
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
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  download() {
    var csvData = this.ConvertToCSV(this.g);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    let str = 'data' + Utils.makeid + '.csv';
   
    if(this.title != undefined){
      str = this.title + '.csv';
    }
    
    a.download = str;/* your file name*/
    a.click();
    return 'success';
  }


}
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

