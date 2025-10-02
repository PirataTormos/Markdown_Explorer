import os
from datetime import datetime
import shutil

# Define el nombre base para la carpeta
base_name = "BATCH"

# Define la ruta para la carpeta admin y el archivo secuencial
admin_dir = "admin"
seq_file = os.path.join(admin_dir, "sequential.txt")
organizer_script = os.path.join(admin_dir, "01_organizer.py")

# Crea la carpeta admin si no existe
if not os.path.exists(admin_dir):
    os.makedirs(admin_dir)

# Lee el número secuencial desde el archivo (o inicialízalo a 0 si el archivo no existe)
if os.path.exists(seq_file):
    with open(seq_file, 'r') as f:
        seq_number = int(f.read().strip())
else:
    seq_number = 0

# Incrementa el número secuencial
seq_number += 1

# Guarda el número secuencial actualizado de nuevo en el archivo
with open(seq_file, 'w') as f:
    f.write(str(seq_number))

# Obtén la fecha actual en formato YYYYMMDD
current_date = datetime.now().strftime("%Y%m%d")

# Crea el nombre de la carpeta con el número secuencial de dos dígitos
folder_name = f"{base_name}_{seq_number:02d}_{current_date}"

# Crea la carpeta en el directorio actual
os.makedirs(folder_name)

# Define los nombres de las subcarpetas
subcarpetas = ["0_Nativos", "1_Dimension", "2_Catalogue", "3_Specs"]

# Crea las subcarpetas dentro de la carpeta creada
for subcarpeta in subcarpetas:
    os.makedirs(os.path.join(folder_name, subcarpeta))

# Copia el archivo organizer.py a la carpeta 0_Nativos
shutil.copy(organizer_script, os.path.join(folder_name, "0_Nativos"))

print(f"Carpeta '{folder_name}' y subcarpetas creadas exitosamente. Archivo 'organizer.py' copiado a '0_Nativos'.")
