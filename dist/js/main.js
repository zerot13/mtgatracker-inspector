"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _appData;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("./api"),
    API_URL = _require.API_URL;

var _require2 = require("./conf"),
    pagePrefix = _require2.pagePrefix;

var toastr = require("toastr");
window.toastr = toastr;

// https://stackoverflow.com/questions/4723213/detect-http-or-https-then-force-https-in-javascript
if (location.protocol !== "https:" && location.hostname != "localhost") {
  window.stop();
  location.protocol = "https:";
}

var appData = (_appData = {
  username: "unknown",
  currentDeckName: "",

  currentGameWinner: "loading ...",
  currentGameHasInfo: false,
  currentGameHasRankInfo: false,

  currentGameEvent: "",
  currentGameOnPlay: "",
  currentGameEndPhase: "",
  currentGameElapsedTime: "",
  currentGameTurnCount: -1,
  currentGameHeroRankBefore: "",
  currentGameHeroRankAfter: "",
  currentGameHeroRankChange: 0.0,

  currentGameName: "",
  currentGameHero: "",
  currentGameHeroDeck: [],
  currentGameHeroDeckName: "loading ..."
}, _defineProperty(_appData, "currentGameHeroDeck", "loading ..."), _defineProperty(_appData, "currentGameOpponent", ""), _defineProperty(_appData, "currentGameOpponentDeck", []), _defineProperty(_appData, "currentGameOpponentDeckName", "loading ..."), _defineProperty(_appData, "currentGameOpponentRank", "loading ..."), _defineProperty(_appData, "homeDeckList", []), _defineProperty(_appData, "homeGameList", []), _defineProperty(_appData, "homeGameListPage", 1), _defineProperty(_appData, "winLossColors", [0, 0, 0, 0, 0]), _defineProperty(_appData, "winLossColorChart", null), _defineProperty(_appData, "bound", null), _defineProperty(_appData, "pagePrefix", pagePrefix), _defineProperty(_appData, "overallWinLoss", [0, 0]), _defineProperty(_appData, "overallWinLossChart", null), _defineProperty(_appData, "playerEventHistoryChart", null), _defineProperty(_appData, "totalGamesPlayed", "loading..."), _defineProperty(_appData, "totalDecks", "loading..."), _defineProperty(_appData, "totalTimeSeconds", "loading..."), _defineProperty(_appData, "longestGameLengthSeconds", "loading..."), _defineProperty(_appData, "averageGameLengthSeconds", "loading..."), _appData);

