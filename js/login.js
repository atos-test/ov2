var Login= {
    initialize: function () {
        console.log("Estoy en initialize de Login");
        Login.refreshView();
        Login.bindEvents();
    },
    refreshView: function (){
    },

    bindEvents: function (){
        console.log("Estoy en bindEvents de Login");
        $("btnAtrasLogin").on("vclick", function(){
            console.log("Pulsado atras");
            $.mobile.pageContainer.pagecontainer("change", "index.html", { transition: "slide", reverse: false });
        });

        $("btnAceptar").on("vclick", function(){
            console.log("Pulsado Aceptar");
        });

        $(".headerCollapsibleLogin").unbind();
    }
};
