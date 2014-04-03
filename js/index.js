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

        $("#containerDetalle1").hide();

        var products = app.hojaProductos.chojaProductos.Producto.cProducto;

        var template = _.template($('#productList-template').html(), {productList : products});
        $('#productosList').html(template);
        $("#productosList").listview().listview('refresh');

        var alturaDocument = $( document ).height();
        console.log("Altura document-->", alturaDocument);
        var alturaContainer = (alturaDocument - alturaDocument*21/100) + "px";
        console.log("Altura container-->", alturaContainer);
        $("#container2").height(alturaContainer);
        $("#containerDetalle2").height(alturaContainer);
        
    },

    showList: function(){
		$("#slider-vista").val( "on" );
		$("#slider-vista").slider( "refresh" );
        $("#btnDetalle").removeClass("ui-btn-active");
        $("#containerDetalle1").hide("slide");
        $("#btnLista").addClass("ui-btn-active");
        $("#container1").show("slide");
    },

    showDetail: function(){
		$("#slider-vista").val ("off");
		$("#slider-vista").slider( "refresh" );
        $("#btnLista").removeClass("ui-btn-active");
        $("#container1").hide("slide");
        $("#btnDetalle").addClass("ui-btn-active");
        $("#containerDetalle1").show("slide");
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
		
		$("#slider-vista").change(function(){
			if ($(this).val()=="on")
				self.showList();
			else
				self.showDetail();
		});

        $("#btnDetalle").on("vclick",function(){
            self.showDetail();
        });

        $("#listPage").on("swipeleft", function(){
            self.showDetail();
        });

        $("#listPage").on("swiperight", function(){
            self.showList();
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
