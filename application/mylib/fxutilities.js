/**
 * Created by francis on 17-4-14.
 */

/**
 * functions relate to Date
 * @date Date object
 */
let fDate = {};
fDate.format_date = (date)=>{
    date            = date.toISOString();
    let date_str    = date.substr(0,10);
    return date_str;
};
fDate.format_time = (date)=>{
    date            = date.toISOString();
    let time_str    = date.substr(11,8);
    return time_str;
};
fDate.format_datetime = (date)=>{
    let dateStr = fDate.format_date(date);
    let timeStr = fDate.format_time(date)
    return `${dateStr} ${timeStr}`;
};
exports.date = fDate;

/**
 * functions relate to text
 * @type {{}}
 */
let fText = {};
/**
 * mask mobile number, replace mobile's middle number with asterisk.
 */
fText.asterisk_mobile = (number, headLen=3, tailLen=4)=>{
    //number.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    console.log('headLen: ', headLen);
    let middleLength    = number.length-headLen-tailLen;
    let matchStr    = `(\\d{${headLen}})\\d{${middleLength}}(\\d{${tailLen}})`;
    let matchPattern      = new RegExp(matchStr, "g");
    let middleStr = '';
    let i = 0;
    while(i<middleLength){
        i++;
        middleStr += '*';
    }
    let replaceStr  = `$1${middleStr}$2`;
    let asterisked = number.replace(matchPattern, replaceStr);
    return asterisked;
}

/**
 * Generates an obfuscated version of a string. Text passed through this
 * method is less likely to be read by web crawlers and robots, which can
 * be helpful for spam prevention, but can prevent legitimate robots from
 * reading your content.
 *
 * @param   string  string to obfuscate
 * @return  string
 */
fText.obfuscate = (string)=>{
    let safe = '';
    let chars = string.split('');
    chars.forEach(function(char){
        let case_n = fMath.getRandomInt(1,3);
        switch(case_n){
            case 1:
                safe += '&#' + char.charCodeAt() + ';';
                break;
            case 2:
                let ASCII_num = char.charCodeAt();
                let num = new Number(ASCII_num);
                let hex = num.toString(16);
                safe += '&#x' + hex + ';';
                break;
            case 3:
                safe += char;
                break;
        }
    });
    return safe;
}
exports.text= fText;

/**
 *
 */
let fMath = {}
// get a random Integer
fMath.getRandomInt = (min, max)=>{
    return Math.floor(Math.random() * (max - min + 1) + min);
}
fMath.randomPrecision = (lo, hi, prec)=>{
    // prec= Math.floor(Math.random()*(prec+1));
    // return Number((lo+ Math.random()*(hi-lo+1)).toFixed(prec));
    return (Math.random() * (hi - lo) + lo).toFixed(prec);
}
exports.math = fMath;



let FxTools = {};
FxTools.deepGet = (obj, properties) => {
    // If we have reached an undefined/null property
    // then stop executing and return undefined.
    if (obj === undefined || obj === null) {
        return;
    }
    // If the path array has no more elements, we've reached
    // the intended property and return its value.
    if (properties.length === 0) {
        return obj;
    }
    // Prepare our found property and path array for recursion
    var foundSoFar = obj[properties[0]];
    var remainingProperties = properties.slice(1);

    return FxTools.deepGet(foundSoFar, remainingProperties);
}

/**
 * Return one object from an array objects.
 * @objects array
 */
FxTools.findOneObj = (objects,key,value) => {
    var result = objects.filter(function(element, index, array) {
        return element[key] == value;
    });
    if(result.length>0)
        return result[0];
    else
        return false;
}
/**
 * remove one object for an array of objects.
 */
FxTools.rmObj = (object, objects) => {
    for(var i in objects){
        var obj = objects[i];
        if(obj == object) {
            objects.splice(i, 1);
        }
    }
}
/**
 * remove an element from an array.
 */
FxTools.rmArrayVal = (val, array) => {
    var i = array.indexOf(val);
    if(i != -1) {
        array.splice(i, 1);
    }
}
/**
 * return a random array-element from an array.
 */
FxTools.randomArrayElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle order of gaven array
 * @param array An array
 * @returns shuffled array
 */
FxTools.shuffleArray = (a) => {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

exports.fxtools = FxTools;
