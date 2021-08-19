$(document).ready(function () {
    var numberings = [];
    var gameMasterData = [];
    var gameMasterColors = [];
    var gameLiveNumberStack = [];
    var gameStartCalledNumbers = [];
    var userGamesList = [];
    var boogieTicketsSelected = [];


    var chkAudio = true;
    var numberExhausted = false;

    var isPaused = false;
    var autoCallsSet = true;  //true if auto & false if manual
    var manualEnterKeyPress = false;
    var manualInputNumberEnterKeyPress = false;
    var startBtnClicked = false;



    var initAPIs = {};
    var userGameMst = {};
    var selectedGameForPlay = {};

    var setIntervalVal = "";
    var userID = "";
    var language = "en";
    var JBuserID = "";
    var ClubName = "";
    var EmailID = "";
    var IsAdmin = "";
    var Name = "";
    var Token = "";
    var ticketsInPlay = "";
    var selectedGameID = "";
    var insideSelectedVerifyTicketVal = "";

    var time = 5000;

    var soldFrom = 0;
    var soldTo = 0;
    var bookletPrice = 0;
    var totalTicketsSold = 0;
    var totalPrice = 0;
    var totalRevenue = 0;
    var totalGain = 0;
    var promptDisableMsg = 0;



    initiateAPI();

    function performAllFunctions() {
        chkIfUserLoggedIn();
        initializeElements();
        initialHidden();
        getMasterColors();
        loadInitialblankTicketDesign();
        getAllLanguages();
        fillTicketInPlayNewSetupDropdown();
        getUsersList();

    }



    function initiateAPI() {
        var url = "media/initAPI.json";
        $.ajax({
            type: 'GET',
            url: url,
            success: function (json) {
                initAPIs = json;
                performAllFunctions();
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });
    }


    function chkIfUserLoggedIn() {
        JBuserID = getCookie("JBuserID");
        ClubName = getCookie("ClubName");
        EmailID = getCookie("EmailID");
        IsAdmin = getCookie("IsAdmin");
        Name = getCookie("Name");
        Token = getCookie("Token");
        if (JBuserID == null || JBuserID == "") {

        } else {
            getUserGameList();
            getNumberings();
            var html = "<div><div class='row'><div class='col'><h3>Hi <span class='red-text'><b>" + Name + "</b></span>!</h3> <a href='dashboard' style='font-size:1.4rem;'> <span class='black-text'>Go to</span> <u>Dashboard</u></a></div></div></div>";
            $("#hide-when-logged-in").html(html);
            try {
                document.getElementById("dashboard-name-display").innerText = Name;
                document.getElementById("dashboard-email-display").innerText = EmailID;
            } catch (ex) { }

            // document.getElementById("dashboard-club-name").innerText = ClubName;
            $(".user-clubName").text(ClubName);

            console.log("IsAdmin > ", IsAdmin);
            if (IsAdmin == "true" || IsAdmin == true) {
                $("#admin-manage").show();
            } else {
                $("#admin-manage").hide();
            }

        }
    }

    function checkedIfUserLoggedIn() {
        JBuserID = getCookie("JBuserID");
        ClubName = getCookie("ClubName");
        EmailID = getCookie("EmailID");
        IsAdmin = getCookie("IsAdmin");
        Name = getCookie("Name");
        Token = getCookie("Token");
        if (Token == "" || Token == null) {
            var url = document.URL;
            var pathname = window.location.pathname;
            window.location.replace("/");
            // if (pathname == "views" || pathname == "views") {

            // } else {
            //     window.location.replace("");
            // }
        } else {
            getUserGameList();
            getNumberings();
            var pathname = window.location.pathname;
            if (pathname == "/" || pathname == "/") {
                var html = "<div><div class='row'><div class='col'><h3>Hi <span class='red-text'><b>" + Name + "</b></span>!</h3> <a href='dashboard' style='font-size:1.4rem;'> <span class='black-text'>Go to</span> <u>Dashboard</u></a></div></div></div>";
                $("#hide-when-logged-in").html(html);
            } else {
                document.getElementById("dashboard-name-display").innerText = Name;
                document.getElementById("dashboard-email-display").innerText = EmailID;
                // document.getElementById("dashboard-club-name").innerText = ClubName;
                $(".user-clubName").text(ClubName);

                console.log("IsAdmin > ", IsAdmin);
                if (IsAdmin == "true" || IsAdmin == true) {
                    $("#admin-manage").show();
                } else {
                    $("#admin-manage").hide();
                }
            }
        }

    }

    function performLogOutProcess() {
        setCookie("JBuserID", "", -1);
        setCookie("ClubName", "", -1);
        setCookie("EmailID", "", -1);
        setCookie("IsAdmin", "", -1);
        setCookie("LoggedExpiryTime", "", -1);
        setCookie("LoggedInDate", "", -1);
        setCookie("LoggedInTime", "", -1);
        setCookie("Name", "", -1);
        setCookie("Token", "", -1);
        window.location.replace("/");
    }

    function generateToken(UID) {
        var token = md5(UID);
        return token
    }

    function sendToken(json) {
        var url = "";
        $.ajax({
            type: 'POST',
            url: url,
            data: json,
            success: function (json) {

            },
            error: function (parsedjson, textStatus, errorThrown) {
                //  toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });
    }

    function preSetLanguageElements() {
        console.log("language > ", language);
        var e = document.getElementById("game-voice-language");
        for (i = 0; i < e.options.length; i++) {
            console.log(" option > ", e.options[i]);
            console.log("Found option.value > ", e.options[i].value);
            console.log("Found option.language > ", language);
            if (e.options[i].value == language) {
                e.options[i].selected = true;
                break;
            }
        }
    }

    function getMasterColors() {
        var url = (initAPIs.domain + initAPIs.ColorList).toString();
        $.ajax({
            type: 'POST',
            url: url,
            success: function (json) {
                gameMasterColors = json;
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });
    }

    function getNumberings() {
        var url = (initAPIs.domain + initAPIs.UserNumbers).toString();
        userID = getCookie("JBuserID");
        var D = {
            "UID": userID
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: D,
            success: function (json) {
                numberings = json;
                setNumberingsDisplay(numberings);
                setAllNumbersDisplay(numberings);
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
                // console.log("parsedjson > ", parsedjson);
                // console.log("textStatus > ", textStatus);
                // console.log("errorThrown > ", errorThrown);
                var numberingsColmns = "<div class='col s12'><h6 class='center-align red-text'>Pls check later...</h6></div>";
                $("#numberings").html(numberingsColmns);
            }
        });
    }

    function loadInitialblankTicketDesign() {
        $.get("blankTicket", function (data, status) {
            $("#current-ticket-display-div").html(data);
            $("#verify-ticket-blank-display-div").html(data);//loading in very ticket modal
            $("#current-ticket-display-div").show();
        });
    }

    function getAllLanguages() {
        $.get("media/ISOLanguages.json", function (data, status) {
            $.each(data, function (key, value) {
                var TEXT = value.name + "(" + value.nativeName + ")";
                $('#game-voice-language')
                    .append($("<option></option>")
                        .attr("value", key)
                        .attr("role", key)
                        .text(TEXT));
            });
        });
    }

    function setNumberingsDisplay(numberings) {
        var numberingsColmns = "";
        if (numberings.length > 0) {
            for (var i = 0; i < numberings.length; i++) {
                var nc = "";
                if (i > 5) {
                    if (numberings[i]["ID"] < 10) {
                        nc = "<div id='col_" + i + "' class='col s2 no-margin'><div class='input-field inline '><span class='no-id-bold'>" + numberings[i]["ID"] + "&nbsp;&nbsp;</span><input id='no_" + numberings[i]["ID"] + "' role='" + numberings[i]["ID"] + "' type='text' class='validate numbers_text no-text-box active' value='" + numberings[i]["Numbers"] + "'></div></div>";
                    } else {
                        nc = "<div id='col_" + i + "' class='col s2 no-margin'><div class='input-field inline '><span class='no-id-bold'>" + numberings[i]["ID"] + "</span><input id='no_" + numberings[i]["ID"] + "' role='" + numberings[i]["ID"] + "' type='text' class='validate numbers_text no-text-box active' value='" + numberings[i]["Numbers"] + "'></div></div>";
                    }
                } else {
                    if (numberings[i]["ID"] < 10) {
                        nc = "<div id='col_" + i + "' class='col s2'><div class='input-field inline'><span class='no-id-bold'>" + numberings[i]["ID"] + "&nbsp;&nbsp;</span><input id='no_" + numberings[i]["ID"] + "' role='" + numberings[i]["ID"] + "' type='text' class='validate numbers_text  no-text-box active' value='" + numberings[i]["Numbers"] + "'>  </div></div>";
                    } else {

                        nc = "<div id='col_" + i + "' class='col s2'><div class='input-field inline'><span class='no-id-bold'>" + numberings[i]["ID"] + "</span><input id='no_" + numberings[i]["ID"] + "' role='" + numberings[i]["ID"] + "' type='text' class='validate numbers_text  no-text-box active' value='" + numberings[i]["Numbers"] + "'>  </div></div>";
                    }
                }
                numberingsColmns = numberingsColmns + nc;
            }
        } else {
            numberingsColmns = "<div class='col s12'><h6 class='center-align red-text'>Pls check later...</h6></div>";
        }
        $("#numberings").html(numberingsColmns);
    }

    //For Game Play Display window
    function setAllNumbersDisplay(numberings) {
        var numbersHTML = "";
        var c = 1;
        $.each(numberings, function (key, value) {
            var n = "";
            n = "<div class='col s1'><a id='call_number_" + value.ID + "' class='btn-floating btn-small teal lighten-2 round-btn-numberings all-number-initial-pointer'>" + value.ID + "</a></div>";
            numbersHTML = numbersHTML + n;
        });
        $(".all-numbers-display").html(numbersHTML);
    }

    function initializeElements() {
        $('.modal').modal({
            dismissible: false,
            opacity: 0.9
        });
        $('.sidenav').sidenav();
        $('.collapsible').collapsible();
        $('.datepicker').datepicker({
            format: "dd-mm-yyyy",
            setDefaultDate: true,
            defaultDate: new Date(),
        });
    }
    function initialHidden() {
        $(".setup_type").hide();
        $("#new_save_btn").hide();
        $("#loading-div").hide();
        $("#numbering-modal-preloader").hide();
        $("#verify-wait").hide();
        $("#reg-email-accept-icon").hide();
        $("#reg-email-reject-icon").hide();
        $("#user-list-preloader").hide();
        $("#new-game-note").hide();
        $("#show-ticket-no").hide();

        $("#edit_setup_btn_grp").hide();
        $("#edit-btn-action-loader").hide();
        $("#new-btn-action-loader").hide();
        $("#play-btn-from-select-game").attr("disabled", true);
        if (manualEnterKeyPress == true || autoCallsSet == true) {
            $("#game-manual-enter-number-display").hide();
        }
        // $("#gameScreen-game-select").prop("disabled", true);
    }

    function fillTicketInPlayNewSetupDropdown() {
        $('#new_game_ticket_in_play').children().remove();
        $('#new_game_ticket_in_play')
            .append($("<option></option>")
                .attr("value", '')
                .attr("disabled", "disabled")
                .attr("selected", 'selected')
                .text("Ticket In Play"));
        var url = (initAPIs.domain + initAPIs.GetAllTktTypes).toString();

        $.ajax({
            type: 'POST',
            url: url,
            success: function (json) {
                ticketsInPlay = json;
                $.each(ticketsInPlay, function (key, value) {
                    $('#new_game_ticket_in_play')
                        .append($("<option></option>")
                            .attr("value", value.TktType)
                            .attr("role", value.TktID)
                            .text(value.TktType));
                });
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });
    }

    function getGamesTypeDetails(ticket_in_play_selected) {
        var url = (initAPIs.domain + initAPIs.GetTicketTypeDetails).toString();
        var ticketsInPlay = "";
        var games = [];
        $.ajax({
            type: 'POST',
            url: url,
            data: { "TktTypeID": ticket_in_play_selected.id },
            success: function (json) {
                console.log("populateTableListAsPerSelectedTicket : json > ", json);
                games = json;
                setTableDisplay1(games);
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });
    };


    function setTableDisplay1(games) {
        $("#new_setup_table tbody").empty();
        for (let i = 0; i < games.length; i++) {
            var ID = games[i].GameID;
            var GAME_NAME = games[i].Game;
            var C = {
                "id": games[i].ColorID,
                "name": games[i].Color
            };
            console.log("C > ", C);


            var options = getOptions(C);
            console.log("options > ", options);

            var tr = "<tr>" +
                "<td> <input id='game_id_" + i + "' role='" + ID + "' type='hidden' value='" + GAME_NAME + "'/> " + GAME_NAME + " </td>" +
                "<td>" +
                "<div class='input-field  col s12'><select id='game_color_" + i + "' class='browser-default game_color' role='" + ID + "' > " +
                options
                + " </select></div>"
                + "</td>" +
                "<td>" +
                "<label><input id='oneLine_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='oneLine'/><span>&nbsp;</span></label><input id='oneLine_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='0.00' style='width:50%' name='oneLine_" + ID + "' disabled> "
                + "</td>" +
                "<td>" +
                "<label><input id='twoLine_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='twoLine'/><span>&nbsp;</span></label><input id='twoLine_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='0.00' style='width:50%' name='twoLine_" + ID + "' disabled>"
                + "</td>" +
                "<td>" +
                "<label><input id='fullHouse_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='fullHouse'/><span>&nbsp;</span></label><input id='fullHouse_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='0.00' style='width:50%' name='fullHouse_" + ID + "' disabled>   "
                + "</td>" +
                "<td>" +
                "<label><input id='corner_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='corner'/><span>&nbsp;</span></label><input id='corner_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='0.00' style='width:50%' name='corner_" + ID + "' disabled>   "
                + "</td>" +
                +"</tr>";
            $("#new_setup_table tbody").append(tr);

        }
    }

    function populateTableListAsPerSelectedTicket(ticket_in_play_selected) {
        var index = 0;
        var ticketGameList = {};
        var games = [];

        games = getGamesTypeDetails(ticket_in_play_selected);


    }

    function getOptions(color) {
        var options = "";
        $.each(gameMasterColors, function (key, value) {
            var o = "";
            if (color.id == value["ColorID"]) {
                o = "<option value='" + value["Colors"] + "' role='" + value["ColorID"] + "' selected>" + value["Colors"] + "</option>";
            } else {
                o = "<option value='" + value["Colors"] + "' role='" + value["ColorID"] + "'>" + value["Colors"] + "</option>";
            }
            options = options + o;
        });


        return options;
    }

    function getOptionsNameForDisplay(color) {
        var colorName = "";
        $.each(gameMasterColors, function (key, value) {
            if (color.id == value["ColorID"]) {
                colorName = value["Colors"];

            }
        });
        return colorName;
    }

    function setNumbersChangedValue(obj) {
        var index = null;
        $.each(numberings, function (key, value) {
            if (value.ID == obj.ID) {
                index = key;
            }
        });
        if (index != null) {
            numberings[index] = obj;
        }

    }


    function displayNumberOnScreen(random) {
        if (random > 9) {
            $(".number-preview-digit").html("<div style='margin-left:20px'>" + random + "</div>");

        } else {
            $(".number-preview-digit").html("<div style='margin-left:50px'>" + random + "</div>");
        }

    }

    function highlightNumberInSeriesDisplay(random) {
        $("#call_number_" + random).removeClass("teal lighten-2");
        $("#call_number_" + random).addClass("red");
    }

    function updateSelectedCallsList() {
        try {
            var first = second = third = 0;
            var len = gameStartCalledNumbers.length;
            if (len > 1) {
                if (len > 0) {
                    first = gameStartCalledNumbers[len - 2];
                }
                if (len > 1) {
                    second = gameStartCalledNumbers[len - 3];
                }
                if (len > 2) {
                    third = gameStartCalledNumbers[len - 4];
                }
            } else { }

            if (first == 0) {
                $("#recent-call").text("");
            } else {
                $("#recent-call").text(first);
            }
            if (second == 0) {
                $("#second-last-call").text("");
            } else {
                $("#second-last-call").text(second);
            }
            if (third == 0) {
                $("#third-last-call").text("");
            } else {
                $("#third-last-call").text(third);
            }



        } catch (ex) { console.log("updateSelectedCallsList | e > ", e); }

    }

    function validateCalledNumbers() {
        if (gameStartCalledNumbers.length == 90) {
            toastMsg("<span class='red-text text-lighten-4'>All Numbers Exhausted!</span>");
            $("#pause-game-btn").attr("disabled", true);
            return false
        } else {


        }
    }

    function dictateNumber(number) {
        $.each(numberings, function (key, value) {
            if (value.ID == number) {
                try {
                    var no_text = value["Numbers"];
                    let sayMyNumber = new SpeechSynthesisUtterance();
                    sayMyNumber.lang = "en-US";
                    sayMyNumber.text = no_text;
                    sayMyNumber.volume = 500;
                    sayMyNumber.rate = 1;
                    sayMyNumber.pitch = 1;
                    window.speechSynthesis.speak(sayMyNumber);
                } catch (ex) {
                    console.log("Exception ex > ", ex);
                }

            }
        });
    }


    function setVerifiedTicket(json, location) {
        console.log("setVerifiedTicket > json > ", json);
        console.log("setVerifiedTicket > location > ", location);
        var html = "";
        if (location == "outside") {
            var tr1 = "<tr>" +
                "<td class='td-width F1' ></td>" +
                "<td class='td-width F2'></td>" +
                "<td class='td-width F3'></td> " +
                "<td class='td-width F4'></td>" +
                "<td class='td-width F5'></td>" +
                "<td class='td-width F6'></td> " +
                "<td class='td-width F7'></td>" +
                "<td class='td-width F8'></td>" +
                "<td class='td-width F9'></td> " +
                "</tr>";
            var tr2 = "<tr>" +
                "<td class='td-width F10'></td>" +
                "<td class='td-width F11'></td>" +
                "<td class='td-width F12'></td> " +
                "<td class='td-width F13'></td>" +
                "<td class='td-width F14'></td>" +
                "<td class='td-width F15'></td> " +
                "<td class='td-width F16'></td>" +
                "<td class='td-width F17'></td>" +
                "<td class='td-width F18'></td> " +
                "</tr>";
            var tr3 = "<tr>" +
                "<td class='td-width F19'></td>" +
                "<td class='td-width F20'></td>" +
                "<td class='td-width F21'></td> " +
                "<td class='td-width F22'></td>" +
                "<td class='td-width F23'></td>" +
                "<td class='td-width F24'></td> " +
                "<td class='td-width F25'></td>" +
                "<td class='td-width F26'></td>" +
                "<td class='td-width F27'></td> " +
                "</tr>";

            html = "<table class='white centered'>" + tr1 + tr2 + tr3 + "</table>";
            var showDiv = false;
            $("#verify-ticket-blank-display-div").html(html);
            showDiv = setTicketValues(json);
            if (showDiv == true) {
                $("#verify-wait").hide();
            }
        }
        if (location == "inSideGame") {
            console.log("inside");
            setEnteredTicketNo();
            disableAllGameBtns();
            showAdminBoogieOrWinnerPrompt();


            var tr1 = "<tr>" +
                "<td class='td-width F1' ></td>" +
                "<td class='td-width F2'></td>" +
                "<td class='td-width F3'></td> " +
                "<td class='td-width F4'></td>" +
                "<td class='td-width F5'></td>" +
                "<td class='td-width F6'></td> " +
                "<td class='td-width F7'></td>" +
                "<td class='td-width F8'></td>" +
                "<td class='td-width F9'></td> " +
                "</tr>";
            var tr2 = "<tr>" +
                "<td class='td-width F10'></td>" +
                "<td class='td-width F11'></td>" +
                "<td class='td-width F12'></td> " +
                "<td class='td-width F13'></td>" +
                "<td class='td-width F14'></td>" +
                "<td class='td-width F15'></td> " +
                "<td class='td-width F16'></td>" +
                "<td class='td-width F17'></td>" +
                "<td class='td-width F18'></td> " +
                "</tr>";
            var tr3 = "<tr>" +
                "<td class='td-width F19'></td>" +
                "<td class='td-width F20'></td>" +
                "<td class='td-width F21'></td> " +
                "<td class='td-width F22'></td>" +
                "<td class='td-width F23'></td>" +
                "<td class='td-width F24'></td> " +
                "<td class='td-width F25'></td>" +
                "<td class='td-width F26'></td>" +
                "<td class='td-width F27'></td> " +
                "</tr>";

            html = "<table id='current-called-ticket' class='white centered'>" + tr1 + tr2 + tr3 + "</table>";
            var showDiv = false;

            $("#current-ticket-display-div").html(html);

            showDiv = setTicketValuesInsideGame(json);
            if (showDiv == true) {
                $("#loading-div").hide();
                $("#current-ticket-display-div").show();
                validateRowStrike();
            }
        }


    }


    function setEnteredTicketNo() {
        $(".current-verify-ticket-entered").text(insideSelectedVerifyTicketVal);
    }

    function validateRowStrike() {
        var rows = $("#current-called-ticket").find('> tbody > tr');
        $.each(rows, function (key, value) {
            // console.log("value > ", value);
            var tds = $(value).find('td');
            // console.log("tds > ", tds);
            var count = 0;
            $.each(tds, function (k, v) {
                // console.log("tds > v > ", v);
                // console.log("tds > v.role > ", $(v).attr("role"));
                // console.log("tds > v.text > ", v.innerText);
                if ($(v).attr("role") == "numberCalled" || v.innerText.trim() == "") {
                    count++;
                }
            });
            // console.log("count > ", count);
            if (count == 9) {
                $.each(tds, function (k, v) {
                    $(this).addClass("cyan accent-2");
                });
            }
        });
    }

    function setTicketValues(json) {
        $.each(json, function (key, value) {
            $("." + value.Place).text(value['Number']);//setting the parameters 
        });
        return true;
    }

    function setTicketValuesInsideGame(json) {
        $.each(json, function (key, value) {
            var tdHtml = "";
            if (gameStartCalledNumbers.includes(value['Number'])) {
                //$("."+value.Place).addClass("numberCalled");
                $("." + value.Place).attr("role", "numberCalled");
                tdHtml = "<span class='red-text'>" + value['Number'] + "</span>";
            } else {
                tdHtml = "<span class='black-text'>" + value['Number'] + "</span>";
            }
            $("." + value.Place).html(tdHtml);//setting the parameters 
        });
        return true;
    }

    function calculateOthers() {
        totalTicketsSold = parseInt(soldTo) - parseInt(soldFrom) + 1;
        // totalPrice = bookletPrice * totalTicketsSold;
        let chk = isNaN(totalTicketsSold);
        if (chk) {
            $("#total-tickets-sold").val(0);
        } else {
            $("#total-tickets-sold").val(totalTicketsSold);
        }

    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function chkConfPassword(password, confPassword) {
        var chk = false;
        if (password == confPassword) {
            chk = true;
        } else {
            chk = false;
        }
        return chk;
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    function getUsersList() {
        var json = {};
        fillUserListTable(json);

        var url = (initAPIs.domain + initAPIs.GetAllUsers).toString();
        var D = {
            "UID": JBuserID
        };
        $.ajax({
            type: 'POST',
            url: url,
            data: D,
            success: function (json) {
                $("#userListTable tbody").empty();
                fillUserListTable(json);
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });
    }

    function fillUserListTable(json) {
        json = sortUsersByNewFirst(json);

        $.each(json, function (key, value) {
            let sr_no = parseInt(key) + 1;

            let switch_btn = "";
            let tr = "";

            if (value.IsActive == "false" || value.IsActive == false) {
                switch_btn = "<div class='switch'><label><span class='red-text'>In-Active</span><input role='" + value.UID + "' class='status-switch' role='" + value.UID + "' type='checkbox'><span class='lever'></span><span class='green-text'>Active</span></label></div>";
                tr = "<tr class='light-green lighten-5' style='border-style: solid;border-width: 1px;border-color:#424242;'>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;text-align: center;'>" + sr_no + "</td>" +

                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;'>" + value.Name + "</td>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;'>" + value.EmailID + "</td>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;'>" + value.ClubName + "</td>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;text-align: center;'>" + value.Address1 + "</td>" +

                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;text-align: center;'>" + switch_btn +
                    "</td>"
                    + "</tr>";
            }
            if (value.IsActive == "true" || value.IsActive == true) {
                switch_btn = "<div class='switch'><label><span class='red-text'>In-Active</span><input role='" + value.UID + "' class='status-switch' role='" + value.UID + "' type='checkbox' checked><span class='lever'></span><span class='green-text'>Active</span></label></div>";
                tr = "<tr  style='border-style: solid;border-width: 1px;border-color:#424242;'>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;text-align: center;'>" + sr_no + "</td>" +

                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;'>" + value.Name + "</td>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;'>" + value.EmailID + "</td>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;'>" + value.ClubName + "</td>" +
                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;text-align: center;'>" + value.Address1 + "</td>" +

                    "<td  style='border-style: solid;border-width: 1px;border-color:#424242;text-align: center;'>" + switch_btn +
                    "</td>"
                    + "</tr>";
            }







            $("#userListTable tbody").append(tr);

        });
    }

    function sortUsersByNewFirst(dummy) {
        let sortedDummy = [];
        $.each(dummy, function (key, value) {
            if (value.IsActive == "false" || value.IsActive == false) {
                sortedDummy.push(value);
            }
        });

        $.each(dummy, function (key, value) {
            if (value.IsActive == "true" || value.IsActive == true) {
                sortedDummy.push(value);
            }
        });

        return sortedDummy;
    }

    function refreshUserGameList() {
        getUserGameList();
    }

    function resetNewGameForm() {
        $("#new_setup_table tbody").empty();
        fillTicketInPlayNewSetupDropdown();
        $("#new-game-name").val("");
        $("#new-game-note").hide();
        $("#new_save_btn").hide();
        $("#new_save_btn").removeAttr('disabled');
        $("#new-game-date").val("");
    }

    function resetEditGameForm() {
        $("#edit_setup_table tbody").empty();
        // $("#new_save_btn").removeAttr('disabled');
        $("#edit-game-date").val("");
        $("#edit-game-selected-display-ticketNo").text("");
    }

    function getUserGameList() {

        $('#edit-game-name-select').children().remove();
        $('#edit-game-name-select')
            .append($("<option></option>")
                .attr("value", '')
                .attr("disabled", "disabled")
                .attr("selected", 'selected')
                .text("Game Name"));
        $('#select-game-modal-choose-game').children().remove();
        $('#select-game-modal-choose-game')
            .append($("<option></option>")
                .attr("value", '')
                .attr("disabled", "disabled")
                .attr("selected", 'selected')
                .text("Select Game"));


        var url = (initAPIs.domain + initAPIs.GetAllGames).toString();

        userID = getCookie("JBuserID");
        var D = {
            "UID": userID
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: D,
            success: function (json) {
                userGameMst = json;
                setUserGameList(userGameMst);
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
            }
        });

    }

    function setUserGameList(userGameMst) {

        let AllGame = userGameMst.AllGame;
        userGamesList = AllGame;
        console.log("================================================");
        console.log("setUserGameList > userGamesList : ", userGamesList);
        console.log("================================================");
        $.each(userGamesList, function (key, value) {
            $('#edit-game-name-select')
                .append($("<option></option>")
                    .attr("value", value.TktID)
                    .attr("role", value.TktType)
                    .attr("class", value.SetupID)
                    .text(value.GameName));

            $('#select-game-modal-choose-game').append($("<option></option>")
                .attr("value", value.TktID)
                .attr("role", value.TktType)
                .attr("class", value.SetupID)
                .text(value.GameName));

        });
    }

    function getNewGameSelectedData() {
        let gameDetailsObj = [];
        let tr = $("#new_setup_table tbody tr");

        for (let i = 0; i < tr.length; i++) {

            let gameID = $("#game_id_" + i).attr("role");
            let Game = $("#game_id_" + i).val();
            let ColorID = $("#game_color_" + i).children("option:selected").attr("role");
            let Color = $("#game_color_" + i).children("option:selected").val();
            let oneLine_game_chk = false;
            let twoLine_game_chk = false;
            let fullHouse_game_chk = false;
            let corner_game_chk = false;

            if ($("#oneLine_game_chk_" + i).is(":checked")) {
                oneLine_game_chk = true;
            }

            let oneLine_game_price = $("#oneLine_game_price_" + i).val();

            if ($("#twoLine_game_chk_" + i).is(":checked")) {
                twoLine_game_chk = true;
            }
            let twoLine_game_price = $("#twoLine_game_price_" + i).val();

            if ($("#fullHouse_game_chk_" + i).is(":checked")) {
                fullHouse_game_chk = true;
            }
            let fullHouse_game_price = $("#fullHouse_game_price_" + i).val();

            if ($("#corner_game_chk_" + i).is(":checked")) {
                corner_game_chk = true;
            }
            let corner_game_price = $("#corner_game_price_" + i).val();


            var obj = {
                "ID": 0,
                "GameID": gameID,
                "ColorID": ColorID,
                "IsOneLn": oneLine_game_chk,
                "OneLnPrice": oneLine_game_price,
                "IsTwoLn": twoLine_game_chk,
                "TwoLnPrice": twoLine_game_price,
                "IsFH": fullHouse_game_chk,
                "FHPrice": fullHouse_game_price,
                "IsCorner": corner_game_chk,
                "CornerPrice": corner_game_price
            };
            gameDetailsObj.push(obj);

        }


        return gameDetailsObj;
    }

    //-------------------------------------------EVENTS--------------------------------

    $("#game-modal-verify-btn").click(function () {
        $("#pause-game-btn").click();
        document.getElementById("ticket_number").value = "";
    });

    $("#exitInitiate-game-btn").click(function () {
        $("#pause-game-btn").click();
    });

    $("#numbering-modal-open").click(function () {
        preSetLanguageElements();
    });

    $(document).on('keyup', '.no-text-box', function (e) {
        var ID = $(this).attr("role");
        var no_text = $(this).val();
        var obj = {
            "ID": ID,
            "Numbers": no_text
        };
        setNumbersChangedValue(obj);
    });

    //saving the number's text entered by user
    $("#numberings-save-btn").click(function () {
        $("#numbering-modal-preloader").show();
        setNumberingsDisplay(numberings);
        setAllNumbersDisplay(numberings);
        var lang = "";
        //game-voice-language
        lang = $("#game-voice-language").children("option:selected").val();
        console.log("language > ", lang);
        language = lang;

        // $("#numbering-modal-preloader").hide();

    });

    $("#new_game_ticket_in_play").on("change", function (e) {
        $("#new-game-note").fadeIn();
        var val = $(this).children("option:selected").val();
        var id = $(this).children("option:selected").attr("role");

        var ticket_in_play_selected = {
            "id": parseInt(id),
            "ticket": val
        };
        populateTableListAsPerSelectedTicket(ticket_in_play_selected);
    });


    function validateIfSelected() {
        let tr = $("#new_setup_table tbody tr");
        console.log("tr.length > ", tr.length);
        let trLineChkArray = [];
        let isOneInTheRowSelectedCount = 0;
        for (let i = 0; i < tr.length; i++) {
            let isOneInTheRowSelected = false;


            console.log("oneLine_game_chk_ is checked  > ", $("#oneLine_game_chk_" + i).is(":checked"));
            if ($("#oneLine_game_chk_" + i).is(":checked") == true ||
                $("#twoLine_game_chk_" + i).is(":checked") == true ||
                $("#fullHouse_game_chk_" + i).is(":checked") == true ||
                $("#corner_game_chk_" + i).is(":checked") == true
            ) {
                isOneInTheRowSelected = true;
                isOneInTheRowSelectedCount = isOneInTheRowSelectedCount + 1;
            }
            trLineChkArray.push(isOneInTheRowSelected);
        }
        console.log("isOneInTheRowSelectedCount > ", isOneInTheRowSelectedCount);
        if (isOneInTheRowSelectedCount == tr.length) {
            $("#new_save_btn").fadeIn();
        } else {
            $("#new_save_btn").hide();
        }


    }

    $("#game-setup-modal-trigger").click(function () {
        $("#new_game_radio").click();
    });


    $(".select_setup_type").click(function () {
        if ($(this).attr('id') == "new_game_radio") {
            $(".setup_type").hide();
            $("#New_Setup").fadeIn();
        }
        if ($(this).attr('id') == "edit_game_radio") {
            $(".setup_type").hide();
            $("#Edit_Setup").fadeIn();
        }
    });

    $(document).on('click', '.game_selection_chk', function (e) {
        validateIfSelected();
        console.log("checkbox clicked : ", e.target);
        console.log("checkbox val : ", e.target.checked);
        var role = "";
        var name = "";
        var name = "";
        var textID = "";
        if (e.target.checked == true) {
            //enable the input box next to it
            role = $(this).attr("role");
            name = $(this).attr("name");
            console.log("checkbox clicked role : ", role);
            console.log("checkbox clicked name : ", name);
            name = name + "_" + role;
            textID = "";
            // $("#" + name + "_game_price_" + role).removeAttr("disabled");
            let game_price_inputs = $(".game_price_input");
            $.each(game_price_inputs, function (key, value) {
                var e = value;
                if (e.name == name) {
                    textID = e.id;
                }

            });
            console.log("checkbox clicked game_price_inputs e textID : ", textID);
            console.log("checkbox clicked game_price_inputs : ", game_price_inputs);
            $("#" + textID).removeAttr("disabled");
        }
        if (e.target.checked == false) {
            //disable the input box next to it
            role = $(this).attr("role");
            name = $(this).attr("name");
            name = name + "_" + role;
            let game_price_inputs = $(".game_price_input");

            $.each(game_price_inputs, function (key, value) {

                var el = value;
                var elName = el.name;
                var elID = el.id;
                console.log("Unchecked game_price_inputs el >   ", el);
                console.log("Unchecked game_price_inputs el.name >   ", elName);
                console.log("Unchecked game_price_inputs name >   ", name);
                if (elName == name) {
                    console.log("Unchecked game_price_inputs elName==name >   ");
                    textID = elID;
                }

            });
            console.log("Unchecked checkbox clicked game_price_inputs e textID : ", textID);
            console.log("Unchecked checkbox clicked game_price_inputs : ", game_price_inputs);
            $("#" + textID).val("0.00");
            $("#" + textID).attr("disabled", "disabled");
        }
    });

    $("#bingo-ticket-verify").click(function () {
        document.getElementById("verify_ticket_number").value = "";
        $.get("/views/blank-tinket-design.html", function (data, status) {
            $("#verify-ticket-blank-display-div").html(data);//loading blank in very ticket modal 
            $("#verify-wait").hide();
        });
    });

    $("#verify-ticket-btn").click(function () {
        $("#verify-wait").fadeIn();
        var ticket_val = $("#verify_ticket_number").val();
        if (ticket_val == "") {
            toastMsg("<span class='red-text text-lighten-4'>Enter Ticket Number!</span>");
            $.get("/views/blank-tinket-design.html", function (data, status) {
                $("#verify-ticket-blank-display-div").html(data);//loading blank in very ticket modal 
                $("#verify-wait").hide();
            });
        } else {

            var url = (initAPIs.domain + initAPIs.GetTicketData).toString();
            var D = {
                "ID": ticket_val
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: D,
                success: function (json) {
                    setVerifiedTicket(json, "outside");

                },
                error: function (parsedjson, textStatus, errorThrown) {
                    toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
                }
            });

        }

    });

    $("#verify-ticket-cancel-button").click(function () {
        enableAllGameBtnsExceptStart();
    });

    function disableAllGameBtns() {
        $("#start-game-btn").attr("disabled", true);
        $("#pause-game-btn").attr("disabled", true);
        $("#game-modal-verify-btn").attr("disabled", false);
        $("#game-modal-clear-btn").attr("disabled", true);
        $("#exitInitiate-game-btn").attr("disabled", true);
    }

    function enableAllGameBtnsExceptStart() {
        $("#start-game-btn").attr("disabled", false);
        $("#pause-game-btn").attr("disabled", true);
        $("#game-modal-verify-btn").attr("disabled", false);
        $("#game-modal-clear-btn").attr("disabled", false);
        $("#exitInitiate-game-btn").attr("disabled", false);
    }

    function showAdminBoogieOrWinnerPrompt() {

        console.log("================================================================");
        console.log("showAdminBoogieOrWinnerPrompt > selectedGameID > ", selectedGameID);
        let AllGameDetails = userGameMst.AllGameDetails;
        console.log("showAdminBoogieOrWinnerPrompt > AllGameDetails > ", AllGameDetails);
        console.log("================================================================");
        var html = "";
        var divStart = "<div class='white' style='margin-left:10px !important; margin-top:-10px !important;'>";
        var divEnd = "</div>";
        var msgTxt = "<p>Please confirm ticket number <b>" + insideSelectedVerifyTicketVal + "</b> is : </p>";
        var oneLine = "<p><label><input name='group1' type='radio' value='One Line'/><span class='black-text'>One Line</span></label></p>";
        var twoLine = "<p><label><input name='group1' type='radio' value='Two Line' /><span class='black-text'>Two Line</span></label></p>";
        var fullHouse = "<p><label><input name='group1' type='radio' value='Full House' /><span class='black-text'>Full House</span></label></p>";
        var corner = "<p><label><input name='group1' type='radio' value='Corner' /><span class='black-text'>Corner</span></label></p>";
        var selectBooggie = "<p><label><input name='group1' type='radio' value='Boogie' class='this-is-boogie-radio' /><span class='black-text'>Boogie</span></label></p>";
        var btn = "<div class='right' style='margin-top:-35px !important;'><a  id='game-check-ticket-ok-btn' class='btn-flat'>Confirm</a> <a id='game-check-ticket-cancel-btn' class='btn-flat'>CANCEL</a> </div>";

        $.each(AllGameDetails, function (key, value) {
            if (value.ID == selectedGameID) {
                if (value.IsOneLn == true) {
                    html = html + oneLine;
                }
                if (value.IsTwoLn == true) {
                    html = html + twoLine;
                }
                if (value.IsFH == true) {
                    html = html + fullHouse;
                }
                if (value.IsCorner == true) {
                    html = html + corner;
                }
            }
        });

        html = divStart + msgTxt + html + selectBooggie + btn + divEnd;

        $("#game-winner-options-display").html(html);
        $("#game-winner-options-display").show();
        $("#game-winner-list-display").hide();

    }

    $(document).on('click', '#game-check-ticket-ok-btn', function () {
        console.log("============================================================");
        console.log("game-check-ticket-ok-btn > clicked");
        var winnerChkRadio = $('input[name=group1]:checked').val();
        console.log("game-check-ticket-ok-btn  > winnerChkRadio > ", winnerChkRadio);
        // if(winnerChkRadio=="Boogie"){}else{


        // }
        var obj = {
            "type": winnerChkRadio,
            "ticket": insideSelectedVerifyTicketVal
        };
        boogieTicketsSelected.push(obj);

        displayWinnerList();
        enableAllGameBtnsExceptStart();
        console.log("============================================================");
        $("#game-winner-list-display").show();
        $("#game-winner-options-display").hide();
    });

    function displayWinnerList() {
        var displayWinnerListHtml = "";
        var oneLine = "";
        var twoLine = "";
        var fullHouse = "";
        var corner = "";
        var booggie = "";

        console.log("In displayWinnerList");
        console.log("In boogieTicketsSelected.lenght > ", boogieTicketsSelected.length);
        console.log("In boogieTicketsSelected > ", boogieTicketsSelected);
        $.each(boogieTicketsSelected, function (key, value) {
            console.log(" value.type > ", value);
            if (value.type == "One Line") {
                oneLine = oneLine + value.ticket + ",";
            }
            if (value.type == "Two Line") {
                twoLine = twoLine + value.ticket + ",";
            }
            if (value.type == "Full House") {
                fullHouse = fullHouse + value.ticket + ",";
            }
            if (value.type == "Corner") {
                corner = corner + value.ticket + ",";
            }
            if (value.type == "Boogie") {
                booggie = booggie + value.ticket + ",";
            }
        });

        console.log("In oneLine > ", oneLine);
        console.log("In twoLine > ", twoLine);
        console.log("In fullHouse > ", fullHouse);
        console.log("In corner > ", corner);
        console.log("In booggie > ", booggie);

        if (oneLine == "") { } else {
            oneLine = "<b>One Line winners : </b>" + oneLine + "<br/>";
        }
        if (twoLine == "") { } else {
            twoLine = "<b>Two Line winners : </b>" + twoLine + "<br/>";
        }
        if (fullHouse == "") { } else {
            fullHouse = "<b>Full House winners : </b>" + fullHouse + "<br/>";
        }
        if (corner == "") { } else {
            corner = "<b>Corner winners : </b>" + corner + "<br/>";
        }
        if (booggie == "") { } else {
            booggie = "<b>Boogie Tickets : </b>" + booggie + "<br/>";
        }

        displayWinnerListHtml = displayWinnerListHtml + oneLine + twoLine + fullHouse + corner + booggie;
        console.log("In displayWinnerListHtml > ", displayWinnerListHtml);
        $("#game-winner-list-display").html(displayWinnerListHtml);

    }

    $(document).on('click', '#game-check-ticket-cancel-btn', function () {
        console.log("game-check-ticket-cancel-btn > clicked");
        // enableAllGameBtnsExceptStart();
        // $("#game-winner-list-display").show();
        // $("#game-winner-options-display").hide();
        cancelBoogieTicketVerify();
    });


    function cancelBoogieTicketVerify() {
        enableAllGameBtnsExceptStart();
        $("#game-winner-list-display").show();
        $("#game-winner-options-display").hide();
    }


    $("#verify-ticket-button").click(function () {
        $("#loading-div").show();
        var ticket_val = $("#ticket_number").val();
        insideSelectedVerifyTicketVal = ticket_val;
        if (ticket_val == "") {
            toastMsg("<span class='red-text text-lighten-4'>Enter Ticket Number!</span>");
            $.get("/views/blank-tinket-design.html", function (data, status) {
                $("#current-ticket-display-div").html(data);//loading blank in very ticket modal 
                $("#loading-div").hide();
                $("#current-ticket-display-div").show();
            });
        } else {
            $("#game-winner-list-display").hide();
            $('.modal#modal4').modal('close');
            var url = (initAPIs.domain + initAPIs.GetTicketData).toString();
            var D = {
                "ID": ticket_val
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: D,
                success: function (json) {
                    setVerifiedTicket(json, "inSideGame");

                },
                error: function (parsedjson, textStatus, errorThrown) {
                    toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
                }
            });
        }
    });

    $("#audio-btn").on('change', function (e) {
        console.log("Audion btn e : ", e);
        console.log("Audion btn e : ", e.target);
        var chk = $(this).prop('checked');
        console.log("Audion btn chk : ", chk);
        if (chk == true) {
            $(this).prop('checked', true);
            chkAudio = true;
            toastMsg("Audio Enabled!");
        } if (chk == false) {
            $(this).prop('checked', false);
            chkAudio = false;
            toastMsg("<span class='red-text text-lighten-4'>Audio Disabled!</span>");
        }
    });

    $("#sold-from").on("keyup", function () {
        soldFrom = $(this).val();
        calculateOthers();
    });
    $("#sold-to").on("keyup", function () {
        soldTo = $(this).val();
        calculateOthers();
    });
    $("#per-booklet-price").on("keyup", function () {
        bookletPrice = $(this).val();
        calculateOthers();
    });

    $("#login-btn").click(function () {
        var userID = $("#user_id").val();
        var password = $("#password").val();
        if (userID == "" || password == "") {
            toastMsg("<span class='red-text text-lighten-4'>Enter your credentials properly!</span>");
        } else {

            var D = {
                "ID": userID,
                "PWD": password
            };

            var url = (initAPIs.domain + initAPIs.Login).toString();
            $.ajax({
                type: 'POST',
                url: url,
                data: D,
                success: function (json) {
                    console.log("json > ", json);

                    if (json.UID == 0) {
                        toastMsg("<span class='red-text text-lighten-4'>User Not registered!</span>");
                    } else {
                        var token = generateToken(json.EmailID);
                        json["Token"] = token;
                        toastMsg("<span class='green-text'>Welcome " + json.Name + "</span>");
                        console.log("token > ", token);
                        setCookie("JBuserID", json.UID, 1);
                        setCookie("ClubName", json.ClubName, 1);
                        setCookie("EmailID", json.EmailID, 1);
                        setCookie("IsAdmin", json.IsAdmin, 1);
                        setCookie("LoggedExpiryTime", json.LoggedExpiryTime, 1);
                        setCookie("LoggedInDate", json.LoggedInDate, 1);
                        setCookie("LoggedInTime", json.LoggedInTime, 1);
                        setCookie("Name", json.Name, 1);
                        setCookie("Token", token, 1);
                        sendToken(json);
                        window.location.replace("dashboard");
                    }
                },
                error: function (parsedjson, textStatus, errorThrown) {
                    toastMsg("<span class='red-text text-lighten-4'>Please try after some time!</span>");
                }
            });

        }
    });

    $("#log-out").click(function () {
        performLogOutProcess();
    });


    $("#reg_email_id").on("keyup", function () {
        var EmailID = $(this).val();
        var validEmail = validateEmail(EmailID);
        if (validEmail) {

            var url = (initAPIs.domain + initAPIs.IsEmailIDExist).toString();
            var D = {
                "EmailID": EmailID
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: D,
                success: function (json) {
                    console.log("Checking email > json : ", json);
                    if (json.IsExist == true) {
                        $("#reg-email-blank").hide();
                        $("#reg-email-accept-icon").fadeOut();
                        $("#reg-email-reject-icon").fadeIn();
                    } else {
                        $("#reg-email-blank").hide();
                        $("#reg-email-accept-icon").fadeIn();
                        $("#reg-email-reject-icon").hide();
                    }
                },
                error: function (parsedjson, textStatus, errorThrown) {
                    toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
                }
            });
        } else {
            if (EmailID == "") {
                $("#reg-email-blank").show();
                $("#reg-email-accept-icon").hide();
                $("#reg-email-reject-icon").hide();
            } else {
                $("#reg-email-reject-icon").fadeIn();
                $("#reg-email-accept-icon").hide();
            }
        }
    });

    $("#conf-password").on("keyup", function () {
        var password = $("#reg-password").val();
        var conf_password = $(this).val();
        if (conf_password == "") {
            $("#conf-chk-msg").html("&nbsp;");
        } else {
            var chk = chkConfPassword(password, conf_password);
            if (chk) {
                $("#conf-chk-msg").html("<i id='reg-email-accept-icon' class='material-icons green-text text-darken-4' style='font-size: 1.5rem;'><b>check</b></i>");
            } else {
                $("#conf-chk-msg").html("<i class='material-icons red-text' style='font-size: 1.5rem;'><b>clear</b></i>");
            }
        }
    });

    $(".input-chk").on("keyup", function () {
        var regClubName = $("#reg-club-name").val();
        var addressLine1 = $("#address_line_1").val();
        var addressLine2 = $("#address_line_2").val();
        var postCode = $("#post_code").val();
        var city = $("#city").val();
        var website = $("#website").val();
        var country = $("#country").val();
        var contactPerson = $("#contact_person").val();
        var phone_no = $("#phone_no").val();
        var regEmailID = $("#reg_email_id").val();
        var regPassword = $("#reg-password").val();
        var confPassword = $("#conf-password").val();

        if (regClubName == "" || addressLine1 == "" || postCode == "" || city == "" || country == "" ||
            contactPerson == "" || regEmailID == "" || regPassword == "" || confPassword == "") {
            $("#register-btn").attr("disabled", true);
        } else {
            var chk = chkConfPassword(regPassword, confPassword);
            if (chk) {
                var ve = validateEmail(regEmailID);
                console.log("--> IN chkConfPassword > chk ve  > ", ve);
                if (ve) {
                    $("#register-btn").attr("disabled", false);



                } else {
                    $("#register-btn").attr("disabled", true);
                }
            } else {
                $("#register-btn").attr("disabled", true);
            }
        }
    });

    $("#register-btn").click(function () {
        $("#register-btn").attr("disabled", true);
        var regClubName = $("#reg-club-name").val();
        var addressLine1 = $("#address_line_1").val();
        var addressLine2 = $("#address_line_2").val();
        var postCode = $("#post_code").val();
        var city = $("#city").val();
        var website = $("#website").val();
        var country = $("#country").val();
        var contactPerson = $("#contact_person").val();
        var phone_no = $("#phone_no").val();
        var regEmailID = $("#reg_email_id").val();
        var regPassword = $("#reg-password").val();
        var confPassword = $("#conf-password").val();
        var D = {
            "ClubName": regClubName,
            "Address1": addressLine1,
            "Address2": addressLine2,
            "PostCode": postCode,
            "City": city,
            "Country": country,
            "Website": website,
            "ContactPerson": contactPerson,
            "PhoneNo": phone_no,
            "EmailID": regEmailID,
            "Password": regPassword,
        };

        var url = (initAPIs.domain + initAPIs.Register).toString();
        $.ajax({
            type: 'POST',
            url: url,
            data: D,
            success: function (json) {
                if (json.IsSuccess == true || json.IsSuccess == "true") {
                    toastMsg("<span class='green-text'>Registration successful!</span>");
                    setTimeout(function () {
                        window.location = '/';
                    }, 2000);
                } else {
                    $("#register-btn").attr("disabled", false);
                    toastMsg("<span class='red-text'>Registration Not successful!</span>");
                }
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
                $("#register-btn").attr("disabled", false);
            }
        });
    });



    $(document).on('change', '.status-switch', function (e) {
        $("#user-list-preloader").show();
        console.log("status-switch btn e : ", e);
        console.log("status-switch btn e : ", e.target);
        var chk = $(this).prop('checked');
        var ID = $(this).attr("role");

        let status = false;
        if (chk == true) {
            $(this).prop('checked', true);
            status = true;
        } if (chk == false) {
            $(this).prop('checked', false);
            status = false;
        }
        var D = {
            "UID": ID,
            "IsActive": status
        };


        var url = (initAPIs.domain + initAPIs.ActiveUser).toString();
        $.ajax({
            type: 'POST',
            url: url,
            data: D,
            success: function (json) {
                if (json.IsSuccess == true || json.IsSuccess == "true") {
                    if (status == false) {
                        toastMsg("<span class='green-text'>User Deactivated</span>");
                    }
                    if (status == true) {
                        toastMsg("<span class='green-text'>User Activated</span>");
                    }
                    $("#user-list-preloader").fadeOut();
                    getUsersList();
                } else {
                    toastMsg("<span class='red-text'>Please Try Later!</span>");
                }
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");

            }
        });


    });



    $(document).on('change', '#gameScreen-game-select', function () {
        console.log("===================================================");
        console.log("Game change initiated");
        var val = $(this).children("option:selected").val();
        var id = $(this).children("option:selected").attr("role");
        var SetupID = $(this).children("option:selected").attr("class");
        var text = $(this).children("option:selected").text();
        console.log("val : ", val);
        console.log("id : ", id);
        console.log("SetupID : ", SetupID);
        console.log("text : ", text);

        selectedGameID = val;
        let Color = "";
        Color = getSelectedGameColor(selectedGameID);
        console.log("Color : ", Color);
        $(".ScreengameColor").text(Color);
        clearGame();
        console.log("===================================================");
    });

    function clearGame() {
        $("#recent-call").text("");
        $("#second-last-call").text("");
        $("#third-last-call").text("");
        $(".number-preview-digit").html("");
        $(".current-verify-ticket-entered").text("");
        $("#game-winner-options-display").html("<br/>");
        $("#game-winner-list-display").html("<br/>");
        loadInitialblankTicketDesign();
        cancelBoogieTicketVerify();
        setAllNumbersDisplay(numberings);
        gameStartCalledNumbers = [];
        boogieTicketsSelected = [];
        insideSelectedVerifyTicketVal = "";
        bingo.clearRandom();
    }

    $("#game-modal-clear-btn").click(function () {
        clearGame();
    });

    $("#select-game-modal-choose-game").on("change", function (e) {
        // $("#play-btn-from-select-game").attr("disabled", false);
        // console.log("select-game-modal-choose-game > ",e);
        var val = $(this).children("option:selected").val();
        var id = $(this).children("option:selected").attr("role");
        var SetupID = $(this).children("option:selected").attr("class");
        var text = $(this).children("option:selected").text();
        $(".ScreengameName").html(text);
        // console.log("text > ",text);        
        // console.log("val > ",val);
        // console.log("id > ",id);
        // console.log("SetupID > ",SetupID);

        $.each(userGamesList, function (key, value) {
            if (value.SetupID == SetupID) {
                GameDate = value.GameDate;
            }
        });
        $("#select-game-modal-choose-game-tkt-display").text(id);

        //get table list of game details from mst
        displayGameDetailsInSelectGameModal(SetupID);
        setGameName(SetupID);

    });

    //-------------------------------------------------

    var bingo = {
        selectedNumbers: [],
        generateRandom: function () {
            var min = 1;
            var max = 90;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
        },
        generateNextRandom: function () {
            if (bingo.selectedNumbers.length > 89) {
                // alert("All numbers Exhausted");
                numberExhausted = true;
                return 0;
            }
            var random = bingo.generateRandom();
            while ($.inArray(random, bingo.selectedNumbers) > -1) {
                random = bingo.generateRandom();
            }
            bingo.selectedNumbers.push(random);
            return random;
        },
        clearRandom: function () {
            bingo.selectedNumbers = [];
        }
    };

    //initializing all the parameters and exiting the modal
    $("#exit-game-btn").click(function () {
        location.reload(true);
    });

    $("#pause-game-btn").click(function () {
        startBtnClicked = false;
        clearInterval(setIntervalVal);
        $(this).attr("disabled", true);
        toastMsg("<span class='red-text text-lighten-4'>Game Paused!</span>");
        isPaused = true;
        $("#start-game-btn").attr("disabled", false);
        $("#gameScreen-game-select").prop("disabled", false);
    });

    $("#start-game-btn").click(function () {
        $("#gameScreen-game-select").prop("disabled", true);

        startBtnClicked = true;
        M.Toast.dismissAll();
        $("#pause-game-btn").attr("disabled", false);
        isPaused = false;
        $(this).attr("disabled", true);
        if (autoCallsSet == true) {
            setIntervalVal = setInterval(function () {
                if (isPaused == false) {
                    var random = bingo.generateNextRandom().toString();
                    if (numberExhausted == false) {
                        gameStartCalledNumbers.push(random);
                        if (chkAudio == true) {
                            dictateNumber(random);
                        }
                        displayNumberOnScreen(random);
                        highlightNumberInSeriesDisplay(random);
                        updateSelectedCallsList();
                        validateCalledNumbers();
                    }
                } else {
                    // if(promptDisableMsg==1){
                    //     toastMsg("<span class='red-text text-lighten-4'>Game Paused!</span>");
                    // }                        
                    // promptDisableMsg++;
                }
            }, time);
        } else {

            if (manualEnterKeyPress == true) {
                toastMsg("<span class='red-text text-lighten-4'>Press Enter to call Numbers!</span>");
            }

        }
    });

    $("#game-screen-user-input-number").on("change", function (e) {

        if (startBtnClicked == true) {
            let number = $(this).val();
            console.log("input number : ", number);
            if (gameStartCalledNumbers.length > 89) {
                numberExhausted = true;
                toastMsg("<span class='red-text text-lighten-4'>Numbers Exhausted!</span>");
                $(this).val("");
            }
            if (numberExhausted == false) {
                if (number >= 1 && number <= 90) {
                    let chk = chkIfNumberExist(number);
                    if (chk == true) {
                        toastMsg("<span class='red-text text-lighten-4'>Number Already Entered!</span>");
                        $(this).val("");
                    } else {
                        gameStartCalledNumbers.push(number);
                        if (chkAudio == true) {
                            dictateNumber(number);
                        }
                        displayNumberOnScreen(number);
                        highlightNumberInSeriesDisplay(number);
                        updateSelectedCallsList();
                        validateCalledNumbers();
                        $(this).val("");
                    }
                } else {
                    toastMsg("<span class='red-text text-lighten-4'>Please Enter Valid Number !</span>");
                    $(this).val("");
                }

            }
        } else {
            toastMsg("<span class='red-text text-lighten-4'>Click on Start to continue!</span>");
            $(this).val("");
        }

    });

    $(document).on("keyup", function (e) {
        if (manualEnterKeyPress == true) {
            if (startBtnClicked == true) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    if (isPaused == false) {
                        var random = bingo.generateNextRandom().toString();
                        if (numberExhausted == false) {
                            gameStartCalledNumbers.push(random);
                            if (chkAudio == true) {
                                dictateNumber(random);
                            }
                            displayNumberOnScreen(random);
                            highlightNumberInSeriesDisplay(random);
                            updateSelectedCallsList();
                            validateCalledNumbers();
                        }
                    } else {
                        // if(promptDisableMsg==1){
                        //     toastMsg("<span class='red-text text-lighten-4'>Game Paused!</span>");
                        // }                        
                        // promptDisableMsg++;
                    }
                }
            } else {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    toastMsg("<span class='red-text text-lighten-4'>Click Start to continue!</span>");
                }

            }
        }


    });

    $(".game-call-type-selection").on("click", function () {
        let val = $(this).val();
        if (val == "auto") {
            autoCallsSet = true;
            manualEnterKeyPress = false;
            manualInputNumberEnterKeyPress = false;
        }
        if (val == "enterkey") {
            autoCallsSet = false;
            manualEnterKeyPress = true;
            manualInputNumberEnterKeyPress = false;
        }
        if (val == "manualEnter") {
            autoCallsSet = false;
            manualEnterKeyPress = false;
            manualInputNumberEnterKeyPress = true;
            $("#game-manual-enter-number-display").show();
        }
    });

    function chkIfNumberExist(number) {
        console.log("==========================================");
        console.log("chkIfNumberExist > number > ", number);
        let isPresent = false;
        $.each(gameStartCalledNumbers, function (key, value) {
            console.log("chkIfNumberExist > value > ", value);
            if (value == number) {
                console.log("chkIfNumberExist  Already Present");
                isPresent = true;
            }
        });
        console.log("==========================================");
        return isPresent;
    }

    $("#tableSearch").on("keyup", function () {
        var value = this.value.toLowerCase().trim();
        console.log("value > ", value);
        $("#userListTable tr").each(function (index) {
            if (!index) return;
            $(this).find("td").each(function () {
                var id = $(this).text().toLowerCase().trim();
                var not_found = (id.indexOf(value) == -1);
                $(this).closest('tr').toggle(!not_found);
                return not_found;
            });
        });

    });

    $("#new_save_btn").click(function () {
        $("#new-btn-action-loader").show();
        $(this).attr("disabled", true);
        let userID = getCookie("JBuserID");
        let gameDate = $("#new-game-date").val();
        let gameName = $("#new-game-name").val();
        let ticketInPlayVal = $("#new_game_ticket_in_play").children("option:selected").val();
        let ticketInPlayId = $("#new_game_ticket_in_play").children("option:selected").attr("role");


        if (gameDate != "" && gameName != "" && ticketInPlayVal != "" && ticketInPlayId != "") {
            let newGameDetails = {
                "UID": userID,
                "TktID": ticketInPlayId,
                "GameName": gameName,
                "GameDate": gameDate
            }

            let gameDetails = getNewGameSelectedData();

            let jsonData = {
                "GameSetupID": 0,
                "gameSetup": newGameDetails,
                "gameSetupDetails": gameDetails
            };


            var url = (initAPIs.domain + initAPIs.UpdateGameSetup).toString();
            console.log("jsonData > ", jsonData);
            console.log("url > ", url);

            var settings = {
                'cache': false,
                'dataType': "jsonp",
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "POST",
                "data": JSON.stringify(jsonData),
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                },
                "processData": false,
            }

            // $.ajax(settings).done(function (json) {
            //     console.log("json : ", json);
            //     if (json.IsSuccess == true || json.IsSuccess == "true") {
            //         toastMsg("<span class='green-text'>Game created successfully!</span>");
            //         refreshUserGameList();
            //         resetNewGameForm();
            //         $("#new-btn-action-loader").hide();
            //     } else {
            //         toastMsg("<span class='red-text'>Game creation was Not successful!</span>");
            //         $("#new-btn-action-loader").hide();
            //     }
            // });


            $.ajax({
                "async": true,
                crossDomain: true,
                type: 'POST',
                url: url,
                data: JSON.stringify(jsonData),
                contentType: "application/json",
                dataType: "json",
                success: function (json) {
                    console.log("json : ", json);
                    if (json.IsSuccess == true || json.IsSuccess == "true") {
                        toastMsg("<span class='green-text'>Game created successfully!</span>");
                        refreshUserGameList();
                        resetNewGameForm();
                        $("#new-btn-action-loader").hide();
                    } else {
                        toastMsg("<span class='red-text'>Game creation was Not successful!</span>");
                        $("#new-btn-action-loader").hide();
                    }
                },
                error: function (parsedjson, textStatus, errorThrown) {
                    toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");

                    $("#new-btn-action-loader").hide();
                    $(this).attr("disabled", false);

                }
            });


        } else {
            toastMsg("<span class='red-text text-lighten-4'>Choose All Details properly!</span>");
        }
    });

    $("#edit-game-name-select").on("change", function (e) {

        console.log("userGamesList > ", userGamesList);
        var val = $(this).children("option:selected").val();
        var id = $(this).children("option:selected").attr("role");
        var SetupID = $(this).children("option:selected").attr("class");
        var GameDate = "";
        console.log("val > ", val);
        console.log("id > ", id);
        console.log("SetupID > ", SetupID);

        $.each(userGamesList, function (key, value) {
            if (value.SetupID == SetupID) {
                GameDate = value.GameDate;
            }
        });


        $("#edit-game-selected-display-ticketNo").text(id);
        $("#edit-game-date").val(GameDate);
        $("#show-ticket-no").fadeIn();
        $("#edit_setup_btn_grp").fadeIn();

        getGameDetails(SetupID);

    });

    function getGameDetails(SetupID) {
        $("#edit_setup_table tbody").empty();
        $("#new_setup_table tbody").empty();
        console.log("=======================================================");
        // console.log("GameID > ", GameID);
        // console.log("userGameMst > ", userGameMst);
        let gameDetailList = [];
        let AllGameDetails = userGameMst.AllGameDetails;
        // console.log("AllGameDetails > ", AllGameDetails);
        $.each(AllGameDetails, function (key, value) {
            if (value.SetupID == SetupID) {
                gameDetailList.push(value);
            }
        });
        console.log("gameDetailList > ", gameDetailList);

        for (let i = 0; i < gameDetailList.length; i++) {
            var OneLnPrice = gameDetailList[i].OneLnPrice;
            var TwoLnPrice = gameDetailList[i].TwoLnPrice;
            var FHPrice = gameDetailList[i].FHPrice;
            var CornerPrice = gameDetailList[i].CornerPrice;
            var ID = gameDetailList[i].GameID;
            var GAME_NAME = gameDetailList[i].GameName;
            var C = {
                "id": gameDetailList[i].ColorID,
                "name": gameDetailList[i].Color
            };
            var options = getOptions(C);

            var onlineTD = "";
            var twoLineTD = "";
            var fullHTD = "";
            var cornerTD = "";

            var IsOneLn = false;
            var IsTwoLn = false;
            var IsFH = false;
            var IsCorner = false;

            IsOneLn = gameDetailList[i].IsOneLn;
            IsTwoLn = gameDetailList[i].IsTwoLn;
            IsFH = gameDetailList[i].IsFH;
            IsCorner = gameDetailList[i].IsCorner;

            if (IsOneLn == true) {
                onlineTD = "<label><input id='oneLine_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='oneLine' checked/><span>&nbsp;</span></label><input id='oneLine_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + OneLnPrice + "' style='width:50%' name='oneLine_" + ID + "' >";
            } else {
                onlineTD = "<label><input id='oneLine_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='oneLine'/><span>&nbsp;</span></label><input id='oneLine_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + OneLnPrice + "' style='width:50%' name='oneLine_" + ID + "' disabled>";
            }
            if (IsTwoLn == true) {
                twoLineTD = "<label><input id='twoLine_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='twoLine' checked/><span>&nbsp;</span></label><input id='twoLine_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + TwoLnPrice + "' style='width:50%' name='twoLine_" + ID + "' >";
            } else {
                twoLineTD = "<label><input id='twoLine_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='twoLine'/><span>&nbsp;</span></label><input id='twoLine_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + TwoLnPrice + "' style='width:50%' name='twoLine_" + ID + "' disabled>";
            }
            if (IsFH == true) {
                fullHTD = "<label><input id='fullHouse_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='fullHouse' checked/><span>&nbsp;</span></label><input id='fullHouse_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + FHPrice + "' style='width:50%' name='fullHouse_" + ID + "' >";
            } else {
                fullHTD = "<label><input id='fullHouse_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='fullHouse'/><span>&nbsp;</span></label><input id='fullHouse_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + FHPrice + "' style='width:50%' name='fullHouse_" + ID + "' disabled>";
            }
            if (IsCorner == true) {
                cornerTD = "<label><input id='corner_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='corner' checked/><span>&nbsp;</span></label><input id='corner_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + CornerPrice + "' style='width:50%' name='corner_" + ID + "' >";
            } else {
                cornerTD = "<label><input id='corner_game_chk_" + i + "' type='checkbox' class='filled-in game_selection_chk' role='" + ID + "' name='corner'/><span>&nbsp;</span></label><input id='corner_game_price_" + i + "' type='text' class='browser-default  game_price_input' value='" + CornerPrice + "' style='width:50%' name='corner_" + ID + "' disabled>";
            }

            var tr = "<tr>" +
                "<td> <input id='game_id_" + i + "' role='" + ID + "' type='hidden' value='" + GAME_NAME + "'/> " + GAME_NAME + " </td>" +
                "<td>" +
                "<div class='input-field  col s12'><select id='game_color_" + i + "' class='browser-default game_color' role='" + ID + "' > " +
                options
                + " </select></div>"
                + "</td>" +
                "<td>" +
                onlineTD
                + "</td>" +
                "<td>" +
                twoLineTD
                + "</td>" +
                "<td>" +
                fullHTD
                + "</td>" +
                "<td>" +
                cornerTD
                + "</td>" +
                +"</tr>";
            $("#edit_setup_table tbody").append(tr);

        }

    }



    $("#edit_deactivate_btn").click(function () {
        $("#show-ticket-no").hide();
        $("#edit-btn-action-loader").show();
        var val = $("#edit-game-name-select").children("option:selected").val();
        var id = $("#edit-game-name-select").children("option:selected").attr("role");
        var Class = $("#edit-game-name-select").children("option:selected").attr("class");


        let D = {
            "SetupID": Class,
            "IsActive": false
        };
        console.log("edit_deactivate_btn > D > ", D);
        var url = (initAPIs.domain + initAPIs.ActiveGame).toString();
        $.ajax({
            type: 'POST',
            url: url,
            data: D,
            success: function (json) {
                console.log("response > json > ", json);
                toastMsg("<span class='green-text'>Game Deactivated!</span>");
                $("#edit_setup_btn_grp").hide();
                getUserGameList();
                $("#edit-game-selected-display-ticketNo").text("");
                $("#edit-btn-action-loader").hide();
                $("#edit-game-date").val("");
                $("#edit_setup_table tbody").empty();
                $("#new_setup_table tbody").empty();
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");
                $("#edit-btn-action-loader").hide();
            }
        });
    });

    $("#edit_save_btn").click(function () {
        $("#edit-btn-action-loader").show();
        console.log("edit_save_btn clicked");
        let userID = getCookie("JBuserID");
        let gameDate = $("#edit-game-date").val();
        let gameName = $("#edit-game-name-select").children("option:selected").text();
        let GameSetupID = $("#edit-game-name-select").children("option:selected").attr("class");
        let ticketInPlayVal = $("#edit-game-selected-display-ticketNo").text();
        let ticketInPlayId = getTicketInPlayId(ticketInPlayVal);
        let newGameDetails = {
            "UID": userID,
            "TktID": ticketInPlayId,
            "GameName": gameName,
            "GameDate": gameDate
        }

        let gameDetails = getEditGameSelectedData(GameSetupID);

        let jsonData = {
            "GameSetupID": GameSetupID,
            "gameSetup": newGameDetails,
            "gameSetupDetails": gameDetails
        };

        console.log("========================================");
        console.log("Edit jsonData : ", jsonData);
        console.log("========================================");

        var url = (initAPIs.domain + initAPIs.UpdateGameSetup).toString();
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(jsonData),
            contentType: "application/json",
            dataType: "json",
            success: function (json) {
                console.log("json : ", json);
                if (json.IsSuccess == true || json.IsSuccess == "true") {
                    toastMsg("<span class='green-text'>Game Updated successfully!</span>");
                    refreshUserGameList();
                    resetEditGameForm();
                    $("#edit-btn-action-loader").hide();
                } else {
                    toastMsg("<span class='red-text'>Game Updation was Not successful!</span>");
                    $("#edit-btn-action-loader").hide();
                }
            },
            error: function (parsedjson, textStatus, errorThrown) {
                toastMsg("<span class='red-text text-lighten-4'>Network Error, Please Try Later!</span>");

                $("#edit-btn-action-loader").hide();

            }
        });


    });


    function getTicketInPlayId(ticketInPlayVal) {
        let ticketInPlayId = 0;
        $.each(ticketsInPlay, function (key, value) {
            if (value.TktType == ticketInPlayVal) {
                ticketInPlayId = value.TktID;
            }
        });
        return ticketInPlayId;
    }

    function getEditGameSelectedData(GameSetupID) {
        let gameDetailsObj = [];
        let tr = $("#edit_setup_table tbody tr");

        for (let i = 0; i < tr.length; i++) {

            let gameID = $("#game_id_" + i).attr("role");
            let Game = $("#game_id_" + i).val();
            let ColorID = $("#game_color_" + i).children("option:selected").attr("role");
            let Color = $("#game_color_" + i).children("option:selected").val();
            let oneLine_game_chk = false;
            let twoLine_game_chk = false;
            let fullHouse_game_chk = false;
            let corner_game_chk = false;

            if ($("#oneLine_game_chk_" + i).is(":checked")) {
                oneLine_game_chk = true;
            }

            let oneLine_game_price = $("#oneLine_game_price_" + i).val();

            if ($("#twoLine_game_chk_" + i).is(":checked")) {
                twoLine_game_chk = true;
            }
            let twoLine_game_price = $("#twoLine_game_price_" + i).val();

            if ($("#fullHouse_game_chk_" + i).is(":checked")) {
                fullHouse_game_chk = true;
            }
            let fullHouse_game_price = $("#fullHouse_game_price_" + i).val();

            if ($("#corner_game_chk_" + i).is(":checked")) {
                corner_game_chk = true;
            }
            let corner_game_price = $("#corner_game_price_" + i).val();


            var obj = {
                "ID": getDetailID(GameSetupID, gameID),
                "GameID": gameID,
                "ColorID": ColorID,
                "IsOneLn": oneLine_game_chk,
                "OneLnPrice": oneLine_game_price,
                "IsTwoLn": twoLine_game_chk,
                "TwoLnPrice": twoLine_game_price,
                "IsFH": fullHouse_game_chk,
                "FHPrice": fullHouse_game_price,
                "IsCorner": corner_game_chk,
                "CornerPrice": corner_game_price
            };
            gameDetailsObj.push(obj);

        }


        return gameDetailsObj;
    }


    function getDetailID(SetupID, GameID) {
        let ID = 0;
        let AllGameDetails = userGameMst.AllGameDetails;
        console.log("AllGameDetails > ", AllGameDetails);
        $.each(AllGameDetails, function (key, value) {
            // console.log("key > ",key);
            console.log("SetupID > ", SetupID);
            console.log("value.SetupID > ", value.SetupID);
            console.log("GameID > ", GameID);
            console.log("value.GameID > ", value.GameID);
            if (value.SetupID == SetupID && value.GameID == GameID) {
                ID = value.ID;
            }
        });
        return ID;
    }



    $(".calculateData").on("keyup", function (e) {

        soldFrom = $("#sold-from").val();
        soldTo = $("#sold-to").val();
        totalTicketsSold = $("#total-tickets-sold").val();
        bookletPrice = $("#per-booklet-price").val();
        let tktNo = $("#select-game-modal-choose-game-tkt-display").text();

        if (tktNo.trim() == "") {
            toastMsg("<span class='red-text text-lighten-4'>Please Select Game!</span>");
        } else {
            let noOfTickets = getNumberOfTickets(tktNo);
            let N1 = 0;
            N1 = parseFloat(totalTicketsSold) / parseFloat(noOfTickets);
            totalRevenue = N1 * parseFloat(bookletPrice);
            totalRevenue = parseFloat(totalRevenue);
            let roundOffRevenue = (Math.round(totalRevenue * 100) / 100).toFixed(2);
            let chk = isNaN(roundOffRevenue);
            console.log("--- > chk > ", chk);
            if (chk) {
                $("#total-revenue").val(0);
            } else {
                $("#total-revenue").val(roundOffRevenue);

                totalPrice = $("#total-price").val();
                totalPrice = (Math.round(parseFloat(totalPrice) * 100) / 100).toFixed(2);
                totalGain = parseFloat(roundOffRevenue) - parseFloat(totalPrice);
                totalGain = (Math.round(parseFloat(totalGain) * 100) / 100).toFixed(2);
                $("#total-gain").val(totalGain);
            }

        }
    });

    $("#game-call-speed").on("keyup", function (e) {
        time = $(this).val();
        if (time == "") {
            time = 5000;
        } else {
            if (parseFloat(time) > 0) {
                time = parseFloat(time) * 1000;
            } else {
                time = 5000;
            }
        }
    });

    $(document).on('click', '.playSelectedGame', function (e) {

        selectedGameID = $(this).attr("role");//to selected the game master ID
        $("#play-btn-from-select-game").attr("disabled", false);
        $('#gameScreen-game-select option[value="' + selectedGameID + '"]').prop('selected', true);
    });


    $("#play-btn-from-select-game").click(function () {
        console.log("Hi your have selectedGameID > ", selectedGameID);
        let Color = "";
        Color = getSelectedGameColor(selectedGameID);
        $(".ScreengameColor").text(Color);
        // $.each(selectedGameForPlay, function (key, value) {
        //     if (value.ID == selectedGameID) {
        //         console.log("Play Clicked Now searching > value > ",value);   

        //     }
        // });
    });

    function getSelectedGameColor(selectedGameID) {
        console.log("getSelectedGameColor > selectedGameID > ", selectedGameID);
        console.log("getSelectedGameColor > selectedGameForPlay > ", selectedGameForPlay);
        let Color = "";
        $.each(selectedGameForPlay, function (key, value) {
            console.log("value > ", value);
            if (value.ID == selectedGameID) {
                console.log("Play Clicked Now searching > value > ", value);
                Color = value.Color;
            }
        });

        return Color;
    }

    function getNumberOfTickets(tktNo) {
        let noOfTickets = 0;
        $.each(ticketsInPlay, function (key, value) {
            if (value.TktType == tktNo) {
                noOfTickets = value.NoOfTkts;
            }
        });
        return noOfTickets;
    }


    function setGameName(SetupID) {
        $('#gameScreen-game-select').children().remove();


        let gameDetailList = [];
        let AllGameDetails = userGameMst.AllGameDetails;
        $.each(AllGameDetails, function (key, value) {
            if (value.SetupID == SetupID) {
                console.log("setGameName > value > ", value);
                gameDetailList.push(value);
            }
        });
        selectedGameForPlay = gameDetailList;
        $.each(selectedGameForPlay, function (key, value) {
            $('#gameScreen-game-select')
                .append($("<option></option>")
                    .attr("value", value.ID)
                    .attr("role", value.SetupID)
                    .attr("class", value.GameID)
                    // .attr("selected", '')
                    .text(value.GameName));
        });




    }

    function displayGameDetailsInSelectGameModal(SetupID) {
        let totalPrize = 0;
        $("#select-game-forPlay-Game-detail-display tbody").empty();
        $("#edit_setup_table tbody").empty();
        $("#new_setup_table tbody").empty();
        console.log("=======================================================");
        let gameDetailList = [];
        let AllGameDetails = userGameMst.AllGameDetails;
        $.each(AllGameDetails, function (key, value) {
            if (value.SetupID == SetupID) {
                gameDetailList.push(value);
            }
        });
        console.log("gameDetailList > ", gameDetailList);

        for (let i = 0; i < gameDetailList.length; i++) {

            var OneLnPrice = gameDetailList[i].OneLnPrice;
            var TwoLnPrice = gameDetailList[i].TwoLnPrice;
            var FHPrice = gameDetailList[i].FHPrice;
            var CornerPrice = gameDetailList[i].CornerPrice;
            var mastergameDetailID = gameDetailList[i].ID;

            var eachRowPrice = parseFloat(OneLnPrice) + parseFloat(TwoLnPrice) + parseFloat(FHPrice) + parseFloat(CornerPrice);

            var ID = gameDetailList[i].GameID;
            var GAME_NAME = gameDetailList[i].GameName;
            var C = {
                "id": gameDetailList[i].ColorID,
                "name": gameDetailList[i].Color
            };
            var GameColor = getOptionsNameForDisplay(C);

            var onlineTD = "";
            var twoLineTD = "";
            var fullHTD = "";
            var cornerTD = "";

            var IsOneLn = false;
            var IsTwoLn = false;
            var IsFH = false;
            var IsCorner = false;

            IsOneLn = gameDetailList[i].IsOneLn;
            IsTwoLn = gameDetailList[i].IsTwoLn;
            IsFH = gameDetailList[i].IsFH;
            IsCorner = gameDetailList[i].IsCorner;

            onlineTD = OneLnPrice;
            twoLineTD = TwoLnPrice;
            fullHTD = FHPrice;
            cornerTD = CornerPrice;

            var radioBtn = "<p><label><input name='select-toPlay-game' role='" + mastergameDetailID + "' class='playSelectedGame' type='radio' /><span class='radio-label'>&nbsp;</span></label></p>";

            var tr = "<tr>" +
                "<td> <input id='game_id_" + i + "' role='" + ID + "' type='hidden' value='" + GAME_NAME + "'/> " + GAME_NAME + " </td>" +
                "<td>" +
                GameColor
                + "</td>" +
                "<td>" +
                onlineTD
                + "</td>" +
                "<td>" +
                twoLineTD
                + "</td>" +
                "<td>" +
                fullHTD
                + "</td>" +
                "<td>" +
                cornerTD
                + "</td>" +
                "<td>" + radioBtn + "</td>"
                + "</tr>";
            $("#select-game-forPlay-Game-detail-display tbody").append(tr);
            totalPrize = parseFloat(totalPrize) + parseFloat(eachRowPrice);
        }
        displayTotalPrize(totalPrize);
    }

    function displayTotalPrize(totalPrize) {
        let roundOfftotalPrize = (Math.round(totalPrize * 100) / 100).toFixed(2);
        totalPrice = roundOfftotalPrize;
        $("#total-price").val(roundOfftotalPrize);
    }





    //---------------------------------------------

    function toastMsg(msg) {
        M.Toast.dismissAll();
        M.toast({ html: msg, classes: 'rounded' });
    }

    function blinker() {
        $('.blink').fadeOut(200);
        $('.blink').fadeIn(200);
    }
    setInterval(blinker, 300);


    //----------------------------------------------------------Security------------------------------------------

    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);

    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        txt = '';
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
    function md5blk(s) { /* I figured global was faster.   */
        var md5blks = [], i; /* Andy King said do it this way. */
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i)
                + (s.charCodeAt(i + 1) << 8)
                + (s.charCodeAt(i + 2) << 16)
                + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s = '', j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function md5(s) {
        return hex(md51(s));
    }

    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
        function add32(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    }






});