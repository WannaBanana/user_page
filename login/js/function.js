$(document).ready(function () {
  /* Login In Form Modal */
  $('.modal').modal();

  var base64image;
  /* Upload Image */
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
        base64image = e.target.result;
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#register_imageUpload").change(function () {
    readURL(this);
  });

  // 註冊
  $("#submitregister").click(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'https://xn--pss23c41retm.tw/api/register',
      data: {
        "photo": base64image,
        "first_name": $("#register_firstname").val(),
        "last_name": $("#register_lastname").val(),
        "email": $("#register_email").val(),
        "password": $("#register_password").val(),
        "student_id": $("#register_stuid").val(),
        "cellphone": $("#register_cellphone").val()
      },
      cache: false,
      dataType: 'json',
      success: function (data) {
        console.log(data);
      },
      error: function (data) {
        alert(data.responseJSON.message);
      }
    });
  });

  // 登入
  $("#signin_btn").click(function (e) {
    e.preventDefault();
    if ($("#signin_account").val() != "" && $("#signin_password").val() != "") {
      $.ajax({
        type: 'POST',
        url: `https://xn--pss23c41retm.tw/api/user/${$("#signin_account").val()}`,
        data: {
          password: $("#signin_password").val()
        },
        success: function (result) {
          console.log(result);
          if (result) {
            setCookie("key", $("#signin_account").val(), 6);
            setCookie("value", sha256($("#signin_account").val() + s), 6);
            setCookie("admin", result.admin, 6);
            setCookie("space", result.space ?JSON.stringify(result.space):"", 6);
            window.location.href = './index.html';
            console.log("驗證完成");
          }
        },
        error: function (error) {
          console.log(error);
          alert("帳號或密碼錯誤");
        }
      });
    } else {
      alert("帳號密碼不得為空");
    }
  });


});