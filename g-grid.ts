import { Component, Input, OnInit } from '@angular/core';
import { KeyValuePair } from '../utilities/keyValuePair';
import { MessageService } from '../utilities/message.service';
import { DataFormatPipe } from '../utilities/data-format-pipe';
import { ColumnStyle } from '../utilities/columnStyle';
import { StrDictionary } from '../utilities/dictionary';
// import { DATE } from 'ngx-bootstrap/chronos/units/constants';
import { OrderPipe } from 'node_modules/ngx-order-pipe';
import { NgClass } from '@angular/common';
import { TableHeading } from  '../utilities/table-heading.type';
//import { OrderModule } from '../node_modules/ngx';
import { Pipe, PipeTransform } from '@angular/core';
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
        birthday = new Date();
        carolyn = "date";
        tdNbr = "tdNbrStyle";
        tdNV = "tdNV";
        tdDate = "tdDateStyle";
        colStyles = new ColumnStyle();

        public filterQuery = "";
        public rowsOnPage = 10;
        public sortBy = "idx";
        public sortOrder = " ";
  //------------------------
    selectedHero: KeyValuePair;
    heroes: KeyValuePair[];
    contacts: GridItem[];
    //contacts: Object[];
    testArr: any;
    // gridItems: Object[];
    //gridItems:any[] = new Array();
    gridItems: Object[];
    g: AnyType[] = new Array();
    gConst: AnyType[];
    ddlId: string;

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
          this.start = false;
      }

     // let id = this.activatedRoute.snapshot.params['id'] as string;
    
     this.getHeroes();
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
                var headingsMapN = new Object;
                 _.map(this.gridItems, function (e, i) {
                    return _.extend(e, { idx: i + 1 });
                }); 

                // data => displayed items
                var keysMapN = new Object;
                var tblHdr = [{ tableHeadingKey: "A", tableHeadingVal: "B" }];


                // rows and columns (objects and their properties) 
                // map to AnyType
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
                       // p.key = 'col' + j.toString();
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
                    // alert(Object.keys(this.gridItems[0])[i]);

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
                       // replace************************************************
                       // rmv
                       this.gridItems = replaceKeysDeep(this.gridItems, keysMapN);
                       for(let i = 0; i < this.gridItems.length; i++){
                        let a = this.gridItems[i].toString();
                        let b = a.split(",");

                       }
                      
                       // _.forOwn(this.gridItems, function(value, key) { alert(key + ' * ' + value); } );

                       // sort***************************************************
                       // rmv
                       this.gridItems = _.orderBy(this.gridItems, (item: any) => item['idx'], 'asc');
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
                               // var dateB = new Date(b.date);
                               // alert(_.map(this.gridItems, Object.keys(this.gridItems[0])[i]));
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
                this.columnStyles();
        
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

       filtersT(f: any) {  // filter button (button group)
        // alert('filter');
        let n = this.g[f].name;
        const johnArr = this.g.filter(person => person.name === 'john');

    }
    clearFilters() {
        this.g = this.gConst;
        this.sorted = false;
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
    sortByColumnDesc(x: any) {
        _.map(this.gridItems, function (e, i) {
            return _.extend(e, { idx: i + 1 });
        });

        var c = _.filter(this.tableHeadings, ['tableHeadingVal', x]);

        if (this.key === c[0].tableHeadingKey) {
            this.named = "Biff";
            alert('asc');
            this.key = c[0].tableHeadingKey;
            this.reverse = !this.reverse;
            if (this.reverse) {
                this.direction = false
            }
            else {
                this.direction = true;
            }
        }
        else {
            //alert('new sort');
            this.direction = false;
            this.reverse = true;
            this.named = "Happ";
            this.key = c[0].tableHeadingKey;

        }
        //_.reverse(this.gridItems);
        this.key = c[0].tableHeadingKey;
    }
ascDsc = 9;
sorted = false;
clrA = '#B0BEC5';
clrD = '#B0BEC5';
    sortByColumn(x: any, d: number, event: any) {
        var c = _.filter(this.tableHeadings, ['idx', x]);

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

            let y = (x.options.selectedIndex + 1) * 10;

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
            //FILTERING
        filterBy(key:string) {
        alert('here');
        }
        vs = "";
        onKey(value: string, s: any) {
            // always reset ??
            
            this.gridItems = this.gridItemsConst;
            this.g = this.gConst;
            var fArr = this.g;

            if (this.g[0].props[s].type.indexOf("string") > -1) {
                let q = value.toString();
                fArr = this.g.filter(p => p.props[s].value.toUpperCase().indexOf(value.toUpperCase()) > -1);
            }
            else {
                fArr = this.g.filter(p => p.props[s].value == value);
            }
            this.g = fArr;
    
//alert(johnArr.length);


            this.dataType = this.detectType(this.g[0][s]);

            
            
          //  alert(this.dateFilters(this.gridItems[0][s], s));
    
           // alert(this.dataType + 'ee');
            if (value.indexOf('/') > -1 && this.dateFilters(value, s)) {
                alert(this.dateFilters(value, s));
                // DATES
                let date = new Date(value);
                this.gridItems = _.filter(this.gridItems, function (item) {
                    return new Date(item[s]) < date;
                });
            }
            // NUMBER
            else if (this.dataType.startsWith('n')) {
                alert(this.dataType + 'ss');
                this.gridItems = _.filter(this.gridItems, function (item) {
                    return item[s] == value;
                });
            }
            else if (this.dataType == 'str') {
                // STRING
                this.gridItems = _.filter(this.gridItems, function (item) {
                    return item[s].toLowerCase().indexOf(value.toLowerCase()) == 0;
                });
            }
            
        }
  
    

 // HERO
    onSelect(hero: KeyValuePair): void {
      this.selectedHero = hero;
      this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
    }
    getHeroes(): void {
      this.dataService.getHeroes()
          .subscribe(heroes => this.heroes = heroes);
         // alert( Object.keys(this.heroes[0]));
    }
    getCustomers(): void {
      this.dataService.getCustomers()
          .subscribe(contacts => this.contacts = contacts);
        // alert(Object.keys(this.contacts[0]));
    }
    //  keeper
    addToDictionary(k: string, v: string) {
      var ds = new StrDictionary();
      ds.key = k;
      ds.value = v;
      this.dataTypes.push(ds);
  }
   // populate column styles rmv?
   columnStyles() {
        
    this.colStyles.Col0 = this.dataTypes[1].value;
    this.colStyles.Col1 = this.dataTypes[2].value;
    this.colStyles.Col2 = this.dataTypes[3].value;
    this.colStyles.Col3 = this.dataTypes[4].value;
    this.colStyles.Col4 = this.dataTypes[5].value;
    this.colStyles.Col5 = this.dataTypes[6].value;
    this.colStyles.Col6 = this.dataTypes[7].value;
    this.colStyles.Col7 = this.dataTypes[8].value;
    this.colStyles.Col8 = this.dataTypes[9].value;
    this.colStyles.Col9 = this.dataTypes[10].value;
    this.colStyles.Col10 = this.dataTypes[11].value;
    this.colStyles.Col11 = this.dataTypes[12].value;
    this.colStyles.Col12 = this.dataTypes[13].value;
}

dateFilters(value: string, s: any) {

let newDate = new Date(value);

if (Object.prototype.toString.call(newDate) === "[object Date]") {
    // it is a date
    if (isNaN(newDate.getTime())) {  // d.valueOf() could also work
        //alert('this is not a date');
        return false;
    }
    else {
        //alert('this is a date');
        return true;
    }
}
else {
    alert('this is not a date');
    //return 'this is NOT a valid date';
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
function replaceKeysDeep(obj, keysMap) { // keysMap = { oldKey1: newKey1, oldKey2: newKey2, etc...
   let biff =  _.transform(obj, function (result, value, key) { // transform to a new object
    var currentKey = keysMap[key] || key; // if the key is in keysMap use the replacement, if not use the original key
    result[currentKey] = _.isObject(value) ? replaceKeysDeep(value, keysMap) : value; // if the key is an object run it through the inner function - replaceKeys
 }); 
let dataArr: Object[];
dataArr = _.values(biff);
return _.values(biff);
}
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

