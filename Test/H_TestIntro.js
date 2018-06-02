var H = H || {};

H.StatView = (function () {
    'use strict';

    function StatView(args) {
        this.testStatuses = args.testStatuses;
        this.statInfo = args.statInfo;
        this.contextInfo = H.TestDB.contextInfo;
        this.situationInfo = H.TestDB.situationInfo;
        this.contextCount = H.TestDB.contextCount;
        this.situationCount = H.TestDB.situationCount;

        // 창에 각 context 넣기.
        var $Stat = $('.H_Stat');
        var contextId;

        for (contextId = 0; contextId < this.contextCount; contextId += 1) {
            this.addContext($Stat, contextId);
        }
    }

    StatView.prototype.addContext = function ($Target, contextId) {
        // Context 넣기.
        var profileImage = this.contextInfo[contextId].image;
        var profileName = this.contextInfo[contextId].name;

        var $Context = $('<div class="H_Stat_Context">')
            .append(
                $('<div class="H_Stat_Profile">')
                    .append($('<img class="H_Stat_ProfileImage">').attr('src', profileImage))
                    .append($('<span class="H_Stat_ProfileName">').text(profileName))
            )
            .appendTo($Target);

        // Context에 각 situation 넣기.
        var $ContextInfo = $('<div class="H_Stat_ContextInfo">').appendTo($Context);
        var situationId;

        for (situationId = 0; situationId < this.situationCount; situationId += 1) {
            this.addSituation($ContextInfo, contextId, situationId);
        }
    };

    StatView.prototype.addSituation = function ($Target, contextId, situationId) {
        // Situation 넣기.
        var situationName = this.situationInfo[situationId].name;
        var situationIcon = this.situationInfo[situationId].icon;

        var $Situation = $('<div class="H_Stat_Situation">')
            .append($('<span class=H_Stat_SituationIcon>').addClass(situationIcon))
            .append($('<span class="H_Stat_SituationName">').text(situationName))
            .appendTo($Target);

        // Situation에 테스트로 가는 버튼 넣기.
        var $Test = $('<button class="H_Stat_Test">')
            .appendTo($Target);

        if (this.testStatuses[contextId][situationId]) {
            $Test
                .text('Start the test!')
                .click(function () {
                    $(location).attr('href', 'H_TestMain.html?active=' + contextId + '&sit=' + situationId);
                });
        } else {
            $Test
                .text('Learn the conversation first!')
                .prop('disabled', true);

            return;
        }

        // Situation에 테스트 기록 넣기.
        var stat = this.getStat(contextId, situationId);
        var $Previous;

        if (stat.length === 0) {
            return;
        }

        $Previous = $('<table class="H_Stat_Previous">')
            .append($('<tr><th>Date</th><th>Result</th><th>Elapsed</th></tr>'))
            .appendTo($Target);

        stat.forEach(function (value) {
            $Previous.append(
                $('<tr>')
                    .append($('<td>').text(value.dateString))
                    .append($('<td>').text(value.isSucceed ? 'Success' : 'Failed'))
                    .append($('<td>').text(value.elapsedTime))
            );
        });
    };

    StatView.prototype.getStat = function (contextId, situationId) {
        // 기록이 비어 있는지 체크.
        if (this.statInfo === null) {
            return [];
        }

        if (!this.statInfo.hasOwnProperty(contextId)) {
            return [];
        }

        if (!this.statInfo[contextId].hasOwnProperty(situationId)) {
            return [];
        }

        // 날짜 순으로 정렬해서 리턴.
        // (리턴값: {dateValue: ..., dateString: ..., isSucceed: ..., elapsedTime: ...}의 리스트)
        var stat = [];

        $.each(this.statInfo[contextId][situationId], function (key, value) {
            stat.push(value);
        });

        stat.sort(function (value1, value2) {
            return value1.dateValue - value2.dateValue;
        });

        return stat;
    };

    return StatView;
}());

$(function () {
    'use strict';

    H.TestDB.loadTestStatuses(function (testStatuses) {
        H.TestDB.loadTestResults(function (statInfo) {
            new H.StatView({
                statInfo: statInfo,
                testStatuses: testStatuses
            });
        });
    });
});
