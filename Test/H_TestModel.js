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
            startTest: new Event(),
            endTest: new Event(),
            updateTime: new Event(),
            updateProblem: new Event(),
            markAnswer: new Event(),
            showHint: new Event(),
            useLife: new Event(),
            useKey: new Event()
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
            this.lifeCount--;

            this.events.useLife.fire({
                lifeCount: this.lifeCount
            });

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
                this.events.endTest.fire({
                    isSucceed: true,
                    elapsedTime: this.elapsedTime
                });
            } else {
                this.updateProblem();
            }
        }.bind(this), this.delayAfterMark);
    };

    TestModel.prototype.requestHint = function () {
        var problem = this.problems[this.problemIndex];

        this.keyCount--;

        this.events.showHint.fire({
            hint: problem.hint
                .map(function (id) {
                    return getHint(id) + ': ' + id
                })
                .join(', ')
        });

        this.events.useKey.fire({
            keyCount: this.keyCount
        });
    };

    TestModel.prototype.updateProblem = function () {
        this.problemIndex++;

        var problem = this.problems[this.problemIndex];
        var answers = range(problem.wrongAnswers.length + 1);
        var answerIndexes = shuffleArray(range(problem.wrongAnswers.length + 1));
        var i;

        this.rightAnswerIndex = answerIndexes[0];
        answers[answerIndexes[0]] = problem.rightAnswer;

        for (i = 0; i < problem.wrongAnswers.length; i++) {
            answers[answerIndexes[i + 1]] = problem.wrongAnswers[i];
        }

        this.events.updateProblem.fire({
            question: problem.question,
            answers: answers,
            hint: problem.hint
        });
    };

    TestModel.prototype.updateTime = function () {
        this.events.updateTime.fire({time: this.elapsedTime});

        this.elapsedTime++;

        // 1초(= 1000밀리초) 뒤 updateTime() 호출.
        setTimeout(function () {
            this.updateTime()
        }.bind(this), 1000);
    };

    return TestModel;
}());
