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
        self.refreshGroups(products.length);
        $("#productosList").listview().listview('refresh');


        var alturaDocument = $( document ).height();
        var alturaContainer = (alturaDocument - alturaDocument*11/100) + "px";
        $("#containerDetalle2").height(alturaContainer);
        self.calcularAlturaImgLista();
		
		/* Calculamos el número de bloques que se van a visualizar*/
		var alturaDetalle = 410;
		var nbloques = Math.floor((alturaDocument-72)/alturaDetalle);
		
		/* Para la altura adaptable de los bloques de detalle de producto */
		var alturaDetalle = (alturaDocument-72)/nbloques;
		$(".detalle-block").height(alturaDetalle);
		$(".texto-servicio").height(500);
        
    },

    refreshGroups: function(total){
        for (var i = 0; i<total; i++) {
            var id= "#myIdGroup"+i;
            $(id).controlgroup().controlgroup("refresh");
        };
    },

    calcularAlturaImgLista: function(){
        var self = app;
        $("#productosList").listview().listview('refresh');
        var anchoDocument = $(document).width();

        /*Ancho de UL es el 95% del document*/
        var anchoUL = (anchoDocument - anchoDocument*5/100);

        /*Ancho controlGroupIzq es el 90% del UL*/
        var anchoControlGroupIzq = Math.ceil(anchoUL - anchoUL*10/100);

        /*Ancho Imagen es el 25% del controlGroup*/
        var anchoImg = (anchoControlGroupIzq - anchoControlGroupIzq*75/100) + "px";
        $(".claseBurofax").height(anchoImg);
        $(".claseCartaCertificada").height(anchoImg);
        $(".claseFilatelia").height(anchoImg);
        $(".clase4872").height(anchoImg);
        $(".clasePostalExpres").height(anchoImg);
        $(".claseTuSello").height(anchoImg);

        console.log("AnchoUL-->", anchoUL);
        console.log("anchoControlGroupIzq-->", anchoControlGroupIzq);
        console.log("anchoImg-->", anchoImg);
    },

    showList: function(){
		$("#slider-vista").val( "on" );
		$("#slider-vista").slider( "refresh" );
        $("#containerDetalle1").hide("slide");
        $("#productosList").show("slide");
    },

    showDetail: function(){
		$("#slider-vista").val ("off");
		$("#slider-vista").slider( "refresh" );
        $("#productosList").hide("slide");
        $("#containerDetalle1").show("slide");
    },
    
    bindEvents: function() {
        var self = app;
        console.log("bindEvents");

        $('a.loginNecesario').on("vclick", function(){
            console.log("Pulsado");
            var cod = $(this).attr("id");
            Login.cod = cod;
            $.mobile.pageContainer.pagecontainer("change", "login.html", { transition: "slide", reverse: false });
            //$.mobile.changePage("login.html", { transition: "slide", reverse: false });
        });

        $("#btnAtrasLogin").on("vclick", function(){
            console.log("Pulsado atras");
            $.mobile.pageContainer.pagecontainer("change", "#listPage", { transition: "slide", reverse: true });
        });

        $("#btnAceptar").on("vclick", function(){
            console.log("Pulsado Aceptar");
        });
		
		$("#slider-vista").change(function(){
			if ($(this).val()=="on")
				self.showList();
			else
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
