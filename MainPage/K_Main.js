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

//line example::    나는 인간->[ID] 컴퓨터->[ID] 상호작용을 듣는 카이스트의 학생이다.
//'->[]' is parsed, output is automatically converted into linked word.
//