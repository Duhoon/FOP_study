const _ = {};

/************************************/
/*               Map                */
/************************************/

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
function getLength(list){
    return list == null ? void 0 : list.length;
}
const isArrayLike = function(list){
    let length = getLength(list);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

_.map = function(data, iteratee){
    const new_list = [];
    if( isArrayLike(data) ){
        for(let i = 0, len = data.length; i < len ; i++){
            new_list.push(iteratee(data[i], i, data));
        }
    } else {
        for (var key in data){
            if(data.hasOwnProperty(key)) new_list.push(iteratee(data[key], key, data));
        }
    }
    return new_list;
}

console.log( _.map([1,2,3], v=> v * 2) );

/************************************/
/*             Identity             */
/************************************/

_.identity = function(v){
    return v;
}
_.idtt = _.identity;

/************************************/
/*              Values              */
/************************************/

_.values = function(data){
    return _.map(data, _.idtt);
}

console.log( _.values({a: 3, b: 5, c: 4}) );

/************************************/
/*               Args1              */
/************************************/

_.args1 = function(a, b){
    return b;
}

_.args0 = _.identity;

_.keys = function(data){
    return _.map(data, _.args1);
}

console.log( _.keys({ id: 1, name: "ID", age: 27 }) );


/************************************/
/*               Each               */
/************************************/

_.each = function(data, iteratee){
    if( isArrayLike(data) ){
        for ( let i = 0 , len = data.length ; i < len ; i++ ){
            iteratee(data[i], i, data);
        }
    } else{
        for ( let key in data){
            if( data.hasOwnProperty(key) ) iteratee(data[key], key, data);
        }
    }
    return data;
}

/************************************/
/*              Bloop               */
/************************************/

_.bloop = function(new_data, body){
    return function(data, iteratee){
        let result = new_data(data);
        if( isArrayLike(data) ){
            for(let i = 0 , len = data.length; i < len ; i++){
                body( iteratee(data[i], i, data), result );
            }
        } else {
            for(let key in data){
                if( data.hasOwnProperty(key) ) 
                    body( iteratee(data[key], key, data), result );
            }
        }
        return result;
    }
}

// modified _.map
_.map = _.bloop(function(){
    return [];
}, function(val, obj){
    obj.push(val);
});

// modified _.each
_.each = _.bloop( function(v){
    return v;
}, function(){})

console.log(_.map([2,4,6], v => v ** 2));
_.each([5,7,10], console.log);

// Naming anonoymous function
_.array = function(){return [];}
_.push_to = function(val, obj){
    obj.push(val);
    return val;
}
_.noop = function(){};

// modified _.map
_.map = _.bloop(_.array, _.push_to);
_.each = _.bloop(_.identity, _.noop );


/************************************/
/*               Keys               */
/************************************/

_.isObject = function(obj){
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

_.keys = function(obj){
    return _.isObject(obj) ? Object.keys(obj) : [];
}

console.log(_.keys( {id: 1, name: "ID", age: 27} ));
console.log(_.keys(null));
console.log(_.keys([1, 2, 3]));

/************************************/
/*          Better bloop            */
/************************************/

function bloop(new_data, body){
    return function(data, iteratee){
        const result = new_data(data);
        if( isArrayLike(data) ){
            for(let i = 0, len = data.length; i < len ; i++){
                body( iteratee(data[i], i , data) );
            }
        } else {
            for(let i = 0, keys = _.keys(data), len = keys.length; i < len; i++){
                body( iteratee(data[keys[i]], keys[i], data), result );
            }
        }
        return result;
    }
}

_.map = bloop(_.array, _.push_to);
_.each = bloop(_.identity, _.noop);

/************************************/
/*              Filter              */
/************************************/

_.filter = function(data, predicate){
    const result = [];
    _.each(data, function(val, idx, data){
        if( predicate(val, idx, data) ) result.push(val);
    });
    return result;
}

console.log( "# Filter" );
console.log( _.filter([1,2,3,4,], v=> v > 1) );
console.log( _.filter({a:1, b:2, c:3, d:4}, v => v > 1) );

/************************************/
/*       Filter with new Bloop      */
/************************************/

function bloop(new_data, body){
    return function(data, iter_predi){
        const result = new_data();
        if( isArrayLike(data) ){
            for( let i = 0, len = data.length; i < len; i++ ){
                body ( iter_predi(data[i], i, data), result, data[i] );
            }
        } else{
            for (let i = 0, keys=_.keys(data), len = keys.length; i < len ; i++ ){
                body( iter_predi(data[keys[i]], keys[i], data), result, data[keys[i]] );
            }
        }
        return result;
    }
}

_.filter = bloop(_.array, 
    function(bool, result, val){
        if(bool) result.push(val);
});

console.log("\n # Improved Filter")
console.log( _.filter([1,2,3,4,], v=> v > 1) );
console.log( _.filter({a:1, b:2, c:3, d:4}, v => v > 1) );

/************************************/
/*               Rest               */
/************************************/

_.toArray = function(list){
    return Array.isArray(list) ? list : _.values(list);
}

_.rest = function(list, num){
    return _.toArray(list).slice(num || 1);
};

console.log("\n # Rest");
console.log( _.rest([1, 2, 3, 4], 2) );

_.reverse = function(list){
    return _.toArray(list).reverse();
};

console.log( _.reverse([1, 2, 3, 4]) );
console.log( _.reverse({0: 2000, 1:3000, 2: 10000}) )

/************************************/
/*              Rester              */
/************************************/

// _.rester = function(func){
//     return function(list, num){
//         return _.map( _.rest(list,num), func);
//     }
// }

_.rester = function(func, num){
    return function(){
        return func.apply(null, _.rest(arguments, num));
    };
}

function sum(a, b, c, d){
    return ( (a || 0) + (b || 0) + (c || 0) + (d || 0) );
}

console.log("\n # Rester");
console.log( _.rester(sum, 2)(1, 2, 3, 4) );

/************************************/
/*                If                */
/************************************/
_.if = function(validator, func, alter){
    return function(){
        return validator.apply(null, arguments) ? 
        func.apply(null, arguments) :
        alter && alter.apply(null, arguments);
    }
};

function sub(a, b){
    return a - b;
}

var sub2 = _.if(
    function(a, b){
        return a > b;
    },
    sub,
    function(){
        return new Error( "a가 b보다 작습니다" );
    }
)

var diff = _.if(
    function(a, b){
        return a > b;
    },
    sub,
    function(a, b){return sub(b,a)}
);

console.log( "\n # If" )
console.log( sub2(10,5) );
console.log( sub2(5,10) );

console.log( diff(5, 10));

_.toArray2 = _.if(Array.isArray, _.idtt, _.values);

_.constant = function(v){
    return function(){
        return v;
    }
}

var square = _.if(
    function(a){ return toString.call(a) === "[object Number]"; },
    function(a){ return a * a; },
    function(){return 0}
)

console.log( square(5) );
console.log( square({}) );

_.isNumber = function(a){
    return toString.call(a) === "[object Number]";
}

var square = _.if(_.isNumber, v => v * v, ()=>0);
console.log( square(5) );


/*************************************/
/* Filter without Anonymous Function */
/*************************************/

_.push = function(obj, val){
    obj.push(val);
    return obj;
}
_.filter = bloop(_.array, _.if(_.idtt, _.rester(_.push)));

console.log("# filter");
console.log(
    _.filter([1,2,3,4], function(val){
        return val > 2;
    })
)

function bloop(new_data, body){
    return function(data, iter_predi){
        let result = new_data(data);
        if( isArrayLike(data) ){
            for(let i = 0, len = data.length; i < len ; i++){
                body( iter_predi(data[i], i, data), result, data[i]);
            }
        } else {
            for(let i = 0, keys = _.keys(data), len = keys.length ; len < i ; i++){
                body( iter_predi(data[keys[i]], keys[i], data), result, data[keys[i]] );
            }
        }
        return result;
    }
}

/************************************/
/*              Reject              */
/************************************/

_.reject = bloop(_.array, _.if( _.idtt, _.noop, _.rester(_.push) ))

console.log("# Reject")
console.log(
    _.reject([1,2,3,4], function(val){
        return val > 2;
    })
)