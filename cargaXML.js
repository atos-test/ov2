var cargaXML={
    cacheXML: {},
    loadXML: function (urlXMLFile,callbackOK, callbackError,customPrefix) {
        var self=cargaXML;
        console.log("Trato de cargar ",urlXMLFile);
        //Prefijo por defecto para casi todos los XMLs
        var prefix="c";
        if (customPrefix){
            prefix=customPrefix;
        }
        
        if (urlXMLFile in self.cacheXML){
            console.log("CacheXML Hit: => ",urlXMLFile);
            callbackOK(self.cacheXML[urlXMLFile]);
            return;
        }

        var request = new XMLHttpRequest();
        request.open("GET", "hojaProductos.xml", false);
        request.setRequestHeader("Content-Type", "text/xml");
        
 
        // Place the response in an XML document.
        
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200 || request.status == 0) {
                    var x2js = new X2JS({
                        arrayAccessForm : "prefix",
                        arrayPrefix : prefix
                    });
                    var xmlFile = request.responseXML;
                    console.log("xmlFile ==>", xmlFile);

                    var dataJSON=x2js.xml2json(xmlFile);
                
                    self.cacheXML[urlXMLFile]=dataJSON;
                    
                    callbackOK(dataJSON);
                }else{
                    alert("Error cargando XML["+urlXMLFile+"]");
                    if(callbackError!=null){
                        callbackError();
                    }
                }
            }
        };
        request.send();
        
    }
};
    