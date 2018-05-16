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
        this.isTestEnd = false;

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

            // 라이프가 안 남으면...
            if (this.lifeCount === 0) {
                setTimeout(function () {
                    // 테스트는 끝나고,
                    this.isTestEnd = true;

                    // 실패한 것으로 처리됩니다.
                    this.events.endTest.fire({
                        isSucceed: false,
                        elapsedTime: this.elapsedTime
                    })
                }.bind(this), this.delayAfterMark);

                return;
            }
        }

        setTimeout(function () {
            this.updateProblem();
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
        WordsUtil.vocabsFromIDs(problem.hint, function (vocabMap) {
            var hint = [];

            $.each(vocabMap, function (id, vocab) {
                hint.push(vocab.korean + ': ' + vocab.shortmeaning);
            });

            this.events.showHint.fire({
                hint: hint.join(', ')
            });
        }.bind(this));
    };

    TestModel.prototype.updateProblem = function () {
        this.problemIndex++;

        var problem = this.problems[this.problemIndex];

        // 마지막 문제인 경우...
        if (this.problemIndex >= this.problemCount - 1) {
            this.isTestEnd = true;

            // 상대방만 말을 하고 나는 더 이상 말을 하지 않습니다.
            this.events.updateProblem.fire({
                progress: (this.problemIndex + 1) * 1.0 / this.problemCount,
                question: problem.question,
                answers: null,
                hint: null,
                keyCount: this.keyCount
            });

            // 여기까지 왔다면 라이프를 잃지 않고 테스트를 완수한 겁니다.
            this.events.endTest.fire({
                isSucceed: true,
                elapsedTime: this.elapsedTime
            });

            return;
        }

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
        if (!this.isTestEnd) {
            setTimeout(function () {
                this.updateTime()
            }.bind(this), 1000);
        }
    };

    return TestModel;
}());
