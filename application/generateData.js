/**
 * Created by francis on 17-6-3.
 */
var fs = require('fs');
var futilities = require('./mylib/fxutilities.js');

var data_file = 'web/data.json';
var numbers = process.argv[2]?process.argv[2]:100;

var food_types = [
    {name:'two-compartment',min:40,max:120,img:'images/Caddynew.png'},
    {name:'two-compartment',min:20,max:40,img:'images/Caddynew.png'},
    {name:'two-compartment',min:40,max:100,img:'images/Caddynew.png'},
    {name:'two-compartment',min:60,max:150,img:'images/Caddynew.png'},
    {name:'two-compartment',min:45,max:90,img:'images/Caddynew.png'},
    {name:'two-compartment',min:30,max:70,img:'images/Caddynew.png'},
    {name:'two-compartment',min:30,max:45,img:'images/Caddynew.png'},
    {name:'two-compartment',min:15,max:60,img:'images/Caddynew.png'},
    {name:'two-compartment',min:32,max:47,img:'images/Caddynew.png'},
    {name:'two-compartment',min:18,max:48,img:'images/Caddynew.png'},
    {name:'two-compartment',min:15,max:25,img:'images/Caddynew.png'},
    {name:'two-compartment',min:15,max:25,img:'images/Caddynew.png'},
    {name:'two-compartmentW',min:25,max:67,img:'images/Caddynew.png'},
    {name:'two-compartment',min:25,max:40,img:'images/Caddynew.png'},
    {name:'two-compartment',min:40,max:80,img:'images/Caddynew.png'},
    {name:'two-compartment',min:40,max:80,img:'images/Caddynew.png'}
    ];
var food_brands = [{name:'bmw',img:'images/Caddynew.png'},
    {name:'bmw',img:''},
    {name:'bmw',img:''},
    {name:'bmw',img:''},{name:'bmw',img:''},
    {name:'bmw',img:'images/Caddynew.png'},
    {name:'bmw',img:''},
    {name:'bmw',img:'images/Caddynew.png'},{name:'bmw',img:'images/Caddynew.png'},
    {name:'bmw',img:''},{name:'bmw',img:''},
    {name:'bmw',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},
    {name:'bmw',img:'images/Caddynew.png'},
    {name:'bmw',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'永和铂爵',img:''},
    {name:'bmw',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},
    {name:'bmw',img:'images/Caddynew.png'},
    {name:'bmw',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:'images/Caddynew.png'},
    {name:'bmw',img:''},{name:'two-compartment',img:''},
    {name:'BMW',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'惠丰',img:''},
    {name:'bmw',img:''},
    {name:'bmw',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''}
];

var movies=[
    {name:'BMW',min:40, max:80,img:'images/Caddynew.png'},
    {name:'BMW',min:35, max:85,img:'images/Caddynew.png'},
    {name:'bmw',min:35, max:85,img:'images/Caddynew.png'},
    {name:'bmw',min:35, max:85,img:'images/Caddynew.png'},
    {name:'bmw',min:35, max:85,img:'images/Caddynew.png'}];
var cinema=[
    {name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},
    {name:'two-compartment',img:''}, {name:'two-compartment）',img:''},
    {name:'two-compartment',img:''},{name:'two-compartment',img:''},
    {name:'bmw',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},
    {name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},{name:'two-compartment',img:''},
];

var types= [
    {name:'food',products:food_types,brands:food_brands},
    {name:'movie',products:movies,brands:cinema}
];

//116.238406,39.995464       116.508616,39.790415
var minX = 116.238406;
var maxX = 116.508616;
var minY = 39.790415;
var maxY = 39.995464;
var items = [];
for(var i=0; i<numbers; i++){
    var type = futilities.fxtools.randomArrayElement(types);
    var brand = futilities.fxtools.randomArrayElement(type.brands);
    var product = futilities.fxtools.randomArrayElement(type.products);
    var name = `${brand.name} ${product.name}`;
    var price = futilities.math.randomPrecision(product.min, product.max, 1);
    var img = brand.img?brand.img:product.img;
    var x = futilities.math.randomPrecision(minX, maxX, 6);
    var y = futilities.math.randomPrecision(minY, maxY, 6);
    img = img?img:'images/default.jpg';
    var item = {id:i+1,type:type.name,price:price,name:name,coord:{x:x,y:y},img:img};
    items.push(item);
    console.log(item);
    // fs.appendFileSync(data_file, item);
}

// var str = JSON.stringify({items:items});
var str = JSON.stringify(items);
str = `var json_items = ${str}`;
fs.writeFileSync(data_file, str);
