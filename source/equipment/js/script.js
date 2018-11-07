$(document).ready(function () {
    $('.tabs').tabs();
    $('.modal').modal();
    $('.collapsible').collapsible();
    M.AutoInit();

    var roomTitle = "",
        roomId = 0,
        itemID = "";

    // 選擇院別
    window.onhashchange = function () {
        // console.log(location.hash);
        var hash = location.hash.replace("#", "");
        switch (hash) {
            case 'm':
            case 'h':
            case 't':
            case 'e':
                renderRoomSelect(hash);
                break;
        }
        location.hash = "";
    }

    function renderRoomSelect(type) {
        let college = {
            m: "管理學院",
            h: "人文學院",
            t: "科技學院",
            e: "教育學院"
        };
        $('#calendar').fullCalendar('removeEventSources');
        roomTitle = college[type];
        $("#header-text").html(`${roomTitle[0]}院`);
        classRoomTemplate(roomTitle[0]);
    }

    // 選取教室時觸發
    $('#room-selection').change(function () {
        if (!isNaN(this.value) && this.value != "") {
            $('#calendar').fullCalendar('removeEventSources');
            console.log(this.value);
            roomId = this.value;
            // getEvents();
            $("#header-text").html(`${roomTitle[0]}院-${roomId}`);
            itemTemplate();
        } else {
            $("#header-text").html(`物品借閱`);
        }
    });

    // 選取物品時觸發
    $('#item-selection').change(function () {
        if (this.value != "") {
            $('#calendar').fullCalendar('removeEventSources');
            console.log(this.value);
            itemID = this.value;
            getEvents();
            $("#header-text").html(`${itemID}`);
        } else {
            $("#header-text").html(`物品借閱`);
        }
    });

    function getEvents() {
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/item/reservation/${roomTitle}/${roomId}/${itemID}`,
            type: 'GET',
            error: function (xhr) {
                alert('查無物品');
            },
            success: function (res) {
                console.log(res);
                var eventData = [];
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        for (const inner_key in res[key]) {
                            if (res[key].hasOwnProperty(inner_key)) {
                                if (res[key][inner_key].state == "未核准") {
                                    if (res[key][inner_key].studentID == getCookie("key")) {
                                        res[key][inner_key].color = "orange";
                                    } else {
                                        res[key][inner_key].color = "red";
                                    }
                                } else {
                                    if (res[key][inner_key].studentID == getCookie("key")) {
                                        res[key][inner_key].color = "#5DB0B7";
                                    }
                                }
                                res[key][inner_key].start = new Date(res[key][inner_key].start);
                                res[key][inner_key].end = new Date(res[key][inner_key].end);
                                eventData.push(res[key][inner_key]);
                            }
                        }
                    }
                }
                console.log(eventData);
                $('#calendar').fullCalendar('addEventSource', eventData);
            }
        });
    }

    function classRoomTemplate(tag) {
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/item/reservation/${roomTitle}`,
            type: 'GET',
            error: function (xhr) {
                alert('查無教室');
            },
            success: function (res) {
                // console.log(res);
                let str = `<option value="" disabled selected>Choose your option</option>`;
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        str += `<option value="${key}">${tag} ${key}</option>`;
                    }
                }
                $("#room-selection").html(str);
            }
        });
    }

    function itemTemplate() {
        $.ajax({
            url: `https://xn--pss23c41retm.tw/api/item/${roomTitle}/${roomId}`,
            type: 'GET',
            error: function (xhr) {
                alert('查無教室');
            },
            success: function (res) {
                let str = `<option value="" disabled selected>Choose your option</option>`;
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        str += `<option value="${key}">${res[key].itemName}</option>`;
                    }
                }
                $("#item-selection").html(str);
            }
        });
    }

    $("#form-btn").click(renderForm);

    function renderForm(e) {
        e.preventDefault();
        let alertText = "";
        if (roomId == 0 || roomTitle == "" || itemID == "") {
            alertText = `<h4 class="center-align" style="font-family:'微軟正黑體';">請選擇院別/教室!</h4>`;
            $(".modal-footer").html(`
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>`);
        } else {
            alertText = `
            <div style="padding-bottom:10px">
                <span style="font-size:26px;font-family:'微軟正黑體';">借閱資訊</span>
            </div>
            <div class="chip">
                ${roomTitle[0]}${roomId} - ${itemID}
            </div>
            <input type="text" id="start-date" class="datepicker" placeholder="Start-Date">
            <input type="text" id="start-time" class="timepicker" placeholder="Start-Time">
            <input type="text" id="end-time" class="timepicker" placeholder="End-Time">
            <div class="input-field">
                <input type="text" id="title" name="title">
                <label for="title">Description</label>
            </div>
            `;
            $(".modal-footer").html(`
            <div class="modalbtn">
            <a href="#!" class="modal-close waves-effect btn-flat">Cancel</a>
            <button id="subBtn" class="btn waves-effect">
            Send</button>`);
        }
        $("#reserve-form").html(alertText);
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            container: '.wrapper',
            autoClose: true,
            format: 'yyyy-mm-dd',
            showClearBtn: true
        });
        M.Timepicker.init(document.querySelectorAll('.timepicker'), {
            container: '.wrapper',
            autoClose: true,
            twelveHour: false
        });
        M.FormSelect.init(document.querySelectorAll('select'));
        // $('.timepicker').timepicker();
        // 手動開啟 modal
        var instance = M.Modal.getInstance(document.getElementById("modal1"));
        instance.open();
    }

    $(document).on('click', '#subBtn', submitForm);

    function submitForm() {
        var sdate = $("#start-date").val();
        var stime = $("#start-time").val();
        var etime = $("#end-time").val();
        // var userID = $("#studentID").val();
        var des = $("#title").val();
        var eventData = {};
        eventData.itemID = itemID;
        console.log(itemID, sdate, stime, etime, des);
        if (!(/(\d{4})-(\d{2})-(\d{2})/.test(sdate)) || sdate == "") {
            alert("起始日期格式錯誤");
            return;
        } else {
            eventData.start = sdate;
            eventData.end = sdate;
        }
        if (!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(stime))) {
            alert("開始時間格式錯誤");
            return;
        }
        if (!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(etime))) {
            alert("結束時間格式錯誤");
            return;
        }
        if (stime > etime) {
            alert("結束時間小於開始時間");
            return;
        } else {
            eventData.start += `T${stime}:00`;
            eventData.end += `T${etime}:00`;
        }
        if (des == "") {
            alert("請輸入描述");
            return;
        } else {
            eventData.title = des;
        }
        // if (userID == "") {
        //     alert("請輸入學號");
        //     return;
        // } else {
        //     eventData.studentID = userID;
        // }
        eventData.studentID = getCookie("key");
        if (confirm("確定要借閱嗎?")) {
            console.log(eventData);
            eventData.repeat = "none";
            eventData.repeat_end = "none";
            eventData.type = "inside";
            eventData.conflict = false;
            var sta = getCookie("admin") == "true" ? "reservation/admin" : "reservation";
            $.ajax({
                url: `https://xn--pss23c41retm.tw/api/item/${sta}/${roomTitle}/${roomId}`,
                type: 'POST',
                data: eventData,
                error: function (xhr) {
                    alert(xhr.responseJSON.message);
                    console.log(xhr);
                },
                success: function (res) {
                    console.log(res);
                    if (getCookie("admin") == "true") {
                        eventData.color = "#5DB0B7";
                    } else {
                        eventData.color = "orange";
                    }
                    eventData.start = new Date(eventData.start);
                    eventData.end = new Date(eventData.end);
                    $('#calendar').fullCalendar('addEventSource', [eventData]);
                    getData();
                    getClassData();
                }
            });
            var instance = M.Modal.getInstance(document.getElementById("modal1"));
            instance.close();
        }
    }

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
                            str += `<tr>
                            <td>${last_element.itemID}</td>
                            <td>${final_key}</td>
                            <td>${ISOtoLocal(last_element.start)}</td>
                            <td>${ISOtoLocal(last_element.end)}</td>
                            <td>${last_element.title}</td>
                            <td>${last_element.repeat_type ? last_element.repeat_type : ""}</td>
                            <td>${last_element.state}</td>
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
                            console.log(inner_element);
                            str +=
                                `<tr>
                                <td>${key}</td>
                                <td>${inner_key}</td>
                                <td>${final_key}</td>
                                <td>${ISOtoLocal(last_element.start)}</td>
                                <td>${ISOtoLocal(last_element.end)}</td>
                                <td>${last_element.title}</td>
                                <td>${last_element.state}</td>
                                </tr>`;
                        }
                    }
                }
            }
        }
        $(`#classroom-content`).html(str);
    }

    function ISOtoLocal(time) {
        var tmp = new Date(time);
        return `${tmp.getYear()+1900}/${tmp.getMonth()+1}/${tmp.getDate()} ${tmp.getHours()}:${tmp.getMinutes()}`;
    }
});