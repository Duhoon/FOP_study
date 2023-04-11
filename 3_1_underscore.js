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
        if( _.isArrayLike(data) ){
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
