var PortfolioTiles = function (ctx, targetList) {
    this.clientContext = ctx;
    this.targetList = targetList;
    this.currentPageID;
    this.fieldsObj = {};
    this.collListItem;
    this.portfolioContent = {};
};
 
 
PortfolioTiles.prototype = function () {
 
    var  setCurrentPageID = function (){
        this.currentPageID = _spPageContextInfo.pageItemId;
    },
        
    encodeSpaces = function (string) {
        return string.replace(/\s/g, '_x0020_');
    },
 
    removeSpaces = function (string) {
        return string.replace(/\s/g, '');
    },
 
    getPortfolioContent = function () {
        return this.portfolioContent; 
    },
 
    createContentEllipsis = function (string) {
        return string.substring(0, 100) + "...";
    },
 
    lanuchModal = function () {
      
    },
 
    outputHTMLMarkup = function (fieldsCollection) {
 
        var htmlModalOutput = "";
        var htmlTilesOutput = "";
        var portfolioContent = {
            'Title': {},
            'Content': {}
        };
        htmlTilesOutput += ' <div class="content-tiles">';
 
        $.each(fieldsCollection, function (key, val) {
 
            htmlTilesOutput += '   <div class="tile-container">';
            htmlTilesOutput += '   <div class="metro-tile"><img class="tile-image" src="' + fieldsCollection[key]['FileRef'] + '" alt="' + fieldsCollection[key]['Title'] + '" /></div>';
            htmlTilesOutput += '        <div class="tile-hover-container">';
            htmlTilesOutput += '         <a class="lanuchModal" id="' + key + '" title="Read More">';
            htmlTilesOutput += '              <h3 class="tile-title">' + fieldsCollection[key]['Title'] + '</h3>';
            htmlTilesOutput += '                      <div class="tile-info">' + createContentEllipsis(fieldsCollection[key]['Content']) + '</div>';
            htmlTilesOutput += '                      <div class="tile-readmore">';
            htmlTilesOutput += '                          <span class="fa fa-arrow-circle-right"></span>';
            htmlTilesOutput += '                      </div>';
            htmlTilesOutput += '               <div class="trans-back"></div> ';
            htmlTilesOutput += '          </a>';
            htmlTilesOutput += '         </div>';
            htmlTilesOutput += '   </div><!-- Tile Container -->';
 
            portfolioContent['Title'][key] = fieldsCollection[key]['Title'];
            portfolioContent['Content'][key] = fieldsCollection[key]['Content'];
 
        });
        this.portfolioContent = portfolioContent;
 
        htmlTilesOutput += '</div>';
 
        htmlModalOutput  += '<div class="modal fade">';
        htmlModalOutput  += '  <div class="modal-dialog">';
        htmlModalOutput  += '    <div class="modal-content">';
        htmlModalOutput  += '     <div class="modal-header">';
        htmlModalOutput  += '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        htmlModalOutput  += '        <h4 class="modal-title"></h4>';
        htmlModalOutput  += '     </div>';
        htmlModalOutput  += '      <div class="modal-body">';
        htmlModalOutput  += '     </div>';
        htmlModalOutput  += '      <div class="modal-footer">';
        htmlModalOutput  += '       <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        htmlModalOutput  += '      </div>';
        htmlModalOutput  += '   </div><!-- /.modal-content -->';
        htmlModalOutput  += ' </div><!-- /.modal-dialog -->';
        htmlModalOutput  += '</div><!-- /.modal -->';
 
       
 
        $('#portfolioWrapper').append(htmlTilesOutput);
        $('#portfolioWrapper').append(htmlModalOutput);
 
    },
    
    buildRequest = function () {
 
        cxtWeb = this.clientContext.get_web();
        var oTargetList = cxtWeb.get_lists().getByTitle(this.targetList);
 
 
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(
            '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Order_x0020_Priority" Ascending="TRUE"/>' +
            '</OrderBy><Where><Eq><FieldRef Name=\'Associated_x0020_Page\' LookupId=\'TRUE\'/>' +
            '<Value Type=\'Lookup\' >' + this.currentPageID + '</Value></Eq></Where></Query>' +
            '<RowLimit>50</RowLimit></View>'
        );
 
        this.fieldsObj['Title'] = "";
        this.fieldsObj['Content'] = "";
        this.fieldsObj['FileRef'] = "";
        
 
        requestObj.call(this, oTargetList, camlQuery);
    },
 
   requestObj = function (oTargetList, camlQuery) {
 
        this.collListItem = oTargetList.getItems(camlQuery);
 
        this.clientContext.load(this.collListItem);
        this.clientContext.executeQueryAsync(
            Function.createDelegate(this, onQuerySucceeded),
            Function.createDelegate(this, onQueryFailed)
        )
    },
 
    onQuerySucceeded = function () {
 
        var listItemInfo = '';
        var listItemEnumerator = this.collListItem.getEnumerator();
        var fieldsCollection = [];
 
        if (this.collListItem.get_count() !== 0) {
 
            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var tempFieldsCollection = JSON.parse(JSON.stringify(this.fieldsObj));
               
                $.each(this.fieldsObj, function (key, val) {
                    tempFieldsCollection[key] = oListItem.get_item(encodeSpaces(key));
                    if (tempFieldsCollection[key] === null) {
                        tempFieldsCollection[key] = ""
                    }
                })
                fieldsCollection.push(tempFieldsCollection);
            }
            outputHTMLMarkup.call(this, fieldsCollection)
        }
    },
 
    onQueryFailed = function (sender, args) {
        console.log('Portfolio Request failed. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
    },
 
 
    intPortfolioTiles = function () {
        setCurrentPageID.call(this);
        buildRequest.call(this);
    };
 
    return {
 
        intPortfolioTiles: intPortfolioTiles,
        portfolioContentCollection: getPortfolioContent,
        callPortfolioModal: lanuchModal
 
    };
}();