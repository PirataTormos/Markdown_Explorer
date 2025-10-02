# REQUISICIÓN DE MODELOS 3D EXTERNOS.

## REQUISISCIONES PARA TODOS LOS FICHEROS

El punto mas importante para el envío de archivos es un correcto nombrado de los mismos. Por favor siga el siguiente criterio.

1. El **NOMBRE DEL ARCHIVO**  contendrá al menos, el nombre del Contratista, un identificador (IdCode), el numero de la revision y el secuencial que ocupa si es un archivo dividido.

        2021_02_25_VendorName_IdCode_1of3_REV01

2. El tamaño del archivo no excederá los **30 MG** para asegurar la integridad de archivo. El contratista extraerá el modelo en diferentes fases para asegurar este requisito. Es mucho mejor 10 archivos de 30 MB que 1 de 300 MG.

3. Los archivos de intercambio serán siempre **FICHEROS NATIVOS.** Esto significa que nunca contendrán otros ficheros externos, es decir ficheros que pertenecen a programas u organizaciones externas a las suyas. Si es necesario enviar esta información externa incluya sus propios nativos.


## FICHEROS STEP CON ORIGEN DE COORDENADAS EN 0,0,0

Este caso incluye los contratistas mecánicos cuyos programas de diseño colocan el origen de coordenadas en O,O,O dentro del propio equipo. 

Ademas de los puntos **1-3** ya mencionados, tenga en cuanta que:

4. El fichero neutro standard sera **STEP AP203**.
5. La única orientación permitida es **Z es UP** (Z es el eje vertical). La mayoría de los programas de diseño mecánico utilizan Y is Up. Por favor, recuerde modificar antes de enviar el archivo.
6. El modelo debe de tener un adecuado **DATUM POINT**. En el **Anexo-2** se incluyen algunos ejemplos de Datum Point para algunos equipos.

## IFC OR STEP INTEGRADOS EN EL SISTEMA DE COORDENADAS DEL PROYECTO.
Los ficheros IFC o STEP son ficheros de intercambio pensados para integrarse en programas de diseño como AVEVA Everything3D.
Ademas de los puntos **1-3** ya mencionados, tenga en cuanta que:
4. El fichero neutro standard sera **STEP AP203** o **IFC2X3**
5. El modelo debe de posicionarse en coordenadas acorde al resto del proyecto. Por ello tenga  en cuenta que el Sistema de Coordenadas del Proyecto segun el **Anexo-1**



## NWD INTEGRADO EN EL EN EL SISTEMA DE COORDENADAS DEL PROYECTO.
Los ficheros Naviswork son ficheros para ser referenciados en Modelos utilizados para el visionado pero no para labores de diseño (para este caso utilizar ficheros STEP AP203 o IFC2X3).
Ademas de los puntos **1-3** ya mencionados, tenga en cuanta que:
4. Salve su **Naviswork** como version **2020**
5. El modelo debe de posicionarse en coordenadas acorde al resto del proyecto. Por ello tenga  en cuenta que el Sistema de Coordenadas del Proyecto segun el **Anexo-1**


