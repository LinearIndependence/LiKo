$(function () {
    'use strict';

    var K_selectedProfileColor = $('.K_ProfileHolder .K_Profile:first')
        .find('.K_Pcolor')
        .addClass('K_selected');

    /*
     * args = {
     *     name: (VF 이름),
     *     isMe: (나 자신이면 true, 아니면 false),
     *     callback: (VF 클릭했을 때 실행할 함수)
     * }
     */
    function K_addProfile(args) {
        var isMe = args.isMe;
        var name = args.name;

        var callback = args.callback || function () {
            alert('Not implemented!');
        };

        $('.K_ProfileHolder').append(
            /*
             * <div class="K_Profile K_myProfile">
             *   <div class="K_Pcolor">
             *     <p class="K_Pname">YOU</p>
             *   </div>
             * </div>
             *
             * <div class="K_Profile">
             *   <div class="K_Pcolor">
             *     <p class="K_Pname">John</p>
             *   </div>
             * </div>
             */
            $('<div>')
                .addClass(isMe ? 'K_Profile K_myProfile' : 'K_Profile')
                .append(
                    $('<div>')
                        .addClass('K_Pcolor')
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
        name: 'You',
        isMe: true
    });

    K_addProfile({
        name: 'VF 1',
        isMe: false,
        callback: function () {
            alert('VF 1!');
        }
    });

    K_addProfile({
        name: 'VF 2',
        isMe: false,
        callback: function () {
            alert('VF 2!');
        }
    });
});
