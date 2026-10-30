// Handler that uses various data-* attributes to trigger
// specific actions, mimicing bootstraps attributes

function myFunction() {
    var x = document.getElementById("collapse-headermenu").getAttribute("aria-expanded");
    if (x == "true") {
        x = "false"
    } else {
        x = "true"
    }
    document.getElementById("collapse-headermenu").setAttribute("aria-expanded", x);
    
    var y = document.getElementById("collapse-footermenu").getAttribute("aria-expanded");
    if (y == "true") {
        y = "false"
    } else {
        y = "true"
    }
    document.getElementById("collapse-footermenu").setAttribute("aria-expanded", x);
    //document.getElementById("p2").innerHTML = "aria-expanded =" + x;
}

var triggersh = Array.from(document.querySelectorAll('[data-toggle="collapse-headermenu"]'));
var triggersf = Array.from(document.querySelectorAll('[data-toggle="collapse-footermenu"]'));

window.addEventListener('click', function (ev) {
    var elm = ev.target;
    if (triggersf.includes(elm)) {
        var selector = elm.getAttribute('data-target');
        collapse(selector, 'toggle');
    }
    else if (triggersh.includes(elm)) {
        var selector = elm.getAttribute('data-target');
        collapse(selector, 'toggle');
    }
}, false);


var fnmap = {
    'toggle': 'toggle',
    'show': 'add',
    'hide': 'remove'
};

var collapse = function collapse(selector, cmd) {
    var targets = Array.from(document.querySelectorAll(selector));
    targets.forEach(function (target) {
        target.classList[fnmap[cmd]]('show');
    });
};


/*

$(document).ready(function(){
    $("img").each(function(){
        var img = $(this);
        var image = new Image();
        image.src = $(img).attr("src");
        var no_image = "/wps/contenthandler/dav/themelist/student.theme.adaptive-test-version-v/img/wrong-img.png";
        if (image.naturalWidth == 0 || image.readyState == 'uninitialized'){
            $(img).unbind("error").attr("src", no_image).css({
                height: $(img).css("height"),
                width: $(img).css("width"),
            });
        }
  });
});
*/

$(document).ready(function() {
  $('.left-menu-portlet').each(function() {
    $("a:contains('HOTLINE')").css({"color":"red"});
  });
});