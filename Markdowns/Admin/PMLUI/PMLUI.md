

C:\AVEVA\Everything3D3.1\mon.exe PROD E3D init "C:\AVEVA\Everything3D3.1\launch.init

```batch
set aveva_design_installed_dir=%0\
if exist "%aveva_design_installed_dir%evars.init" call "%aveva_design_installed_dir%evars.init"
```

En evars.init se ven dos cosas, la primera son las rutas definidas del programa (recuerda que hay un fichero de salvamento) y una llamada al fichero de evars de custom, aqui es donde aveva muestra su intencion de colocar las cosas. 

```batch
set pmllib=%aveva_design_exe%pmllib\
set pmlui=%aveva_design_exe%pmlui\


if exist "%projects_dir%custom_evars.bat" call "%projects_dir%custom_evars.bat"
```




Conclusion: los cambios de 




Explicar con un ejemplo la apariencia diferente que tiene los programas PMLUI de los PMLLIB (en el ejemplo de los pmllib se ven los 4 tipos, comandos, funciones,objetos y formularios)