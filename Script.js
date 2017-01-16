var idCount = 0;
var rowDisplay = 0;
var rowCount = 0;
var obj = {
    "id": 0,
    "firstname": "",
    "lastname": "",
    "email": "",
    "location": [],
    "phone": "",
    "current_class": 0,
    "address": {
        "communication": "",
        "permanent": ""
    },
    "marks": {
        "english": 0,
        "science": 0,
        "computers": 0,
        "hardware": 0
    }
};
$(document).ready(function () {

    $studentTable = $('#myTable');
    var studentTemplate = $('#myTemplate').html();
    function loadStudentData(data) {
        $studentTable.append(Mustache.render(studentTemplate, data));
    }
    //load data from data.json and save student data to localStorage
    jQuery.ajax({
        "type": "GET",
        "url": "data.json",
        success: function (data) {
            if (data) {
                if (typeof Storage !== 'undefined') {
                    $.each(data, function (i, data) {
                        //console.log(data);
                        loadStudentData(data);
                        //save to localstorage
                        localStorage.setItem(data.id, JSON.stringify(data));
                        idCount++;
                    });
                }
            }
            ($('.data').slice(0, 10)).removeClass('data');
            rowDisplay = 10;
        },
        error: function () {
            alert("Error loading data from data.json!");
        }
    });

    ////drag and drop location template define
    //$drag_drop_location = $('#drag_drop_locationUl');
    //var drag_drop_locationTemplate = $('#drag_drop_location').html();
    //function loadNewLocation(location) {
    //    $drag_drop_location.append(Mustache.render(drag_drop_locationTemplate, location));
    //}
    ////drag and drop location hit enter function
    //$('#drag_drop_location_input').on('keyup', function (e) {
    //    if (e.keyCode == 13 && ($('#drag_drop_location_input').val() !== "")) {
    //        obj = {
    //            "location": $('#drag_drop_location_input').val()
    //        }
    //        $('#drag_drop_location_input').val("");
    //        loadNewLocation(obj);

    //    };
    //});

    ////define dragstart event
    //$(document).on('dragstart', 'a.alocationCls', function (event) {
    //    alert($(this).html());
    //});

    //bind dragstart event to location links
    var a_location = $('.alocation');
    for (var i = 0; i < a_location.length; i++) {
        a_location[i].addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('Text', $(this).html());
        });
    }

    //first prevent all default input area receiving drag event
    var form_input = $('.add_inputCls');
    for (var i = 0; i < form_input.length; i++) {
        form_input[i].addEventListener('dragover', function (event) {
            event.preventDefault();
        });
    }
    //second set only location drop event listener
    $('#new_add_drop_location')[0].addEventListener('drop', function (event) {
        var loc = event.dataTransfer.getData('Text');
        var temp = $(this).val();
        if (temp == "") {
            $(this).val(loc);
        } else {
            var temparr = temp.split(',');
            for (var i = 0; i < temparr.length; i++) {
                if (temparr[i] == loc) {
                    return;
                }
            }
            $(this).val(temp + "," + loc);
        };
    });


    //prevent default link action
    $('a').click(function (event) {
        event.preventDefault();
    });

});


//define btn show detail
$(document).on('click', '#btn_show_more_details', function () {
    $stuMarks = ($(this).parentsUntil('table')).next();
    //hide/unhide marks
    $stuMarks.toggleClass('showDetailCls');
});

//define edit button
$(document).on('click', '#btn_edit', function () {
    //switch data between data field and input field
    $row = $(this).parentsUntil('table');
    $row.children().each(function () {
        $(this).find('span.dataFieldCls').addClass('hideCls');
        $(this).find('input.inputTxtCls').val($(this).find('span.dataFieldCls').html());
        $(this).find('input.inputTxtCls').removeClass('hideCls');
    });
    $nextRow = $row.next();
    ((($nextRow.children()).children()).not('p')).children().each(function () {
        $(this).find('span.dataFieldCls').addClass('hideCls');
        $(this).find('input.inputTxtCls').val($(this).find('span.dataFieldCls').html());
        $(this).find('input.inputTxtCls').removeClass('hideCls');
    });
    //show all button
    $(this).parent().find('input.edit').removeClass('hideCls');
    //hide the edit button
    $(this).addClass('hideCls');
});

