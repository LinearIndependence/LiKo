
var K_selectedProfileColor = null;
var K_selectedCand = null;
$(document).ready(function () {
    K_selectedProfileColor = $('.K_ProfileHolder .K_Profile:first').find('.K_Pcolor');
    K_selectedProfileColor.addClass('K_selected');
    $('.K_Profile').mouseenter(function () {
        $(this).find('.K_Pcolor').addClass('K_hovering');
    })
    $('.K_Profile').mouseleave(function () {
        $(this).find('.K_Pcolor').removeClass('K_hovering');
    })
    $('.K_Profile').click(function () {
        K_selectedProfileColor.removeClass('K_selected');
        K_selectedProfileColor.removeClass('K_hovering');
        K_selectedProfileColor = $(this).find('.K_Pcolor');
        K_selectedProfileColor.addClass('K_selected');
    });
    $('.K_commitButton, .K_cand').mouseenter(function () {
        $(this).addClass('K_hovering');
    })
    $('.K_commitButton, .K_cand').mouseleave(function () {
        $(this).removeClass('K_hovering');
    })
    $('.K_commitButton').mousedown(function () {
        $(this).addClass('K_selected');
        $(this).removeClass('K_hovering');
    })
    $('.K_cand').mousedown(function () {
        K_clearCand();
        K_selectedCand = $(this);
        $(this).addClass('K_selected');
        $(this).removeClass('K_hovering');
    })
    $('.K_commitButton').mouseup(function () {
        $(this).removeClass('K_selected');
    })
    $('.K_commitButton').click(function () {
        console.log(K_selectedCand.attr('idx'));
        K_clearCand();
    })
})
function K_clearCand() {
    if (K_selectedCand !== null) {
        K_selectedCand.removeClass('K_selected');
    }
}