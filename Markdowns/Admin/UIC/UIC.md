set user 

set CAF_UIC_PATH=\\Es001vs0165\800238\ADMIN\Customization\Uic


copiamos alguno de estos archivos de la ruta de instalacion y los colocamos en la ruta de CAF_UIC_PATH
"C:\AVEVA\Everything3D3.1\DrawCustomization.xml"
"C:\AVEVA\Everything3D3.1\DesignCustomization.xml"


Modificamos el archivo intruduciendo una nueva linea:
<CustomizationFile Name="SOL" Path="s001vs0165\800238\ADMIN\Customization\Uic\Tpi-Draw.uic" />


