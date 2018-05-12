
var K_selectedProfileColor = null;

$(document).ready(function () {
    K_selectedProfileColor = $('.K_ProfileHolder .K_Profile:first').find('.K_Pcolor');
    K_selectedProfileColor.addClass('K_Pselected');
    $('.K_Profile').mouseenter(function () {
        $(this).find('.K_Pcolor').addClass('K_Phovering');
    })
    $('.K_Profile').mouseleave(function () {
        $(this).find('.K_Pcolor').removeClass('K_Phovering');
    })
    $('.K_Profile').click(function () {
        K_selectedProfileColor.removeClass('K_Pselected');
        K_selectedProfileColor = $(this).find('.K_Pcolor');
        K_selectedProfileColor.addClass('K_Pselected');
    });
})
