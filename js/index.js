var app = {
    
    hojaProductos: null,
    fichero : "hojaProductos.xml",
    products : null,
    indice: 0,
    alturaDocument: 0,
    anchoDocument: 0,
    alturaHeader: 0,
    alturaDetalle: 0,

    initialize: function() {
        var self = app;
        console.log("initialize");
        self.alturaDocument = $(document).height();
        self.anchoDocument = $(document).width();

        console.log("alturaDocument-->", self.alturaDocument);

        /*Sacamos la altura del div de dentro del header,
        ya que este no se carga al principio, por tanto no da un valor correcto.
        Añadimos los pixeles de los bordes, position y padding = 2+1+1*/
        self.alturaHeader = $("#divHeader").height()+4;
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
        self.products = app.hojaProductos.chojaProductos.Producto.cProducto;

        //Si estoy en LANDSCAPE cargo un template para detalle
        if(window.orientation == -90 || window.orientation == 90) {

            console.log("Estoy en landscape");

            self.cargaLandscape();

        }
        //Si estoy en PORTRAIT cargo los templates hechos anteriormente
        else{

            console.log("Estoy en portrait");
            
            self.cargaPortrait();
        }
    },

    cargaLandscape: function(){
        var self = app;

        //Cargamos el template de la lista
        self.templateLista();

        //Cargamos el template del detalle LANDSCAPE
        self.templateDetalleLandscape();

        //Calculamos la altura de la imagen en función del tipo de pantalla (480x800, 320x480..)
        //También se calcula el tamaño de la letra y el punto medio donde ubicar el boton info
        self.calcularAlturaImgLista();


        /************PARTE DETALLE************/
        
        /* Calculamos el número de bloques que se van a visualizar*/
        self.bloquesDetalle(268);
    },

    cargaPortrait: function(){
        var self = app;

        //Cargamos el template de la lista
        self.templateLista();

        //Cargamos el template del detalle PORTRAIT
        self.templateDetallePortrait();
        
        //Calculamos la altura de la imagen en función del tipo de pantalla (480x800, 320x480..)
        //También se calcula el tamaño de la letra y el punto medio donde ubicar el boton info
        self.calcularAlturaImgLista();
        
        /* Calculamos el número de bloques que se van a visualizar*/
        /* Anteriormente habia 403, pero en pantallas de 800px de altura, el detalle sale demasiado largo*/
        self.bloquesDetalle(370);

        /* Aplicamos la altura de cada detalle a su clase*/
        /* Aplicamos la altura de la info de cada detalle a su clase*/
        $(".detalle-block").height(self.alturaDetalle);
        $(".texto-servicio").height(self.alturaDetalle-88-154-83);
    },

    bloquesDetalle: function(valor){
        var self = app;

        self.alturaDetalle = valor;
        var nbloques = Math.floor((self.alturaDocument-self.alturaHeader)/self.alturaDetalle);

        console.log(self.alturaDocument,"-",self.alturaHeader,"/",self.alturaDetalle," = ", nbloques);
        
        /* Para la altura adaptable de los bloques de detalle de producto */
        console.log("alturaDocument: ", self.alturaDocument);
        console.log("nbloques: ", nbloques);
        
        self.alturaDetalle = (self.alturaDocument-self.alturaHeader)/nbloques;
        console.log("alturaDetalle: ", self.alturaDetalle);
    },

    actualizarAltoAncho: function(){
        var self = app;

        var aux = self.alturaDocument;
        self.alturaDocument = self.anchoDocument;
        self.anchoDocument = aux;
    },

    templateLista: function(){
        console.log("Cargo template Lista PORTRAIT/LANDSCAPE");
        var self = app;
        //Template de lista
        var template = _.template($('#productList-template').html(), {productList : self.products});
        $('#productosList').html(template);
        self.refreshGroups(self.products.length);
        $("#productosList").listview().listview('refresh');
    },

    templateDetallePortrait: function(){
        console.log("Cargo template detalle PORTRAIT");
        var self = app;
        //Template de detalle
        var templateDetalle = _.template($('#productDetail-template').html(), {productDetail : self.products});
        $('#detalle').html(templateDetalle);
    },

    templateDetalleLandscape: function(){
        console.log("Cargo template detalle LANDSCAPE");
         var self = app;
        //Template de detalle
        var templateDetalle = _.template($('#productDetailLandscape-template').html(), {productDetail : self.products});
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
        $("#productosList").show("slide");
        $("#containerDetalle1").hide("slide");
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
			else{
				self.showDetail();
                _.delay(function(){
                    self.scrollEfecto($("#listPage").offset().top);
                }, 500);
            }
		});

        $("#listPage").on("swipeleft", function(){
            self.showDetail();
            _.delay(function(){
                self.scrollEfecto($("#listPage").offset().top);
            }, 500);
        });

        $("#listPage").on("swiperight", function(){
            self.showList();
            _.delay(function(){
                self.scrollEfecto($("#listPage").offset().top);
            }, 500);
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
                _.delay(function(){
                    self.scrollEfecto($(id).offset().top - self.alturaHeader);
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
                self.scrollEfecto($(id).offset().top - self.alturaHeader);
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
                self.scrollEfecto($(id).offset().top - self.alturaHeader);
            });
        });

        window.onorientationchange = function() {
            self.actualizarAltoAncho();
            //Si estoy en LANDSCAPE cargo un template para detalle
            if(window.orientation == -90 || window.orientation == 90) {

                console.log("Estoy en landscape");

                self.cargaLandscape();

            }
            //Si estoy en PORTRAIT cargo los templates hechos anteriormente
            else{

                console.log("Estoy en portrait");
                
                self.cargaPortrait();
            }
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

