import { Component, Input, OnInit } from '@angular/core';
import { KeyValuePair } from '../utilities/keyValuePair';
import { MessageService } from '../utilities/message.service';
import { DataFormatPipe } from '../utilities/data-format-pipe';
import { ColumnStyle } from '../utilities/columnStyle';
import { StrDictionary } from '../utilities/dictionary';

import { NgClass } from '@angular/common';
import { TableHeading } from  '../utilities/table-heading.type';
import { AnyType } from '../utilities/AnyType';
import { ActivatedRoute } from '@angular/router';
import { GridItem } from '../utilities/grid-item';
import { DataService } from '../utilities/data.service'; // data service
import * as _ from 'lodash';
import { values } from 'lodash';
import { prop } from '../utilities/prop';
import { Style } from '../utilities/Style';

@Component({
  selector: 'example',
  templateUrl: './wip2.component.html'
})
export class Wip2Component implements OnInit {
 // constructor(private accountService: AccountService,
 //  private activatedRoute: ActivatedRoute, private orderPipe: OrderPipe) {
 // routing?
  constructor(private dataService: DataService, private messageService: MessageService) { 

  }
  @Input() item: GridItem;
  @Input() hdr: string[];
  @Input() columns: string[];
 
  color: string;
  style: Style;
  start: boolean = true;
  aId: string;
  dId: string;
  th: TableHeading;
  tableHeadings: TableHeading[];
  dataTypes: StrDictionary[];
  headings: string[];  // rmv

  newKeys: string[];

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

  contactModel: GridItem;


  properties: string[];

  gridType: AnyType;

    // filtering
    dataType: string;
    filterButtonCaption: string;

    //colTypes: Dictionary<string>;  // lodash
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

    //sorting
        orderby: string;
        last: string;
        key: string = ' ';
        keyDefault: string = 'idx';
        reverse: boolean = false;
        direction: boolean;
        
        sort(key) {
            this.reverse = !this.reverse;
        }
        unsorted: "hoverSort";

      // Column Styling
        tdNbr = "tdNbrStyle";
        tdNV = "tdNV";
        tdDate = "tdDateStyle";
        colStyles = new ColumnStyle();

        public rowsOnPage = 10;
        public sortBy = "idx";
        public sortOrder = " ";

    selectedHero: KeyValuePair;
    heroes: KeyValuePair[];
    contacts: GridItem[];

    testArr: any;

    gridItems: Object[];
    g: AnyType[] = new Array();
    gConst: AnyType[];
    ddlId: string;
    filIds = ''; 
    ngOnInit() {
   
      if(this.start){
          if(this.style == undefined){
              this.style = new Style();
          }
          else { this.style = new Style();}
          if(this.color != undefined){
              this.style.primary = this.color;
          }
          else{ this.color = this.style.primary}
          this.aId = makeid();
          this.dId = makeid();
          this.ddlId = makeid();
          this.filIds = makeid();
          this.start = false;
      }

     // let id = this.activatedRoute.snapshot.params['id'] as string;
     this.getCustomers();

     // Grid Items
        this.dataService.getCustomers()
            .subscribe(data => {
                this.gridItems = data;
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

                var k =  Object.keys(this.gridItems[0]);
                let vg:AnyType[] = new Array();
                let re = /\-/gi;

                for (i = 0; i < this.gridItems.length; i++) {
                    let itm:AnyType = new AnyType();
                     itm.iid = i; itm.name = k[i]; 
                    var v = Object.values(this.gridItems[i])
                    let aP: prop[] = new Array();
                 
                   for (j = 0; j < Object.values(this.gridItems[i]).length; j++) {
                        let p:prop = new prop();
                        p.key = k[j];
                        p.value = v[j];
                        p.type = typeof(v[j]);

                        if(Object.prototype.toString.call(v[j]) === '[object Date]'){
                            p.type = "date";
                            p.style = this.tdDate;
                            p.value = p.value.toLocaleString();
                        }
                        else if(Number(p.value) || Number(p.value.replace(re, ""))){
                            if(p.key == "idx"){
                                p.style = this.tdNV;
                            }
                            else{
                                p.style = this.tdNbr;
                            }
                        }
                        else{
                            p.type = typeof(v[j]);
                            p.style = "tdStrStyle";
                        } 
                        
                      aP.push(p);
                    } 
                  itm.props = aP;
                  vg.push(itm);
                }

                this.g = vg;
                this.gConst = vg;

                if(this.columns == undefined){  this.hdr = Object.keys(this.gridItems[0]) }
                else { this.hdr = this.columns; }
              
                // old
                // create column names, okay
                for (i = 0; i < Object.keys(this.gridItems[0]).length; i++) {
                    let col = "Col" + i.toString();

                    if (i === Object.keys(this.gridItems[0]).length - 1) {
                        col = "idx";
                    }
                    var tN = new TableHeading;
                    tN.idx = i;
                    tN.tableHeadingKey = col;

                    if (Object.keys(this.gridItems[0])[i] != "idx") {
                        if (this.hdr != undefined) { 
                            tN.tableHeadingVal = this.hdr[i]; 
                        }
                        else { tN.tableHeadingVal = Object.keys(this.gridItems[0])[i]; }
                        tblHdr.push(tN);
                        keysMapN[Object.keys(this.gridItems[0])[i]] = col;
                    }
                }
                // to initialize the object, we had to create a first item
                // otherwise this array would have been undefined.
                // here we rmv it
             this.tableHeadings = tblHdr.filter(obj => obj.tableHeadingKey !== "A");

             this.arrPageNbrs();


                       // sort***************************************************
                       // rmv
                       //this.gridItems = _.orderBy(this.gridItems, (item: any) => item['idx'], 'asc');
                       // *******************************************************
       
                       //save this for reset*************************************
                       // replace with line 238
                       this.gridItemsConst = this.gridItems;
                       this.gridItemsConst = this.g;
       
                       // *******************************************************
                // DATES and other data types, identify the columns that are dates, etc.
                // for special handling
                // OK  how do you want to handle this...
                this.dataTypes = [{ key: "idx", value: "nbr" }];
                //this.gridItems.forEach(task => task.isPrototypeOf = task.Col10.format("YYYY-MM-DD"));
                // return tasks;
              
                // column styles?
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
            });
 
    }
    
