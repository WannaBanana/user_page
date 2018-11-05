$(document).ready(function () {
  $('.tabs').tabs();
  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.fixed-action-btn').floatingActionButton();

  /* List Select All */
  function eventBind() {
    $(document).change(function () {
      var all = $("#myForm").serializeArray();
      console.log(all);
    });
    $(".checkAll1").click(function () {
      if ($(".checkAll1").prop("checked")) { //如果全選按鈕有被選擇的話（被選擇是true）
        $("input[name='room-checkbox[]']").prop("checked", true); //把所有的核取方框的property都變成勾選
      } else {
        $("input[name='room-checkbox[]']").prop("checked", false); //把所有的核取方框的property都取消勾選
      }
    })
    $(".checkAll2").click(function () {
      if ($(".checkAll2").prop("checked")) { //如果全選按鈕有被選擇的話（被選擇是true）
        $("input[name='item-checkbox[]']").prop("checked", true); //把所有的核取方框的property都變成勾選
      } else {
        $("input[name='item-checkbox[]']").prop("checked", false); //把所有的核取方框的property都取消勾選
      }
    })
  }
  eventBind();

  /* Modify -> Get JSON */
  $.ajax({
    url: `https://暨大猴子.tw/api/user/${getCookie("key")}`,
    type: "GET",
    dataType: "json",
    success: function (data) {
      $('#modify_imagePreview').css('background-image', 'url(' + data.photo + ')');
      $('#modify_name').val(data.name);
      $('#userName').html(data.name);
      $('#modify_department').val(data.department);
      $('#modify_email').val(data.email);
      var allcard = "";
      if (data.card != null) {
        for (var i = 0; i < data.card.length; i++) {
          allcard += data.card[i].cardID + " ";
        }
        $('#modify_cardid').val(allcard);
      }
      $('#modify_cellphone').val(data.cellphone);
      if (data.lineUserID) {
        $("#notify").html(`
          <div class="input-field col l10 offset-l1 m10 offset-m1 s10 offset-s1">
            <input type="text" class="validate" value="${data.lineUserID}" readonly>
            <label class="active red-text" for="modify_email">Please bind the LineBot instantly!</label>
          </div>
        `);
      }
      $("#account").html(`
        <img src="${data.photo}" style="width:110px; border-radius:50%">
      `);
    },
    error: function () {
      alert("ERROR!!!");
    }
  })

  /* Upload Image */
  var base64photo;

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        base64photo = e.target.result;
        $('#modify_imagePreview').css('background-image', 'url(' + e.target.result + ')');
        $('#modify_imagePrevieww').hide();
        $('#modify_imagePreview').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#modify_imageUpload").change(function () {
    readURL(this);
  })

  // 修改
  $("#submitmodify").click(function (e) {
    e.preventDefault();
    if ($("#modify_password").val() != "" && $("#modify_password").val() != $("#modify_cpassword").val()) {
      alert("新密碼兩次輸入不一致");
      return;
    }
    $.ajax({
      asyn: true,
      crossDomain: true,
      type: 'PATCH',
      url: `https://暨大猴子.tw/api/register/${getCookie("key")}`,
      data: JSON.stringify({
        "photo": base64photo,
        "name": $("#modify_name").val(),
        "email": $("#modify_email").val(),
        "password": $("#before_password").val(),
        "newpassword": $("#modify_password").val() != "" ? $("#modify_password").val() : "",
        "cellphone": $("#modify_cellphone").val()
      }),
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      },
      success: function (data) {
        console.log(data);
        alert("修改成功");
        location.reload();
      },
      error: function (data) {
        // console.log(data.password);
        alert(data.responseJSON.message);
      }
    });
  });

  $("#logoutBtn").click(function (e) {
    e.preventDefault();
    logout();
  });


  // Get Personal Item Borrowing Record 
  function getData() {
    $.ajax({
      url: `https://xn--pss23c41retm.tw/api/item/reservation`,
      type: "GET",
      success: function (result) {
        console.log(result);
        render(result);
      },
      error: function (error) {
        console.log("error:", error);
        $(`#itemrecord`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
      }
    });
  }
  getData();

  function render(result) {
    var str = "";
    for (const key in result) {
      const element = result[key];
      console.log(element); // 441
      for (const inner_key in element) {
        const inner_element = element[inner_key];
        console.log(inner_element);
        for (const final_key in inner_element) {
          const final_element = inner_element[final_key];
          for (const last_key in final_element) {
            var last_element = final_element[last_key];
            if (last_element.studentID == getCookie("key")) {
              var start = last_element.start.replace(final_key, "").replace("T", "").replace(".000Z", "");
              var end = last_element.end.replace(final_key, "").replace("T", "").replace(".000Z", "");
              str +=
                `<tr>
                <td>${last_element.itemID}</td>
                <td>${final_key}</td>
                <td id="${last_key}StartTime">${start}</td>
                <td id="${last_key}EndTime">${end}</td>
                <td id="${last_key}Title">${last_element.title}</td>
                <td id="${last_key}Repeat">${last_element.repeat_type ? last_element.repeat_type : ""}</td>
                <td id="${last_key}State">${last_element.state}</td>
              </tr>`;
            }
          }
        }
      }
    }
    $(`#itemrecord-content`).html(str);
  }

  // Get Personal Class Reservation Record 
  function getClassData() {
    $.ajax({
      url: `https://xn--pss23c41retm.tw/api/reservation`,
      type: "GET",
      success: function (result) {
        console.log(result);
        classRender(result);
      },
      error: function (error) {
        console.log("error:", error);
        $(`#classroom-content`).html(`<h4 class="red-text text-darken-2">伺服器發生錯誤，請稍後再試</h4>`);
      }
    });
  }
  getClassData();

  function classRender(result) {
    var str = "";
    for (const key in result) {
      const element = result[key];
      console.log(element); // 441
      for (const inner_key in element) {
        const inner_element = element[inner_key];
        console.log(inner_key);
        console.log(inner_element);
        for (const final_key in inner_element) {
          const final_element = inner_element[final_key];
          for (const last_key in final_element) {
            var last_element = final_element[last_key];
            if (last_element.name == getCookie("key")) {
              var start = last_element.start.replace(final_key, "").replace("T", "").replace(".000Z", "");
              var end = last_element.end.replace(final_key, "").replace("T", "").replace(".000Z", "");
              console.log(inner_element);
              str +=
                `<tr>
                <td>${key}</td>
                <td>${inner_key}</td>
                <td>${final_key}</td>
                <td id="${last_key}StartTime">${start}</td>
                <td id="${last_key}EndTime">${end}</td>
                <td id="${last_key}Title">${last_element.title}</td>
                <td id="${last_key}State">${last_element.state}</td>
              </tr>`;
            }
          }
        }
      }
    }
    $(`#classroom-content`).html(str);
  }


});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'top',
    hoverEnabled: false
  });
});