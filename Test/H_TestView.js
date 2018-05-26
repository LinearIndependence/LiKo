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
            this.drawLives(args.lifeCount);
            this.drawKeys(args.keyCount);
            this.hidePopup();

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
            this.updateTime(args.time);
        }, this);

        this.testModel.events.updateProblem.on(function (args) {
            // 질문을 대화창에 추가합니다.
            this.updateChat(args.question, false);

            if (args.answers === null) {
                this.updateAnswers(['.', '.', '.'], 0);
            } else {
                // 답 버튼들을 새로 만듭니다.
                this.updateAnswers(args.answers, args.rightAnswerIndex);
            }

            // 진행 바를 업데이트합니다.
            this.updateProgress(Math.floor(args.progress * 100));

            // 입력이 비활성화된 경우 활성화해줍니다.
            this.enableAnswers();

            if (args.keyCount > 0) {
                this.enableHint();
            }
        }, this);

        this.testModel.events.markAnswer.on(function (args) {
            // 일단 입력을 막습니다.
            this.disableAnswers();
            this.disableHint();

            // 정답을 파란색으로 칠합니다.
            $('.H_Test_Answer').eq(args.rightAnswerIndex)
                .removeClass('H_Test_Answer-select')
                .addClass('H_Test_Answer-right');

            // 정답을 대화창에 추가합니다.
            this.updateChat([args.answer], true);

            // Correct 또는 Wrong이라고 팝업을 띄웁니다.
            this.showPopup(args.isRight);
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

    TestView.prototype.updateProgress = function (percentage) {
        $('.H_Test_ProgressValue').animate({width: '' + percentage + '%'});
    };

    TestView.prototype.drawLives = function (lifeCount) {
        var i;

        $('.H_Test_Lives').empty();

        for (i = 0; i < lifeCount; i++) {
            $('.H_Test_Lives').append($('<span>').addClass('fa fa-heart'));
        }
    };

    TestView.prototype.removeLife = function (lifeCount) {
        $('.H_Test_Lives').children().eq(lifeCount).fadeTo('slow', 0.2);
    };

    TestView.prototype.drawKeys = function (keyCount) {
        var i;

        $('.H_Test_Keys').empty();

        for (i = 0; i < keyCount; i++) {
            $('.H_Test_Keys').append($('<span>').addClass('fa fa-key'));
        }
    };

    TestView.prototype.removeKey = function (keyCount) {
        $('.H_Test_Keys').children().eq(keyCount).fadeTo('slow', 0.2);

        if (keyCount === 1) {
            this.disableHint();
        }
    };

    TestView.prototype.updateTime = function (time) {
        $('.H_Test_Time').text(
            'Elapsed: '
            + fixNumberLength(Math.floor(time / 60), 2) + 'm '
            + fixNumberLength(time % 60, 2) + 's'
        );
    };

    TestView.prototype.showPopup = function (isRight) {
        $('.H_Test_Popup')
            .empty()
            .append($('<span>').addClass(isRight ? 'fa fa-check' : 'fa fa-times'))
            .append($('<span>').text(isRight ? ' Correct' : ' Wrong'))
            .fadeIn(500).delay(1000).fadeOut(500);
    };

    TestView.prototype.hidePopup = function () {
        $('.H_Test_Popup').hide();
    };

    TestView.prototype.updateChat = function (sentences, isMe) {
        var chat = $('.H_Test_Chat');

        sentences.forEach(function (sentence, index) {
            var newRow = $('<li>');

            if (!isMe) {
                // 프로필 사진은 상대방만 그립니다.
                newRow.append(
                    $('<img>')
                        .addClass('H_Test_Profile H_Test_Profile-other')
                        .attr('src', '../VFData/profile0.png')
                        // 두 번째 문장부터는 프로필을 그리지 않습니다.
                        .css('opacity', (index === 0) ? 1 : 0)
                )
            }

            // 문장을 그립니다.
            newRow.append(
                $('<div>')
                    .addClass('H_Test_Sentence')
                    .addClass(isMe ? 'H_Test_Sentence-me' : 'H_Test_Sentence-other')
                    .text(sentence)
            );

            chat.append(newRow);
        });

        // 스크롤을 강제로 아래로 내립니다.
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

    TestView.prototype.updateAnswers = function (answers) {
        $('.H_Test_AnswerArea').empty();

        answers.forEach(function (answer) {
            $('.H_Test_AnswerArea').append(
                $('<button>')
                    .addClass('H_Test_Answer')
                    .data('answer', answer)
                    .text(answer)
                    .click(function () {
                        // 버튼 자기 자신.
                        var thisButton = $(event.currentTarget);

                        this.removeHint();
                        thisButton.addClass('H_Test_Answer-select');
                        this.testModel.markAnswer(thisButton.data('answer'));
                    }.bind(this))
                    .mouseenter(function () {
                        var thisButton = $(event.currentTarget);

                        thisButton.addClass('H_Test_Answer-hover');
                    }.bind(this))
                    .mouseleave(function () {
                        var thisButton = $(event.currentTarget);

                        thisButton.removeClass('H_Test_Answer-hover');
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
