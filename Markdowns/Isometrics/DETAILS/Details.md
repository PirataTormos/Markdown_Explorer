## Introducción

Para mostrar un detalle en la isométrica, debes asignar el archivo de detalle al componente correspondiente y activar su visualización mediante el *preview standard*.

---

## 1. Especificar la ubicación del archivo `.PLT`

En la UDA **DPFN** del componente, indica la ruta completa del archivo en formato `.PLT`:

```plaintext
Ejemplo: DPFN \\ruta\al\archivo\detalle.plt
```

---

## 2. Configurar la visualización del detalle

Agrega la siguiente sentencia en el *preview standard* para posicionar el detalle en la isométrica:

```plaintext
POSITION DETAILPLOTS CORNER BL X 280 Y 80 CHARH 5 DIR UP STACK 5 DIR LEFT SCALE 10
```

**Parámetros:**

- `CORNER BL`: Esquina inferior izquierda (*Bottom Left*)
- `X 280 Y 80`: Coordenadas de posición
- `CHARH 5`: Altura de los caracteres
- `DIR UP`: Dirección hacia arriba
- `STACK 5`: Apilamiento de detalles
- `DIR LEFT`: Dirección de apilamiento hacia la izquierda
- `SCALE 10`: Escala del detalle

Puedes ajustar estos valores según tus necesidades de presentación.
Cabe remarcar que excepto el `SCALE`, y las coordenadas, no se ha encontrado su utilidad.
---

## 3. Guardar y verificar la visualización

Guarda los cambios realizados y verifica que el detalle se muestre correctamente en la isométrica generada.

