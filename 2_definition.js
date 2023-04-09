const {expect} = require('chai');

describe("Example 2",()=>{
    const _ = {} // Underscore

    _.map = function (list, iteratee){
        const newArray = [];
        for(let i = 0, length = list.length; i < length ; i++){
            newArray.push(iteratee(list[i], i, list));
        }
        return newArray;
    }

    function L(str){
        let splited = str.split("=>");
        return new Function(splited[0], `return ( ${splited[1]} )`);
    }

    function L2(str){
        if(L2[str]) return L2[str];
        let splitted = str.split('=>');
        return L2[str] = new Function(splitted[0], `return ( ${splitted[1]} )`);
    }

    it("Anonymous Function", ()=>{
        console.time('Anonymous Function');
        for(let i = 0; i < 10000 ; i++){
            (function(v){return v;})(i);
        }
        console.timeEnd('Anonymous Function');

        console.time('new Function');
        for(let i = 0; i < 10000 ; i++){
            L('v => v')(i);
        }
        console.timeEnd('new Function');
    })

    it("Anonymous Function with map", ()=>{
        console.time('1');
        var arr = Array(10000);
        _.map(arr, function(v, i){
            return i * 2
        });
        console.timeEnd('1');

        console.time('2');
        var arr = Array(10000);
        _.map(arr, L('v, i => i * 2'));
        console.timeEnd("2");

        console.time('3(Cover with "Eval")');
        var arr = Array(10000);
        _.map(arr, eval(`L('v, i => i * 2')`));
        console.timeEnd('3(Cover with "Eval")');

        console.time('4(One more Anonymous Inner Function)')
        var arr = Array(10000);
        _.map(arr, function(v, i){
            return function(v, i){
                return i * 2
            }(v,i);
        });
        console.timeEnd('4(One more Anonymous Inner Function)')

        console.time('5(One more Anonymous Inner Function with Eval)')
        var arr = Array(10000);
        _.map(arr, function(v, i){
            return L('v, i => i * 2')(v, i);
        });
        console.timeEnd('5(One more Anonymous Inner Function with Eval)')

        console.time('6(Optimaization case 5)')
        var arr = Array(10000);
        _.map(arr,function(v, i) {
            return L2('v, i => i * 2')(v, i);
        });
        console.timeEnd('6(Optimaization case 5)')
    })

    it("flatten", ()=>{
        function flatten(arr){
            return function f(arr, newArr){
                arr.forEach(function(v){
                    Array.isArray(v) ? f(v, newArr) : newArr.push(v);
                });
                return newArr;
            }(arr, []);
        }

        expect(flatten([1, [2], [3, 4]])).to.eql([1,2,3,4]);
        expect(flatten([1, [2], [[3], 4]])).to.eql([1,2,3,4]);

        function flatten2(arr, newArr){
            arr.forEach(function(v){
                Array.isArray(v) ? flatten2(v, newArr) : newArr.push(v);
            });
            return newArr;
        }

        expect(flatten2([1, [2], [3, 4]],[])).to.eql([1,2,3,4]);
        expect(flatten2([1, [2], [[3], 4]], [])).to.eql([1,2,3,4]);
    })

    it("review 'if' State", ()=>{
        function add(a, b){
            return a + b;
        }

        let a;
        if(a = add(3, 5)) console.log(a);
        console.log(a);

        var b;
        if(b = add(1, 4)) console.log(b);
        console.log(b);
    })
})