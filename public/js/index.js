$(".avatarUl li").click(function () {
    $.each($(".avatarUl li"),function (index,item) {
        $(item).removeClass('active');
    })
    $(this).addClass('active');
});

