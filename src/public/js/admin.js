//preview ảnh trước khi upload
var loadFile = function (event) {
    var output = $("#image-preview");
    if ($('#image-clinic').val()) {
        output.removeClass('d-none');
        output.addClass('d-block');
        output.attr('src', URL.createObjectURL(event.target.files[0]));
    }
};

function loadImageUserSetting() {
    var output = $("#img-user-setting");
    if ($('#update-avatar').val()) {
        output.attr('src', URL.createObjectURL(event.target.files[0]));
    }
}

//tạo bài viết mới với nội dung markdown 
function createNewPost(markdown, converter) {
    $('#createNewPost').on('click', function (event) {
        let formData = new FormData($('form#formCreateNewPost')[0]);
        let contentMarkdown = markdown.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        formData.append('contentMarkdown', contentMarkdown);
        formData.append('contentHTML', contentHTML);
        formData.append('title', $('#title-post').val());

        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/supporter/manage/post/create`,
            data: data,
            success: function (data) {
                alert('A new post is created successfully!');
                window.location.href = `${window.location.origin}/supporter/manage/posts`;
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error)
            }
        });

    });
}

//xóa phòng khám
function deleteClinicById() {
    $('.delete-specific-clinic').bind('click', function (e) {
        e.preventDefault();
        if (!confirm('Delete this clinic?')) {
            return
        }

        let id = $(this).data('clinic-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/clinic`,
            data: { id: id },
            success: function (data) {
                node.closest("tr").remove();
                alertify.success('Delete succeed!');
            },
            error: function (err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        }); //ajax có tác dụng gửi và nhận dữ liệu từ server mà không cần tải lại toàn bộ trang web.
    });
}

//tạo phòng khám mới
function createNewClinic(markdownIntroClinic, converter) {
    $("#createNewClinic").on('click', function (e) {
        let formData = new FormData($('form#formCreateNewClinic')[0]);
        let contentMarkdown = markdownIntroClinic.value();
        let contentHTML = converter.makeHtml(contentMarkdown);

        //tạo phòng khám có ảnh
        if ($('#image-clinic').val()) {
            formData.append('introductionMarkdown', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            handleCreateClinicNormal(formData);
        } else {
            // tạo phòng khám kh có ảnh
            let data = {
                introductionMarkdown: contentMarkdown,
                introductionHTML: contentHTML
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleCreateClinicWithoutFile(data);
        }
    });
}

function handleCreateSpecializationNormal(formData) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/specialization/create`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('A new specialization is created successfully');
            window.location.href = `${window.location.origin}/users/manage/specialization`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function createNewSpecialization(markdownIntroSpecialization, converter) {
    $("#createNewSpecialization").on('click', function (e) {
        let formData = new FormData($('form#formCreateNewSpecialization')[0]);
        let contentMarkdown = markdownIntroSpecialization.value();
        let contentHTML = converter.makeHtml(contentMarkdown);

        //tạo phòng khám có ảnh
        if ($('#image-clinic').val()) {
            formData.append('markdownIntroSpecialization', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
            handleCreateSpecializationNormal(formData);
        } else {
            alert("Vui lòng thêm ảnh")
            return
        }
    });
}

function handleCreateClinicWithoutFile(data) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/clinic/create-without-file`,
        data: data,
        success: function (data) {
            alert('A new clinic is created successfully');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error)
        }
    });
}

function handleCreateClinicNormal(formData) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/clinic/create`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('A new clinic is created successfully');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function updateClinic(markdownIntroClinic, converter) {
    $('#btnUpdateClinic').on('click', function (e) {
        let clinicId = $('#btnUpdateClinic').data('clinic-id');
        let formData = new FormData($('form#formUpdateClinic')[0]);
        let contentMarkdown = markdownIntroClinic.value();
        let contentHTML = converter.makeHtml(contentMarkdown);

        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('introductionMarkdown', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            formData.append('id', clinicId);
            handleUpdateClinicNormal(formData);
        } else {
            // create without file upload
            let data = {
                id: clinicId,
                introductionMarkdown: contentMarkdown,
                introductionHTML: contentHTML
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleUpdateClinicWithoutFile(data);
        }
    });
}
function updateSpecialization(markdownIntroSpecialization, converter) {
    $('#btnUpdateSpecialization').on('click', function (e) {
        console.log(markdownIntroSpecialization)
        let clinicId = $('#btnUpdateSpecialization').data('clinic-id');
        let formData = new FormData($('form#formUpdateClinic')[0]);
        let contentMarkdown = markdownIntroSpecialization.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        console.log(23456789)
        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('description', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            formData.append('id', clinicId);
            handleUpdateSpecializationNormal(formData);
        } else {
            // create without file upload
            let data = {
                id: clinicId,
                description: contentMarkdown,
                introductionHTML: contentHTML
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleUpdateSpecializationWithoutFile(data);
        }
    });
}

function handleUpdateClinicNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/clinic/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateClinicWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/clinic/update-without-file`,
        data: data,
        success: function (data) {
            alert('Update succeed');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateSpecializationNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/specialization/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/specialization`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateSpecializationWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/specialization/update-without-file`,
        data: data,
        success: function (data) {
            alert('Update succeed');
            window.location.href = `${window.location.origin}/users/manage/specialization`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

//hiển thị thông tin chi tiết phòng khám khi click nút
function showModalInfoClinic() {
    $('.info-specific-clinic').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('clinic-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-clinic-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageClinic').empty();
                $('#name').val(data.clinic.name);
                if (data.clinic.phone) {
                    $('#phone').val(data.clinic.phone);
                } else {
                    $('#phone').val('Has not been updated');
                }
                if (data.clinic.address) {
                    $('#address').val(data.clinic.address);
                } else {
                    $('#address').val('Has not been updated');
                }

                if (data.clinic.image) {
                    $('#imageClinic').prepend(`<img class="img-info-clinic" src="/images/clinics/${data.clinic.image}" />`)
                } else {
                    $('#imageClinic').text('Has not been updated')
                }

                $('#modalInfoClinic').modal('show');
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });
}
function showModalInfoSpecialization() {
    $('.info-specialization').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('specialization-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-specialization-by-id`,
            data: { id: id },
            success: function (data) {
                const spec = data.specialization;
                $('#name').val(spec.name || 'Chưa cập nhật');
                $('#description').val(spec.description || 'Chưa cập nhật');
                $('#imageClinic').empty();

                if (spec.image) {
                    $('#imageClinic').prepend(`<img class="img-info-clinic" src="/images/specializations/${spec?.image}" />`);
                } else {
                    $('#imageClinic').text('Chưa cập nhật');
                }

                $('#modalInfoSpecialization').modal('show');
            },
            error: function (error) {
                alertify.error('Có lỗi xảy ra, vui lòng thử lại sau!');
                console.log(error);
            }
        });
    });
}

