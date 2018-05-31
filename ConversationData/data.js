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
    [
        //class
        [
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
        ],
        //sick
        [
            "- 무슨 일인가요?",
            "- 무슨 질문이>>26 있나요?",
            "?",
            "?[머리아파] 두통이>>17 있습니다.",
            "?[외상] 팔이>>18 부러졌습니다.",
            "?[몸살] 몸에 힘이 없습니다.",
            "[머리아파]",
            "- 안타깝군요.",
            "- 수업을 듣지 못할 정도인가요?",
            "?",
            "?[못들어] 아무 생각도 할 수 없을 만큼 아픕니다.",
            "?[들음] 아니오, 조금 쉬면 나아질 것 같습니다.",
            "[못들어]",
            "- 이런, 일단 건강관리실을 찾아가 보세요.",
            "- 그러나 결석은>>19 어쩔 수 없습니다.",
            "__FIN__",
            "[들음]",
            "- 그렇다면 자리로 돌아가 앉으세요.",
            "- 숙제를>>7 하다 보면 나아질 겁니다.",
            "__FIN__",
            "[외상]",
            "- 안타깝군요.",
            "- 연필을>>20 쓸 수 없나요?",
            "?",
            "?[펜씀] 아니오, 연필을>>20 쓸 수 있습니다.",
            "?[펜못씀] 네, 연필을>>20 쓸 수 없습니다.",
            "[펜씀]",
            "- 그렇다면 수업을 듣는 데 문제가>>21 없을 겁니다.",
            "- 돌아가세요.",
            "__FIN__",
            "[펜못씀]",
            "- 문제가>>21 심각하네요.",
            "- 나을 때까지, 굳이 수업에 나올 필요 없습니다.",
            "__FIN__",
            "[몸살]",
            "- 힘이 없다고 해서 수업을 듣지 못하는 것은 아닙니다.",
            "- 수업을 듣다 보면 괜찮아질 겁니다.",
            "?",
            "?[정말아픔] 교수님, 정말 죽을>>22 것 같습니다.",
            "?[나이롱] 네, 견딜>>23 만 합니다.",
            "[정말아픔]",
            "- 그렇다면 돌아가세요.",
            "- 의사에게 소견서를>>24 받아오세요.",
            "__FIN__",
            "[나이롱]",
            "- 이런 시시콜콜한>>25 일로 말을 걸지 마세요.",
            "- 돌아가 자리에 앉으세요.",
            "__FIN__"
        ],
        //hobby
        [],
        //drink
        []

    ]
    ,
    [
        [
            "- 교수님이>>0 방금 뭐라고 하셨지?",
            "?",
            "?[농담] 이상한 농담을>>27 하셨어.",
            "?[충고] 졸지>>28 말라고 하셨어.",
            "?[숙제] 또 숙제가>>7 나온다고 하셨어.",
            "[농담]",
            "- 무슨 농담을>>27 했는데?",
            "- 나도 듣고 싶어.",
            "?",
            "?[농담내용] 그냥 말장난>>29 인데, 재미 하나도 없었어.",
            "[농담내용]",
            "- 난 교수님이>>0 수업 시간에 농담하는>>27 것이 좋아.",
            "- 멋있잖아. 안 그래?",
            "?",
            "?[정말] 교수님이 멋있긴>>30 하지.",
            "?[아니] 무슨 소리야? 끔찍한>>32 말 하지 마.",
            "[정말]",
            "- 농담인데...>>27 네가 그렇게 생각할 줄은 몰랐어.",
            "- 취향>>33 존중한다.>>34",
            "__FIN__",
            "[아니]",
            "- 역시 그렇지?",
            "__FIN__",
            "[충고]",
            "- 말도 안 돼.",
            "- 우리가 조는>>28 건, 수업이 재미 없기 때문이야.",
            "__FIN__",
            "[숙제]",
            "- 말도 안 돼.",
            "- 아직 저번 숙제를>>7 시작하지도 않았어.",
            "- 넌 어때?",
            "?",
            "?[다함] 난 숙제>>7 다 했어.",
            "?[다안함] 나도 아직 안 했어.",
            "[다함]",
            "- 좋겠다.",
            "__FIN__",
            "[다안함]",
            "- 오늘 만나서 같이 하자.",
            "- F는 싫어.",
            "__FIN__"
        ],
        [
            "- 안색이 안 좋아.",
            "- 어디 아파?",
            "?",
            "?[두통] 머리가 아파.",
            "?[외상] 손가락이>>35 부러졌어.",
            "?[몸살] 몸에 힘이 없어.",
            "[두통]",
            "- 나한테 타이레놀이 있어.",
            "- 하나 먹을래?",
            "?",
            "?[줘] 응, 먹어야 될 것 같아.",
            "?[아니] 아니, 안 먹어도 될 것 같아.",
            "[줘]",
            "- 여기 있어.",
            "- 아무리 아파도 수업은 꼭 나와야 할 거야.",
            "__FIN__",
            "[아니]",
            "- 정말 괜찮아?",
            "- 얼른 나았으면 좋겠어.",
            "__FIN__",
            "[외상]",
            "- 어쩌다 그랬어?",
            "- 넌 병원에>>36 가야 할 것 같아.",
            "- 내가 교수님께>>0 말할게.",
            "__FIN__",
            "[몸살]",
            "- 언제부터 그랬어?",
            "?",
            "?[어제] 어제 숙제한다고>>7 밤을 새서 이런 것 같아.",
            "?[일주일] 저번 주에 축제>>37 때문에 무리했어.>>38",
            "[어제]",
            "- 가끔은 숙제를>>7 미뤄도 괜찮아.",
            "- 건강이>>39 먼저라고 생각해.",
            "__FIN__",
            "[일주일]",
            "- 축제는>>37 즐겨야 하는 거야.",
            "- 무리하지>>38 않았으면 좋겠어.",
            "__FIN__"
        ],
        [],
        []
    ]
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

    cd.translate = function (stackLines, active, situation) {
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
        testsRef.child('' + active + '/' + situation).set(ret);
    };

    return cd;
}());
