# BFILES

## Definición:
Archivo de interface entre E3D y SPMAT. Cada fila es un componente presente en un programa de diseño de tuberias.

## Aspecto de un bfile:

```
BOLT UNIDAD   MTO_AREA     UNIDAD-FLUIDO-SECUENCIIAL  TRAIN  SPEC   IDENT1     - -        F 0.7500"    114       16
BOLT UNIDAD   MTO_AREA     UNIDAD-FLUIDO-SECUENCIIAL  TRAIN  SPEC   IDENT2     - -        F 0.7500"    127        8
CAP  UNIDAD   MTO_AREA     UNIDAD-FLUIDO-SECUENCIIAL  TRAIN  SPEC   IDENT3     - -        T 20mm       0mm        1
ELBO UNIDAD   MTO_AREA     UNIDAD-FLUIDO-SECUENCIIAL  TRAIN  SPEC   IDENT4     - -        T 80mm       80mm       1
ELBO UNIDAD   MTO_AREA     UNIDAD-FLUIDO-SECUENCIIAL  TRAIN  SPEC   IDENT4     - -        T 80mm       80mm       1
ELBO UNIDAD   MTO_AREA     UNIDAD-FLUIDO-SECUENCIIAL  TRAIN  SPEC   IDENT4     - -        T 80mm       80mm       1
```

Todos los campos seran coincidentes con AE.
Las columnas 2-5 asignan el lugar del componente dentro de SPMAT. Pueden leerse desde el name de la pipe de e3d o ser importados directamente desde el AE.
Existe tambien Interface entre SPMAT y AE. Por tanto es mas exigente relacionar el bfile con el AE, aunque genera mas Pitrequest.


\\\es001vs0165\800241\PROJECT\ADI\adidflts\TPDesPipeExtracts

## Nombre del archivo
El nombre del archivo (bfile) sigue el mismo criterio que cualquier archivo que se sube a Isocontrol, deben de tener el nombre de la pipe que aparece en AE
bfile, la pipe, la :cpipe, 

Hay condiciones en las que no exista MTO. Por ejemplo cuando se hace un contrato marco. Varios proyectos (codigos) van a trabajar sobre las mismas unidades. 

## Discusión:

Si vinculo bfile con AE, se puede bloquear la primera extracion de bfiles por no estar preparado el AE-ISOCONTR
