


Comparemos estos dos bloques, el valos de .5in esta definido, pero el de 70 no. Ambos valores van a un campo de tipo dimension. si no esta definido lo almacenara conforme a lo que este definido en Q UNIT.

```
<START>  C214359001_BOLT SBlt_2_HHx_N&2W, 64575_4811900_.5_BLTA 64575_4811900_.5_BLIS 64575_4811900_.5_SBOL
.5IN
4811900-.5
70
4
```

En este caso, no podemos saber si 2.5 es MM o INC. Pero probablemente sean INCH. Para que nos lo acepte como INCH debemos configurar **DIST INCH**

```
<START>  C214726001_BOLT SBlt_2_HHx_N, 69299_5801037_.5_BLTA 69299_5801037_.5_BLIS 69299_5801037_.5_SBOL
.5IN
5801037-.5
2.5
4
```