//Parse this data.

// '?' => now candidates will start to appear.
// '?[label]' => a candidate. if selected, goto label.
// '>>word_ID' => postfix of a word; indicates that word can be added to vocab list. Automatically parsed when load time.
// '[label]' => indicates position of label.
// '->[label]' => goto label.
// '__FIN__' => special line content that can finalize whole conversation.
// '-' => normal line.
//Parsing is always UP-to-DOWN. Sequence never flows after new label.(i.e. if parser incounter new [label], it's malformed data.)
//Cannot goto past label. ==> these features can help finding context.
var testConv = [
    "- First line of context.",
    "- Second line, in sequence.>>Sequence!!",
    "?",
    "?[ONE] First candidate of first choose.",
    "?[TWO] Second candidate,",
    "?[THE] This is third candidate.",
    "[ONE]",
    "- You choosed the First>>ID_of_word candidate!!",
	"- Context will end now.",
    "__FIN__",
    "[TWO]",
    "- You choosed the SECOND>>second candidate!!!",
	"- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Du",
    "- Now it's time to choose another.",
    "?",
    "?[GGG] Now, there are two candidates.",
    "?[AAA] I'm planning to color candidates by different hue.",
    "[THE]",
    "- You choosed the THIRD candidate!!",
    "- I can do this as long as I want.",
	"- But it's time to end>>CUSTOM_ID_END the context.",
    "__FIN__",
    "[GGG]",
    "- YOU CHOOSED the FIRST one.",
    "->[FINAL]",
    "- 이 대사는 안 나올 거예요.",
    "[FINAL]",
    "- BYE!! context is over.",
	"__FIN__",
	"[AAA]",
	"- This is the longest context branch.",
	"- Time to say goodbye."];
