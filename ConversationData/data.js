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
var Context_Situations = [
[[
    "- 안녕하세요! 전 Einstein 교수 입니다.",
    "?",
    "?[인사] 안녕하세요, 교수님!>>0",
    "[인사]",
    "- 당신의 이름은>>1 무엇입니까?",
    "?",
    "?[이름말하기] 제 이름은 Natasha입니다.",
    "[이름말하기]",
    "- 오, Natasha, 반갑습니다!",
    "- 왜 저를 찾아오셨나요?",
    "?",
    "?[숙제때문에] 숙제에>>7 대해서 궁금한 게 있습니다.",
    "?[시험때문에] 시험 일정이>>9 어떻게 되나요?",
    "?[출석때문에] 제 출석>>4 점수가 이상합니다.",
    "[숙제때문에]",
    "- 숙제는>>7 다 했나요?",
    "?",
    "?[숙제다함] 숙제를>>7 다 했습니다.",
    "?[시험준비안함] 아니오, 아직 안 했습니다.",
    "[숙제다함]",
    "- 대단하네요!",
    "- 제 수업 내용이 쉬운>>5 건가요?",
    "?",
    "?[수업쉬움] 네, 수업이 꽤 쉽습니다.",
    "?[수업어려움] 아니오, 수업이 너무 어렵습니다.",
    "[수업쉬움]",
    "- 그렇다면 숙제가 더 필요하겠네요.",
    "- 제 수업은>>6 어려워야 합니다.",
    "__FIN__",
    "[수업어려움]",
    "- 마음이 아프네요.",
    "- 그러나 숙제를 줄여 줄 생각은 없어요.",
    "- 내일 새로운 숙제가 나올 거예요.",
    "- 수고하세요!",
    "__FIN__",
    "[시험때문에]",
    "- 시험은 다음 주 목요일>>2 입니다.",
    "- 시험 공부는>>10 하고 계신가요?",
    "?",
    "?[시험준비안함] 아니오, 놀고 있습니다.",
    "?[시험준비함] 네, 열심히 하고 있습니다.",
    "[시험준비안함]",
    "- 마음이 아프네요.",
    "- 저는 F를 많이 갖고>>8 있습니다.",
    "- 나눠줄 사람이 한 명 늘어난 것 같군요!",
    "__FIN__",
    "[시험준비함]",
    "- 시험은 꽤 어렵습니다.",
    "- 더 열심히 하세요!",
    "__FIN__",
    "[출석때문에]",
    "- 출석>>4 점수는 바꿔드리지 않아요.",
    "- 돌아가세요.",
    "__FIN__"
]]
,
[[
    "- 매우 기분이 나쁜>>11 날입니다.",
    "?",
    "?[아니] ......",
    "?[왜요] ...... 저...... 저기......",
    "[왜요]",
    "- 조용히>>12 해 주세요.",
    "- 오늘은>>13 말하고 싶지 않네요.",
    "__FIN__",
    "[아니]",
    "- 집에 가고 싶어요.",
    "- 웹 프로젝트가 이만큼 힘들 줄이야......",
    "- 보고서도>>14 써야 하는데... 언제 다 할 수 있을 지 모르겠네요.",
    "?",
    "?[혼내기] 그래도 해야 할 건 해야죠.",
    "?[어르기] 두 시간만>>15 열심히>>16 하고 집에 갑시다.",
    "[혼내기]",
    "- 알았어요...",
    "__FIN__",
    "[어르기]",
    "- 집에 가고 싶어요......",
    "__FIN__"

]]
];

var ConversationData = (function () {
    'use strict';

    var cd = {};

    // -------------------- Private. --------------------

    var db = firebase.initializeApp(
        // Config.
        {
            apiKey: "AIzaSyCzCLfk8yqwdxamEEFx3PRrRyhOcTL1IUk",
            authDomain: "liko-665bd.firebaseapp.com",
            databaseURL: "https://liko-665bd.firebaseio.com",
            projectId: "liko-665bd",
            storageBucket: "liko-665bd.appspot.com",
            messagingSenderId: "133340779007"
        },
        // 중복 오류 방지용 이름.
        'ConversationData'
    ).database();

    var testsRef = db.ref('tests');

    function makeProblem() {
        var ret = {};
        ret.question = [];
        ret.rightAnswer = '';
        ret.wrongAnswers = [];
        ret.hint = [];
        return ret;
    }

    // -------------------- Public. --------------------

    cd.translate = function (stackLines) {
        var problem = makeProblem();
        var ret = [];

        for (var idx = 0; idx < stackLines.length; idx++) {
            var curLine = stackLines[idx].content;

            curLine = K_parseLine(curLine, false, problem.hint).join('');

            if (!stackLines[idx].isMe) {
                problem.question.push(curLine);
            }
            else {
                problem.rightAnswer = curLine;
                ret.push(problem);
                problem = makeProblem();
            }
        }

        ret.push(problem);
        testsRef.set({0: ret});
    };

    return cd;
}());
