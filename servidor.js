var http=require('http');
var url=require('url');
var fs=require('fs');

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
    var camino='firejob'+objetourl.pathname;
    if (camino=='firejob/')
        camino='firejob/index.html';
    fs.exists(camino,function(existe){
        if (existe) {
            fs.readFile(camino,function(error,contenido){
                if (error) {
                    respuesta.writeHead(500, {'Content-Type': 'text/plain'});
                    respuesta.write('Error interno');
                    respuesta.end();                    
                } else {
                    respuesta.writeHead(200, {'Content-Type': 'text/html'});
                    respuesta.write(contenido);
                    respuesta.end();
                }
            });
        } else {
            respuesta.writeHead(404, {'Content-Type': 'text/html'});
            respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');        
            respuesta.end();
        }
    });
});

servidor.listen(8080);

console.log('Servidor web iniciado');