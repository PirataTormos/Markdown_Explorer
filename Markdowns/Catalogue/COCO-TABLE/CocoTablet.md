Presta atención al siguiente objeto COCO perteneciente a la 7046 MASTER/COCO del ACP

Name /FBP-GBP
Type COCO
Lock false
Owner /PIPING.COCO
Ctype FBP GBP 
Ckey FL
Cocoreference 
 1 /FBP-DESC
 2 /GBP-DESC

Attributes 
Name /FBP-DESC
Type COCDES
Lock false
Owner /PIPING.COCO
Description Flange RF DIN PN16
Coconnection FBP

# Connection Compatibility Tables
The Connection Compatibility Table (element name CCTA) holds a list of all the compatible connection types for Piping Components in a set project. A CCTA is an administrative element which exists at the same level as CATA in the hierarchy. A CCTA has Connection Compatibility (COCO) elements as its members, each of which has a pair of coded connection types stored as its CTYPE attribute. These connection types are those referred to in the PCON attribute of a Piping Component’s P-points.
The commands below give an example of the setting up of a typical connection table. 

NEW CCTA   
NEW COCO /WELDWELD CTYPE WELD WELD (weld to weld) 
NEW COCO /SCRDSCRD CTYPE SCRD SCRD (screwed to screwed) 
NEW COCO /WELDBW CTYPE WELD BW (weld to butt weld) 

Note:  That ISODRAFT uses the connection codes to derive bolting requirements, and so the connection codes used must conform to certain standards - refer to Appendix B and the ISODRAFT Reference Guide for details. Setting up the Connection Compatibility Table should be one of the first tasks to be carried out when commencing a design project using AVEVA E3D™. 
If an attempt is made to connect two pipework components in MODEL, then a check is made to see if the p-leave PCON attribute of the first component and the p-arrive PCON attribute of the second component appear as a matching pair in the connection table. If there is such a matching pair then the components are connected, otherwise a similar check is made on the p-leave PCON attributes of each component. If a matching pair is now found, the second component is ‘flipped’ and connected to the first. If no matching pair is found then an ‘incompatible connection type’ error message is output and the second component is left in its original position and orientation.

# COCDES Elements
COCDES provide the means of associating a long description to a COCO pair.
Create a COCDES element below a CCTA as follows:
NEW COCDES
DESC 'This is a long description of a COCO element'
COCONNECTION FBB


# Connection Compatibility Element (COCO)
Attributes:
Name Name of the element 
Ctype Connection type 
Ckey ISODRAFT end condition key 
Cocoreference COCO description reference





CREATE A NEW CONECTION
En CATADMIN/PROJECT_CATALOG

NEW CCTA NAME /PROJECT_COCO
NEW COCDES /LJS-DESC Description 'LJS'  Coconnection LJS
NEW COCDES /JAD-DESC Description 'JAD'  Coconnection JAD
NEW COCO /LJS-JAD Ctype LJS JAD  Ckey FL Cocoreference /LJS-DESC /JAD-DESC

NEW COCO /SCF-SCF Ctype SCF SCF  Ckey FL
NEW COCO /SWF-SWF Ctype SWF SWF  Ckey FL

NEW COCO /SCF-TUB Ctype SCF TUB  Ckey BWhttps://help.aveva.com/AVEVA_Everything3D/2.1/wwhelp/wwhimpl/js/html/wwhelp.htm#href=CSUG/CSUG6.07.3.html

--PARA QUE LAS BRIDAS NO SE den la vuelta una de las teminaciones de la brida debe poder conectarse con p2 del elemnto anterior (O el head). 
--En Solvay ocurria que teniamos bridas FBP-SWF, por ello creamos la conexion /BWD-SWF dento de una proyect_coco con nuestras trampitas.

NEW CCTA NAME /PROJECT_COCO
NEW COCDES /BWD-DESC Description 'BWD'  Coconnection BWD
NEW COCDES /SWF-DESC Description 'SWF'  Coconnection SWF
NEW COCO /BWD-SWF Ctype BWD SKF  Ckey BW Cocoreference /BWD-DESC /SWF-DESC
