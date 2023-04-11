const _ = require('underscore');
const {expect} = require('chai');

describe("underscore.js", ()=>{
    const users = [
        { id: 1, name: "ID", age: 32 },
        { id: 2, name: "HA", age: 25 },
        { id: 3, name: "BJ", age: 32 },
        { id: 4, name: "PJ", age: 28 },
        { id: 5, name: "JE", age: 27 },
        { id: 6, name: "JM", age: 32 },
        { id: 7, name: "HI", age: 24 }
    ];

    it("Compare With Falsy", ()=>{
        console.log("#### false ####");
        console.log( 1 < false );
        console.log( 1 > false );
        console.log( 0 > false );
        console.log( 0 == false );
        console.log( 0 === false );

        console.log("#### undefined ####");
        console.log( 1 < undefined );
        console.log( 1 > undefined );
        console.log( 0 > undefined );
        console.log( 0 == undefined );
        console.log( 0 === undefined );

        console.log("#### null ####");
        console.log( 1 < null );
        console.log( 1 > null );
        console.log( 0 > null );
        console.log( 0 == null );
        console.log( 0 === null );

        console.log("#### NaN ####");
        console.log( 1 < NaN );
        console.log( 1 > NaN );
        console.log( 0 > NaN );
        console.log( 0 == NaN );
        console.log( 0 === NaN );
    })

    it("Using Underscore.js", ()=>{
        // each
        _.each([1, 2, 3], v => console.log(v * 2));

        // odd
        let odd = _.reject([1, 2, 3, 4, 5, 6], v => v % 2 === 0);
        expect(odd).to.eql([1,3,5]);

        // contain
        expect( _.contains([1, 2, 3, 4, 5], 3) ).to.eql(true);

        // isArray
        expect( _.isArray([]) ).to.eql(true);

        // pluck
        console.log( _.pluck(users, 'name') );

        // first
        expect( _.first([1,2,3,4,5]) ).to.eql(1);
        expect( _.first([1,2,3,4,5], 2)).to.eql([1,2]);

        // last
        expect( _.last([1,2,3,4,5], 3) ).to.eql([3,4,5]);

        // rest
        expect( _.rest([5,4,3,2,1]) ).to.eql([4,3,2,1]);
        expect( _.rest([5,4,3,2,1], 3) ).to.eql([2,1]);

        // initial
        expect( _.initial([5,4,3,2,1], 1) ).to.eql([5,4,3,2]);

        // values
        console.log( _.values(users[0]) );

        // keys
        console.log( _.keys(users[0]) );

        // extend
        console.log("#### extend mutable ####");
        console.log( users[0] );
        expect( _.extend(users[0], {age: 36, job: "developer"}) ).to.eql({id: 1, name: "ID", age: 36, job: "developer"});
        console.log( _.extend(users[0], {age: 36, job: "developer"}) )
        console.log( users[0] );

        console.log("#### extend immmutable ####");
        console.log( users[1] );
        expect( _.extend({}, users[1], {age: 41, job: "dev"}) ).to.eql({id: 2, name: "HA", age: 41, job: "dev"});
        console.log( _.extend({}, users[1], {age: 41, job: "dev"}) )
        console.log( users[1] );

        // pick
        expect( _.pick(users[1], "id", "name") ).to.eql( {id: 2, name: "HA"} );

        // omit
        expect( _.omit(users[1], "id", "name") ).to.eql( {age: 25} );

        // chaining
        let result = _.chain([1,2,3,4,5,6,7,8,9,10])
        .filter(v=> v % 2 === 0)
        .map(v=> v ** 2)
        .value();

        console.log(result);
    })
})