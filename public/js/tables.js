var selectedId = '';
var selectedUser = '';

$(document).ready(function() {
	$(".table-row").on('click', function(){
		$(this).addClass('selected').siblings().removeClass('selected');    
		// selectedId=$(this).find('.stationId').html();
		selectedId=$(this).attr("data");
		console.log("selected = " + selectedId);
		selectedUser = $(this).attr("data2"); // This is the username
		console.log("user = " + selectedUser)
		// if ($(this).attr("username") !== typeof undefined) {

		// }
	});

	$('#view-station-btn').click(function() {
		if (selectedId == '') {
			alert("Please select station");
		} else {
			url = window.location.href
			url = url.substring(0, url.lastIndexOf("/"));
			url += "/admin_stationview?stationId=" + selectedId;
			window.location.href = url;
		}
	});

	$('#create-new-station-btn').click(function() {
		url = window.location.href
		url = url.substring(0, url.lastIndexOf("/"));
		url += "/admin_createstation";
		window.location.href = url;
	});

	$('#assign-to-new-btn').click(function() {
		if (selectedId == '') {
			alert("Please select card");
		} else {
			url = window.location.href
			url = url.substring(0, url.lastIndexOf("/"));
			url += "/unlock?cardnum=" + selectedId + "&newUser=" + selectedUser + "&toNew=1";
			window.location.href = url;
		}
	});

	$('#assign-to-prev-btn').click(function() {
		if (selectedId == '') {
			alert("Please select card");
		} else {
			url = window.location.href
			url = url.substring(0, url.lastIndexOf("/"));
			url += "/unlock?cardnum=" + selectedId + "&newUser=" + selectedUser + "&toNew=0";
			window.location.href = url;
		}
	});

	$('#reset-filter-btn').click(function() {
		url = window.location.href
		url = url.substring(0, url.lastIndexOf("/"));
		url += "/admin_cardmanage";
		window.location.href = url;
	});

	$('#set-value-btn').click(function() {
		if (selectedId == '') {
			alert("Please select card");
		} else {
			// alert($('#value-input').val());
			url = window.location.href
			url = url.substring(0, url.lastIndexOf("/"));
			url += "/updatecardvalue?cardnum=" + selectedId + "&newvalue=" + $('#value-input').val();
			window.location.href = url;
			console.log(url);
		}
	});

	$('#transfer-card-btn').click(function() {
		if (selectedId == '') {
			alert("Please select card");
		} else {
			// alert($('#transfer-input').val());
			url = window.location.href
			url = url.substring(0, url.lastIndexOf("/"));
			url += "/updatecardowner?cardnum=" + selectedId + "&newowner=" + $('#transfer-input').val();
			window.location.href = url;
		}
	});

	$('#reset-flow-filter-btn').click(function() {
		url = window.location.href
		url = url.substring(0, url.lastIndexOf("/"));
		url += "/admin_flowreport";
		window.location.href = url;
	});

	// $('#remove-btn').click(function() {
	// 	url = window.location.href
	// 	url = url.substring(0, url.lastIndexOf("/"));
	// 	url += "/removeCard";
	// 	window.location.href = url;
	// });



});