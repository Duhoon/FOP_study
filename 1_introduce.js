const {expect} = require("chai");

describe("Chapter 1", ()=>{
    function addMaker(a){
        return function(b){
            return a+b;
        }
    }

    describe("example 1", ()=>{
        it("Result addMaker", ()=>{
            expect(addMaker(10)(5)).to.equal(15);
        })
    
        it("Result addMaker using 5", ()=>{
            const add5 = addMaker(5);
            expect(add5(3)).to.equal(8);
            expect(add5(4)).to.equal(9);
        })
    
        it("Result addMaker using 3", ()=>{
            const add3 = addMaker(3);
            expect(add3(3)).to.equal(6);
            expect(add3(4)).to.equal(7);
        })
    })

    describe("example 2", ()=>{
        const users = [
            { id: 1, name: "ID", age: 32 },
            { id: 2, name: "HA", age: 25 },
            { id: 3, name: "BJ", age: 32 },
            { id: 4, name: "PJ", age: 28 },
            { id: 5, name: "JE", age: 27 },
            { id: 6, name: "JM", age: 32 },
            { id: 7, name: "HI", age: 24 }
        ];

        function filter(list, predicate){
            const newList = [];
            for (let i = 0, len = list.length; i < len ; i++){
                if(predicate(list[i])) newList.push(list[i]);
            }
            return newList;
        }

        function map(list, iteratee){
            const newList = [];
            for (let i = 0, len = list.length; i < len ; i++){
                newList.push(iteratee(list[i]));
            }
            return newList;
        }

        describe("Filter", ()=>{
            it("user under 30 years old with filter", ()=>{
                const userUnder30 = filter(users, function(user){return user.age < 30});
                
                expect(userUnder30.length).to.equal(4);
            })
    
            it("user over 30 years old with filter", ()=>{
                const userOver30 = filter(users, function(user){return user.age > 30});
                
                expect(userOver30.length).to.equal(3);
            })
        })
        
        describe("Map", ()=>{
            it("Each user's age under 30 years old", ()=>{
                // const userUnder30 = filter(users, function(user){return user.age < 30}); 변수 할당 없애기
                const ages = map(
                    filter(users, function(user){return user.age < 30}), 
                    function(user){return user.age}
                );
                
                expect(ages).to.eql([25, 28, 27, 24]);
            })

            it("Each user's names over 30 years old", ()=>{
                // const userOver30 = filter(users, function(user){return user.age > 30}); 변수 할당 없애기
                const names = map(
                    filter(users,function(user){return user.age > 30}), 
                    function(user){return user.name}
                );

                expect(names).to.eql(["ID", "BJ", "JM"]);
            })
        })

        /*
         * Closure 
         */
        function bvalue(key){
            return function(obj){
                return obj[key];
            }
        }

        describe("Closure", ()=>{

        })  
    })

    describe("example 3", ()=>{
        const users = [
            { id: 1, name: "ID", age: 32 },
            { id: 2, name: "HA", age: 25 },
            { id: 3, name: "BJ", age: 32 },
            { id: 4, name: "PJ", age: 28 },
            { id: 5, name: "JE", age: 27 },
            { id: 6, name: "JM", age: 32 },
            { id: 7, name: "HI", age: 24 }
        ];

        it("findById", ()=>{  
            function findById(list, id){
                for(let i = 0, len = list.length ; i < len ; i++){
                    if(list[i].id == id) return list[i];
                }
            }

            expect(findById(users, 3)).to.eql({id: 3, name: "BJ", age: 32});
        })

        it("Reusable findBy", ()=>{
            function findBy(key, list, val){
                for(let i = 0, len = list.length ; i < len ; i++){
                    if(list[i][key] == val) return list[i];
                }
            }

            expect(findBy('name', users, 'BJ')).to.eql({id:3, name: "BJ", age: 32});
        })

        it("Ultimate find", ()=>{
            function find(list, predicate){
                for(let i = 0, len = list.length ; i < len ; i++){
                    if(predicate(list[i])) return list[i];
                }
            }

            expect(find(users, function(u){return u.name.indexOf('P') != -1})).to.eql({id:4, name: "PJ", age: 28});
        })

        it("Bmatch", ()=>{
            function find(list, predicate){
                for(let i = 0, len = list.length ; i < len ; i++){
                    if(predicate(list[i])) return list[i];
                }
            }

            function bmatch1(key, val){
                return function(obj){
                    return obj[key] === val;
                }
            }

            expect(find( users, bmatch1('id', 1) )).to.eql({id: 1, name: "ID", age: 32});
        })

        it("Ultimate bmatch", ()=>{
            function find(list, predicate){
                for(let i = 0, len = list.length ; i < len ; i++){
                    if(predicate(list[i])) return list[i];
                }
            }

            function filter(list, predicate){
                const newArray = [];
                for(let i = 0, len = list.length ; i < len ; i++){
                    if(predicate(list[i])) newArray.push(list[i]);
                }
                return newArray;
            }

            function map(list, iteratee){
                const newArray = [];
                for(let i = 0, len = list.length ; i < len ; i++){
                    newArray.push(iteratee(list[i]));
                }
                return newArray;
            }

            function object(key, val){
                let obj = {};
                obj[key] = val;
                return obj;
            }

            function match(obj, obj2){
                for(let key in obj2){
                    if(obj[key] !== obj2[key]) return false;
                }
                return true;
            }

            function bmatch(obj2, val){
                if(arguments.length === 2) obj2 = object(obj2, val);
                return function(obj){
                    return match(obj, obj2)
                }
            }

            console.log(find(users, bmatch('id', 1)));
            console.log(find(users, bmatch({id:3, name: "BJ"})))
            
        })
    })

    describe("Simillar to Underscore.js", ()=>{
        let _ = {};

        _.map = function(list, iteratee){
            let newList = [];
            for (let i = 0, len = list.length; i < len; i++){
                // Adding index and resource
                newList.push(iteratee(list[i], i, list));
            }
            return newList;
        }

        _.filter = function(list, predicate){
            let newList = [];
            for(let i = 0, len = list.length; i < len; i++){
                if(predicate(list[i], i, list)) newList.push(list[i]);
            }
            return newList;
        }

        _.find = function(list, predicate){
            for(let i = 0, len = list.length; i < len; i++){
                if(predicate(list[i], i, list)) return list[i];
            }
        }

        _.findIndex = function(list, predicate){
            for(let i = 0, len = list.length; i < len; i++){
                if(predicate(list[i], i, list)) return i;
            }
            return -1;
        }

        _.identity = function(v){ return v; };

        it("identity function", ()=>{
            expect(_.filter([true, 0, 10, false, 'a', null ], _.identity)).to.eql([true, 10, 'a']);
        })

        it("some, every function", ()=>{
            _.some = function(list){
                return !!_.find(list, _.identity);
            }

            _.every = function(list){
                return _.filter(list, _.identity).length === list.length;
            }

            expect(_.some([0, null, 2])).to.equal(true);
            expect(_.some([0, null, false])).to.equal(false);

            expect(_.every([1, 'a', true])).to.equal(true);
            expect(_.every([1, 0, 'a'])).to.equal(false)
        })

        it("not, beq function", ()=>{
            function not(v){ return !v; }
            function beq(a){
                return function(b){
                    return a === b;
                }
            }

            _.every = function(list){
                return beq(-1)(_.findIndex(list, not))
            }

            _.some([0,null,2]);
        })

        it("compose function", ()=>{
            _.compose = function(){
                let args = arguments;
                let start = args.lenth - 1;
                return function(){
                    let i = start;
                    let result = args[start].apply(this, arguments);
                    while(i--) result = args[i].call(this, result);
                    return result;
                }
            }
        })
    })
})

