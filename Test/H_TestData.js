var H = H || {};

/*
 * 테스트의 데이터베이스입니다.
 * 임시로 만든 거고, 대화 DB랑 단어 DB가 완성되면 그거에 맞춰서
 * 변경할 계획입니다.
 * 현재의 포맷은 다음과 같습니다:
 *
 * [
 *     {
 *         question: (질문),
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
            question: '안녕하세요! 전 주호킴 교수입니다.',
            rightAnswer: '안녕하세요, 교수님!',
            wrongAnswers: [
                '안녕히 가세요, 교수님!',
                '날씨가 참 좋네요!'
            ],
            hint: ['professor', 'weather']
        },
        {
            question: '당신의 이름은 무엇입니까?',
            rightAnswer: '제 이름은 Natasha입니다.',
            wrongAnswers: [
                '날씨가 참 좋네요!',
                '수업이 너무 어렵습니다.'
            ],
            hint: ['name', 'weather', 'class']
        },
        {
            question: '숙제를 다 했나요?',
            rightAnswer: '숙제를 다 했습니다.',
            wrongAnswers: [
                '날씨가 참 좋네요!',
                '안녕하세요, 교수님!'
            ],
            hint: ['professor', 'weather', 'homework']
        },
        {
            question: '오늘 날씨는 어떤가요?',
            rightAnswer: '날씨가 참 좋네요!',
            wrongAnswers: [
                '수업이 너무 어렵습니다.',
                '당신의 이름은 무엇인가요?'
            ],
            hint: ['weather', 'class', 'name']
        },
        {
            question: '저의 수업에 대해서 어떻게 생각하나요?',
            rightAnswer: '수업이 너무 어렵습니다.',
            wrongAnswers: [
                'Yee',
                '숙제를 다 했습니다.'
            ],
            hint: ['homework', 'class']
        },
        {
            question: '교과서에 대해서 어떻게 생각하나요?',
            rightAnswer: '교과서가 너무 어렵습니다.',
            wrongAnswers: [
                '당신의 이름은 무엇인가요?',
                '교과서를 잃어버렸습니다.'
            ],
            hint: ['textbook']
        }
    ]
];
