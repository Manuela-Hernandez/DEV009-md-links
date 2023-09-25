# Markdown Links

## Índice
* [1. Resumen del proyecto](#1-resumen-del-proyecto)
* [2. Diagrama de flujo](#2-diagrama-de-flujo)
* [3. Planificación del proyecto](#3-palnificación-del-proyecto)
* [4. Instalación](#4-instalación)
* [5. Guia de uso](#5-guia-de-uso)
* [6. Pruebas unitarias](#6-pruebas-unitarias)



## 1. Resumen del proyecto

En este proyecto se realizó una herramienta usando Node.js la cual permite leer y analizar archivos en formato `Markdown`. Asi mismo como verificar los links que contengan y reportar
algunas estadísticas.

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de la información que se quiere compartir.

## 2. Diagrama de flujo 
![Diagrama de flujo](/img/Diagrama-de-flujo.png)

## 3. Planificación del proyecto

Se realiza la planificación siguiendo la metodología ágil:
* Metodo Kanban: se realiza usando Github projects con issues y milestones para priorizar y organizar el trabajo y hacer seguimiento del proceso. Se plantearon 5 milestones que equivale a cada hito del proyecto y los issues son las tareas especificas para lograr el milestones.

[Github project](https://github.com/Manuela-Hernandez/DEV009-md-links/milestones)
![Github project](/img/Github-project-mdlinks.png)

## 4. Instalación
```
npm install Manuela-Hernandez/DEV009-md-links
```
## 5. Guia de uso
### Interfaz de Línea de Comando (CLI)

```
mdlinks <path-to-file> [options]
```

* Path-to-file: Es la ruta del archivo o directorio el cual se va a analizar.
* Options: Tendríamos dos opciones: _validate_ y/o _stats_.

### Ejemplos:

1. Sin validar los links: Obtendremos un arreglo de objetos con las siguientes propiedades:

* text: Texto que aparecía dentro del link.
* href: URL encontrada.
* file: Ruta del archivo donde se encontró el link

 * Comando: `mdlinks ./archivo2.mkd`

 ![Sin validar](/img/Sin-validar.png)

2. Con validación: Al arreglo anterior se le  agregarían las siguientes propiedades:

* status: Código de respuesta HTTP.
* ok: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

* Comando: `mdlinks ./archivo2.mkd --validate`

![Con validación](/img/Con-validate.png)

3. Con stats: Esta opción permite obtener estadísticas relacionadas con los links presentes en los archivos Markdown.

* Total: Total de los links encontrados.
* Unique: Total de links únicos.

* Comando: `mdlinks ./archivo2.mkd --stats`

![Con stats](/img/--stats.png)

4. Combinar  `--validate` y `--stats`: Permite obtener estadísticas que necesiten de los resultados de la validación. Se agregaría la siguiente propiedad:

* Broken: Equivale al total de links rotos, es decir los enlaces que al hacer la valicación arrojen un status diferente a `200`.

* Comando: `mdlinks ./file.md  --stats --validate`

![Stats y validate](/img/--stats%20y%20--validate.png)

### Manejo de errores:
* Cuando la ruta no existe.
* Cuando la ruta es un archivo y no es Markdown.
* Cuando dentro del directorio no hay archivos.


## 6. Pruebas unitarias
  ![Pruebas](/img/Pruebas-mdlinks.png)

## Desarrollado por

- [@Manuela-Hernandez](https://github.com/Manuela-Hernandez)