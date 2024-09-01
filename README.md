# sri-summer-2024

Integrantes:

- Jackson Vera Pineda.

- Kevin Manzano Rodríguez.

- Roger Fuentes Rodríguez.

# Problema

Una tienda online de cosméticos desea implementar un sistema de recomendación secuencial basado en las interacciones de los usuarios con los productos.

# Implementación

Se diseña un sistema de recomendación secuencial basado en redes neuronales recurrentes utilizando el historial de compras de los usuarios. Los datos de entrenamiento fueron tomados de los productos, críticas e historial de compras de los usuarios de Amazon. Se modelaron dos variantes principales de redes neuronales. La primera basada en algunos papers estudiados, donde se incorporan dos primeras capas de neuronas especializadas para realizar el embeddings de los productos utilizando solo su ID. El segundo modelo, no tiene en cuenta estas capas, sino que realiza el embeddings de los productos con otro modelo de embedding utilizando el título de los productos, y luego se diseña una red con una dimensión de entrada y salida en dependencia de la dimensión de embeddings.

# Requerimientos

La construcción de los conjuntos de datos, el preprocesados de los datos y el entrenamiento de los modelos de ML, se realizaron en Notebooks de Python. Entre las librerías principales usadas se destacan:
- `pandas`: para el manejo de los datos
- `keras` y `tensorflow`: para los modelos de redes neuronales

La mayoría de ejecuciones de estos Notebooks se realizaron en la plataforma online Colab, en su versión gratuita. Se recomienda utilizar esta plataforma si desean ejecutar los scripts, ya que se necesitan descargar bases de datos muy grandes, y hacer procesamientos muy costosos.

Adicinalmente el sitio web de la tienda se elaboró usando `FastAPI` y `Angular 17` sin mucha complejidad, ya que no es objetivo de este proyecto diseñar un sitio web de calidad.

# Cómo ejecutar el proyecto

Es necesario tener todos los datos en la carpeta data, ejecutar las celdas de los notebooks data_download.ipynb, data_construction.ipynb y data_preprocessing.ipynb para obtener el dataset depurado. Ejecutar, además, las celdas del archivo solucion_propuesta, para obtener los modelos knn y rnn.

Una vez con los datos listo, se debe correr el archivo startup.sh que creara una base de datos  vacía (necesario poblarla con los datos de productos) ejecutara el Api, instalará las dependencias del proyecto de Angular y lo echará a andar, para poder observar el sistema en acción.