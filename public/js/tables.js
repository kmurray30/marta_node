var selectedId = '';

$(document).ready(function() {
	$(".table-row").on('click', function(){
		$(this).addClass('selected').siblings().removeClass('selected');    
		// selectedId=$(this).find('.stationId').html();
		selectedId=$(this).attr("data");
		console.log(selectedId);
	});

	$('#view-station-btn').click(function() {
		console.log("hi");
		if (selectedId == '') {
			alert("Please select station");
		} else {
			url = window.location.href
			url = url.substring(0, url.lastIndexOf("/"));
			url += "/admin_stationview?stationId=" + selectedId;
			window.location.href = url;
		}
	});

});