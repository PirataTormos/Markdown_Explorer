# EXCLUDE MATERIAL FOR MATERIAL LIST:



## MTOC / MTOT 


Para el concepto de MTOC y MTOT ver:

https://help.aveva.com/AVEVA_Everything3D/2.1/wwhelp/wwhimpl/js/html/wwhelp.htm#href=ISOUG/ISOUG9.09.04.html


Es decir, son att diseñados para controlar la representacion por ISODRAFT. Pero tambien pueden ser utilizados en el bfile

## BFILES

En **TPDesPipeExtExportBFile** :

Hay dos opciones o un NEQ en  el collect, como en el caso de los tubos
```
var !Tubis collect all (TUBI) WITH ((MTOT OF PREV NEQ |OFF|) AND (MTOT OF PREV NEQ |DOTU|) AND (MTOT OF PREV NEQ |DOTD|)) or ((MTOH NEQ |OFF|) AND (MTOH NEQ |DOTU|) AND (MTOH NEQ |DOTD|))  for $!strPipes 
```

O un skip como en el caso de los !comp

```
        skip if (MTOC EQ |OFF|)
        skip if (MTOC EQ |DOTD|) 
        skip if (MTOC EQ |DOTU|)
```

## ISOMETRICOS CON INTERVENCIÓN (MODIFICADOS)

En la siguiente imagen se distinguen 3 tipos de pipe, nueva, interverida y existente
![FOTo](img\ExcludeItemsMaterialList_01.png)


\\es001vs0129\WI_3D-ADMINISTRATION\SPIT-E3D\INTERFACES\SPMAT\doc\651MO-651-4-Z-708.0.TIP0032-1BH6-TV3_01.pdf

![FOTo2](img\ExcludeItemsMaterialList_02.png)

[bfile isometrico intervenido](\\es001vs0129\WI_3D-ADMINISTRATION\SPIT-E3D\INTERFACES\SPMAT\doc\651MO-651-4-Z-708.0.TIP0032-1BH6-TV3_01.b)


# UIC. ASISTENTE PARA 

IDEA: Separar los elementos existentes en branch donde todos sus elementos sean no reportables.

```
 var !bran name of CE
     $!bran
     :TPI-BRAN-TYPE 'DOTD'
     Mtohead DOTD
  
    var !branmems collect all BRAN MEM for ce
    do !branmem  values !branmems 
     $!branmem
     var !typeBranmem type of $!branmem
    IF !typeBranmem neq 'TUBI' then
       Mtocomponent DOTD
       Mtotube DOTD
    endif
```

 :TPI-BRAN-TYPE 'DOTD' permite el coloreado en la maqueta sin tener que incorporar tantos bran mem en el att. La  **debilidad** es que se pueden incluir elementos reportables en este tipo de branch

 

![FOTo2](img\ExcludeItemsMaterialList_03.png)


**Soluciones:** 
1. Programa que al lanzar la iso, modifique todos los MTOC. Habria que preparar un control de errores.
2. Regla de colores en E3D basada en MTOC/MTOC
3. tener en cuenta que si este es un asistente, si no estan las piezas correctamente marcadas, se vera en la iso. Lo vera el revisor.



