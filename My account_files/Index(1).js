$(function() {
	$('#main-menu').smartmenus({
		subMenusSubOffsetX: 6,
		subMenusSubOffsetY: -8
	});
});

$(document).mouseup(function (e) {
    var container = $("#show-dropdown");
    if (container.has(e.target).length === 0){
        container.hide();
    }
});