# ERROR GLOBAL->THERE WAS NO ENDPOINT LISTENING
## Objetivo
El objetivo de esta KB es plasmar la solución a un error con el Global (1, 501)

## PROBLEMA
## Escenario
El Global se acaba desvaneciendo y cuando se intenta hacer un allocate de una base de datos fuerza su cierre.
## Error
<B><FONT COLOR="red"> An exception of type 'System.ServiceModel.EndpointNotFoundException' occurred and was caught.</FONT>

Message :<B><FONT COLOR="red">  There was no endpoint listening at http://eu012vm2187:8000/e44914e5-3448-4dd7-b1f7-a7ccc35c1040/GlobalWcfServiceLib/GlobalWcfService_11_1_201011/ that could accept the message. This is often caused by an incorrect address or SOAP action. See InnerException, if present, for more details.</FONT>

Ejemplo:

[Image](./img/ERROR_COMPLETO_GLOBAL.PNG)

## *Pasos a seguir* 
## -Parar Daemon de todas las localizaciones

## -Borrar la base de datos de transacciones del Hub o renombrarla
Ejemplo: 

[Image](./img/Ejemplo_bd_transfer.PNG)

<B><FONT COLOR="teal"> NOTA: Tienen que salir todos los usuarios del proyecto</B></FONT>

## -*Arrancar Daemon(Global) del Hub*
<B><FONT COLOR="teal"> NOTA: Se crea de nuevo, regenera la base de datos automáticamente</B></FONT>


## -*Arrancar Daemon(Global) del Satellite*








