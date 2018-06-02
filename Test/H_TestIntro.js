var H = H || {};

H.TestIntroView = (function () {
    'use strict';

    var db = firebase.initializeApp({
        apiKey: "AIzaSyCzCLfk8yqwdxamEEFx3PRrRyhOcTL1IUk",
        authDomain: "liko-665bd.firebaseapp.com",
        databaseURL: "https://liko-665bd.firebaseio.com",
        projectId: "liko-665bd",
        storageBucket: "liko-665bd.appspot.com",
        messagingSenderId: "133340779007"
    }, 'TestStats').database();

    var statRef = db.ref('testStats');
});

$(function () {
    'use strict';

    // TODO: Dummy code!
    $('.H_Stat_Test').click(function () {
        $(location).attr('href', 'H_TestMain.html?active=0&sit=0');
    });
});
