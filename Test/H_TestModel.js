var H = H || {};

/*
 * 테스트의 내부 상태들을 관리하는 클래스입니다.
 * 이 클래스는 TestView와는 독립적으로 작동합니다.
 * 다음과 같이 사용합니다.
 *
 * var testModel = new TestModel({
 *     problems: (문제의 배열),
 *     lifeCount: (라이프 갯수),
 *     keyCount: (힌트 갯수)
 * });
 */
H.TestModel = (function () {
    'use strict';

    function range(length) {
        return Array.apply(null, Array(length)).map(function (_, i) {
            return i;
        });
    }

    function shuffleArray(array) {
        var newArray = array.slice(0);
        var i, j, x;

        for (i = newArray.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = x;
        }

        return newArray;
    }

    /* 이건 힌트 테스트용 함수고, 단어 DB랑 연결하게 되면 지울 겁니다. */
    function getHint(id) {
        return {
            professor: '교수',
            weather: '날씨',
            name: '이름',
            class: '수업',
            homework: '숙제',
            textbook: '교과서'
        }[id];
    }

    function Event() {
        this.listeners = [];
    }

    Event.prototype.on = function (callback, context) {
        this.listeners.push(callback.bind(context));
    };

    Event.prototype.fire = function (args) {
        this.listeners.forEach(function (listener) {
            listener(args);
        });
    };

    function TestModel(args) {
        this.problems = args.problems;
        this.problemCount = this.problems.length;
        this.problemIndex = -1;
        this.rightAnswerIndex = -1;
        this.delayAfterMark = args.delayAfterMark || 1500;
        this.elapsedTime = 0;
        this.lifeCount = args.lifeCount || 3;
        this.keyCount = args.keyCount || 3;

        this.events = {
            startTest: new Event(),     // 테스트 시작 이벤트
            endTest: new Event(),       // 테스트 종료 이벤트
            updateTime: new Event(),    // 타이머 1초 지나는 이벤트
            updateProblem: new Event(), // 새 질문 이벤트
            markAnswer: new Event(),    // 정답 채점 이벤트
            showHint: new Event(),      // 힌트 보여주기 이벤트
            useLife: new Event(),       // 라이프 1개 깎는 이벤트
            useKey: new Event()         // 열쇠 1개 깎는 이벤트
        };
    }

    TestModel.prototype.startTest = function () {
        this.events.startTest.fire({
            lifeCount: this.lifeCount,
            keyCount: this.keyCount
        });

        this.updateProblem();
        this.updateTime();
    };

    TestModel.prototype.markAnswer = function (answer) {
        var problem = this.problems[this.problemIndex];
        var isRight = answer === problem.rightAnswer;

        this.events.markAnswer.fire({
            answer: problem.rightAnswer,
            isRight: isRight,
            rightAnswerIndex: this.rightAnswerIndex
        });

        if (!isRight) {
            // 틀렸으면... 라이프 1개 깎음.
            this.lifeCount--;

            this.events.useLife.fire({
                lifeCount: this.lifeCount
            });

            // 라이프가 안 남으면, 게임 오버.
            if (this.lifeCount === 0) {
                setTimeout(function () {
                    this.events.endTest.fire({
                        isSucceed: false,
                        elapsedTime: this.elapsedTime
                    })
                }.bind(this), this.delayAfterMark);

                return;
            }
        }

        setTimeout(function () {
            if (this.problemIndex >= this.problemCount - 1) {
                // 대화가 끝났으면... 게임 오버.
                this.events.endTest.fire({
                    isSucceed: true,
                    elapsedTime: this.elapsedTime
                });
            } else {
                // 아직 안 끝났으면... 다음 질문.
                this.updateProblem();
            }
        }.bind(this), this.delayAfterMark);
    };

    TestModel.prototype.requestHint = function () {
        var problem = this.problems[this.problemIndex];

        // 일단 열쇠 1개 깎음.
        this.keyCount--;

        this.events.useKey.fire({
            keyCount: this.keyCount
        });

        // View에게 힌트 정보 보내기.
        this.events.showHint.fire({
            hint: problem.hint
                .map(function (id) {
                    return getHint(id) + ': ' + id
                })
                .join(', ')
        });
    };

    TestModel.prototype.updateProblem = function () {
        this.problemIndex++;

        var problem = this.problems[this.problemIndex];
        var answerCount = problem.wrongAnswers.length + 1;
        var answers = new Array(answerCount);
        var i;

        /*
         * [0, ..., n - 1](n = (답의 개수) = 1 + (오답의 개수))을 섞습니다.
         * 섞은 걸 [a(0), ..., a(n - 1)]이라고 하면, 정답은 a(0)번째 버튼에,
         * 오답들은 a(1), ..., a(n - 1)번째 버튼들에 배치합니다.
         */
        var answerIndexes = shuffleArray(range(answerCount));

        this.rightAnswerIndex = answerIndexes[0];
        answers[answerIndexes[0]] = problem.rightAnswer;

        for (i = 0; i < problem.wrongAnswers.length; i++) {
            answers[answerIndexes[i + 1]] = problem.wrongAnswers[i];
        }

        this.events.updateProblem.fire({
            progress: (this.problemIndex + 1) * 1.0 / this.problemCount,
            question: problem.question,
            answers: answers,
            hint: problem.hint,
            keyCount: this.keyCount
        });
    };

    TestModel.prototype.updateTime = function () {
        this.events.updateTime.fire({
            time: this.elapsedTime
        });

        this.elapsedTime++;

        // 1초(= 1000밀리초) 뒤 updateTime() 호출.
        setTimeout(function () {
            this.updateTime()
        }.bind(this), 1000);
    };

    return TestModel;
}());
