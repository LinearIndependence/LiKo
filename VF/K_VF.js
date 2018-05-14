$(function () {
    'use strict';

    var K_selectedProfileColor = $('.K_ProfileHolder .K_Profile:first')
        .find('.K_Pcolor')
        .addClass('K_selected');

    $('.K_Profile').mouseenter(function (event) {
        $(event.currentTarget).find('.K_Pcolor').addClass('K_hovering');
    });

    $('.K_Profile').mouseleave(function (event) {
        $(event.currentTarget).find('.K_Pcolor').removeClass('K_hovering');
    });

    $('.K_Profile').click(function (event) {
        K_selectedProfileColor.removeClass('K_selected K_hovering');

        K_selectedProfileColor = $(event.currentTarget)
            .find('.K_Pcolor')
            .addClass('K_selected');
    });
});
