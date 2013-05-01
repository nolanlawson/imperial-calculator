/*global describe it expect module beforeEach*/
describe("Controllers unit tests", function() {
    describe("GameController unit tests", function(){
        
        beforeEach(module('imperial'));
        
        it("contains spec with an expectation", function() {
            expect(module('imperial')).not.toBe(null);
        });
    });
});
