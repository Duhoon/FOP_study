/**************************/
/*          once          */
/**************************/

const _ = {};

_.once = function(func){
    var flag, result;
    return function(){
        if (flag) return result;
        flag = true;
        return result = func.apply(this, arguments);
    }
}

let something = _.once(function(){
    console.log("a");
    return "b"
})

console.log( something() );
console.log( something() );

/**************************/
/*          skip          */
/**************************/

function skip(body){
    let yes;
    return function(){
        return yes || ( yes = body.apply(null, arguments) )
    }
}

/**************************/
/*         Method         */
/**************************/
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;


function getLength(list){
    return list == null ? 0 : list.length;
}

function isArrayLike(list){
    let length = getLength(list);
    return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

_.array = function(){ return []}

_.map = function(data, iteratee){
    const result = [];
    if( isArrayLike(data) ){
        for(let i = 0, len = data.length; i < len; i++){
            result.push(iteratee(data[i], i, data));
        }
    } else{
        for(let key in data){
            if( data.hasOwnProperty(key) ) result.push( iteratee(data[key], key, data) );
        }
    }
    return result;
}

_.idtt = function(val){
    return val;
}

_.values = function(obj){
    return _.map(obj, _.idtt);
}

console.log(_.values([4, 1, 2, 5]));
console.log(_.values({a:4, b:1, c:2, d:5}));

function isObject(obj){
    var type = typeof obj;
    return type == 'function' || type == 'object' || !!obj;
}

_.keys = function(obj){
    return isObject(obj) ? Object.keys(obj) : [];
}

console.log(_.keys([4, 1, 2, 5]));
console.log(_.keys({a:4, b:1, c:2, d:5}));

_.toArray = function(list){
    return Array.isArray(list) ? list : _.values(list);
}

_.rest = function(list, num){
    return _.toArray(list).slice(num || 1);
}

const method = function(method){
    var args = _.rest(arguments);
    return function(obj){
        return obj[method].apply(this, args.concat(_.rest(arguments)));
    }
};