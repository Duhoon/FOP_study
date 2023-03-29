const {expect} = require("chai");

describe("Chapter 1", ()=>{
    function addMaker(a){
        return function(b){
            return a+b;
        }
    }

    it("Result addMaker", ()=>{
        expect(addMaker(10)(5)).to.equal(15);
    })

    it("Result addMaker using 5", ()=>{
        const add5 = addMaker(5);
        expect(add5(3)).to.equal(8);
        expect(add5(4)).to.equal(9);
    })
})