//define save button
$(document).on('click', '#btn_save', function () {
    //switch data between data field and input field
    $row = $(this).parentsUntil('table');
    $row.children().each(function () {
        $(this).find('input.inputTxtCls').addClass('hideCls');
        $(this).find('span.dataFieldCls').html($(this).find('input.inputTxtCls').val());
        $(this).find('span.dataFieldCls').removeClass('hideCls');
    });
    $nextRow = $row.next();
    ((($nextRow.children()).children()).not('p')).children().each(function () {
        $(this).find('input.inputTxtCls').addClass('hideCls');
        $(this).find('span.dataFieldCls').html($(this).find('input.inputTxtCls').val());
        $(this).find('span.dataFieldCls').removeClass('hideCls');
    });
    //hide all button
    $(this).parent().find('input.edit').addClass('hideCls');
    //show edit button
    $(this).parent().find('input.edit.btn_editCls').removeClass('hideCls');

    //create a json object and save to localStorage

    obj.id = Number($(this).attr('localKey'));
    obj.firstname = (($row.find('#firstname')).find('span.dataFieldCls')).html();
    obj.lastname = (($row.find('#lastname')).find('span.dataFieldCls')).html();
    obj.email = (($row.find('#email')).find('span.dataFieldCls')).html();
    obj.location = ((($row.find('#location')).find('span.dataFieldCls')).html()).split(',');
    obj.phone = (($row.find('#phone')).find('span.dataFieldCls')).html();
    obj.current_class = Number(((($row.find('#current_class')).find('span.dataFieldCls')).html()).replace("th", ""));
    obj.address.communication = (($row.find('#address_communication')).find('span.dataFieldCls')).html();

    obj.marks.english = Number(($nextRow.find('span#marks_english')).html());
    obj.marks.science = Number(($nextRow.find('span#marks_science')).html());
    obj.marks.computers = Number(($nextRow.find('span#marks_computers')).html());
    obj.marks.hardware = Number(($nextRow.find('span#marks_hardware')).html());

    //console.log(obj);
    localStorage.setItem(obj.id, JSON.stringify(obj));
});

//define cancel button
$(document).on('click', '#btn_cancel', function () {
    $row = $(this).parentsUntil('table');
    $twoRow = $row.add($row.next());
    $twoRow.find('input.inputTxtCls').addClass('hideCls');
    $twoRow.find('span.dataFieldCls').removeClass('hideCls');
    //hide all button
    $(this).parent().find('input.edit').addClass('hideCls');
    //show edit button
    $(this).parent().find('input.edit.btn_editCls').removeClass('hideCls');
});

//define delete button
$(document).on('click', '#btn_delete', function () {
    $row = $(this).parentsUntil('table');
    $twoRow = $row.add($row.next());
    //hide two row of data
    $twoRow.addClass('hideCls');
    //delete local data
    localStorage.removeItem($(this).attr('localKey'));
});

//add new data button
$(document).on('click', '#btn_add_new', function () {
    if (!checkValidation()) {
        alert('Please do not leave blank!');
    } else {

        obj.id = ++idCount;
        obj.firstname = $('#newFirstName').val();
        obj.lastname = $('#newLastName').val();
        obj.email = $('#newEmail').val();
        obj.location = $('#new_add_drop_location').val().split(',');
        obj.phone = $('#newPhone').val();
        obj.current_class = Number($('#newCurrent_class').val());
        obj.address.communication = $('#newCommunicationAddr').val();
        obj.address.permanent = $('#newPermanentAddr').val();
        obj.marks.english = Number($('#newEnglishMark').val());
        obj.marks.science = Number($('#newScienceMark').val());
        obj.marks.computers = Number($('#newComputersMark').val());
        obj.marks.hardware = Number($('#newHardwareMark').val());

        localStorage.setItem(obj.id, JSON.stringify(obj));

        function loadStudentData(data) {
            $('#myTable').append(Mustache.render($('#myTemplate').html(), data));
        }
        loadStudentData(obj);
        alert("New student info saved!");
        clearForm();
    }
});


function checkValidation() {
    var countBlank = 0;
    $.each($('.add_inputCls'), function () {
        if ($(this).val() == "") {
            countBlank++;
        };
    });
    if (countBlank == 0) {
        return true;
    } else {
        return false;
    };
};
function clearForm() {
    $.each($('.add_inputCls'), function () {
        $(this).val("");
    });
};

//display number of table rows
function displayRow(row) {
    $('.student').addClass('data');
    var showCount;
    if (typeof row == 'undefined') {
        showCount = 10;
    } else {
        showCount = row;
    }
    ($('.data').slice(0, showCount)).removeClass('data');
}

//mouse event on select number of rows
var timeout = 500;
var closetimer = 0;
var menuitem = 0;
//mouse over and mouse out to display the drop down menu
$(document).on('mouseover', 'a#show', function () {
    cancelClose();
    $('#hiddenDiv').css('visibility', 'visible');
});

$(document).on('mouseout', 'a#show', function () {
    closeAfter(timeout);
});

$(document).on('mouseover', '#hiddenDiv', function () {
    cancelClose();
});

$(document).on('mouseout', '#hiddenDiv', function () {
    closeAfter(timeout);
})

function cancelClose() {
    window.clearTimeout(closetimer);
    closetimer = null;
};


function mclose() {
    $('#hiddenDiv').css('visibility', 'hidden');
}

function closeAfter(time) {
    closetimer = window.setTimeout(mclose, time);
}

//show 20, 50, 100 rows
$(document).on('click', '#hiddenDiv>a', function () {
    displayRow(Number($(this).html()));
    rowDisplay = Number($(this).html());
});


//window scroll function
$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
        if (rowDisplay < idCount) {
            displayRow(rowDisplay + 5);
            rowDisplay += 5;
        } else {
            alert('No more records');
        }
    }
})








