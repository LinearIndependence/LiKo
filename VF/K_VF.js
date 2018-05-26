var VF_DATA = [
    {
        name: 'Professor',
        image: '../VFData/profile0.png'
    },
    {
        name: 'Friend',
        image: '../VFData/profile1.png'
    }
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

$(function () {
    'use strict';

    function K_moveToURL(url) {
        $(location).attr('href', url);
    }

    /*
     * args = {
     *     profileIndex: (프로필 번호) (i.e URL에서 ?active=...에 들어가는 숫자)
     * }
     */
    function K_createPopup(args) {
        var profileIndex = args.profileIndex;

        var rowData = [
            {name: 'Class', icon: 'fas fa-chalkboard-teacher'},
            {name: 'Sick', icon: 'fas fa-briefcase-medical'},
            {name: 'Hobby', icon: 'fas fa-music'},
            {name: 'Drink', icon: 'fas fa-beer'}
        ];

        $('.K_Whole').prepend(
            $('<div class="A_Popup">').append(
                $('<div class="A_Window">')
                    .append(
                        $('<div class="A_Instruction">')
                            .append($('<br>'))
                            .append($('<span id="A_Text">').text('Choose the situation you want to study'))
                            .append($('<span id="A_Close">').append($('<i class="fas fa-times-circle">')))
                    )
                    .append($('<div id="A_Row">'))
            )
        );

        rowData.forEach(function (row, index) {
            $('#A_Row').append(
                $('<div class="A_Items">')
                    .append(
                        $('<div class="A_Item">')
                            .append($('<i>').addClass('fas ' + row.icon))
                    )
                    .append(
                        $('<p>').text(row.name)
                    )
                    .click(function () {
                        K_moveToURL('../MainPage/K_Main.html?active=' + profileIndex + '&sit=' + index);
                    })
            );
        });

        $('#A_Close').click(function () {
            $('.A_Popup').remove();
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
            K_moveToURL('../MyPage/A_Main.html');
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

    K_addProfile({
        name: VF_DATA[0].name,
        image: VF_DATA[0].image,
        callback: function () {
            //K_moveToURL('../Popup/popup.html?active=0');
            K_createPopup({profileIndex: 0});
        },
        classes: 'K_Profile'
    });

    K_addProfile({
        name: VF_DATA[1].name,
        image: VF_DATA[1].image,
        callback: function () {
            //K_moveToURL('../Popup/popup.html?active=1');
            K_createPopup({profileIndex: 1});
        },
        classes: 'K_Profile'
    });

    K_addProfile({
        name: 'Test',
        image: '../VFData/test.png',
        callback: function () {
            K_moveToURL('../Test/H_Test.html?active=2');
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

    var K_selectedProfileColor = $($('.K_Pcolor').get(Number(getAllUrlParams().active))).addClass('K_selected');
});
