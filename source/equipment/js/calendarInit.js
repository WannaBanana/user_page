$(document).ready(function () {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        nowIndicator: true,
        // height: 650,
        // contentHeight: 600,
        handleWindowResize: false, // 拖曳瀏覽器視窗時，是否動態調整大小
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectHelper: true,
        select: function (start, end) {
            $("#form-btn").click();
            // var title = prompt('Event Title:');
            // var eventData;
            // if (title) {
            //     eventData = {
            //         title: title,
            //         start: start,
            //         end: end
            //     };
            //     // 將新排成加到日曆上
            //     $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            // }
            // $('#calendar').fullCalendar('unselect');

            // 取出所有排成
            // var all = $("#calendar").fullCalendar('clientEvents')

            // 取出所有事件源(動態增加的不算)
            // var test = $('#calendar').fullCalendar('getEventSources');

            // 刪除所有事件源
            // $('#calendar').fullCalendar('removeEventSources');

            // 添加事件到事件源，因為 renderEvent 不會列入事件源
            // $('#calendar').fullCalendar('addEventSource', [{start: "2018-09-10", title: "資管系"}]);
        },
        eventClick: function (event, element) {

            // console.log(event, element);

            // event.title = "CLICKED!";

            // 重新 render 某個排成
            // $('#calendar').fullCalendar('updateEvent', event);

            // 重新 render 多個事件
            // .fullCalendar('updateEvents', events)

            // 刪除排成
            // $('#calendar').fullCalendar('removeEvents', event._id);

        },
        // 排成拖動到新時間觸發
        eventDrop: function (event, delta, revertFunc) {

            alert(event.title + " was dropped on " + event.start.format());

            if (!confirm("Are you sure about this change?")) {
                revertFunc();
            }

        },
        // 調整排成時間觸發
        eventResize: function (event, delta, revertFunc) {

            alert(event.title + " end is now " + event.end.format());

            if (!confirm("is this okay?")) {
                revertFunc();
            }

        },
        editable: true, // allow the time of event can be changed
        eventLimit: true, // allow "more" link when too many events
        // events: [{
        //         title: '觀餐系',
        //         start: '2018-09-01'
        //     },
        //     {
        //         title: '資管系',
        //         start: '2018-09-02',
        //         end: '2018-09-05'
        //     },
        //     {
        //         title: '經濟系',
        //         start: '2018-09-09T16:00',
        //         end: '2018-09-09T18:00'
        //     },
        //     {
        //         title: '國企系',
        //         start: '2018-09-09T09:00:00',
        //         end: '2018-09-09T12:00:00'
        //     },
        //     {
        //         title: 'Conference',
        //         start: '2018-03-11',
        //         end: '2018-03-13'
        //     },
        //     {
        //         title: 'Meeting',
        //         start: '2018-03-12T10:30:00',
        //         end: '2018-03-12T12:30:00'
        //     },
        //     {
        //         title: 'Lunch',
        //         start: '2018-03-12T12:00:00'
        //     },
        //     {
        //         title: 'Meeting',
        //         start: '2018-03-12T14:30:00'
        //     },
        //     {
        //         title: 'Happy Hour',
        //         start: '2018-03-12T17:30:00'
        //     },
        //     {
        //         title: 'Dinner',
        //         start: '2018-03-12T20:00:00'
        //     },
        //     {
        //         title: 'Birthday Party',
        //         start: '2018-03-13T07:00:00'
        //     },
        //     {
        //         title: 'Click for Google',
        //         url: 'http://google.com/',
        //         start: '2018-03-28'
        //     }
        // ],

        // 透過函數取得
        // events: function (start, end, timezone, callback) {
            // $.ajax({
            //     ...
            //     success: function (doc) {
            //         var events = [];
            //         $(doc).find('event').each(function () {
            //             events.push({
            //                 title: $(this).attr('title'),
            //                 start: $(this).attr('start') // will be parsed
            //             });
            //         });
            //         callback(events);
            //     }
            // });
            // callback([{start: "2018-09-09", title: "財金系"}]);
        // }
    });

});