// do this very first to try to avoid FouC
var darkModeEnabled = localStorage.getItem("dark-mode") == "true" || false;
var enableDarkMode = function enableDarkMode(noTransition) {
  if (noTransition) {
    $(".themeable").addClass("notransition");
  }
  $(".themeable").addClass("dark-mode");
  if (appData.winLossColorChart) {
    appData.winLossColorChart.options.scales.yAxes[0].gridLines.color = "#5d5d5d";
    appData.winLossColorChart.options.scales.xAxes[0].gridLines.color = "#5d5d5d";
    appData.winLossColorChart.options.scales.yAxes[0].ticks.fontColor = "#dedede";
    appData.winLossColorChart.options.scales.xAxes[0].ticks.fontColor = "#dedede";
    appData.winLossColorChart.options.title.fontColor = "#dedede";
    appData.winLossColorChart.data.datasets[0].backgroundColor = ["#005429", "#004ba5", "#940400", "#8c8c51", "#6d6d6d"];
    appData.winLossColorChart.update();
  }
  if (appData.overallWinLossChart) {
    appData.overallWinLossChart.options.title.fontColor = "#dedede";
    appData.overallWinLossChart.options.legend.labels.fontColor = "#dedede";
    appData.overallWinLossChart.data.datasets[0].borderColor = "#333";
    appData.overallWinLossChart.update();
  }
  if (appData.playerEventHistoryChart) {
    appData.playerEventHistoryChart.options.scales.yAxes[0].gridLines.color = "#5d5d5d";
    appData.playerEventHistoryChart.options.scales.xAxes[0].gridLines.color = "#5d5d5d";
    appData.playerEventHistoryChart.options.legend.labels.fontColor = "#dedede";
    appData.playerEventHistoryChart.update();
  }
  $(".themeable").removeClass("notransition");
  setTimeout(function () {
    // after it has been long enough for any transitions to complete, flip the toggle
    // in case this is the first load, and the toggle is blank
    $("#dark-mode").prop("checked", true);
  }, 300);
};
window.enableDarkMode = enableDarkMode;
var disableDarkMode = function disableDarkMode() {
  $(".themeable").removeClass("dark-mode");
  if (appData.winLossColorChart) {
    appData.winLossColorChart.options.scales.yAxes[0].gridLines.color = "#d5d5d5";
    appData.winLossColorChart.options.scales.xAxes[0].gridLines.color = "#d5d5d5";
    appData.winLossColorChart.options.scales.xAxes[0].ticks.fontColor = "#696969";
    appData.winLossColorChart.options.scales.yAxes[0].ticks.fontColor = "#696969";
    appData.winLossColorChart.options.title.fontColor = "#696969";
    appData.winLossColorChart.data.datasets[0].backgroundColor = ["#c4d3ca", "#b3ceea", "#e47777", "#f8e7b9", "#a69f9d"];
    appData.winLossColorChart.update();
  }
  if (appData.overallWinLossChart) {
    appData.overallWinLossChart.options.title.fontColor = "#474747";
    appData.overallWinLossChart.options.legend.labels.fontColor = "#474747";
    appData.overallWinLossChart.data.datasets[0].borderColor = "#eee";
    appData.overallWinLossChart.update();
  }
  if (appData.playerEventHistoryChart) {
    appData.playerEventHistoryChart.options.scales.yAxes[0].gridLines.color = "#d5d5d5";
    appData.playerEventHistoryChart.options.scales.xAxes[0].gridLines.color = "#d5d5d5";
    appData.playerEventHistoryChart.options.legend.labels.fontColor = "#696969";
    appData.playerEventHistoryChart.update();
  }
};
var toggleDarkMode = function toggleDarkMode() {
  darkModeEnabled = !darkModeEnabled;
  localStorage.setItem("dark-mode", darkModeEnabled);
  if (darkModeEnabled) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
};
window.toggleDarkMode = toggleDarkMode;

// https://stackoverflow.com/questions/46041831/copy-to-clipboard-with-break-line
function clipboardCopy(text) {
  var input = document.createElement('textarea');
  input.innerHTML = text;
  input.id = "heyheyhey";
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
}

function exportDeck(deck) {
  var result = "";
  if (deck && (typeof deck === "undefined" ? "undefined" : _typeof(deck)) === 'object' && deck.constructor === Array) {
    deck.forEach(function (cardObj) {
      if (typeof cardObj == "number" || typeof cardObj == "string") {
        var card = cardUtils.allCards.findCard(cardID);
        result += "1 " + card.get("prettyName") + " (" + card.get("set") + ") " + card.get("setNumber") + "\n";
      } else if (cardObj.count) {
        result += cardObj.count + " " + cardObj.name + " (" + cardObj.set + ") " + cardObj.setNumber + "\n";
      }
    });
  }
  clipboardCopy(result);
  toastr.info("Deck Exported to Clipboard");
}

window.exportDeck = exportDeck;

if (localStorage.getItem("dark-mode") == "true") enableDarkMode(true);

var cookies = require('browser-cookies');
window.ncookies = cookies;

var cardUtils = require('mtga');
window.cardUtils = cardUtils;

var page = require('page');
window.page = page;
var spaRouter = require('./spaRouter');

var _require3 = require('./api'),
    getGames = _require3.getGames,
    hideDeck = _require3.hideDeck,
    unHideDeck = _require3.unHideDeck;

window.appData = appData;

rivets.formatters.humanseconds = function (value) {
  try {
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    var minute_seconds = 60;
    var hour_seconds = minute_seconds * 60;
    var day_seconds = hour_seconds * 24;

    while (value > hour_seconds) {
      hours += 1;
      value -= hour_seconds;
    }
    while (value > minute_seconds) {
      minutes += 1;
      value -= minute_seconds;
    }
    seconds = value.toFixed(2);

    value = "";
    if (days) {
      value += days + " days, ";
    }if (hours) {
      value += hours + " hours, ";
    }if (minutes) {
      value += minutes + " minutes, ";
    }
    value += seconds + " seconds";
    return value;
  } catch (error) {
    console.log(error);
    return value;
  }
};

