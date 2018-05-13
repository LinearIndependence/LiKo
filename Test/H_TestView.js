var H = H || {};

/*
 * 테스트의 뷰를 관리하는 클래스입니다.
 * 다음과 같이 사용합니다.
 *
 * var testView = new TestView({
 *     testModel: (TestModel의 인스턴스)
 * });
 */
H.TestView = (function () {
    'use strict';

    function fixNumberLength(number, length) {
        return ('' + (Math.pow(10, length) + number)).slice(1);
    }

    function TestView(args) {
        this.testModel = args.testModel;

        this.testModel.events.startTest.on(function (args) {
            this.drawLifes(args.lifeCount);
            this.drawKeys(args.keyCount);

            $('.H_Test_Popup').hide();

            $('.H_Test_HintButton').click(function () {
                this.testModel.requestHint();
            }.bind(this));
        }, this);

        this.testModel.events.endTest.on(function (args) {
            $('.H_Test_HintButton').prop('disabled', true);
            $('.H_Test_Answer').prop('disabled', true);

            setTimeout(function () {
                alert(
                    (args.isSucceed ? 'Success!' : 'Failed!')
                    + ' (Elapsed time: ' + args.elapsedTime + ' seconds)'
                );
            }, 500);
        }, this);

        this.testModel.events.updateTime.on(function (args) {
            this.drawTime(args.time);
        }, this);

        this.testModel.events.updateProblem.on(function (args) {
            this.drawChat(args.question, false);
            this.drawAnswers(args.answers);
            this.enableHint();
        }, this);

        this.testModel.events.markAnswer.on(function (args) {
            this.drawChat(args.answer, true);
            this.drawPopup(args.isRight);
        }, this);

        this.testModel.events.showHint.on(function (args) {
            this.drawHint(args.hint);
            this.disableHint();
        }, this);

        this.testModel.events.useLife.on(function (args) {
            this.removeLife(args.lifeCount);
        }, this);

        this.testModel.events.useKey.on(function (args) {
            this.removeKey(args.keyCount);
        }, this);
    }

    TestView.prototype.drawLifes = function (lifeCount) {
        var i;

        $('.H_Test_Life').empty();

        for (i = 0; i < lifeCount; i++) {
            $('.H_Test_Life').append($('<span>').addClass('fa fa-heart'));
        }
    };

    TestView.prototype.removeLife = function (lifeCount) {
        $('.H_Test_Life').children().eq(lifeCount).fadeTo('slow', 0.2);
    };

    TestView.prototype.drawKeys = function (keyCount) {
        var i;

        $('.H_Test_Key').empty();

        for (i = 0; i < keyCount; i++) {
            $('.H_Test_Key').append($('<span>').addClass('fa fa-key'));
        }
    };

    TestView.prototype.removeKey = function (keyCount) {
        $('.H_Test_Key').children().eq(keyCount).fadeTo('slow', 0.2);

        if (keyCount === 0) {
            this.disableHint();
        }
    };

    TestView.prototype.drawTime = function (time) {
        $('.H_Test_Time').text(
            fixNumberLength(Math.floor(time / 60), 2)
            + ' : '
            + fixNumberLength(time % 60, 2)
        );
    };

    TestView.prototype.drawPopup = function (isRight) {
        $('.H_Test_Popup')
            .empty()
            .append($('<span>').addClass(isRight ? 'fa fa-check' : 'fa fa-times'))
            .append($('<span>').text(isRight ? ' Correct' : ' Wrong'))
            .fadeIn('fast').delay(500).fadeOut('fast');
    };

    TestView.prototype.drawChat = function (sentence, isMe) {
        $('.H_Test_Chat')
            .append(
                $('<li>')
                    .append(
                        isMe
                            ? null
                            : $('<img>')
                                .addClass('H_Test_Profile H_Test_Profile-other')
                                .attr('src', 'H_Test_Profile.jpg')
                    )
                    .append(
                        $('<div>')
                            .addClass('H_Test_Sentence')
                            .addClass(isMe ? 'H_Test_Sentence-me' : 'H_Test_Sentence-other')
                            .text(sentence)
                    )
            )
            .scrollTop($('.H_Test_Chat').height());
    };

    TestView.prototype.drawHint = function (hint) {
        $('.H_Test_HintView').hide().text(hint).fadeIn('slow');
    };

    TestView.prototype.removeHint = function () {
        $('.H_Test_HintView').hide();
    };

    TestView.prototype.enableHint = function () {
        $('.H_Test_HintButton').prop('disabled', false).fadeTo(0, 1.0);
    };

    TestView.prototype.disableHint = function () {
        $('.H_Test_HintButton').prop('disabled', true).fadeTo('slow', 0.2);
    };

    TestView.prototype.drawAnswers = function (answers) {
        $('.H_Test_HintView').nextAll().remove();

        answers.forEach(function (answer) {
            $('.H_Test_Input').append(
                $('<button>')
                    .addClass('H_Test_Answer')
                    .data('answer', answer)
                    .text(answer)
                    .click(function () {
                        this.removeHint();
                        this.testModel.markAnswer($(event.currentTarget).data('answer'));
                    }.bind(this))
            );
        }.bind(this));
    };

    return TestView;
}());
