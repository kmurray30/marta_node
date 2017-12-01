// function getParameterByName(name, url) {
//     if (!url) url = window.location.href;
//     name = name.replace(/[\[\]]/g, "\\$&");
//     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//         results = regex.exec(url);
//     if (!results) return null;
//     if (!results[2]) return '';
//     return decodeURIComponent(results[2].replace(/\+/g, " "));
// }

// $(document).ready(function() {
	
// 	$('#checkbox').click(function() {
// 		url = window.location.href
// 		var stationId = getParameterByName('stationId', url);
// 		url = url.substring(0, url.lastIndexOf("/"));
// 		if ($(this).checked) {
// 			// It's currently open so close it
// 			url += "/openstation?stationId=" + stationId + "&action=close";
// 		} else {
// 			// It's currently closed so open it
// 			url += "/openstation?stationId=" + stationId + "&action=open";
// 		}
// 		window.location.href = url;
// 	});

// });