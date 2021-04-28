import { Component, EventEmitter, Input, Output, OnInit, KeyValueDiffers } from '@angular/core';
import { AnyType } from '../utilities/anyType';
import { prop } from '../utilities/prop';
import { StrDictionary } from '../utilities/dictionary';
import { Style } from '../utilities/Style';
import { TableHeading } from '../grid/table-heading.type';
import Utils from '../utilities/helpers';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor() { }
  @Input() hdr: string[];
  @Input() columns: string[];
  @Input() title: string;
  @Input() color: string;
  @Input() hdrBgColor: string;
  @Input() hdrTxtColor: string;
  @Input() data: Object[];
  @Input() export: boolean = true;
  @Input() paged: boolean = true;
  @Input() range: number;
  @Input() totalItems: number;
  @Output() pageChg = new EventEmitter<args>();

  chunk = 0;
  t = 0;
  u = 0;
  bof = 0;
  dataTracker = 0;
  cursor = 0;
  ngOnChanges(changes: SimpleChanges) {
   
    this.u += this.pageNumbers[this.pageNumbers.length - 1];
    if (changes.data && !this.start) {
   
      if(this.data.length == 0){
        this.noData = true;
        this.sMsg = "There are no results returned from this request.";
      }
      else{
        this.noData = false;
        this.sMsg = "";
      if (this.page.refresh || this.page.reset) {
        this.format();
        this.chunk = 0;
        this.dataTracker = 0;
        this.curPage = 1;
        this.page.refresh = false;
        this.page.reset = false;
      }
      else {
        let b = this.dataTracker;  // rmv
        this.format();
        let c = Math.ceil(this.g.length / this.nbrItems);
        this.curPage = 1;

        if (this.page.cursor > 0) {
          this.dataTracker += this.data.length;
          this.chunk = (this.u - 1);
          this.t = c++;
        }
        else {
          this.dataTracker -= this.data.length;
          this.chunk = this.chunk - c;
        }
        if (this.dataTracker >= this.totalItems) {
          this.eof = true;
        }
        else if (this.dataTracker <= 0) {
          this.eof = false;
          this.bof = 1;
        }
      }
    }
    }
  }


  style: Style;
  start: boolean = true;
  aId: string;
  dId: string;
  th: TableHeading;
  tableHeadings: TableHeading[];
  dataTypes: StrDictionary[];
  dataApp: Object[];
  gridItemsConst: Object[];
  shouldShow = false;
  rowCount: number;
  columnCount: number;
  search: string;
  i: number;
  named: string;
  filters: string;
  hidden = "showme";
  // hideFilter = "showme";
  isSelected = "isSelected";
  notSelected = "notSelected";
  public isSelectedNA = false;
  hover = 1;
  hoverC = '';
  // filtering
  dataType: string;
  filterButtonCaption: string;
  fNm = '';
  dtFnm = '';
  nbrfNm = '';

  colTypes: StrDictionary[];

  // pagination
  paging: boolean = true;
  @Input() nbrItems: number;
  page: args;
  p: number = 1;
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
  // calcs objects
  cId = '';
  // icons, sort
  ai: string;
  di: string;
  dlen = 0;
  tblId: string;
  addNewItem(val: string) { }
  ngOnInit(): void {
    if (this.start) {
      this.tblId = makeid();
      this.fNm = makeid();
      this.dtFnm = makeid();
      this.nbrfNm = makeid();
      this.eq = makeid();
      this.gr = makeid();
      this.lt = makeid();
      this.ge = makeid();
      this.le = makeid();
      this.ai = makeid();
      this.di = makeid();
      this.cId = 'mth' + makeid();

      // initiialize 
      this.page = {
        page: 1
      };
      this.page.page = 1;
      this.page.cursor = 0;
      this.fK = { "key": 9, "val": "desc" };
      this.page.filters = [];
      this.page.sort = [];
      this.page.reset = false;
      this.page.refresh = false;
      if (this.nbrItems == undefined) { this.nbrItems = 10; };
      this.pageSize = this.nbrItems;
      if (this.data == undefined) {
        this.noData = true;
      }
      else {
        this.dataTracker = this.data.length;
        this.dataApp = this.data;
        this.dlen = this.dataApp.length;
        this.format();
        this.page.start = 0;
        this.page.end = this.g.length - 1;
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
  mad = '';
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
    let colLen = 0;
    // let result = this.g.map(a => a.props[0].value);
    // check for null values
    for (i = 0; i < this.gridItems.length; i++) {
      let itm: AnyType = new AnyType();
      itm.iid = i; itm.name = k[i];
      var v = Object.values(this.gridItems[i]);
      let aP: prop[] = new Array();
      let tW = 0;
      for (let j = 0; j < Object.values(this.gridItems[i]).length; j++) {

        let p: prop = new prop();
        if (p.value == undefined) { p.value = " "; }
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



        // date
        let dt = new Date(v[j]);
        // ToDo: how do you want to include the time??
        if (Object.prototype.toString.call(v[j]) === '[object Date]') {
          p.type = "date";
          p.style = this.tdDate;
        //  p.value = dt.toLocaleString() + " ** " + v[j].toString().length;
      
         p.value = dt.toLocaleDateString();
         
        }
        else if (Number(p.value) || Number(p.value.replace(re, ""))) {
          if (p.key == "idx") {
            p.style = this.tdNV;
          }
          else {
            p.style = this.tdNbr;
          }
        }
        else if (typeof p.value == "string") {
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
            if (len > 3) {
              len += 3;
            }
          }
          p.charLen = len.toString();
          this.w.push(p.charLen);
        }
        else if (p.type.indexOf('date') > -1) {
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

    if (this.totalItems == 0 || this.totalItems == undefined) { this.totalItems = vg.length; }

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
  eof = false;

  // PAGINATION *******************************************
  public arrPageNbrs() {
    this.totalNumberPages = Math.ceil(this.g.length / this.nbrItems);

    this.pageNumbers = [];
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

    let e = this.totalNumberPages;
    this.cursor = this.pageNumbers[this.pageNumbers.length - 1]
  }

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
    // Previous
    //  this.page.page = this.curPage - 1;
    //  this.page.cursor = -1;
    //  this.pageChg.emit(this.page);
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
    // >>
    this.page.page = this.totalNumberPages;
    this.page.cursor = 1;
    // this.pageChg.emit(this.page);
  };
  // ToDo: add emit for paging????
  nextPg(nbr: number) {
    if (nbr == this.lastPage) {
      // this.nextTen();
      this.curPage = nbr;
    }
    else {
      this.curPage = nbr;
    }
  }
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
    // Next
    this.page.page = this.curPage + 1;
    this.page.cursor = 1;
    this.pageChg.emit(this.page);
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
    // ...
    //  this.page.page = this.pageNumbers[0];
    if (this.paging) {
      this.curPage = 1;
      this.page.cursor = -1;
      this.pageChg.emit(this.page);
    }
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
    // ...

    this.page.page = this.pageNumbers[this.pageNumbers.length - 1];
    this.page.cursor = 1;
    this.pageChg.emit(this.page);
  }
  // ITEMS PER PAGE 
  itemsPerPage(nbr: number) {
    // 2-6-21 CMT select changed to ddl to allow for styling
    this.chunk = 0;
    if (nbr > this.g.length || nbr == 0) {

      this.nbrItems = this.g.length;
      this.pageSize = this.g.length;
    }
    else {
      this.nbrItems = nbr;
      this.pageSize = nbr;
    }
    //alert(this.nbrItems);
    this.curPage = 1;
    this.arrPageNbrs();

    this.paginate();

  }
  // ToDo: remove
  paginate() {
   // alert(571);
    /* let p: args = {
      "sort": "value" */
    //}
    // this.pageChg.emit(this.page);
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
  // https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
  lS: number;
  sel = 999;
  dir = 9;
  k: keyValue;
  sortByColumn(x: any, d: number, e: any) {
    this.sel = x;
    this.dir = d;
   
    let kV = { "key": x, "operand": '', "val": "desc" };
    if (this.paged) {
     
      kV.val = (d > 0) ? "desc" : "asc";
      this.page.cursor = 0;
      this.page.refresh = true;
      this.page.sort = [];
      this.page.sort.push(kV);
     // alert(this.page.sort[0].val);
      this.pageChg.emit(this.page);
    }
    else {
      if (d == 0) {
        this.g.sort((a, b) => (a.props[x].value > b.props[x].value) ? 1 : ((b.props[x].value > a.props[x].value) ? -1 : 0));
      }
      else if (d == 1) {
        this.g.sort((a, b) => (a.props[x].value < b.props[x].value) ? 1 : ((b.props[x].value < a.props[x].value) ? -1 : 0));
      }
    }
  }

  /*   resetArrows(){
      var d = document.getElementsByName("des");
      var a = document.getElementsByName("asc");
      var e = document.getElementsByName("des1");
  
      for (let i = 0; i < d.length; i++) {
         d[i].innerHTML = "<svg width='" + 15 + "' height='" + 25 + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
          "<g transform='translate(" + 2 + ",0) scale(" + .3 + ")'>" +
            this.dPs +
          "</g>" +
          "</svg>";
      }
      // asc
      for(let i = 0; i < a.length; i++){
        a[i].innerHTML = "<svg width='" + 15 + "' height='" + 25 + "'transform='rotate(180)' " + "' style='background-color:transparent;overflow: hidden;vertical-align:top;padding:0px;margin:0px;'>" +
        "<g transform='translate(" + 3 + ",0) scale(" + .3 + ")'>" +
          this.aPs +
        "</g>" +
        "</svg>";;
      }
    } */

  reset() {
    if(this.paged){
      this.page.filters = [];
      this.page.sort = [];
      this.page.reset = true;
      this.pageChg.emit(this.page);
      this.sorted = false;
      this.sortVis = "none";
      this.sel = 999;
      this.clearFilters();      
    } 
    else{
    this.sel = 999;
    this.dir = 999;
    this.sArr = [];
    this.g = this.gConst;
    this.sortVis = "none";
    this.g.sort((a, b) => (a.iid > b.iid) ? 1 : ((b.iid > a.iid) ? -1 : 0));
    this.sorted = false;
    this.clearFilters();
    this.startOver();
  }
  }

  // filter
  // the filtering, it turns out, is quite involved
  vs = "";
  fil = false;
  dTest = new Date('6/10/2020');
  nbrFil: number;
  tokyo = '';
  // filter dates
  filDts(s: any) {
    let eN = null; let gN = null; let lN = null; let gE = null; let lE = null;
    var a = document.getElementsByName(this.g[0].props[s].key);
    this.update(s);

    for (let i = 0; i < a.length; i++) {
      let c = <HTMLInputElement>a[i];
      let o = c.id.substring(0, 2);
      if(this.paged){
        this.rollUpFilters(s, o, Number(c.value));
      }
      else 
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
  rollUpDtFil(s: any, operand: string, val: Date){
    this.fK.key = s;
    this.fK.dt = val;
    this.fK.operand = operand;
    this.page.filters.push(this.fK);
  }
  // filter numbers

  filNbrs(s: any) {
    let eN = null; let gN = null; let lN = null; let gE = null; let lE = null;
  
    var a = document.getElementsByName(this.g[0].props[s].key);
  
    this.update(s);
    // what if there's a back space?
    for (let i = 0; i < a.length; i++) {
      let c = <HTMLInputElement>a[i];
  
      let o = c.id.substring(0, 2);
      if (this.paged && c.value != '' && !isNaN(Number(c.value))) {
        this.rollUpFilters(s, o, Number(c.value));
      }
      else {
        if (c.id == 'eq' + this.g[0].props[s].key && c.value) {
          eN = Number(c.value);
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
    }
    //}
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
  // filter paged data
  rollUpFilters(s: any, operand: string, val: number) {

    this.fK.key = s;
    this.fK.nbr = val;
    this.fK.operand = operand;
    let kV = { "key": parseInt(s), "operand": operand, "nbr": val };
    this.page.filters.push(kV);
   
    // alert(" hey  " + this.page.filters[0].operand);
    // ToDo: rmv
    switch (operand) {
      case ("gt"):
        
        break;
      case ("lt"):

        break;
      case ("ge"):

        break;
      case ("le"):

        break;
    }
    // push fArr
  }
  update(s: any){
    for(let i = 0; i < this.page.filters.length; i++){
      if(this.page.filters[i].key == s){
        this.page.filters.splice(i, 1);
      }
    }
  }
  fOn = false;
  fK: keyValue;
  submitFilters() {
    this.tokyo = '';
    // strings
    var s = document.getElementsByName(this.fNm);

  //  this.page.filters.length = 0;
    this.tokyo = '';
    for (let i = 0; i < s.length; i++) {
      let sf = <HTMLInputElement>s[i];

      if (sf != undefined && sf.value != '') {
        try {
          let kV = { "key": parseInt(sf.id), "val": sf.value };
          this.page.filters.push(kV);
        }
        catch
        {
        
        }
      }
     
    }

  
// debug
this.tokyo += this.tokyo.length;
for(let m = 0; m < this.page.filters.length; m++){
  this.tokyo += this.page.filters[m].key + "  " + this.page.filters[m].val + "  *  " + this.page.filters[m].nbr;
}

      this.page.cursor = 0;
      this.page.refresh = true;
      this.pageChg.emit(this.page);
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
  v = '';
  // main filter, strings
  onKey(value: string, s: any, e: any) {
if(!this.paged){
    if (e.target.value.length == 0) {
      this.g = this.gConst;
    }
    else {
      if (this.g[0].props[s].type.indexOf("string") > -1) {
        let c = value.toLowerCase();
        this.g = this.g.filter(p => p.props[s].value.toLowerCase().indexOf(c) > -1);
      }
      else if (this.g[0].props[s].type.indexOf("number") > -1) {
        this.g = this.g.filter(p => p.props[s].value == value);
      }
    }
    this.startOver();
  }
  }
  public startOver() {
    this.curPage = 1;
    this.arrPageNbrs();
    this.lastDisplayed = this.pageNumbers.slice(-1)[0];
    this.page.page = 1;
    this.page.cursor = 0;
    //  this.pageChg.emit(this.page);
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


  downloadCSV() {
    var csvData = this.cSV();
    var blob = new Blob(csvData, { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
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

interface args {
  page?: number,
  cursor?: number,
  start?: number,
  end?: number,
  total?: number,
  sort?: keyValue[],

  asc?: number,
  filters?: keyValue[],
  refresh?: boolean,
  reset?: boolean

}
interface keyValue {
  key: number,
  operand?: string,
  val?: string,
  nbr?: number,
  dt?: Date
}
interface keyNbrRange {
  key: number,
  from: number,
  to: number
}
interface keydtRange {
  key: number,
  from: string,
  to: string
}
