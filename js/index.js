var app = {
    
    hojaProductos: null,
    fichero : "hojaProductos.xml",

    initialize: function() {
        var self = app;
        console.log("initialize");
        self.loadXML();
        self.refreshView();
        self.bindEvents();
    },

    loadXML: function(){
        var self = app;
        console.log("loadXML");

        cargaXML.loadXML(self.fichero,function(dataJSON){
            self.hojaProductos = dataJSON;
            console.log(self.hojaProductos);
            console.log("Cargados datos de hojaProductos");
        });
    },

    refreshView: function(){
        var self = app;

        $("#detalle").hide();

        var products = app.hojaProductos.chojaProductos.Producto.cProducto;

        var template = _.template($('#productList-template').html(), {productList : products});
        $('#productosList').html(template);
        $("#productosList").listview().listview('refresh');
    },

    showList: function(){
        $("#detalle").hide("slide");
        $("#productosList").show("slide");
    },

    showDetail: function(){
        $("#productosList").hide("slide");
        $("#detalle").show("slide");
    },
    
    bindEvents: function() {
        var self = app;
        console.log("bindEvents");

        $('a.contenedorProducto').on("vclick", function(){
            console.log("Pulsado");
            $.mobile.pageContainer.pagecontainer("change", "#loginPage", { transition: "slide", reverse: false });
        });

        $("#btnAtrasLogin").on("vclick", function(){
            console.log("Pulsado atras");
            $.mobile.pageContainer.pagecontainer("change", "#listPage", { transition: "slide", reverse: true });
        });

        $("#btnAceptar").on("vclick", function(){
            console.log("Pulsado Aceptar");
        });

        $("#btnLista").on("vclick",function(){
            self.showList();
        });

        $("#btnDetalle").on("vclick",function(){
            self.showDetail();
        });

        document.addEventListener('deviceready', function(){
            console.log("Received Event: deviceready");
        }, false);
    },
    
    onDeviceReady: function() {
        var self = app;
        self.receivedEvent('deviceready');
    },
    
    receivedEvent: function(id) {
        var self = app;
        console.log('Received Event: ' + id);
    }
};