//mở cửa sổ cài đặt người dùng
function showModalSettingUser() {
    $('.user-setting').on('click', function (e) {
        e.preventDefault();
        $('#modalSettingUser').modal('show');

    });
}

//tạo bác sĩ mới
function createNewDoctor() {
    $('#createNewDoctor').on('click', function (e) {
        e.preventDefault();
        let formData = new FormData($('form#formCreateNewDoctor')[0]);
        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/admin/doctor/create`,
            data: data,
            success: function (data) {
                alert('Create a new doctor succeeds');
                window.location.href = `${window.location.origin}/users/manage/doctor`;
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });
}

function createNewDoctor() {
    $('#createNewSupporter').on('click', function (e) {
        e.preventDefault();
        let formData = new FormData($('form#formCreateNewDoctor')[0]);
        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/admin/supporter/create`,
            data: data,
            success: function (data) {
                alert('Create a new doctor succeeds');
                window.location.href = `${window.location.origin}/users/manage/supporter`;
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });
}

//xóa bác sĩ theo id
function deleteDoctorById() {
    $('.delete-doctor-info').on('click', function (e) {
        if (!confirm('Delete this doctor?')) {
            return
        }

        let id = $(this).data('doctor-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/doctor`,
            data: { id: id },
            success: function (data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function (err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function deleteSupporterById() {
    $('.delete-supporter-info').on('click', function (e) {
        if (!confirm('Delete this supporter?')) {
            return
        }
        let id = $(this).data('supporter-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/supporter`,
            data: { id: id },
            success: function (data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function (err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function showModalInfoDoctor() {
    $('.show-doctor-info').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('doctor-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-doctor-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageDoctor').empty();

                $('#nameDoctor').val(data.doctor.name);
                if (data.doctor.phone) {
                    $('#phoneDoctor').val(data.doctor.phone);
                } else {
                    $('#phoneDoctor').val('Has not been updated');
                }
                if (data.doctor.address) {
                    $('#addressDoctor').val(data.doctor.address);
                } else {
                    $('#addressDoctor').val('Has not been updated');
                }
                $('#specializationDoctor').val(data.doctor.specializationName);
                $('#clinicDoctor').val(data.doctor.clinicName);
                if (data.doctor.avatar) {
                    $('#imageDoctor').prepend(`<img class="img-info-clinic" src="/images/users/${data.doctor.avatar}" />`)
                } else {
                    $('#imageDoctor').text('Has not been updated')
                }

                $('#modalInfoDoctor').modal('show');
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });

}

function showModalInfoSupporter() {
    $('.show-supporter-info').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('supporter-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-supporter-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageDoctor').empty();

                $('#nameDoctor').val(data.doctor.name);
                if (data.doctor.phone) {
                    $('#phoneDoctor').val(data.doctor.phone);
                } else {
                    $('#phoneDoctor').val('Has not been updated');
                }
                if (data.doctor.address) {
                    $('#addressDoctor').val(data.doctor.address);
                } else {
                    $('#addressDoctor').val('Has not been updated');
                }
                $('#specializationDoctor').val(data.doctor.specializationName);
                $('#clinicDoctor').val(data.doctor.clinicName);
                if (data.doctor.avatar) {
                    $('#imageDoctor').prepend(`<img class="img-info-clinic" src="/images/users/${data.doctor.avatar}" />`)
                } else {
                    $('#imageDoctor').text('Has not been updated')
                }

                $('#modalInfoSupporter').modal('show');
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });

}

function updateDoctor() {
    $('#btnUpdateDoctor').on('click', function (e) {
        let doctorId = $('#btnUpdateDoctor').data('doctor-id');

        let formData = new FormData($('form#formUpdateDoctor')[0]);
        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('avatar', document.getElementById('image-clinic').files[0]);
            formData.append('id', doctorId);
            handleUpdateDoctorNormal(formData);
        } else {
            // create without file upload
            let data = {
                id: doctorId,
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleUpdateDoctorWithoutFile(data);
        }
    });
}

/*Gửi AJAX PUT đến /admin/doctor/update.
Gửi dạng FormData để hỗ trợ upload file.
Nếu thành công: hiển thị thông báo + chuyển hướng.*/
function handleUpdateDoctorNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/doctor/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/doctor`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateDoctorWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/doctor/update-without-file`,
        data: data, //Dùng object thông thường (không có file ảnh).
        success: function (data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/doctor`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function updateUser() {
    $('#updateInfoUserSetting').on('click', function (e) {
        console.log(12345)
        let userId = $('#updateInfoUserSetting').data('user-id');
        let formData = new FormData();
        formData.append('id', userId);
        formData.append('email', $('#emailUser').val());
        formData.append('name', $('#nameUser').val());
        formData.append('phone', $('#phoneUser').val());
        formData.append('gender', $('input[name="gender"]:checked').val());
        formData.append('address', $('#addressUser').val());
        formData.append('description', $('#descriptionUser').val());
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        let fileInput = document.getElementById('update-avatar');
        if (fileInput.files && fileInput.files[0]) {
            // Trường hợp có file ảnh mới
            formData.append('avatar', fileInput.files[0]);
            handleUpdateUserNormal(formData);
        } else {
            // Trường hợp không có file ảnh mới
            let data = {};
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1];
            }
            handleUpdateUserWithoutFile(data);
        }
    });
}

function handleUpdateUserNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/user/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Cập nhật người dùng thành công!');
            window.location.href = `${window.location.origin}/users`;
        },
        error: function (error) {
            alertify.error('Có lỗi xảy ra, vui lòng thử lại sau!');
            console.log(error);
        }
    });
}

function handleUpdateUserWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/user/update-without-file`,
        data: data, // Dữ liệu là object thường, không có ảnh
        success: function (data) {
            alert('Cập nhật người dùng thành công!');
            window.location.href = `${window.location.origin}/users`;
        },
        error: function (error) {
            alertify.error('Có lỗi xảy ra, vui lòng thử lại sau!');
            console.log(error);
        }
    });
}

function updatePasswordUser() {
    $('#updatePasswordUserSetting').on('click', function () {
        const oldPassword = $('#oldPassword').val().trim();
        const newPassword = $('#newPassword').val().trim();
        const confirmPassword = $('#confirmPassword').val().trim();

        // Validate cơ bản
        if (!oldPassword || !newPassword || !confirmPassword) {
            alertify.error('Vui lòng điền đầy đủ các trường!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alertify.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        const data = {
            oldPassword,
            newPassword,
            confirmPassword
        };

        handleUpdatePasswordUser(data);
    });
}

function handleUpdatePasswordUser(data) {
    $.ajax({
        method: 'PUT',
        url: `${window.location.origin}/admin/user/update-password`,
        data: data,
        success: function (res) {
            alert('Đổi mật khẩu thành công!');
            // Tuỳ chọn làm mới form
            $('#oldPassword, #newPassword, #confirmPassword').val('');
        },
        error: function (err) {
            alertify.error('Có lỗi xảy ra khi đổi mật khẩu!');
            console.log(err);
        }
    });
}


function updateSupporter() {
    $('#btnUpdateSupporter').on('click', function (e) {
        let doctorId = $('#btnUpdateSupporter').data('doctor-id');
        let formData = new FormData($('form#formUpdateSupporter')[0]);
        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('avatar', document.getElementById('image-clinic').files[0]);
            formData.append('id', doctorId);
            handleUpdateSupporterNormal(formData);
        } else {
            // create without file upload
            let data = {
                id: doctorId,
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleUpdateSupporterWithoutFile(data);
        }
    });
}

/*Gửi AJAX PUT đến /admin/doctor/update.
Gửi dạng FormData để hỗ trợ upload file.
Nếu thành công: hiển thị thông báo + chuyển hướng.*/
function handleUpdateSupporterNormal(formData) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/supporter/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/supporter`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function handleUpdateSupporterWithoutFile(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/admin/supporter/update-without-file`,
        data: data, //Dùng object thông thường (không có file ảnh).
        success: function (data) {
            alert('Update succeeds');
            window.location.href = `${window.location.origin}/users/manage/supporter`;
        },
        error: function (error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

/*Xóa chuyên khoa khi click nút .delete-specialization.
Gửi AJAX DELETE đến /admin/delete/specialization.
Nếu thành công: xóa hàng <tr> tương ứng khỏi bảng và hiển thị thông báo.*/
function deleteSpecializationById() {
    $('.delete-specialization').on('click', function (e) {
        if (!confirm('Delete this specialist?')) {
            return
        }
        let id = $(this).data('specialization-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/specialization`,
            data: { id: id },
            success: function (data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function (err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

//điều khiển phân trang bài viết cho supporter
function showPostsForSupporter() {
    let currentPage = 1;
    let total = $('#paginationForPost').data('total');
    if (total === 1) {
        $(' .li-next').addClass('disabled');
    }
    $('.page-post-next').on('click', function (e) {
        e.preventDefault();
        currentPage++;
        $(' .li-pre').removeClass('disabled');

        if (currentPage === total) {
            $(' .li-next').addClass('disabled');
        }
        if (currentPage > total) return;
        generateTablePostPagination(currentPage);
    });//click next or pre => tăng giảm trang

    $('.page-post-pre').on('click', function (e) {
        e.preventDefault();
        currentPage--;
        $(' .li-next').removeClass('disabled');
        if (currentPage === 1) {
            $(' .li-pre').addClass('disabled');
        }
        if (currentPage === 0) return;
        generateTablePostPagination(currentPage);
    });
}

//
function generateTablePostPagination(page) {
    $.ajax({
        url: `${window.location.origin}/supporter/pagination/posts?page=${page}`,
        method: 'GET',
        success: function (data) {
            $("#listPostsTable tbody").empty();
            let html = '';
            data.posts.rows.forEach((post) => {
                html += `
                 <tr>
                        <td> ${post.id}</td>
                        <td>${post.title}</td>
                        <td>${post.writerName}</td>
                        <td>${post.dateClient}</td>
                        <td class="">
                            <a class=" " href="/supporter/post/edit/${post.id}" title="Edit info"><i class="fas fa-pen-square mx-3"></i></a>
                            <a class="delete-post" href="#" data-post-id="${post.id}" title="Delete"><i class="fas fa-trash"></i></a>
                        </td>
                   </tr>
                `;
            });
            $("#listPostsTable tbody").append(html);//Gửi AJAX GET đến /supporter/pagination/posts?page=... để lấy dữ liệu bài viết theo trang.
        },
        error: function (err) {
            alertify.error('An error occurs, please try again later!');
            console.log(err)
        }
    });
}

function deletePostById() {
    $('.delete-post').on('click', function (e) {
        if (!confirm('Delete this post?')) {
            return
        }
        let id = $(this).data('post-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/post`,
            data: { id: id },
            success: function (data) {
                node.closest("tr").remove();
                alertify.success('Delete succeeds');
            },
            error: function (err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

function updatePost(markdown, converter) {
    $('#btnUpdatePost').on('click', function (e) {
        let postId = $('#btnUpdatePost').data('post-id');
        let formData = new FormData($('form#formUpdatePost')[0]);
        let contentMarkdown = markdown.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        formData.append('contentMarkdown', contentMarkdown);
        formData.append('contentHTML', contentHTML);
        formData.append('title', $('#titlePost').val());

        let data = {
            id: postId
        };
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }
        $.ajax({
            method: "PUT",
            url: `${window.location.origin}/supporter/post/update`,
            data: data,
            success: function (data) {
                alert('Update succeeds');
                window.location.href = `${window.location.origin}/supporter/manage/posts`;
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error)
            }
        });

    });
}
//gửi danh sách lịch khám (scheduleArr) từ UI về server khi click button
function createScheduleByDoctor(scheduleArr) {
    $("#createNewScheduleDoctor").on("click", function () {
        if (scheduleArr.length === 0) {
            alertify.error('Have not selected a plan to save');
            return
        }
        let doctorId = $("#doctor").val();
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/doctor/manage/schedule/create`,
            data: { 'schedule_arr': scheduleArr, doctorId },
            success: function (data) {
                if (data.status === 1) {
                    alertify.success('Add a successful appointment');
                }
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error)
            }

        });
    });
}

//xử lý sự kiện khi người dùng chọn giờ khám
/*Toggle class .btn-css để chọn/bỏ chọn khung giờ.
Nếu chọn: thêm lịch vào scheduleArr và thêm dòng mới vào bảng.
Nếu bỏ chọn: xóa khỏi scheduleArr và bảng.
Trả về mảng scheduleArr.*/
function handleBtnSchedule() {
    let scheduleArr = [];
    $('.btn-schedule').unbind('click').bind('click', function (e) {
        let idBtn = $(this).attr('id');
        $(`#${idBtn}`).toggleClass('btn btn-css');

        let time = $(`#${idBtn}`).attr("value");
        let date = $("#datepicker").val();

        //check có class thì add new row, else try to remove
        if ($(`#${idBtn}`).hasClass("btn-css")) {

            let item = {
                'date': date,
                'time': time,
                'id': `${idBtn}-${date}`
            };
            scheduleArr.push(item);
            $('#tableCreateSchedule tbody').append(
                ` <tr id="row-${idBtn}">
                         <td>${time}</td>
                         <td>${date}</td>
                  </tr>`);
        } else {
            let count = -1;
            let timeCheck = $(`#${idBtn}`).attr("value");
            let dateCheck = $("#datepicker").val();
            scheduleArr.forEach((x, index) => {
                if (x.time === timeCheck && x.date === dateCheck) {
                    count = index;
                }
            });
            if (count > -1) scheduleArr.splice(count, 1);

            $(`table#tableCreateSchedule tr#row-${idBtn}`).remove();
        }

        scheduleArr.sort(function (a, b) {
            return a.time.localeCompare(b.time)
        });
    });

    return scheduleArr;
}

//xử lý thay đổi ngày trong datePicker
function handleChangeDatePicker(currentDate) {
    $('#datepicker').datepicker().on('changeDate', function (event) {
        let date = $("#datepicker").val();
        let dateConvert = stringToDate(date, "dd/MM/yyyy", "/");
        let currentDateConvert = stringToDate(currentDate, "dd/MM/yyyy", "/");
        if (dateConvert >= currentDateConvert) {
            //continue, refresh button
            $('.btn-schedule').removeClass('btn-css').addClass('btn');
        } else {
            $('#datepicker').datepicker("setDate", new Date());
            alertify.error('Cant create a medical plan for the past');
        }
    });// chỉ cho phép chọn ngày hôm nay và tương lai nếu chọn ngày trong qk 
    //=> lỗi và reset về ngày hiện tại
}

//Chuyển đổi chuỗi ngày dạng dd/MM/yyyy thành đối tượng Date.
function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);

}

//Gọi API lấy danh sách bệnh nhân theo trạng thái: mới, chờ, xác nhận, huỷ.
function loadNewPatientsForSupporter() {
    $.ajax({
        url: `${window.location.origin}/supporter/get-patients-for-tabs`,
        method: 'POST',
        success: function (data) {
            let countNew = data.object.newPatients.length;
            let countPending = data.object.pendingPatients.length;
            let countConfirmed = data.object.confirmedPatients.length;
            let countCanceled = data.object.canceledPatients.length;

            $('#count-new').text(`${countNew}`);
            $('#count-need').text(`${countPending}`);
            $('#count-confirmed').text(`${countConfirmed}`);
            $('#count-canceled').text(`${countCanceled}`);

            let htmlNew, htmlPending, htmlConfirmed, htmlCanceled = '';
            data.object.newPatients.forEach((patient) => {
                htmlNew += `
                <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td>${convertStringToDateClient(patient.updatedAt)}      </td>
                    <td> 
                    <button type="button"  data-patient-id="${patient.id}" class="ml-3 btn btn-primary btn-new-patient-ok"> Receive</button>
                    <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger btn-new-patient-cancel"> Cancel </button>
                    </td>
                </tr>
                `;
            });

            data.object.pendingPatients.forEach((patient) => {
                htmlPending += `
                <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${convertStringToDateClient(patient.updatedAt)}      </td>
                    <td> 
                    <button  data-patient-id="${patient.id}"  class="ml-3 btn btn-warning btn-pending-patient">Confirm</button>
                    <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger btn-pending-patient-cancel"> Cancel </button>
                    </td>
                </tr>
                `;
            });

            data.object.confirmedPatients.forEach((patient) => {
                htmlConfirmed += `
                <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${convertStringToDateClient(patient.updatedAt)}     </td>
                    <td> 
                    <button  type="button" data-patient-id="${patient.id}"  class="ml-3 btn btn-info btn-confirmed-patient"> Information</button>
                    </td>
                </tr>
                `;
            });

            data.object.canceledPatients.forEach((patient) => {
                htmlCanceled += `
                <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${convertStringToDateClient(patient.updatedAt)} </td>
                    <td> 
                    <button   data-patient-id="${patient.id}"  class="ml-3 btn btn-primary btn-history-cancel-patient">History</button>
                    </td>
                </tr>
                `;
            });

            $('#tableNewPatients tbody').append(htmlNew);
            $('#tableNeedConfirmPatients tbody').append(htmlPending);
            $('#tableConfirmedPatients tbody').append(htmlConfirmed);
            $('#tableCancelPatients tbody').append(htmlCanceled);
        },
        error: function (error) {
            console.log(error);
            alertify.error('An error occurs, please try again later!');
        }
    })
}

// Xử lý khi nhân viên xác nhận tiếp nhận bệnh nhân mới.
function handleBtnNewPatientOk() {
    $("#tableNewPatients").on("click", ".btn-new-patient-ok", function (e) {
        if (!confirm('Do you want to confirm admission of this patient?')) {
            return
        }
        let countNew = +$('#count-new').text();
        let countPending = +$('#count-need').text();
        let patientId = $(this).data('patient-id');
        this.closest("tr").remove();
        countNew--;
        countPending++;
        $('#count-new').text(countNew);
        $('#count-need').text(countPending);

        $.ajax({
            url: `${window.location.origin}/supporter/change-status-patient`,
            method: 'POST',
            data: { patientId: patientId, status: 'pending' },
            success: function (data) {
                let patient = data.patient;
                addNewRowTablePending(patient);
            },
            error: function (error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

//Khi nhân viên nhấn nút "Hủy" bệnh nhân mới → hiển thị modal lý do hủy
function handleBtnNewPatientCancel() {
    $("#tableNewPatients").on("click", ".btn-new-patient-cancel", function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#btnCancelBookingPatient').attr('data-type', 'new-patient-cancel');
        $('#modalCancelBooking').modal('show');
    });
}

//Lấy thông tin chi tiết bệnh nhân theo ID và hiển thị modal.
function callAjaxRenderModalInfo(patientId, option) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/get-detail-patient-by-id`,
        data: { patientId: patientId },
        success: function (data) {
            $('#patientName').val(data.name);
            $('#btn-confirm-patient-done').attr('data-patient-id', data.id);
            $('#patientPhone').val(data.phone);
            $('#patientEmail').val(data.email);
            $('#patientDate').val(data.dateBooking);
            $('#patientTime').val(data.timeBooking);
            $('#patientReason').text(data.description);
            $('#patientAddress').text(data.address);
            if (data.ExtraInfo) {
                $('#patientHistoryBreath').text(data.ExtraInfo.historyBreath);
                $('#patientMoreInfo').text(data.ExtraInfo.moreInfo);
            }
            if (option) {
                $('#btn-confirm-patient-done').css('display', 'none');
                $('#btn-cancel-patient').text("OK");
            }
            $('#modalDetailPatient').modal('show');
        },
        error: function (err) {
            console.log(error);
            alertify.error('An error occurs, please try again later!');
        }
    });
}

//Xử lý khi nhân viên muốn xác nhận lại bệnh nhân đang ở trạng thái "pending".
function handleBtnPendingPatient() {
    $("#tableNeedConfirmPatients").on("click", ".btn-pending-patient", function (e) {
        let patientId = $(this).data('patient-id');
        let option = false;
        callAjaxRenderModalInfo(patientId, option);
    });
}

//Mở modal hủy đối với bệnh nhân "pending".
function handleBtnPendingCancel() {
    $("#tableNeedConfirmPatients").on("click", ".btn-pending-patient-cancel", function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#btnCancelBookingPatient').attr('data-type', 'pending-patient-cancel');
        $('#modalCancelBooking').modal('show');
    });
}

//Thêm một dòng bệnh nhân vào bảng "chờ xác nhận".
function addNewRowTablePending(patient) {
    let htmlPending = `
                 <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${convertStringToDateClient(patient.updatedAt)}     </td>
                    <td> 
                    <button  data-patient-id="${patient.id}"  class="ml-3 btn btn-warning btn-pending-patient">Confirm</button>
                    <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger btn-pending-patient-cancel"> Cancel </button>
                    </td>
                </tr>
               
                `;
    $('#tableNeedConfirmPatients tbody').prepend(htmlPending);
}

//Thêm một dòng bệnh nhân vào bảng "đã xác nhận".
function addNewRowTableConfirmed(patient) {
    let htmlConfirmed = `
                <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${convertStringToDateClient(patient.updatedAt)}     </td>
                    <td> 
                    <button  type="button" data-patient-id="${patient.id}"  class="ml-3 btn btn-info btn-confirmed-patient"> Information</button>
                    </td>
                </tr>
                `;
    $('#tableConfirmedPatients tbody').prepend(htmlConfirmed);

}

//Thêm một dòng bệnh nhân vào bảng "đã huỷ".
function addNewRowTableCanceled(patient) {
    let htmlPending = `
                  <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${convertStringToDateClient(patient.updatedAt)} </td>
                    <td> 
                    <button   data-patient-id="${patient.id}"  class="ml-3 btn btn-primary btn-history-cancel-patient">History</button>
                    </td>
                </tr>
               
                `;
    $('#tableCancelPatients tbody').prepend(htmlPending);
}

//Chuyển chuỗi ngày backend (ISO) thành định dạng DD/MM/YYYY, HH:mm A.
function convertStringToDateClient(string) {
    return moment(Date.parse(string)).format("DD/MM/YYYY, HH:mm A");
}

//Sau khi gọi xác nhận bệnh nhân (từ bảng "pending"), chuyển sang "confirmed".
function handleAfterCallingPatient() {
    $('#btn-confirm-patient-done').on('click', function (e) {
        if (!confirm('Have you phoned to confirm whether the patient has an appointment?')) {
            return;
        }
        let countPending = +$('#count-need').text();
        let countConfirmed = +$('#count-confirmed').text();
        countPending--;
        countConfirmed++;
        $('#modalDetailPatient').modal('hide');
        let patientId = $('#btn-confirm-patient-done').attr('data-patient-id');
        $('#tableNeedConfirmPatients tbody').find(`.btn-pending-patient[data-patient-id=${patientId}]`).closest("tr").remove();
        $('#count-need').text(countPending);
        $('#count-confirmed').text(countConfirmed);

        $.ajax({
            url: `${window.location.origin}/supporter/change-status-patient`,
            method: 'POST',
            data: { patientId: patientId, status: 'confirmed' },
            success: function (data) {
                console.log(data)
                let patient = data.patient;
                addNewRowTableConfirmed(patient);
            },
            error: function (error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

//Xem thông tin chi tiết bệnh nhân đã xác nhận.
function handleViewInfoPatientBooked() {
    $("#tableConfirmedPatients").on("click", ".btn-confirmed-patient", function (e) {
        let patientId = $(this).data('patient-id');
        let option = true;
        callAjaxRenderModalInfo(patientId, option);
    });
}

//Xử lý logic khi nhân viên hủy lịch bệnh nhân từ modal
/*Lấy lý do hủy từ form.
Cập nhật lại số lượng, bảng.
Gửi AJAX cập nhật trạng thái failed.*/
function handleCancelBtn() {
    $('#btnCancelBookingPatient').on('click', function (e) {
        let formData = new FormData($('form#formCancelBooking')[0]);
        let data = {};
        let text = '';
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1]
        }

        if (data.reasonCancel === 'reason3') {
            if (!$('#otherReason').val()) {
                alert('Please fill in more information for another reason');
                return;
            }
            text = `Other reason: ${$('#otherReason').val()} `;
        } else if (data.reasonCancel === 'reason2') {
            text = 'The patient canceled the schedule';
        } else {
            text = 'Spam clinic appointment, not real'
        }

        let patientId = $('#btnCancelBookingPatient').attr('data-patient-id');

        let type = $('#btnCancelBookingPatient').attr('data-type');

        if (type === 'pending-patient-cancel') {
            let countPending = +$('#count-need').text();
            let countCancel = +$('#count-canceled').text();
            countPending--;
            countCancel++;
            $('#tableNeedConfirmPatients tbody').find(`.btn-pending-patient-cancel[data-patient-id=${patientId}]`).closest("tr").remove();
            $('#count-need').text(countPending);
            $('#count-canceled').text(countCancel);
        } else {
            let countNew = +$('#count-new').text();
            let countCancel = +$('#count-canceled').text();
            countNew--;
            countCancel++;
            $('#tableNewPatients tbody').find(`.btn-new-patient-cancel[data-patient-id=${patientId}]`).closest("tr").remove();
            $('#count-new').text(countNew);
            $('#count-canceled').text(countCancel);
        }

        $('#modalCancelBooking').modal('hide');

        $.ajax({
            url: `${window.location.origin}/supporter/change-status-patient`,
            method: 'POST',
            data: { patientId: patientId, status: 'failed', reason: text },
            success: function (data) {
                let patient = data.patient;
                addNewRowTableCanceled(patient);
            },
            error: function (error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });

    });
}

//Khi nhân viên bấm "History" ở bảng bệnh nhân đã hủy, hiển thị lịch sử trạng thái.
function handleBtnViewHistory() {
    $('#tableCancelPatients').on('click', '.btn-history-cancel-patient', function () {
        let patientId = $(this).data('patient-id');
        $('#btn-view-history').attr('data-patient-id', patientId);
        $.ajax({
            url: `${window.location.origin}/supporter/get-logs-patient`,
            method: 'POST',
            data: { patientId: patientId },
            success: function (data) {
                $("#contentHistory").empty();

                let html = '';
                data.forEach((log) => {
                    html += `
                     <div class="form-row mb-3">
                            <div class="col-6">
                                <input type="text"  class="form-control" id="historyStatus" value="${log.content}">
                            </div>
                            <div class="col-3">
                                <input type="text"  class="form-control" id="personDone" value="${log.supporterName}">
                            </div>
                            <div class="col-3">
                                <input type="text"  class="form-control" id="timeDone" value="${convertStringToDateClient(log.createdAt)} ">
                            </div>
                        </div>
                    
                    `;
                });
                $('#contentHistory').append(html);
                $('#modalHistoryBooking').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    })
}

//Bác sĩ bấm xem chi tiết bệnh nhân 
//→ Gọi API lấy thông tin bệnh nhân → Hiển thị lên modal.
function handleDoctorViewInfoPatient() {
    $('.doctor-view-detail').on('click', function (e) {
        let patientId = $(this).attr('data-patient-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-detail-patient-by-id`,
            data: { patientId: patientId },
            success: function (data) {
                $('#imageOldForms').empty();
                $('#patientName').val(data.name);
                $('#patientPhone').val(data.phone);
                $('#patientEmail').val(data.email);
                $('#patientDate').val(data.dateBooking);
                $('#patientTime').val(data.timeBooking);
                $('#patientReason').text(data.description);
                $('#patientAddress').text(data.address);
                if (data.ExtraInfo) {
                    $('#patientHistoryBreath').text(data.ExtraInfo.historyBreath);
                    $('#patientMoreInfo').text(data.ExtraInfo.moreInfo);
                    if (data.ExtraInfo.oldForms) {
                        let images = JSON.parse(data.ExtraInfo.oldForms);
                        let html = '';
                        for (let [key, value] of Object.entries(images)) {
                            html += `
                              <a href="/images/patients/${value}" class="mr-3" target="_blank" title="Click to show the image">
                                <span>${value}</span>
                              </a>
                            `;
                        }

                        $('#imageOldForms').append(html)
                    } else {
                        $('#imageOldForms').append(`<span>No information</span>`)
                    }
                }

                $('#modalDetailPatientForDoctor').modal('show');
            },
            error: function (err) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

//Bác sĩ bấm gửi đơn thuốc → Lấy thông tin bệnh nhân & các file đã gửi trước đó (nếu có) 
//→ Hiển thị modal gửi file.
function showModalSendForms() {
    $('.doctor-send-forms').on('click', function (e) {
        let patientId = $(this).attr('data-patient-id');
        let isSend = $(this).attr('data-is-send-forms');

        $.ajax({
            url: `${window.location.origin}/api/get-detail-patient-by-id`,
            method: "POST",
            data: { patientId: patientId },
            success: function (data) {
                let html = '';
                $('#divGenerateFilesSend').empty();
                $('#emailPatient').val(data.email);
                $('#btnSendFilesForms').attr('data-patient-id', patientId);
                if (data.ExtraInfo) {
                    if (data.ExtraInfo.sendForms) {
                        let images = JSON.parse(data.ExtraInfo.sendForms);
                        for (let [key, value] of Object.entries(images)) {
                            html += `
                              <div class="form-row">
                                <div class="form-group col-9">
                                    <a type="text" class="form-control" id="nameFileSent" target="_blank" href="/images/patients/remedy/${value}" readonly="true" title="${value}" >
                               ${value}
                                </a>
                                </div>
                             </div>`;
                        }
                    } else {
                        html = `
                          <div class="form-row">
                            <div class="form-group col-9">
                                <label class="col-form-label text-label" for="nameFileSent"> File's name:</label>
                                <input type="text" class="form-control" id="nameFileSent" name="nameFileSent" disabled>
                            </div>
                         </div>`
                    }
                }
                $('#divGenerateFilesSend').append(html);
                $('#modalSendForms').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('An error occurs, please try again later!');
            }
        });
    });
}

//Khi bác sĩ gửi file → Kiểm tra file, gửi lên server 
//→ Cập nhật UI (biểu tượng đã gửi) & thông báo thành công.
function handleSendFormsForPatient() {
    $('#btnSendFilesForms').on("click", function (e) {
        if (!$('#filesSend').val()) {
            alert("Please select files before sending!");
            return;
        }
        $(this).prop('disabled', true);
        $('#processLoadingAdmin').removeClass('d-none');
        let formData = new FormData($('form#formSendFormsForPatient')[0]);
        formData.append('patientId', $(this).attr('data-patient-id'));

        $.ajax({
            method: "POST",
            url: `${window.location.origin}/doctor/send-forms-to-patient`,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#modalSendForms').modal('hide');
                $('#processLoadingAdmin').addClass('d-none');
                $('#btnSendFilesForms').prop('disabled', false);
                $(`.fa-exclamation-circle[data-patient-id=${data.patient.id}]`).css('color', '#36b9cc');
                $(`.fa-exclamation-circle[data-patient-id=${data.patient.id}]`).removeClass('fa-exclamation-circle').addClass('fa-check-circle')
                alertify.success('Sending remedies succeeds');
            },
            error: function (error) {
                alertify.error('An error occurs, please try again later!');
                console.log(error);
            }
        });
    });
}

//Reset toàn bộ nội dung trong các modal khi bị đóng lại.
function resetModal() {
    $(`#modalDetailPatient`).on('hidden.bs.modal', function (e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });

    $(`#modalHistoryBooking`).on('hidden.bs.modal', function (e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });

    $(`#modalDetailPatientForDoctor`).on('hidden.bs.modal', function (e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });

    $(`#modalSendForms`).on('hidden.bs.modal', function (e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
    });
    $(`#modalCancelBooking`).on('hidden.bs.modal', function (e) {
        $(this).find("input,textarea,select").val('').end().find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
        $('#inputDefaultReason').prop('checked', true);
    });
}

//Hỗ trợ viên bấm xác nhận đã xử lý bình luận 
//→ Gọi API → Xóa dòng bình luận khỏi bảng.
function doneComment() {
    $(".done-comment").on('click', function (e) {
        if (confirm("Confirm save customer feedback?")) {
            let commentId = $(this).attr('data-comment-id');
            node = this;
            $.ajax({
                method: 'POST',
                url: `${window.location.origin}/supporter/done-comment`,
                data: { commentId: commentId },
                success: function (data) {
                    node.closest("tr").remove();
                    console.log(data);
                    alertify.success('Save customer feedback successfully');
                },
                error: function (error) {
                    alertify.error('An error occurs, please try again later!');
                    console.log(error);
                }
            })
        }

    })
}

//Lấy số liệu thống kê (bệnh nhân, bác sĩ, bài viết, người xuất sắc) theo tháng 
//→ Cập nhật lên giao diện.
function statisticalAdmin(month) {
    $.ajax({
        method: "POST",
        url: `${window.location.origin}/admin/statistical`,
        data: { month: month },
        success: function (data) {

            $('#sumPatient').text(data.patients.count);
            $('#sumDoctor').text(data.doctors.count);
            $('#sumPost').text(data.posts.count);

            if (data.bestDoctor === '') {
                $('#bestDoctor').text(`No information`);
            } else {
                $('#bestDoctor').text(`${data.bestDoctor.name} (${data.bestDoctor.count})`);
            }
            if (data.bestSupporter === '') {
                $('#bestSupporter').text(`No information`);
            } else {
                $('#bestSupporter').text(`${data.bestSupporter.name} (${data.bestSupporter.count})`);
            }
        },
        error: function (error) {
            alertify.error('An error occurred while getting statistical information, please try again later');
            console.log(error);
        }
    })
}

//Khi admin chọn tháng 
//→ Gọi lại statisticalAdmin() để xem thống kê theo tháng đó.
function handleFindStatisticalAdmin() {
    $('#findStatisticalAdmin').on('click', function () {
        statisticalAdmin($('#monthAnalyse').val())
    })
}

function deleteSchedule() {
    $('.btn-delete-schedule').click(function (e) {
        e.preventDefault();
        const date = $(this).data('date');
        const doctorId = $(this).data('doctorid');

        if (confirm('Bạn có chắc chắn muốn xóa kế hoạch này không?')) {
            $.ajax({
                url: '/doctor/manage/schedule/delete',
                method: 'POST',
                data: { date, doctorId },
                success: function (response) {
                    alertify.success('Xóa thành công!');
                    location.reload(); // hoặc remove dòng khỏi DOM nếu muốn nhẹ hơn
                },
                error: function (err) {
                    alertify.error('Xóa thất bại, vui lòng thử lại!');
                    console.error(err);
                }
            });
        }
    });
}

$(document).ready(function (e) {
    // $('.modal').on('hidden.bs.modal', function(e) {
    //     $(this).removeData();
    // });

    let markdownIntroClinic = new SimpleMDE({
        element: document.getElementById("intro-clinic"),
        placeholder: 'Nội dung giới thiệu...',
        spellChecker: false
    });
    let markdownIntroSpecialization = new SimpleMDE({
        element: document.getElementById("intro-specialization"),
        placeholder: 'Nội dung giới thiệu...',
        spellChecker: false
    });
    let markdownPost = new SimpleMDE({
        element: document.getElementById("contentMarkdown"),
        placeholder: 'Nội dung bài viết...',
        spellChecker: false
    });
    let converter = new showdown.Converter();
    //create datepicker, doctor create schedule
    $('#datepicker').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });
    $('#datepicker').datepicker("setDate", new Date());

    //create datepicker, doctor-appointment
    $('#dateDoctorAppointment').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });

    loadFile(e);
    loadImageUserSetting(e);
    createNewClinic(markdownIntroClinic, converter);
    createNewSpecialization(markdownIntroSpecialization, converter);
    deleteClinicById();
    updateClinic(markdownIntroClinic, converter);
    updateSpecialization(markdownIntroSpecialization, converter);
    showModalInfoClinic();
    showModalInfoSpecialization();
    showModalSettingUser();
    createNewDoctor();
    deleteDoctorById();
    deleteSupporterById();
    showModalInfoDoctor();
    showModalInfoSupporter();
    updateDoctor();
    updateSupporter();
    updateUser();
    updatePasswordUser();
    deleteSpecializationById();
    showPostsForSupporter();
    deletePostById();
    deleteSchedule();
    createNewPost(markdownPost, converter);
    updatePost(markdownPost, converter);

    let arr = handleBtnSchedule();
    createScheduleByDoctor(arr);
    let currentDate = $("#datepicker").val();
    handleChangeDatePicker(currentDate);
    loadNewPatientsForSupporter();
    handleBtnNewPatientOk();
    handleBtnNewPatientCancel();
    handleBtnPendingPatient();
    handleBtnPendingCancel();
    resetModal();
    handleAfterCallingPatient();
    handleViewInfoPatientBooked();
    handleCancelBtn();
    handleBtnViewHistory();

    handleDoctorViewInfoPatient();
    showModalSendForms();
    handleSendFormsForPatient();
    doneComment();

    let month = new Date().getMonth();
    statisticalAdmin(month + 1);
    handleFindStatisticalAdmin();
});

