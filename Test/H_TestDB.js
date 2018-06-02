var H = H || {};

H.TestDB = (function () {
    'use strict';

    var T = {};

    var db = firebase.initializeApp({
        apiKey: "AIzaSyCzCLfk8yqwdxamEEFx3PRrRyhOcTL1IUk",
        authDomain: "liko-665bd.firebaseapp.com",
        databaseURL: "https://liko-665bd.firebaseio.com",
        projectId: "liko-665bd",
        storageBucket: "liko-665bd.appspot.com",
        messagingSenderId: "133340779007"
    }, 'Test').database();

    var testsRef = db.ref('tests');
    var statsRef = db.ref('testStats');

    function fixNumberLength(number, length) {
        return ('' + (Math.pow(10, length) + number)).slice(1);
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

    function formatDate(date) {
        return '' + date.getFullYear()
            + '.' + fixNumberLength(date.getMonth() + 1, 2)
            + '.' + fixNumberLength(date.getDate(), 2)
            + ' ' + fixNumberLength(date.getHours(), 2)
            + ':' + fixNumberLength(date.getMinutes(), 2)
            + ':' + fixNumberLength(date.getSeconds(), 2)
    }

    function formatTime(time) {
        return ''
            + fixNumberLength(Math.floor(time / 60), 2) + 'm '
            + fixNumberLength(time % 60, 2) + 's'
    }


    // Context(= 프로필) 정보.
    T.contextCount = VF_DATA.length;
    T.contextInfo = VF_DATA;

    // Situation 정보.
    T.situationCount = POPUP_DATA.length;
    T.situationInfo = POPUP_DATA;

    // DB에서 테스트 정보를 가져와서 정답, 오답을 생성하고 리턴.
    T.loadAndGenTest = function (contextId, situationId, callback) {
        testsRef.child('' + contextId + '/' + situationId).once('value').then(function (snapshot) {
            var problems = snapshot.val();
            var allAnswers = [];

            problems.forEach(function (problem) {
                if (problem.rightAnswer.length > 0) {
                    allAnswers.push(problem.rightAnswer);
                }
            });

            // 랜덤하게 두 개 뽑겠다고 매 번 리스트 전체를 섞었더니 퍼포먼스가 똥망... ㅠㅠ
            problems.forEach(function (problem, index) {
                var allAnswersExceptMe = allAnswers.slice(0);

                allAnswersExceptMe.splice(index, 1);
                problem.wrongAnswers = shuffleArray(allAnswersExceptMe).slice(0, 2);
            });

            callback(problems);
        });
    };

    // DB를 뒤져서 각 (contextId, situationId)에 해당하는 테스트가 가능한지
    // (i.e 유저가 공부한 적이 있는지) 알아옴.
    T.loadTestStatuses = function (callback) {
        testsRef.once('value', function (snapshot) {
            var tests = snapshot.val();
            var statuses = [];
            var row;
            var contextId;
            var situationId;

            for (contextId = 0; contextId < T.contextCount; contextId += 1) {
                row = [];

                for (situationId = 0; situationId < T.situationCount; situationId += 1) {
                    row.push(
                        tests.hasOwnProperty(contextId)
                        && tests[contextId].hasOwnProperty(situationId)
                    );
                }

                statuses.push(row);
            }

            callback(statuses);
        });
    };

    // DB에 테스트 결과를 저장.
    T.saveTestResult = function (contextId, situationId, isSucceed, elapsedTime) {
        var date = new Date();

        statsRef.child('' + contextId + '/' + situationId).push({
            dateValue: date.getTime(),
            dateString: formatDate(date),
            isSucceed: isSucceed,
            elapsedTime: formatTime(elapsedTime)
        });
    };

    // DB에서 테스트 결과를 모두 불러옴.
    T.loadTestResults = function (callback) {
        statsRef.once('value', function (snapshot) {
            callback(snapshot.val());
        });
    };

    return T;
}());
