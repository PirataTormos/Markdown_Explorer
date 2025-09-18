# Aparece aislamiento en lineas /NT

## Problema

En ocasiones, aparecen aislamientos en las tuberías que tienen el ISpec `/NT`. Esto no es correcto, ya que las tuberías con este ISpec no deberían llevar aislamiento.

## Solución Propuesta

Para solucionar este problema, se debe eliminar el ISpec de todos los branches (ramales) de las tuberías que tengan ISpec `/NT`.  
- **Nota:** El ISpec seguirá apareciendo en el cajetín porque no se elimina de la tubería principal, solo de los branches.
- Al quitar el ISpec de los branches, no será posible colocar aislamiento en ellos.

## Precauciones

Antes de ejecutar la solución, es importante:
- Verificar que las líneas sobre las que se va a actuar no tengan ningún branch con otro tipo de aislamiento necesario, para no eliminar aislamientos que sí sean requeridos.

## Macro Adjunta

Se adjunta una macro en PML que automatiza este proceso.  
La macro recorre todas las tuberías con ISpec `/NT` y elimina el ISpec de sus branches.



---

### Ejemplo de Macro en PML

```pml
-- Quita el aislamiento en los branches de todas las líneas con ispec /NT

var !pipes collect all pipes with purp of site eq 'PI'

do !pip values !pipes

    !ispec = !pip.dbref().ispec.name
    handle(2,754)
        !ispec = ''
    endhandle

    if !ispec.eq('/NT') then
        var !bran collect all bran for $!pip

        do !br values !bran
            !brispec = !br.dbref().ispec.name
            handle(2,754)
                !brispec = ''
            endhandle
            if !brispec.neq('') then
                !!CE = !br.dbref()
                ispec unset
                handle(2,614)
                endhandle
            endif
        enddo
    endif

enddo
```

---

##### BY: Adrià Tormos.