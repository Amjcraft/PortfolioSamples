(function(){

var _apiuri = "https://teex.org/_api/web/lists/",
	_pageId = $('#pageID').text(); //This value is generated on the masterpage by an ASP.Net Control.
 
function IntMetroTiles(callback) {
	var requesturi = _apiuri + "GetByTitle('Images-Metrotiles')/Items?$filter=Associated_x0020_Page_x003a_ID eq" + _pageId + "&$select=LinkFilename,Title, Description, LinkTo";
	MakeAPICAll(requesturi, callback);
}


function MakeAPICAll(calluri, callback){
    $.ajax({
        method: "GET",
        headers: { "accept": "application/json; odata=verbose"},
        url: calluri,
        success: callback,
        error: function () {
            errorData = {"d":{"results":[{"error": "Oops, Sorry. We've had an unexpected error and were unable to get your content."}]}}
            callback(errorData);
        },
           
    });
}


function BuildMetroTiles(data) {
    $(document).ready(function () {
        if (data.d.results[0].error) {
            var Source = $("#Error-Template").html();
        } else {
            var Source = $('#MetroTiles-Template').html();
        }
        //Compile the actual Template file
        var template = Handlebars.compile(Source);
 
        var output = template(data.d);
 
        //Replace the body section with the new code.
        $("#metroTileItems").html(output);
    });
}

IntMetroTiles(BuildMetroTiles);
})();