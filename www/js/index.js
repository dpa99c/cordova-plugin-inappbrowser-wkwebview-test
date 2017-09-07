var IAB_PAGE_URL = "iab_content_page.html";

var webView, iabOpts, osVersion, iab, updateTimerId, iabUrl;

function log(msg){
    console.log(msg);
    $('#log').append("<p>"+msg+"</p>");
}

function openIAB(){
    iab = cordova.InAppBrowser.open(IAB_PAGE_URL, '_blank', iabOpts);
    
    iab.addEventListener('loadstart', function(e) {
                         log("received 'loadstart' event for: "+ e.url);
                         iabUrl = e.url;
                         });
    iab.addEventListener('loadstop', function(e) {
                         log("received 'loadstop' event for: "+ e.url);
                         testInjection();
                         });
    iab.addEventListener('loaderror', function(e) {
                         log("received 'loaderror' event for: "+ e.url);
                         });
    iab.addEventListener('exit', function() {
                         log("received 'exit' event");
                         clearInterval(updateTimerId);
                         updateTimerId = null;
                         document.getElementById('mycookie').value = readCookie('mycookie');
                         });
}

function testInjection(){
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
                      }, function(returnValue){
                      returnValue = returnValue[0];
                      log("executeScript callback returned : " + returnValue);
                      });
    
    iab.insertCSS({
                  code: "body *{color: red !important;} \
                  .bottom { position: fixed; bottom: 0; z-index: 500; width: 100%; background: black; opacity: 0.5; padding: 10px; font-size: 20px;}"
                  }, function(){
                  log("insertCSS called back");
                  });
    
    updateTimerId = setInterval(function(){
                                iab.executeScript({
                                                  code: "(function() { " +
                                                  "var timeEl = document.getElementById('time');" +
                                                  "if(!timeEl){ " +
                                                  "var body = document.querySelector('body'); " +
                                                  "timeEl = document.createElement('div'); " +
                                                  "timeEl.id=\"time\"; " +
                                                  "body.appendChild(timeEl); " +
                                                  "}" +
                                                  "var time = (new Date()).toISOString(); " +
                                                  "timeEl.innerHTML = time; " +
                                                  "return time;" +
                                                  "})();"
                                                  }, function(returnValue){
                                                  returnValue = returnValue[0];
                                                  log("executeScript for updateTimer returned : " + returnValue);
                                                  });
                                }, 1000);
   
}

// Create cookie
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}

// Read cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}

function setMyCookie(){
	createCookie('mycookie', document.getElementById('mycookie').value);
}


function onDeviceReady(){
    console.log("deviceready");
    
    osVersion = parseFloat(device.version);
    
    if( device.platform === "iOS" ) {
        iabOpts = 'location=no,toolbar=yes';
        if(window.webkit && window.webkit.messageHandlers ) {
            webView = "WKWebView" ;
        }else{
            webView = "UIWebView" ;
        }
    }else{
        iabOpts = 'location=yes';
        if(navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
            webView = "Crosswalk" ;
        } else {
            webView = "System" ;
        }
    }
    
    $('#platform').html(device.platform + " " + device.version);
    $('#webview').html(webView);
	
	setMyCookie();
	document.getElementById('mycookie').addEventListener('change', setMyCookie);
}

$(document).on('deviceready', onDeviceReady);
