﻿
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserID = window.localStorage.getItem("UserID");
var companyCode = window.localStorage.getItem("companyCode");
var UserName = window.localStorage.getItem("UserName");
var AWB_Number = localStorage.getItem('AWB_Number');
var HAWB_Number = localStorage.getItem('HAWB_Number');
var SelectedHawbId;
var IGMno;
var strXmlStore;
var locPieces;
var html;
var FromLoc;
var Hawbid;

$(function () {

    if (window.localStorage.getItem("RoleIMPImportQuery") == '0') {
        window.location.href = 'IMP_Dashboard.html';
    }

});

function GetHAWBDetailsForMAWB() {

    var igmList = [];

    $('#divAddTestLocation').empty();

    $('#ddlHAWB').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlHAWB');

    $('#ddlIGM').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlIGM');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo == '') {
        return;
    }

    //if (MAWBNo.length != '11') {
    //    errmsg = "Please enter valid AWB No.";
    //    $.alert(errmsg);
    //    $('#txtAWBNo').val('');
    //    return;
    //}
    var InputXML = '<Root><AWBNumber>' + $('#txtAWBNo').val() + '</AWBNumber><HouseNo></HouseNo><ShipmentId></ShipmentId><IGMNo></IGMNo><CompanyCode>' + companyCode + '</CompanyCode><UserId>' + UserID + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
   // $("#txtAWBNo").blur();
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetEventDetails",
            data: JSON.stringify({ 'InputXML': InputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;                
                $("body").mLoading('hide');
                response = response.d;
                console.log(response);
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {
                    Status = $(this).find('Status').text();
                    StrMessage = $(this).find('StrMessage').text();

                    if (Status == 'E') {
                        $("#spnErrorMSG").text(StrMessage).css('color', 'red');
                        $("#txtAWBNo").val('');
                      //  $("#txtAWBNo").focus();
                        return;
                    } else {
                        $("#spnErrorMSG").text('');
                    }
                });

                $(xmlDoc).find('Table1').each(function () {

                    var HouseNo = $(this).find('HouseNo').text();
                    var IMPAWBROWID = $(this).find('IMPAWBROWID').text();

                    var newOption = $('<option></option>');
                    newOption.val(IMPAWBROWID).text(HouseNo);
                    newOption.appendTo('#ddlHAWB');

                    //var outMsg = $(this).find('OutMsg').text();

                    //if (outMsg != '') {
                    //    //$.alert(outMsg);
                    //    $("#spnErrorMSG").text(outMsg).css('color', 'red');
                    //    return;
                    //}
                    //else {
                    //    $("#spnErrorMSG").text('');
                    //    var HawbNo = $(this).find('HAWBNo').text();
                    //    var HAWBId = $(this).find('HAWBId').text();

                    //    Hawbid = HAWBId;

                    //    if (HawbNo != '') {

                    //        var newOption = $('<option></option>');
                    //        newOption.val(HAWBId).text(HawbNo);
                    //        newOption.appendTo('#ddlHAWB');
                    //    }

                    //    igmList.push($(this).find('IGMNo').text());
                    //}
                });

                //var uniqueIGMs = [];

                //$.each(igmList, function (i, el) {
                //    if ($.inArray(el, uniqueIGMs) === -1) uniqueIGMs.push(el);
                //});

                //var i;
                //for (i = 0; i < uniqueIGMs.length; ++i) {
                //    // do something with `substr[i]`
                //    var newOption = $('<option></option>');
                //    newOption.val(uniqueIGMs[i]).text(uniqueIGMs[i]);
                //    newOption.appendTo('#ddlIGM');
                //}

                $(xmlDoc).find('Table2').each(function () {
                    ShipmentId = $(this).find('ShipmentId').text();
                    IGMNo = $(this).find('IGMNo').text();
                    var newOption = $('<option></option>');
                    newOption.val(ShipmentId).text(IGMNo);
                    newOption.appendTo('#ddlIGM');

                });

            },
            error: function (msg) {
                //debugger;
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
    else if (connectionStatus == "offline") {
        $("body").mLoading('hide');
        $.alert('No Internet Connection!');
    }
    else if (errmsg != "") {
        $("body").mLoading('hide');
        $.alert(errmsg);
    }
    else {
        $("body").mLoading('hide');
    }
}
//function onkeyupAWBNo() {
//    if ($('#txtAWBNo').val().length == 11) {
//        GetHAWBDetailsForMAWB();
//    }
//}
function GetShipmentDetails() {



    //clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmNo = $("#ddlIGM option:selected").text();

    SelectedHawbId = $("#ddlHAWB option:selected").val();
    if ($('#ddlHAWB > option').length > 1) {
        if ($("#ddlHAWB option:selected").val() == '0') {
            $("#spnErrorMSG").text("Please select HAWB No.").css('color', 'red');
            return;
        } else {
            $("#spnErrorMSG").text('');
        }

    } else {
        $("#spnErrorMSG").text('');
    }
    if (SelectedHawbId == '0') {

        SelectedHawbId = Hawbid;

    }

    if (AWBNo == '') {
        //errmsg = "Please enter AWB No.";
        //$.alert(errmsg);
        $("#spnErrorMSG").text("Please enter AWB No.").css('color', 'red');
        return;
    } else {
        $("#spnErrorMSG").text('');
    }

    if (HAWBNo == 'Select') {
        HAWBNo = '';
    }

    if ($('#ddlIGM').val() == '0' && $('#ddlIGM option').length > 1) {
        //errmsg = "Please select IGM</br>";
        //$.alert(errmsg);
        $("#spnErrorMSG").text("Please select IGM No.").css('color', 'red');
        return;
    } else {
        $("#spnErrorMSG").text('');
    }

    if ($("#ddlIGM option:selected").text() == 'Select') {
        $("#spnErrorMSG").text("Please select IGM No.").css('color', 'red');
        return;
    } else {
        $("#spnErrorMSG").text('');
    }

    var InputXML = '<Root><AWBNumber>' + $('#txtAWBNo').val() + '</AWBNumber><HouseNo>' + HAWBNo + '</HouseNo><ShipmentId>' + $('#ddlIGM').val() + '</ShipmentId><IGMNo>' + $("#ddlIGM option:selected").text()+'</IGMNo><CompanyCode>' + companyCode + '</CompanyCode><UserId>' + UserID + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetEventDetails",
            data: JSON.stringify({ 'InputXML': InputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;
                console.log(str);
                strXmlStore = str;
                $('#divAddTestLocation').empty();
                if (str != null && str != "") {

                    $('#divAddTestLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Event</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Date</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>User</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table3').each(function (index) {

                        var event = $(this).find('Eventname').text().toUpperCase();
                        var date = $(this).find('EventDateTime').text().toUpperCase();
                        var user = $(this).find('Username').text().toUpperCase();

                        AddTableLocation(event, date, user);

                    });

                    html += "</tbody></table>";

                    if (locPieces != '0')
                        $('#divAddTestLocation').append(html);
                }
                else {
                    errmsg = 'Shipment does not exists';
                    $.alert(errmsg);
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
    else if (connectionStatus == "offline") {
        $("body").mLoading('hide');
        $.alert('No Internet Connection!');
    }
    else if (errmsg != "") {
        $("body").mLoading('hide');
        $.alert(errmsg);
    }
    else {
        $("body").mLoading('hide');
    }
}

function grtIGMBYHOUSE(hwabrowid) {



    //clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmNo = $("#ddlIGM option:selected").text();

    SelectedHawbId = $("#ddlHAWB option:selected").val();
    //if ($('#ddlHAWB > option').length > 1) {
    //    if ($("#ddlHAWB option:selected").val() == '0') {
    //        $("#spnErrorMSG").text("Please select HAWB No.").css('color', 'red');
    //        return;
    //    } else {
    //        $("#spnErrorMSG").text('');
    //    }

    //} else {
    //    $("#spnErrorMSG").text('');
    //}
    //if (SelectedHawbId == '0') {

    //    SelectedHawbId = Hawbid;

    //}

    if (AWBNo == '') {
        //errmsg = "Please enter AWB No.";
        //$.alert(errmsg);
        $("#spnErrorMSG").text("Please enter AWB No.").css('color', 'red');
        return;
    } else {
        $("#spnErrorMSG").text('');
    }

    if (HAWBNo == 'Select') {
        HAWBNo = '';
    }

    //if ($('#ddlIGM').val() == '0' && $('#ddlIGM option').length > 1) {
    //    //errmsg = "Please select IGM</br>";
    //    //$.alert(errmsg);
    //    $("#spnErrorMSG").text("Please select IGM No.").css('color', 'red');
    //    return;
    //} else {
    //    $("#spnErrorMSG").text('');
    //}

    //if ($("#ddlIGM option:selected").text() == 'Select') {
    //    $("#spnErrorMSG").text("Please select IGM No.").css('color', 'red');
    //    return;
    //} else {
    //    $("#spnErrorMSG").text('');
    //}

    var InputXML = '<Root><AWBNumber>' + $('#txtAWBNo').val() + '</AWBNumber><HouseNo>' + HAWBNo + '</HouseNo><ShipmentId>' + hwabrowid + '</ShipmentId><IGMNo></IGMNo><CompanyCode>' + companyCode + '</CompanyCode><UserId>' + UserID + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetEventDetails",
            data: JSON.stringify({ 'InputXML': InputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;
                console.log(str);
                strXmlStore = str;
                $('#divAddTestLocation').empty();
                if (str != null && str != "") {

                    $('#divAddTestLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Event</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Date</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>User</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table3').each(function (index) {

                        var event = $(this).find('Eventname').text().toUpperCase();
                        var date = $(this).find('EventDateTime').text().toUpperCase();
                        var user = $(this).find('Username').text().toUpperCase();

                        AddTableLocation(event, date, user);

                    });
                    $('#ddlIGM').empty();
                    $(xmlDoc).find('Table2').each(function () {
                        ShipmentId = $(this).find('ShipmentId').text();
                        IGMNo = $(this).find('IGMNo').text();
                        var newOption = $('<option></option>');
                        newOption.val(ShipmentId).text(IGMNo);
                        newOption.appendTo('#ddlIGM');

                    });

                    html += "</tbody></table>";

                    //if (locPieces != '0')
                    //    $('#divAddTestLocation').append(html);
                }
                else {
                    errmsg = 'Shipment does not exists';
                    $.alert(errmsg);
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
    else if (connectionStatus == "offline") {
        $("body").mLoading('hide');
        $.alert('No Internet Connection!');
    }
    else if (errmsg != "") {
        $("body").mLoading('hide');
        $.alert(errmsg);
    }
    else {
        $("body").mLoading('hide');
    }
}

function AddTableLocation(event, date, user) {

    html += "<tr>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + event + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + date + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + user + "</td>";
    html += "</tr>";

}

function clearBeforePopulate() {
    $('#txtAWBNo').val('');
    $('#txtAWBNo').focus();
    $('#ddlHAWB').val('0');
    $('#ddlIGM').val('0');
    $('#txtRcvWt').val('');
    $('#txtLoc').val('');
    $('#spnErrorMSG').text('');
    $('#divAddTestLocation').empty();

}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function alertDismissed() {
}


