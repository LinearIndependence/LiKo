//Object 'K_Line' contains only single line.
//the most basic object. All others are referencing these objects.
function K_Line(cont, prev) {
    this.wordsIn = cont.split(" ");
    this.prev = prev;
    this.next = null;
    prev.next = this;
    this.getNext = function () {
        return next;
    }
    this.getPrev = function () {
        return prev;
    }
}