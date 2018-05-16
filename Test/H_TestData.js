var H = H || {};

/*
 * 테스트의 데이터베이스입니다.
 * 임시로 만든 거고, 대화 DB랑 단어 DB가 완성되면 그거에 맞춰서
 * 변경할 계획입니다.
 * 현재의 포맷은 다음과 같습니다:
 *
 * [
 *     {
 *         question: [(질문 첫 줄), (질문 둘째 줄), ...],
 *         rightAnswer: (정답),
 *         wrongAnswers: [(오답 1), (오답 2), ...],
 *         hint: [(단어 ID 1), (단어 ID 2), ...]
 *     },
 *     ...
 * ]
 */

H.TestData = [
    [
        {
            question: [
                '안녕하세요! 전 Einstein 교수입니다.',
                '학교에서 HCI를 가르치고 있습니다.'
            ],
            rightAnswer: '안녕하세요, 교수님!',
            wrongAnswers: [
                '안녕히 가세요, 교수님!',
                '날씨가 참 좋네요!'
            ],
            hint: [3]
        },
        {
            question: [
                '당신의 이름은 무엇입니까?'
            ],
            rightAnswer: '제 이름은 Natasha입니다.',
            wrongAnswers: [
                '날씨가 참 좋네요!',
                '수업이 너무 어렵습니다.'
            ],
            hint: [3, 31]
        },
        {
            question: [
                '오, Natasha, 반갑습니다!',
                '왜 저를 찾아오셨나요?'
            ],
            rightAnswer: '숙제에 대해서 궁금한 게 있습니다.',
            wrongAnswers: [
                '날씨가 참 좋네요!',
                '안녕하세요, 교수님!'
            ],
            hint: [3, 31]
        },
        {
            question: [
                '숙제는 다 했나요?'
            ],
            rightAnswer: '숙제를 다 했습니다.',
            wrongAnswers: [
                '수업이 너무 어렵습니다.',
                '당신의 이름은 무엇인가요?'
            ],
            hint: [31]
        },
        {
            question: [
                '대단하네요!',
                '제 수업 내용이 쉬운 건가요?'
            ],
            rightAnswer: '아니오, 수업이 너무 어렵습니다.',
            wrongAnswers: [
                '수업을 들으러 갑니다.',
                '숙제를 다 했습니다.'
            ],
            hint: [31]
        },
        {
            question: [
                '마음이 아프네요.',
                '그러나 숙제를 줄여 줄 생각은 없어요.',
                '내일 새로운 숙제가 나올 거예요.',
                '수고하세요!'
            ],
            rightAnswer: 'ㅗㅗㅗ',
            wrongAnswers: [
                '감사합니다.',
                '숙제가 많아서 기쁩니다.'
            ],
            hint: [3, 31]
        },
        {
            question: [
                '너 F'
            ],
            rightAnswer: '',
            wrongAnswers: [],
            hint: []
        }
    ]
];