rivets.binders.fixhref = function (el, value) {
  if (!el.href.includes(pagePrefix)) {
    var hrefStart = el.href.split("/").slice(0, 3).join("/");
    var hrefEnd = el.href.split("/").slice(3).join("/");
    el.href = "" + hrefStart + pagePrefix + "/" + hrefEnd;
  }
};

rivets.binders.multimana = function (el, value) {
  el.innerHTML = "";
  var ih = "";
  if (value === undefined) value = [];
  value.forEach(function (val) {
    if (val == "Blue") val = "u";
    val = val[0].toLowerCase();
    if (val != "c") {
      ih += "<i class=\"mi mi-mana mi-shadow mi-" + val + "\"></i>";
    }
  });
  el.innerHTML = ih;
};

rivets.binders.rarity = function (el, value) {
  el.classList.remove("rare");
  el.classList.remove("mythic");
  el.classList.remove("uncommon");
  el.classList.remove("common");
  value = value.toLowerCase().split(" ")[0];

  el.classList.add(value);
};

rivets.binders.mana = function (el, value) {
  if (value == "Blue") value = "u";
  value = value[0].toLowerCase();
  var mi_class = "mi-" + value.toLowerCase();
  el.classList.remove("mi-w");
  el.classList.remove("mi-b");
  el.classList.remove("mi-g");
  el.classList.remove("mi-u");
  el.classList.remove("mi-r");
  el.classList.remove("mi-1");
  el.classList.remove("mi-2");
  el.classList.remove("mi-3");
  el.classList.remove("mi-4");
  el.classList.remove("mi-5");
  el.classList.remove("mi-6");
  el.classList.remove("mi-7");
  el.classList.remove("mi-8");
  el.classList.remove("mi-9");
  el.classList.remove("mi-10");
  el.classList.remove("mi-x");
  el.classList.add(mi_class);
};

rivets.binders.typecount = function (el, val) {
  var expectedType = $(el).attr("type-check");
  var total = 0;
  val.forEach(function (card) {
    if (card.cardType == expectedType) {
      total += card.count;
    }
  });
  $(el).html($(el).html().split(" ")[0] + (" &mdash; " + total));
  if (total) {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
};

rivets.binders.hideifnotcorrecttype = function (el, val) {
  var expectedType = $(el).attr("type-check");
  if (val != expectedType) {
    el.style.display = 'none';
  }
};

rivets.binders.linegame = function (el, val) {
  $(el).removeClass("danger").removeClass("success");
  if (val) {
    if (!val.won) {
      $(el).addClass("danger");
      el.innerHTML = '<i class="fa fa-times-circle"></i>';
    } else {
      $(el).addClass("success");
      el.innerHTML = '<i class="fa fa-check-circle"></i>';
    }
  }
};

rivets.binders.hidedeck = function (el, deckid) {
  console.log("attempting to bind...");
  $(el).click(function () {
    console.log("sliding up: " + '[deckid="' + deckid + '"]');
    $('[deckid="' + deckid + '"]').slideUp();
    hideDeck(deckid, el);
  });
};

rivets.binders.softhidedeck = function (el, deckid) {
  $(el).unbind("click");
  $(el).click(function () {
    console.log("softhiding deck " + deckid);
    hideDeck(deckid, el);
  });
};

rivets.binders.unhidedeck = function (el, deckid) {
  $(el).unbind("click");
  $(el).click(function () {
    console.log("softhiding deck " + deckid);
    unHideDeck(deckid, el);
  });
};

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
  // load both menu templates

  $("#token-req-button").click(authRequest);
  $("#token-submit-button").click(authAttempt);

  $("#top-menu").load(pagePrefix + "/templates/top-menu-inner.html?v=1.3.0", function (loaded) {
    $("#side-menu").load(pagePrefix + "/templates/side-menu-inner.html?v=1.3.0", function (loaded) {
      // this will catch homepage links, but we still need to add page.js middleware in spaRouter
      $("a").click(function (e) {
        window.scrollTo(0, 0);
      });

      if (localStorage.getItem("dark-mode") == "true") enableDarkMode(true);

      $("#logout-button").click(logout);
      $('#side-menu').metisMenu();
      var username = cookies.get("username");
      $("#username").val(username);
      appData.username = username;
      $(window).bind("load resize", function () {
        var topOffset = 50;
        var width = this.window.innerWidth > 0 ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
          $('div.navbar-collapse').addClass('collapse');
          topOffset = 100; // 2-row-menu
        } else {
          $('div.navbar-collapse').removeClass('collapse');
        }

        var height = (this.window.innerHeight > 0 ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
          $("#page-wrapper").css("min-height", height + "px");
        }
      });

      var url = window.location;
      var element = $('ul.nav a').filter(function () {
        return this.href == url;
      }).addClass('active').parent();

      while (true) {
        if (element.is('li')) {
          element = element.parent().addClass('in').parent();
        } else {
          break;
        }
      }
    });
  });
});

