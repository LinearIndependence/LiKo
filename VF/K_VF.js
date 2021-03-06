var VF_DATA = [
    {name: 'Professor', image: '../VFData/profile0.png'},
    {name: 'Friend', image: '../VFData/profile1.png'},
    {name: 'Sister', image: '../VFData/profile2.png'},
    {name: 'TA', image: '../VFData/profile3.png'}
];


var POPUP_DATA = [
    {name: 'Class', icon: 'fas fa-chalkboard-teacher'},
    {name: 'Sick', icon: 'fas fa-briefcase-medical'},
    {name: 'Hobby', icon: 'fas fa-music'},
    {name: 'Drink', icon: 'fas fa-beer'}
];

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}

function K_showLoadingPopup() {
    $('.K_Main').append(
        $('<div class="K_LoadingPopup">').append(
            $('<img src="../VF/K_Loading.gif">')
        )
    );
}

function K_hideLoadingPopup() {
    $('.K_LoadingPopup').remove();
}

$(function () {
    'use strict';

    function K_moveToURL(url) {
        $(location).attr('href', url);
    }

    /*
     * args = {
     *     profileIndex: (프로필 번호) (i.e URL에서 ?active=...에 들어가는 숫자),
     *     url: 이동할 URL (Situation 클릭하면 url + '?active=...&sit=...'로 이동함.)
     * }
     */
    function K_createPopup(args) {
        var profileIndex = args.profileIndex;
        var url = args.url;

        $('.K_Whole').prepend(
            $('<div class="A_Popup">').append(
                $('<div class="A_Window">')
                    .append(
                        $('<div class="A_Instruction">')
                            .append($('<span id="A_Text">').text('Choose the situation you want to study'))
                            .append($('<span id="A_Close" class="fas fa-times-circle">'))
                    )
                    .append($('<div id="A_Row">'))
            )
        );

        POPUP_DATA.forEach(function (row, index) {
            $('#A_Row').append(
                $('<div class="A_Item">')
                    .append($('<span class="A_Icon">').addClass('fas ' + row.icon))
                    .append($('<p class="A_Name">').text(row.name))
                    .click(function () {
                        K_moveToURL(url + '?active=' + profileIndex + '&sit=' + index);
                    })
            );
        });

        // X 클릭하면 닫힘.
        $('#A_Close').click(function () {
            $('.A_Popup').remove();
        });

        // 팝업창 바깥쪽을 클릭해도 닫히도록 함.
        $('.A_Popup').click(function () {
            $('.A_Popup').remove();
        });

        $('.A_Window').click(function (event) {
            event.stopPropagation();
        });
    }

    /*
     * args = {
     *     name: (VF 이름),
     *     image: (프로필 이미지 src),
     *     callback: (VF 클릭했을 때 실행할 함수),
     *     classes: (additive classes)
     * }
     */
    function K_addProfile(args) {
        var name = args.name;
        var image = args.image;
        var classes = args.classes;

        var callback = args.callback || function () {
        };

        $('.K_ProfileHolder').append(
            /*
             * <div class="K_Profile (K_myProfile)">
             *   <div class="K_Pcolor">
             *     <img class="K_Pimage" src="...">
             *     <p class="K_Pname">YOU</p>
             *   </div>
             * </div>
             */
            $('<div>')
            //.addClass(isMe ? 'K_Profile K_myProfile' : 'K_Profile')
                .addClass(classes)
                .append(
                    $('<div>')
                        .addClass('K_Pcolor')
                        .append(
                            $('<img>')
                                .addClass('K_Pimage')
                                .attr('src', image)
                        )
                        .append(
                            $('<p>')
                                .addClass('K_Pname')
                                .text(name)
                        )
                )
                .mouseenter(function (event) {
                    // $(event.currentTarget): $(this)와 동일. (다른 용도로 this를 쓸걸 대비해서...)
                    $(event.currentTarget).find('.K_Pcolor').addClass('K_hovering');
                })
                .mouseleave(function (event) {
                    $(event.currentTarget).find('.K_Pcolor').removeClass('K_hovering');
                })
                .click(function (event) {
                    K_selectedProfileColor.removeClass('K_selected K_hovering');

                    K_selectedProfileColor = $(event.currentTarget)
                        .find('.K_Pcolor')
                        .addClass('K_selected');

                    // VF가 색칠이 끝까지 된 후에 callback을 호출.
                    setTimeout(function () {
                        callback();
                    }, 200);
                })
        );
    }

    VF_DATA.forEach(function (vf, index) {
        K_addProfile({
            name: vf.name,
            image: vf.image,
            callback: function () {
                K_createPopup({
                    url: '../MainPage/K_Main.html',
                    profileIndex: index
                });
            },
            classes: 'K_Profile'
        });
    });

    K_addProfile({
        name: 'Test',
        image: '../VFData/test.png',
        callback: function () {
            K_moveToURL('../Test/H_TestIntro.html');
        },
        classes: 'K_Profile K_lowerProfile'
    });

    K_addProfile({
        name: 'Vocab',
        image: '../VFData/profile vocab.png',
        callback: function () {
            K_moveToURL('../Vocablist/vocablist.html?active=3');
        },
        classes: 'K_Profile K_lowerProfile'
    });

    K_addProfile({
        name: 'Home',
        image: '../VFData/home.png',
        callback: function () {
            K_moveToURL('../Intro/H_Intro.html')
        },
        classes: 'K_Profile K_lowerProfile'
    });

    var K_selectedProfileColor = $($('.K_Pcolor').get(Number(getAllUrlParams().active))).addClass('K_selected');
});
