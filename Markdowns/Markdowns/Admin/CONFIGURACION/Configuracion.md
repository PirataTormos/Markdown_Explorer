
# COMO LO HACE AVEVA 

Como lo hace aveva:  <B><FONT COLOR="red"> 
LNK-> Launch.init -> evars.int -> custom_evars.bat
</FONT></B>

## Acceso.lnk

```
Traget:     C:\AVEVA\Everything3D2.10\mon.exe PROD E3D init "C:\AVEVA\Everything3D2.10\launch.init"
Start in:   C:\Users\Public\Documents\AVEVA\USERDATA\
```



## Launch.init
La función principal de **lauch.init** es llamar a evars.init

```batch
set aveva_design_installed_dir=%0\
call "%aveva_design_installed_dir%evars.init"
```

## evars.init 
tiene dos funciones, establecer las variables de entorno y encontrar los proyectos.

Variables:
```batch
set pmllib=%aveva_design_exe%pmllib\
set AVEVA_DESIGN_DFLTS=C:\Users\Public\Documents\AVEVA\Everything3D\Data2.10\DFLTS\
set aveva_design_user=C:\Users\Public\Documents\AVEVA\USERDATA\
```

Proyectos:
```batch
set projects_dir=C:\Users\Public\Documents\AVEVA\Projects\E3D2.1\
if exist "%projects_dir%custom_evars.bat" call "%projects_dir%custom_evars.bat"
```

## custom_evars.bat

en esta logica el custrom_evars llama o bien explicitamente a los proyectos o llama a otro archivo que a su verz llama a los proyectos.
```batch
rem Call projects explicitly
if exist "%projects_dir%mdu\evarsmdu.bat" call "%projects_dir%mdu\evarsmdu.bat" "%projects_dir%"
rem Add any additional projects into the file projects.bat.
if exist "%projects_dir%projects.bat" call "%projects_dir%projects.bat" "%projects_dir%"
```

## evarsproject.bat

Llegados hasta aqui solo queda apuntar a las bases de datos.
Este archivo es creado por el asistente para la creacion de proyectos.

```batch
SET GHT000=\\es001vs0120\GHT\PROJECT\ght000
SET GHTMAC=\\es001vs0120\GHT\PROJECT\ghtmac
SET GHTISO=\\es001vs0120\GHT\PROJECT\ghtiso
```

## set_aveva_design.bat

"C:\AVEVA\Everything3D2.10\set_aveva_design.bat"

Al final del launch.init se asegura de que las variables de diseño esten seteadas. Aqui podemos ver como consultarlas. 
set compatibility_batfile=%aveva_design_installed_dir%set_aveva_design.bat

```batch
set PDMSEXE=%AVEVA_DESIGN_EXE%
set PDMSUI=%PMLUI%
set pdmsdflts=%AVEVA_DESIGN_DFLTS%
set pdmsuser=%AVEVA_DESIGN_USER%
set pdmswk=%AVEVA_DESIGN_WORK%
set pdmsplots=%AVEVA_DESIGN_PLOTS%
set pdmsuser=%AVEVA_DESIGN_USER%
set pdmsrepdir=%AVEVA_DESIGN_REP_DIR%
set pdmshelpdir=%AVEVA_DESIGN_HELP_DIR%
set pdms_installed_dir=%AVEVA_DESIGN_INSTALLED_DIR%
set pdms_findexe=%AVEVA_DESIGN_FINDEXE%
set pdms_acad=%AVEVA_DESIGN_ACAD%
set pdms_acad_path=%AVEVA_DESIGN_ACAD_PATH%
set pdms_console_window=%AVEVA_DESIGN_CONSOLE_WINDOW%
set PDMSLOG=%AVEVA_DESIGN_LOG%
set PDMSLOGOPT=%AVEVA_DESIGN_LOG_OPT%
```



# CUSTOMIZACION EN TECHNIP

## FICHERO INIT

Lo primero que hace una persona sabia es llamar al evars de la instalación en la direccion de instalacion del programa: 

```
set AVEVA_DESIGN_INSTALLED_DIR=C:\AVEVA\Administration1.9\
call %AVEVA_DESIGN_INSTALLED_DIR%\evars.init
```

Observe que establece todas las variables de entorno, algunas de ellas seran controladas para poder realizar lecturas donde nos es conveniente ('overwriting settings')