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
        this.elapsedTime = 0;
        this.lifeCount = args.lifeCount;
        this.keyCount = args.keyCount;

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

        if (answer === problem.rightAnswer) {
            this.events.markAnswer.fire({
                answer: problem.rightAnswer,
                isRight: true
            });
        } else {
            this.lifeCount--;

            this.events.markAnswer.fire({
                answer: problem.rightAnswer,
                isRight: false
            });

            this.events.useLife.fire({
                lifeCount: this.lifeCount
            });

            if (this.lifeCount === 0) {
                this.events.endTest.fire({
                    isSucceed: false,
                    elapsedTime: this.elapsedTime
                });
                return;
            }
        }

        if (this.problemIndex >= this.problemCount - 1) {
            this.events.endTest.fire({
                isSucceed: true,
                elapsedTime: this.elapsedTime
            });
        } else {
            this.updateProblem();
        }
    };

    TestModel.prototype.requestHint = function () {
        var problem = this.problems[this.problemIndex];

        this.keyCount--;

        this.events.showHint.fire({
            hint: problem.hint
                .map(function (id) {
                    return '가나다: ' + id
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
        var answers = [];
        var answerIndexes = shuffleArray(range(problem.wrongAnswers.length + 1));
        var i;

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
