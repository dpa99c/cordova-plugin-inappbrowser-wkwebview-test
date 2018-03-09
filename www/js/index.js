var IAB_PAGE_URL = "iab_content_page.html";

var webView, osVersion, iab, updateTimerId, startTime;

function log(msg) {
    $('#log').append("<p>" + msg + "</p>");
}

function openIAB() {
    var iabOpts = getIabOpts();
    if(document.getElementById('init-hidden').checked){
        document.body.className = "hidden";
        iabOpts += ",hidden=yes";
    }

    iab = cordova.InAppBrowser.open(IAB_PAGE_URL, '_blank', iabOpts);

    iab.addEventListener('loadstart', function (e) {
        log("received 'loadstart' event");
        console.log("received 'loadstart' event for: " + e.url);
    });
    iab.addEventListener('loadstop', function (e) {
        log("received 'loadstop' event");
        console.log("received 'loadstop' event for: " + e.url);
        onIABLoaded();
    });
    iab.addEventListener('loaderror', function (e) {
        log("received 'loaderror' event");
        console.error("received 'loaderror' event for: " + e.url);
    });
    iab.addEventListener('exit', function () {
        log("received 'exit' event");
        clearInterval(updateTimerId); updateTimerId = null;
        readMyCookie();
    });
    iab.addEventListener('message', function (e) {
        log("received 'message' event");
        console.dir(e);
        if(e.data.action === 'hide'){
            hideIAB();
        }
    });
}

function onIABLoaded() {
    iab.executeScript({
        code: "(function() { " +
        "var body = document.querySelector('body'); " +
        "var bottom = document.createElement('div'); " +
        "bottom.innerHTML = 'Absolute Bottom'; " +
        "bottom.classList.add('bottom');  " +
        "body.appendChild(bottom); " +
        "var time = document.createElement('div'); " +
        "time.id=\"time\";" +
        "body.appendChild(time); " +
        "})(); " +
        "document.getElementsByTagName('h1')[0].innerHTML = \" Injected Title\";"
    }, function (returnValue) {
        returnValue = returnValue[0];
        log("executeScript callback returned : " + returnValue);
    });

    iab.insertCSS({
        code: "body *{color: red !important;} \
                  .bottom { position: fixed; bottom: 0; z-index: 500; width: 100%; background: black; opacity: 0.5; padding: 10px; font-size: 20px;}"
    }, function () {
        log("insertCSS called back");
    });

    startTime = (new Date()).getTime();
    updateTimerId = setInterval(function () {
        var elapsedSecs = Math.floor(((new Date()).getTime() - startTime)/1000);
        iab.executeScript({
            code: "(function() { " +
            "var timeEl = document.getElementById('time');" +
            "timeEl.innerHTML = "+elapsedSecs+"; " +
            "return "+elapsedSecs+";" +
            "})();"
        }, function (returnValue) {
            returnValue = returnValue[0];
            console.log("executeScript for updateTimer returned : " + returnValue);
        });
    }, 1000);

}

function hideIAB(){
    document.body.className = "hidden";
    iab.hide();
    readMyCookie();
}

function showIAB(){
    document.body.className = "";
    iab.show();
    iab.executeScript({
        code: "readMyCookie();"
    });
}

// Create cookie
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Read cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// Erase cookie
function eraseCookie(name) {
    createCookie(name,"",-1);
}

function setMyCookie() {
    createCookie('mycookie', document.getElementById('mycookie').value);
}

function readMyCookie(){
    document.getElementById('mycookie').value = readCookie('mycookie');
}


function onDeviceReady() {
    console.log("deviceready");

    osVersion = parseFloat(device.version);

    $('#platform').html(device.platform + " " + device.version);
    getIabOpts();
    $('#webview').html(webView);

    setMyCookie();
    document.getElementById('mycookie').addEventListener('change', setMyCookie);
}

function getIabOpts(){
    var iabOpts;
    if (device.platform === "iOS") {
        iabOpts = 'location=no,toolbar=yes';
        if (window.webkit && window.webkit.messageHandlers) {
            webView = "WKWebView";
        } else {
            webView = "UIWebView";
        }
    } else {
        iabOpts = 'location=yes';
        if (navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk";
        } else {
            webView = "System";
        }
    }
    return iabOpts;
}


$(document).on('deviceready', onDeviceReady);
