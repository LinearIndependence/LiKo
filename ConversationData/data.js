//Parse this data.
// '%%' => separating lines.
// '?[label]' => a candidate. if selected, goto label.
// '>>word_ID' => postfix of a word; indicates that word can be added to vocab list. Automatically parsed when load time.
// '[label]' => indicates position of label.
// '->[label]' => goto label.
// '__FIN__' => special line content that can finalize whole conversation.
//
//Parsing is always UP-to-DOWN. Sequence never flows after new label.(i.e. if parser incounter new [label], it's malformed data.)
//Cannot goto past label. ==> these features can help finding context.
var testConv = "첫 번째 대사.%%\
선택 없이 이어지는 두 번째 대사.>>daeSa%%\
?[ONE] 첫 번째 선택이 시작되었고, 첫 번째 후보입니다.%%\
?[TWO] 첫 번째 선택의 두 번째 후보입니다.%%\
?[THR] 첫 번째 선택의 세 번째 후보입니다.%%\
[ONE]%%\
첫 번째 선택에서 첫 번째 후보를 선택하셨습니다.%%\
__FIN__%%\
[TWO]%%\
첫 번째 선택에서 두 번째 후보를 선택하셨네요.%%\
근데 또 선택을>>sunTack 해야 할 것 같아요.\
?[THE] 방금 세 번째를 선택했다면?\
?[TWO] 이번에도 두>>doo 번째.\
[THE]%%\
첫 번째 선택에서 세 번째 후보를>>hooBo 선택해 버리기!%%\
두 번째를 선택하고 첫 번째를 선택해도 여기 오긴 해요.%%\
__FIN__%%\
[TWO]%%\
이게 재미있지는 않죠.%%\
->[FINAL]%%\
이 대사는 안 나올 거예요.%%\
[FINAL]%%\
다음에는>>daum 두 번째가 아닌 걸로 선택도 해 봐요.";