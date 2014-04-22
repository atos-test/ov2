var app = {
    
    hojaProductos: null,
    fichero : "hojaProductos.xml",
    products : null,
    indice: 0,

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

        //Si estoy en LANDSCAPE cargo un template para detalle
        if(window.orientation == -90 || window.orientation == 90) {
            console.log("Estoy en landscape");

            //Cargamos el template de la lista
            self.templateLista();

            //Cargamos el template del detalle LANDSCAPE
            //self.templateDetalleLandscape();

            //Calculamos la altura de la imagen en función del tipo de pantalla (480x800, 320x480..)
            //También se calcula el tamaño de la letra y el punto medio donde ubicar el boton info
            self.calcularAlturaImgLista();

        }
        //Si estoy en PORTRAIT cargo los templates hechos anteriormente
        else{

            self.products = app.hojaProductos.chojaProductos.Producto.cProducto;
            
            //Cargamos el template de la lista
            self.templateLista();

            //Cargamos el template del detalle PORTRAIT
            self.templateDetallePortrait();


            var alturaDocument = $( document ).height();
            //Calculamos la altura de la imagen en función del tipo de pantalla (480x800, 320x480..)
            //También se calcula el tamaño de la letra y el punto medio donde ubicar el boton info
            self.calcularAlturaImgLista();
            
            /* Calculamos el número de bloques que se van a visualizar*/
            var alturaDetalle = 403;
            var nbloques = Math.floor((alturaDocument-48)/alturaDetalle);
            
            /* Para la altura adaptable de los bloques de detalle de producto */
            console.log("alturaDocument: ", alturaDocument);
            console.log("nbloques: ", nbloques);
            
            var alturaDetalle = (alturaDocument-48)/nbloques;
            $(".detalle-block").height(alturaDetalle);
            console.log("alturaDetalle: ", alturaDetalle);
            $(".texto-servicio").height(alturaDetalle-88-154-83);
        }
    },

    templateLista: function(){
        var self = app;
        //Template de lista
        var template = _.template($('#productList-template').html(), {productList : self.products});
        $('#productosList').html(template);
        self.refreshGroups(self.products.length);
        $("#productosList").listview().listview('refresh');
    },

    templateDetallePortrait: function(){
        var self = app;
        //Template de detalle
        var templateDetalle = _.template($('#productDetail-template').html(), {productDetail : self.products});
        $('#detalle').html(templateDetalle);
    },

    refreshGroups: function(total){
        var cg = document.getElementsByName("controlGroupLista");
        $(cg).controlgroup().controlgroup("refresh");
    },

    calcularAlturaImgLista: function(){
        var self = app;
        $("#productosList").listview().listview('refresh');
        var anchoDocument = $(document).width();

        /*Ancho de UL es el 95% del document*/
        var anchoUL = (anchoDocument - anchoDocument*5/100);

        /*Ancho controlGroupIzq es el 90% del UL*/
        var anchoControlGroupIzq = Math.ceil(anchoUL - anchoUL*10/100);
        var anchoControlGroupDer = anchoUL - anchoControlGroupIzq;

        /*Ancho Imagen es el 25% del controlGroup*/
        var anchoImg = (anchoControlGroupIzq - anchoControlGroupIzq*75/100);
        self.setWidthImg(anchoImg);
        

        /*Calculamos el tamaño de la letra en función del alto/ancho de la imagen*/
        var tamNombreProducto = anchoImg/100 + 0.05 + "em";
        var tamPrecioProducto = anchoImg/100 + "em";

        $(".nombreProducto").css({ 'font-size': tamNombreProducto});
        $(".precioProducto").css({ 'font-size': tamPrecioProducto});
        $(".plazoProducto").css({ 'font-size': tamPrecioProducto});

        /*Calculamos el punto medio del botón info en funcion del alto/ancho de la imagen*/
        //Formula: altura/2 - 28(altura del boton)/2

        var alturaMediaInfo = anchoImg/2 - 14 + "px";
        $(".btnInfo").css({ 'margin-top': alturaMediaInfo});
    },

    setWidthImg: function(ancho){
        var self = app;
        for (var i = 0; i < self.products.length; i++) {
            var fondoLista=".fondoLista"+i;
            $(fondoLista).height(ancho);
        };
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

    scrollEfecto: function(destino){
        /*Scroll sin efecto*/
        //$.mobile.silentScroll(destino);

        /*Scroll con efecto*/
        $('body').stop().animate({  
            scrollTop: destino
        }, 500); 
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
			if ($(this).val()=="on"){
                /*Además de mostrar la lista, navegamos al inicio*/
				self.showList();
                _.delay(function(){
                    self.scrollEfecto($("#listPage").offset().top);
                }, 500);
                
            }
			else
				self.showDetail();
		});

        $("#listPage").on("swipeleft", function(){
            self.showDetail();
        });

        $("#listPage").on("swiperight", function(){
            self.showList();
        });

        /*Botones info*/
        /*En función del botón que se pulse, se muestra el detalle correspondiente*/
        var btnInfo = document.getElementsByName("btnInfo");

        $(btnInfo).each(function(index){
            $(this).on("vclick",function(){

                self.indice = index;
                self.showDetail();

                /*Id del detalle al que hacer scroll*/
                var id = "#id"+index;

                /*Damos un delay para que cargue todo y luego le aplicamos el scroll. Hay que quitarle el tamaño del header*/
                var tamHeader = $("#divHeader").outerHeight(true);

                _.delay(function(){
                    self.scrollEfecto($(id).offset().top - tamHeader);
                }, 500);
                
            });
        });

        /*Botones sig.*/
        /*Al pulsar el boton sig. hacemos scroll al siguiente detalle*/
        var btnSig = document.getElementsByName("btnSig");

        $(btnSig).each(function(index){
            $(this).on("vclick",function(){

                /*Si se trabaja con "index", acaba dando errores. 
                Especialmente cuando hay varios "detalles" por pantalla*/
                self.indice = index;
                
                /*Id del detalle al que hacer scroll*/
                self.indice++;

                var id = "#id"+self.indice;

                /*Hay que quitarle el tamaño del header*/
                var tamHeader = $("#divHeader").outerHeight(true);

                self.scrollEfecto($(id).offset().top - tamHeader);
            });
        });

        /*Botones ant.*/
        /*Al pulsar el boton ant. hacemos scroll al anterior detalle*/
        var btnAnt = document.getElementsByName("btnAnt");

        $(btnAnt).each(function(index){
            $(this).on("vclick",function(){

                /*Si se trabaja con "index", acaba dando errores. 
                Especialmente cuando hay varios "detalles" por pantalla*/
                self.indice = index;

                /*Id del detalle al que hacer scroll*/
                self.indice--;

                var id = "#id"+self.indice;

                /*Hay que quitarle el tamaño del header*/
                var tamHeader = $("#divHeader").outerHeight(true);

                self.scrollEfecto($(id).offset().top - tamHeader);
            });
        });

        window.onorientationchange = function() {
            self.refreshView();
        }

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

