(function(){
 'use strict';

function config($stateProvider, $urlRouterProvider,$firebaseRefProvider) {

	const urlTpl='./app/templates/'

	//inicializar mi api key de feribase
	// Initialize Firebase
  	var config = {
    	apiKey: "AIzaSyDGe7QahcwQMKGveqWHtTwhyoYUkuG-qZ0",
   	 	authDomain: "ejemplo-4f6fa.firebaseapp.com",
    	databaseURL: "https://ejemplo-4f6fa.firebaseio.com",
    	projectId: "ejemplo-4f6fa",
    	storageBucket: "ejemplo-4f6fa.appspot.com",
    	messagingSenderId: "375714798102"
  	};


  	//aqui registro la url global
  	$firebaseRefProvider
  	.registerUrl({

  		default :config.databaseURL,
  		products:config.databaseURL+'/productos'
  	});
  	firebase.initializeApp(config);


  	//termina mi iniciualizacion
    
	

	$stateProvider
	.state('products', {
		url 		:'/products',
		controller	:'ProductsCtrl as pc',
	//	template	:'<h1>Saludos desde el estado Productos cambio 1</h1>'
	   // templateUrl	:'./app/templates/productos.html'
	   templateUrl	:urlTpl+'productos.html'
	})

	.state('productadd', {
		url 		:'/add',
		controller	:'ProductsAdicionalCtrl as pac',
		templateUrl	:urlTpl+'incluir.html'
		//template	:'<h1>agregar  Productos </h1>'
	})
	//estamos diciendo que estado producdetalle es hijo de product
	.state('products.producdetalle',{
		url 	: '/{{prod_id}}',
		views	:{
			detalleProd:{
				//template :'<h1 class="titulo">{{pc.key}}</h1>',
				templateUrl :urlTpl+'prodDetalle.html',
				 controller:"ProductsCtrl as pc"
			}

		}

	}) 

	.state ('products.editar',{
		url  :'/edit/:prod_id',
		views:{
			detalleProd:{

			//	template  :'EDITAR PRODUCTO',
			templateUrl  :urlTpl+'editar.html',
				controller:'ProductosEditarCtls as pec'

		}

	}


	})

	;





//en caso de colocar un estado mal no lleva a productos

	$urlRouterProvider.otherwise('/products');



	//console.log('Mensaje desde la Configuracion ');
	//console.log(config);
	//console.log(config.databaseURL);

	


}

function ProductsCtrl(ProductosServicios,$stateParams){
//$stateParams es una directiva que recibe los parametro que estamos enviando
	var ctrl=this;
	ctrl.products=ProductosServicios.getProductos();
	//console.log('parametros estado: ',$stateParams);

	if($stateParams.prod_id!=''){

		ctrl.key=$stateParams.prod_id;
		ProductosServicios.getProductosDetalle($stateParams.prod_id)
		.then(function(success){
			ctrl.Prod={};
			ctrl.prod=success;
			console.log('Existosamente ',success);
		})
		.catch(function(err){
			console.log('error',err);
		});


//Eliminar Productos ***************************************
 ctrl.onDelete = function( sProductoKey ){
   	if(confirm('Esta Segur@ de eliminar el producto?')){	
 	  
 	   ProductosServicios.eliminarProducto( sProductoKey )
  	  .then( function(exito ){
  	
		//enviamos al estado de productos
  		$state.go('products');
  		console.log(' exito ',exito);


   	})
     .catch( function( error){
  		console.log('Error : ',error);
  	
  	});
  }
 };

//console.log('Mensaje desde el controlador productsCtrl',ctrl.products);
//fin de eliminar productos *******************************
}

	
}

function ProductsAdicionalCtrl(ProductosServicios,$state){

//todos el contenido de la funcion es this o en ambito 
	var ctrl =this;
	ctrl.prod={};//array que viene desde formulario

	ctrl.onSubmit=function(){
		
		//ctrl.prod.time_add	 = new date().getTime(); //aqui la hora que se incluye
		//ctrl.prod.time_update= new date().getTime();//aqui la hora que se actuliza

		ProductosServicios.incluirProducto(ctrl.prod)
		.then(function(resultado){

			// si resultado del key es diferente a vacio
			if(resultado.key!=''){

				$state.go('products');
				//el estado que tenemos y lo manda 
				//con la funcion go() a estado productos
				console.log("Graba Existosamente", resultado.key);
			}
			

		  })
		.catch(function(error){
			console.log(error);
		})

		//mensaje para ver el obejto 


		//console.log(" todo lo del Objeto del formulario ",ctrl.prod);

	}

	console.log('Mensaje desde el controlador Adicional Productos');
	//aqui un arreglo de Json
	ctrl.categorias=[

	  {
	  	id	:1,
	  	text:"Angular JS"
	  },
	  {
	  	id	:2,
	  	text:'PHP'
	  },
	  {
	  	id	:3,
	  	text:'Firebase'
	  }

	];

	ctrl.prod.cat = ctrl.categorias[2];
}

//ProductosEditarCtls

function ProductosEditarCtls($stateParams,ProductosServicios,$state){

	var ctrl= this;

	ctrl.categorias=[

	  {
	  	id	:1,
	  	text:"Angular JS"
	  },
	  {
	  	id	:2,
	  	text:'PHP'
	  },
	  {
	  	id	:3,
	  	text:'Firebase'
	  }

	];


	//get para traer el valor
	ctrl.prod={};

	ProductosServicios.getProductosDetalle($stateParams.prod_id )
	.then( function (Existosamente){
		ctrl.prod=Existosamente;
		console.log(Existosamente);
	});

	ctrl.onSubmit= function(){
		ProductosServicios.actulizarProducto(ctrl.prod)
		.then( function (Existosamente){
			$state.go('products.producdetalle',{prod_id:Existosamente.key});
			console.log(' Existosamente',Existosamente);

		});

		console.log('Informacion del Prouctos',ctrl.prod);


	}

	
}

function ProductosServicios ($firebaseArray, $firebaseObject , $firebaseRef ){
	var ref = $firebaseRef.products;
	function incluirProducto(aProducto){
		return $firebaseArray( ref ).$add(aProducto);


	}

	//FUNCION PARA MOSTRAS DATOS
	function getProductos(){
		return $firebaseArray( ref );

	}

	function getProductosDetalle(sProductoKey){
		return getProductos()
		.$loaded()  //.$loader() lo que hacer es cargar bien el productos
		.then( function (res ) {
			//$getRecord obtendar la informacion del productos
			return res.$getRecord(sProductoKey);
		});


	}

	function eliminarProducto(sProductoKey){
		//console($firebaseObject);
		return $firebaseObject( ref.child( sProductoKey ) ).$remove();
	}
	//servicios para editar o actulizar
	function actulizarProducto(arregloProducto){
	   var referenciaProducto=$firebaseObject( ref.child(arregloProducto.$id ) );
	   referenciaProducto.titulo=arregloProducto.titulo;
	   referenciaProducto.precio=arregloProducto.precio;
	   referenciaProducto.cat=arregloProducto.cat;
	   referenciaProducto.desc=arregloProducto.desc;
	  // referenciaProducto.time_add=arregloProducto.time_add;
	  // referenciaProducto.time_update=new Date().getTime();

		return referenciaProducto.$save();
		//servicoo save de firebase
	}
	

//registramos servicios
	this.incluirProducto=incluirProducto;
	this.getProductos=getProductos;
	this.getProductosDetalle=getProductosDetalle;
	this.eliminarProducto=eliminarProducto;
	this.actulizarProducto=actulizarProducto;
	




}

 angular.module('LetCodeApp',[

 	'ui.router',
 	'firebase'

 	])
      //luego siempre hay que registrarlo  .controller("nombre de controlador" ,funcion que contiene el nombre de ese controlador)
      .config(config)
      .controller('ProductsCtrl', ProductsCtrl)
      .controller('ProductsAdicionalCtrl',ProductsAdicionalCtrl)
      .controller('ProductosEditarCtls',ProductosEditarCtls)
      .service('ProductosServicios',ProductosServicios);



}());