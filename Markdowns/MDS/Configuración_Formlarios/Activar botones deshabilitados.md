# MDS - Activar botones deshabilitados

En el formulario de edición de soportes de MDS, ciertos botones pueden aparecer deshabilitados en funcion del soporte. Para activarlos, es necesario modificar un archivo de configuración interna.

## 🔧 Pasos para habilitar botones

1. **Localiza el archivo de configuración**  
   El archivo a modificar se llama `mdsSupportEditorCtrlConfigTT.pmlobj`, donde `TT` corresponde al tipo específico de soporte.

   > 📁 Ruta habitual: ...\ADMIN\Customization\Pmllib\3_Mds\Design\Object


2. **Edita el archivo correcto**  
Abre el archivo correspondiente al tipo de soporte en cuestión.

3. **Busca el soporte por nombre**  
Dentro del archivo, localiza la entrada del soporte utilizando el nombre que aparece en AVEVA.
   >    !config.tt549 = 'setTrunnionHeight,setTrunnionMaterial,addReference,remReference,remAllReference'
4. **Añade el botón deseado**  
Dentro de la configuración del soporte, añade el nombre exacto del botón que deseas habilitar.

✅ **Consejo:**  
Puedes saber el nombre del boton conultando las variables del formulario o bien comparando la linia con la de otro soporte que ya tenga el botón habilitado.

---

> ⚠️ Esta modificación afecta al comportamiento de los formularios en MDS. Se recomienda hacer una copia de seguridad del archivo antes de modificarlo.
