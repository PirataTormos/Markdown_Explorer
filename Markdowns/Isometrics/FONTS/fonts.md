
# problema:

Al abrir un archivo de CAD extraido desde E3D algunas fuentes aparecen superpuestas o demasiado grandes. 

# solucion: 
Programas como E3d tienen fuentes propias que pueden no ser reconocidas por otros programas como BricsCAD o AutoCAD. 
E3d guarda dichas fuentes en alguna de las siguientes carpetas (segun version), para que terceros programas las encuentren se debe de especificar su localizacion en la configuracion.


C:\Program Files (x86)\AVEVA\Everything3D3.1\AutoDraftFonts
C:\AVEVA\Everything3D2.10\AutoDraftFonts


En caso de no tener la ruta en su pc o que no le funcione adecuadamente recomendamos copiarlo en C:\Temp

PASOS RECOMENDADOS:


1. Copie el contenido de C:\Program Files (x86)\AVEVA\Everything3D3.1\AutoDraftFonts en C:\Temp 
2. Configurar BricsCAD.
  MANAGE > SETTINGS > PROGRAM OPTIONS > FILES > SUPPORT FILE SEARCH PATH
1. Añadir la ruta a SUPPORT FILE SEARCH PATH utilizando el icono '...'
2. cerrar el programa y volver a abrir

   