var logout = function logout() {
  cookies.erase("username");
  cookies.erase("token");
  document.location.href = pagePrefix + "/login/";
};

var authAttempt = function authAttempt() {
  $("#auth-loading").css("opacity", "1");
  $("#token-submit-button").addClass("btn-primary").removeClass("btn-success").val("Attempting to log in...").prop('disabled', true);
  var username = $("#username").val();
  var accessCode = $("#access-code").val();
  $.ajax({
    url: API_URL + "/public-api/auth-attempt",
    type: "POST",
    data: JSON.stringify({ "username": username, "accessCode": accessCode }),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      cookies.set("token", data.token, { expires: 6 });
      window.location.href = pagePrefix + "/";
    },
    error: function error(xhr, status, err) {
      $("#token-submit-button").removeClass("btn-primary").addClass("btn-success").val("Log in").prop('disabled', false);
      $("#auth-loading").css("opacity", "0");
      $('#access-code').pincodeInput().data('plugin_pincodeInput').clear();
      console.log("error! " + status);
      console.log(xhr);
      console.log(status);
      console.log(err);
      if (xhr.responseJSON.error.includes("auth_error")) {
        toastr.error("Incorrect code, try again");
      } else {
        toastr.error("An unknown error occurred, please try again");
      }
    }
  });
};

var authRequest = function authRequest() {
  $("#token-loading").css("opacity", "1");
  $("#token-req-button").addClass("btn-primary").removeClass("btn-success").val("Sending token...").prop('disabled', true);
  var username = $("#username").val();
  $.ajax({
    url: API_URL + "/public-api/auth-request",
    type: "POST",
    data: JSON.stringify({ "username": username }),
    dataType: "json",
    contentType: "application/json",
    success: function success(data) {
      $("#username").val(data.username);
      cookies.set("username", data.username, { expires: 6 });
      $("#auth-container").slideDown();
      $('#access-code').pincodeInput({
        hideDigits: false,
        keydown: function keydown(e) {
          console.log(e);
        },
        inputs: 6,
        // callback when all inputs are filled in (keyup event)
        complete: function complete(value, e, errorElement) {
          authAttempt();
        }
      });
      $("#token-req-button").addClass("btn-primary").removeClass("btn-success").val("Token Sent").prop('disabled', true);
      $("#token-loading").css("opacity", "0");
    },
    error: function error(xhr, status, err) {
      $("#token-loading").css("opacity", "0");
      console.log("error! " + status);
      console.log(xhr);
      console.log(status);
      console.log(err);
      if (xhr.responseJSON.error.includes("no user found")) {
        $("#token-req-button").removeClass("btn-primary").addClass("btn-success").val("Request Token").prop('disabled', false);
        toastr.error("User not found.<br><br>Note that you must have used MTGATracker to track at least one game in order to log in!<br><br><br><a href='https://mtgatracker.com'>Click here to get MTGATracker!</a>");
      } else if (xhr.responseJSON.error.includes("discord mapping not found")) {
        $("#token-req-button").addClass("btn-primary").removeClass("btn-success").val("Redirecting...").prop('disabled', true);
        window.stop();
        window.location.href = 'https://github.com/shawkinsl/mtga-tracker/blob/master/logging_in.md';
      } else {
        $("#token-req-button").removeClass("btn-primary").addClass("btn-success").val("Request Token").prop('disabled', false);
        toastr.error("An unknown error occurred, please try again");
      }
    }
  });
};