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
            // 질문을 대화창에 추가합니다.
            this.drawChat(args.question, false);

            // 답 버튼들을 새로 만듭니다.
            this.drawAnswers(args.answers, args.rightAnswerIndex);

            // 입력이 비활성화된 경우 활성화해줍니다.
            this.enableAnswers();
            this.enableHint();
        }, this);

        this.testModel.events.markAnswer.on(function (args) {
            // 정답을 파란색으로 칠합니다.
            $('.H_Test_Answer').eq(args.rightAnswerIndex)
                .removeClass('H_Test_Answer-select')
                .addClass('H_Test_Answer-right');

            // 문제가 업데이트 되기 전까지 입력을 막습니다.
            this.disableAnswers();
            this.disableHint();

            // 정답을 대화창에 추가합니다.
            this.drawChat(args.answer, true);

            // Correct 또는 Wrong이라고 팝업을 띄웁니다.
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
            .fadeIn(500).delay(1000).fadeOut(500);
    };

    TestView.prototype.drawChat = function (sentences, isMe) {
        if (!Array.isArray(sentences)) {
            sentences = [sentences];
        }

        var chat = $('.H_Test_Chat');

        sentences.forEach(function (sentence, index) {
            var newRow = $('<li>');

            if (!isMe) {
                newRow.append(
                    $('<img>')
                        .addClass('H_Test_Profile H_Test_Profile-other')
                        .attr('src', 'H_Test_Profile.jpg')
                        .css('opacity', (index === 0) ? 1 : 0)
                )
            }

            newRow.append(
                $('<div>')
                    .addClass('H_Test_Sentence')
                    .addClass(isMe ? 'H_Test_Sentence-me' : 'H_Test_Sentence-other')
                    .text(sentence)
            );

            chat.append(newRow);
        });

        chat.scrollTop(chat.height());
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
        $('.H_Test_HintButton').prop('disabled', true).fadeTo('fast', 0.2);
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
                        var thisButton = $(event.currentTarget);

                        this.removeHint();
                        thisButton.addClass('H_Test_Answer-select');
                        this.testModel.markAnswer(thisButton.data('answer'));
                    }.bind(this))
            );
        }.bind(this));
    };

    TestView.prototype.enableAnswers = function () {
        $('.H_Test_Answer').prop('disabled', false);
    };

    TestView.prototype.disableAnswers = function () {
        $('.H_Test_Answer').prop('disabled', true);
    };

    return TestView;
}());