    // PAGINATION *******************************************
         public arrPageNbrs() {
          //this.totalNumberPages = Math.ceil(this.gridItems.length / this.nbrItems);
        //  alert(this.nbrItems)
          this.totalNumberPages = Math.ceil(this.g.length / this.nbrItems);
        //  alert(this.g.length);
          this.pageNumbers = [1];
         // this.numberToDisplay = this.nbrItems;
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

       filtersT(f: any) { 
        let n = this.g[f].name;
        const johnArr = this.g.filter(person => person.name === 'john');
    }
    clearFilters() {
        var f = document.getElementsByName(this.filIds);
        for (var i=0, item; item = f[i]; i++) {
            let e = <HTMLInputElement>f[i];
            e.value = "";
        }
        this.g = this.gConst;
        this.sorted = false;
        this.filters = "noFilters";
    }
    sortVis = "none";
    showSort(){
        if(this.sortVis.indexOf("none") > -1){
            this.sortVis = "inline";
        }
        else{
            this.sortVis = "none";
        }
        
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
    
    public startOver() { // <<
        this.curPage = 1;
        this.arrPageNbrs();
        this.lastDisplayed = this.pageNumbers.slice(-1)[0];
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
        if( n < 1 ){ n = 1; }
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
    // sort*************************************************
    public sortByWordLength = (a: any) => {
        return a.country.length;
    }
    sortAccounts(prop: string) {
        return this.gridItems.sort(name);
       // const sorted = this.testArr.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
        // asc/desc
       // if (prop.charAt(0) === '-') { sorted.reverse(); }
       // return sorted;
    }
ascDsc = 9;
sorted = false;
clrA = '#B0BEC5';
clrD = '#B0BEC5';
    sortByColumn(x: any, d: number, event: any) {
        let ele = <HTMLSpanElement>event.target;

        let ml = <HTMLSpanElement>document.getElementById(x);
        var rl = document.getElementsByClassName('Sam');
        for (let i = 0; i < rl.length; i++) {
            let rm = <HTMLSpanElement>rl[i];
            rm.style.color = "#B0BEC5";
        }

        ele.style.color = this.color;
        if (d == 0) {
            this.g.sort((a, b) => (a.props[x].value > b.props[x].value) ? 1 : ((b.props[x].value > a.props[x].value) ? -1 : 0));
        }
        else if (d == 1) {
            this.g.sort((a, b) => (a.props[x].value < b.props[x].value) ? 1 : ((b.props[x].value < a.props[x].value) ? -1 : 0));
        }
    }
    reset() {
        this.g = this.gConst;
        this.sortVis = "none";
        this.g.sort((a, b) => (a.iid > b.iid) ? 1 : ((b.iid > a.iid) ? -1 : 0));
    }
        // ITEMS PER PAGE ****************************************
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

/*         filterBy(key:string) {
        alert('here');
        } */
        vs = "";
        fil = false;
        onKey(value: string, s: any) {
            this.gridItems = this.gridItemsConst;
            this.g = this.gConst;
            var fArr = this.g;

            if (this.g[0].props[s].type.indexOf("string") > -1) {
                let q = value.toString();
                 this.g = this.g.filter(p => p.props[s].value.toString().toUpperCase().indexOf(value.toUpperCase()) >= 0);
            }
            else {
                this.g = this.g.filter(p => p.props[s].value == value);
            }
        
            this.dataType = this.detectType(this.g[0][s]);

        //    if (value.indexOf('/') > -1 && this.dateFilters(value, s)) {
        /*         alert(this.dateFilters(value, s));
             
                let date = new Date(value);
                this.gridItems = _.filter(this.gridItems, function (item) {
                    return new Date(item[s]) < date;
                }); */
        //    }
            // NUMBER
        //    else if (this.dataType.startsWith('n')) {
        /*          this.gridItems = _.filter(this.gridItems, function (item) {
                    return item[s] == value;
                }); */ 
        //    }
        //    else if (this.dataType == 'str') {

       /*          this.gridItems = _.filter(this.gridItems, function (item) {
                    return item[s].toLowerCase().indexOf(value.toLowerCase()) == 0;
                }); */
        //    }
            
        }
  
    getCustomers(): void {
      this.dataService.getCustomers()
          .subscribe(contacts => this.contacts = contacts);
    }
    //  keeper
    addToDictionary(k: string, v: string) {
      var ds = new StrDictionary();
      ds.key = k;
      ds.value = v;
      this.dataTypes.push(ds);
  }

dateFilters(value: string, s: any) {

let newDate = new Date(value);

if (Object.prototype.toString.call(newDate) === "[object Date]") {
    // it is a date
    if (isNaN(newDate.getTime())) {  
        return false;
    }
    else {
        return true;
    }
}
else {
    alert('this is not a date');
    return false;
}
}

resetAll() {
    this.key = 'idx';
}


    private log(message: string) {
      this.messageService.add(`HeroService: ${message}`);
    }
  
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

