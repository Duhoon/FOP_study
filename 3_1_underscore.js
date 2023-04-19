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

/************************************/
/*          Modifying Bloop         */
/************************************/

function bloop(new_data, body, stopper){
    return function(data, iter_predi){
        const result = new_data(data);
        let memo;
        if( isArrayLike(data) ){
            for( let i = 0, len = data.length; i < len; i++){
                memo = iter_predi(data[i], i, data);
                if(!stopper) body( memo, result, data[i], i );
                else if (stopper(memo)) return body( memo, result, data[i], i);
            }
        } else {
            for( let i = 0, keys = _.keys(data), len = keys.length; i < len; i++ ){
                memo = iter_predi(data[keys[i]], keys[i], data);
                if(!stopper) body(memo, result, data[keys[i]], keys[i]);
                else if (stopper(memo)) return body( memo, result, data[keys[i]], keys[i] )
            }
        }
        return result;
    }
}

_.each = bloop( _.identity, _.noop );
_.map = bloop( _.array, _.push_to );
_.filter = bloop( _.array, _.if(_.identity, _.rester(_.push)) );
_.reject = bloop( _.array, _.if(_.identity, _.noop, _.rester(_.push)) );

/************************************/
/*               Find               */
/************************************/

_.find = bloop( _.noop, function(bool, result, val){ return val;}, _.identity );

console.log("\n# Find");
console.log( _.find([1, 10, 100, 1000], v => v > 50) );

_.findIndex = bloop(_.constant(-1), _.rester(_.identity, 3), _.identity);
_.findKey = bloop(_.noop, _.rester(_.idtt, 3), _.identity);

console.log("\n# Find Index");
console.log( _.findIndex([1,10,100, 1000], v => v > 20) );

console.log( _.findKey( {a: 1, c: 10, b: 100, d: 1000}, v => v > 20 ));

/************************************/
/*            Some, Every           */
/************************************/

_.not = function(v){
    return !v;
}

function bloop(new_data, body, stopper){
    return function(data, iter_predi){
        iter_predi = iter_predi || _.identity;
        const result = new_data(data);
        let memo;
        if( isArrayLike(data) ){
            for(let i = 0, len = data.length; i < len; i++){
                memo = iter_predi(data[i], i, data);
                if( !stopper ) body( memo, result, data[i], i);
                else if( stopper(memo) ) return body( memo, result, data[i], i)
            }
        } else {
            for(let i = 0, keys = _.keys(data), len = keys.length; i < len ; i++){
                memo = iter_predi(data[keys[i]], keys[i], data);
                if( !stopper ) body( memo, result, data[keys[i]], keys[i] )
                else if( stopper(memo) ) return body( memo, result, data[keys[i]], keys[i] );
            }
        }
        return result;
    }
}

_.some = bloop(_.constant(false), _.constant(true), _.identity);
_.every = bloop(_.constant(true), _.constant(false), _.not);

console.log("\n # Some")
console.log( _.some([false, true, 0, NaN]) );
console.log( _.some([false, undefined, 0]) );

console.log("\n # Every")
console.log( _.every([false, true, 0, NaN]) );
console.log( _.every([1, 2, 3, 4]) );

/************************************/
/*              Reduce              */
/************************************/

function bloop(new_data, body, stopper, is_reduce){
    return function(data, iter_predi, opt1){
        iter_predi = iter_predi || _.identity;
        const result = new_data(data);
        let memo = is_reduce ? opt1 : undefined;

        if( isArrayLike(data) ){
            for(let i = 0, len = data.length; i < len ; i++){
                memo = is_reduce ? 
                    iter_predi(memo, data[i], i, data ) :
                    iter_predi(data[i], i ,data);
                if( !stopper ) body(memo, result, data[i], i);
                else if( stopper(memo) ) return body(memo, result, data[i], i);
            }
        } else {
            for(let i = 0, keys = _.keys(data), len = keys.length; i < len ; i++){
                memo = is_reduce ?
                    iter_predi(memo, data[keys[i]], keys[i], data) :
                    iter_predi(data[keys[i]], keys[i], data);
                if(!stopper) body(memo, result, data[keys[i]], keys[i]);
                else if(stopper(memo)) body(memo, result, data[keys[i]], keys[i]);
            }
        }
        return is_reduce? memo : result;
    }
}

_.reduce = bloop(_.noop, _.noop, undefined, true);

console.log("\n # Reduce");
console.log( _.reduce([1, 2, 3], (m,v) => m+v, 0) );

/************************************/
/*         Refactoring Bloop        */
/************************************/

function bloop(new_data, body, stopper, is_reduce){
    return function(data, iter_predi, opt1){
        iter_predi = iter_predi || _.identity;
        const result = new_data(data);
        let memo = is_reduce ? opt1 : undefined;
        let keys = isArrayLike(data) ? null : _.keys(data);
        for(let i = 0, len = (keys || data).length; i < len; i++ ){
            let key = keys? keys[i] : i;
            memo = is_reduce ? 
                iter_predi(memo, data[key], key, data):
                iter_predi(data[key], key, data);
            if(!stopper) body(memo, result, data[key], key);
            else if(stopper(memo)) return body(memo, result, data[key], key);
        }
        return is_reduce ? memo : result;
    }
}

function bloop(new_data, body, stopper , is_reduce){
    return function(data, iter_predi, opt1){
        iter_predi = iter_predi || _.identity;
        const result = new_data(data);
        let memo = is_reduce ? opt1 : undefined;
        var limiter = is_reduce ? undefined : opt1;
        var keys = isArrayLike(data) ? null : _.keys(data);
        
        if(is_reduce){
            for( var i = 0, len = (keys || data).length ; i < len ; i++ ){
                let key = keys ? keys[i] : i ;
                memo = iter_predi(data[key], key, data);
            }
            return memo;
        }
        if(stopper){
            for (var i = 0, len = (keys || data).length ; i < len ; i++){
                let key = keys ? keys[i] : i ;
                let memo = iter_predi(data[key], key, data);
                if(stopper(memo)) return body(memo, result, data[key], key);
            }
        } else if(limiter){
            for( var i = 0, len = (keys || data).length ; i < len ; i++ ){
                let key = keys ? keys[i] : i ;
                body(iter_predi(data[key], key, data), result, data[key]);
                if( limiter == result.length ) break;
            }
        } else {
            for( var i = 0, len = (keys || data).length ; i < len ; i++){
                let key = keys ? keys[i] : i ;
                body(iter_predi(data[key], key, data), result, data[key]);
            }
        }
        return result;
    }
}