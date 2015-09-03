var RelatedPageLinks = function (ctx) {
    this.clientContext = ctx;
    this.currentPageID;
    this.fieldsObj = {};
    this.collListItem;
};
 
 
RelatedPageLinks.prototype = function () {
 
    var  setCurrentPageID = function (){
        this.currentPageID = _spPageContextInfo.pageItemId;
    },
        
    encodeSpaces = function (string) {
        return string.replace(/\s/g, '_x0020_');
    },
 
    outputHTMLMarkup = function (fieldsCollection) {
 
        var htmlOutput = "";
		htmlOutput += '<h2 class="bottom-border">You may also like</h2>';
        htmlOutput += '<ul class="resource-list">';
 
        $.each(fieldsCollection, function (key, val) {
 
   
            var hyperlink = (fieldsCollection[key]["Hyperlink"] !== "") ? fieldsCollection[key]["Hyperlink"] : null;
 
            htmlOutput += '<li class="item-list">';
            htmlOutput += '<a href="' + hyperlink.get_url() + '"';
            htmlOutput += 'title="' + hyperlink.get_description() + '">';
            htmlOutput +=  fieldsCollection[key]["Title"] + '</a>';
            htmlOutput += '</li>';
        });
 
        htmlOutput += '</ul>';
 
        $('#relatedLinksWrapper').append(htmlOutput);
 
    },
    
    buildRequest = function () {
 
        cxtWeb = this.clientContext.get_web();
        var oTargetList = cxtWeb.get_lists().getByTitle("Page-Related-Links");
 
 
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(
            '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name=\'Associated_x0020_Page\' LookupId=\'TRUE\'/>' +
            '<Value Type=\'Lookup\' >' + this.currentPageID + '</Value></Eq></Where></Query>' +
            '<RowLimit>6</RowLimit></View>'
        );
 
        this.fieldsObj['Title'] = "";
        this.fieldsObj['Hyperlink'] = "";
 
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
        console.log('Related Page Links Request failed. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
    },
 
 
    intRelatedPageLinks = function () {
        setCurrentPageID.call(this);
        buildRequest.call(this);
    };
 
    return {
 
        intRelatedPageLinks: intRelatedPageLinks
 
    };
}();