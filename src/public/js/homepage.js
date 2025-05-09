//Tạo slider ảnh và bài viết bằng Slick.js.
//Xử lý mở menu điều hướng khi click vào icon.
//Đóng menu nếu người dùng click ra ngoài.
$(document).ready(function() { //Đây là sự kiện khởi tạo của jQuery, đảm bảo rằng tất cả HTML đã được tải xong trước khi thực thi mã JavaScript bên trong.
    $('.slider-nav').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<i class="fa fa-angle-left prev-custom"></i>',
        nextArrow: '<i class="fa fa-angle-right next-custom"></i>',
    });
/*Tạo một slider (carousel) hiển thị 4 phần tử cùng lúc.
Mỗi lần cuộn sẽ cuộn 1 phần tử.
focusOnSelect: khi người dùng click vào slide, slide đó sẽ được chọn.
Có tùy chỉnh nút mũi tên trái/phải với font-awesome (fa-angle-left/right).*/
    $('.slider-nav-posts').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        focusOnSelect: true,
        prevArrow: '<i class="fa fa-angle-left prev-custom"></i>',
        nextArrow: '<i class="fa fa-angle-right next-custom"></i>',
    });

    $(".menu-nav").on("click", function(e) {
        $(".home-nav").css("display", "block");
    });

    $(document).mouseup(function(e) {
        var container = $(".home-nav");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });
});
