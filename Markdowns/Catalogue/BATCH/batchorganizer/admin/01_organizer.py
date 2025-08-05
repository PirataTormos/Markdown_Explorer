import os
import shutil
import glob
import codecs

# Define la ruta de la carpeta actual y las carpetas 1_Dimension, 2_Catalogue, 3_Specs y 7_Reports que están un directorio por encima
current_dir = os.getcwd()
parent_dir = os.path.dirname(current_dir)
dimension_folder = os.path.join(parent_dir, "1_Dimension")
catalogue_folder = os.path.join(parent_dir, "2_Catalogue")
specs_folder = os.path.join(parent_dir, "3_Specs")
deletes_folder = os.path.join(specs_folder, "Deletes")
reports_folder = os.path.join(parent_dir, "7_Reports")
missing_bolts_folder = os.path.join(reports_folder, "Missing_Bolts")

# Crea las carpetas 1_Dimension, 2_Catalogue, 3_Specs, Deletes, 7_Reports y Missing_Bolts si no existen
if not os.path.exists(dimension_folder):
    os.makedirs(dimension_folder)
if not os.path.exists(catalogue_folder):
    os.makedirs(catalogue_folder)
if not os.path.exists(specs_folder):
    os.makedirs(specs_folder)
if not os.path.exists(deletes_folder):
    os.makedirs(deletes_folder)
if not os.path.exists(reports_folder):
    os.makedirs(reports_folder)
if not os.path.exists(missing_bolts_folder):
    os.makedirs(missing_bolts_folder)

# Busca archivos con formato Excel en el directorio actual y en todas las subcarpetas
excel_files = glob.glob(os.path.join(current_dir, "**", "*.xlsx"), recursive=True)

# Copia los archivos Excel encontrados a la carpeta 1_Dimension
for excel_file in excel_files:
    # Obtiene el nombre del archivo sin la ruta
    file_name = os.path.basename(excel_file)
    # Sustituye los espacios por guiones bajos en el nombre del archivo
    new_file_name = file_name.replace(" ", "_")
    # Define la ruta completa del nuevo archivo en la carpeta 1_Dimension
    new_file_path = os.path.join(dimension_folder, new_file_name)
    # Copia el archivo al nuevo destino con el nombre modificado
    shutil.copy(excel_file, new_file_path)

print(f"Archivos Excel copiados exitosamente a {dimension_folder} con nombres modificados si tenían espacios.")

# Busca archivos con extensión .dat que contengan en su nombre _d, _m, _b, _bs, _c, o _u en el directorio actual y en todas las subcarpetas
dat_files_patterns = ["*_d*.dat", "*_m*.dat", "*_b*.dat", "*_bs*.dat", "*_c*.dat", "*_u*.dat"]
dat_files = []
for pattern in dat_files_patterns:
    dat_files.extend(glob.glob(os.path.join(current_dir, "**", pattern), recursive=True))

# Copia los archivos .dat encontrados a la carpeta 2_Catalogue y modifica su encoding a UTF-8-BOM
for dat_file in dat_files:
    # Obtiene el nombre del archivo sin la ruta
    file_name = os.path.basename(dat_file)
    # Define la ruta completa del nuevo archivo en la carpeta 2_Catalogue
    new_file_path = os.path.join(catalogue_folder, file_name)
    # Copia el archivo al nuevo destino
    shutil.copy(dat_file, new_file_path)
    
    # Modifica el encoding del archivo a UTF-8-BOM
    with open(dat_file, 'r', encoding='latin1') as f:
        content = f.read()
    
    with codecs.open(new_file_path, 'w', encoding='utf-8-sig') as f:
        f.write(content)

    # Elimina el símbolo 'Â' de los archivos con '_d' o '_m' en su nombre
    if '_d' in file_name or '_m' in file_name:
        with open(new_file_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        content = content.replace('Â', '')

        with open(new_file_path, 'w', encoding='utf-8-sig') as f:
            f.write(content)

print(f"Archivos .dat copiados exitosamente a {catalogue_folder} y modificados a UTF-8-BOM.")

# Busca archivos con extensión .spec que contengan la palabra new delante de su nombre en el directorio actual y en todas las subcarpetas
spec_files = glob.glob(os.path.join(current_dir, "**", "new*.spec"), recursive=True)

# Copia los archivos .spec encontrados a la carpeta 3_Specs
for spec_file in spec_files:
    # Obtiene el nombre del archivo sin la ruta
    file_name = os.path.basename(spec_file)
    # Define la ruta completa del nuevo archivo en la carpeta 3_Specs
    new_file_path = os.path.join(specs_folder, file_name)
    # Copia el archivo al nuevo destino
    shutil.copy(spec_file, new_file_path)

print(f"Archivos .spec copiados exitosamente a {specs_folder} si existían.")

# Abre todos los archivos de la carpeta 3_Specs y agrega una -- delante de todas las líneas que contengan el texto EXTRA :TP-UPDATE-STATUS
for spec_file in glob.glob(os.path.join(specs_folder, "*.spec")):
    with open(spec_file, 'r') as f:
        lines = f.readlines()
    
    with open(spec_file, 'w') as f:
        for line in lines:
            if "EXTRA :TP-UPDATE-STATUS" in line:
                f.write("--" + line)
            else:
                f.write(line)

print(f"Archivos .spec modificados exitosamente en {specs_folder}.")

# Busca archivos con extensión .spec que contengan la palabra delete al inicio del nombre en el directorio actual y en todas las subcarpetas
delete_spec_files = glob.glob(os.path.join(current_dir, "**", "delete*.spec"), recursive=True)

# Copia los archivos .spec encontrados a la carpeta 3_Specs/Deletes
for delete_spec_file in delete_spec_files:
    # Obtiene el nombre del archivo sin la ruta
    file_name = os.path.basename(delete_spec_file)
    # Define la ruta completa del nuevo archivo en la carpeta 3_Specs/Deletes
    new_file_path = os.path.join(deletes_folder, file_name)
    # Copia el archivo al nuevo destino
    shutil.copy(delete_spec_file, new_file_path)

print(f"Archivos .spec copiados exitosamente a {deletes_folder} si existían.")

# Abre todos los archivos de la carpeta 3_Specs/Deletes y agrega una -- delante de todas las líneas que empiecen por EXTRA
for delete_spec_file in glob.glob(os.path.join(deletes_folder, "*.spec")):
    with open(delete_spec_file, 'r') as f:
        lines = f.readlines()
    
    with open(delete_spec_file, 'w') as f:
        for line in lines:
            if line.startswith("EXTRA"):
                f.write("--" + line)
            else:
                f.write(line)

print(f"Archivos delete .spec modificados exitosamente en {deletes_folder}.")

# Abre todos los archivos .spec en la carpeta 3_Specs excepto los de la carpeta Deletes y copia las líneas que contienen ??? y sus tres líneas inferiores a un archivo de texto en Missing_Bolts dentro de 7_Reports
missing_bolts_all_specs_path = os.path.join(missing_bolts_folder, "MissingBoltsAllSpecs.txt")
with open(missing_bolts_all_specs_path, 'w') as all_specs_report:
    for spec_file in glob.glob(os.path.join(specs_folder, "*.spec")):
        if deletes_folder not in spec_file:
            with open(spec_file, 'r') as f:
                lines = f.readlines()
            
            report_lines = []
            for i in range(len(lines)):
                if "???" in lines[i]:
                    report_lines.extend(lines[i:i+4])
            
            if report_lines:
                # Obtiene los caracteres entre _ del nombre del archivo .spec y agrega _missing_bolts al final
                file_name_parts = os.path.basename(spec_file).split('_')
                if len(file_name_parts) > 1:
                    report_file_name = file_name_parts[1] + "_missing_bolts.txt"
                    report_file_path = os.path.join(missing_bolts_folder, report_file_name)
                    
                    with open(report_file_path, 'w') as report_file:
                        report_file.writelines(report_lines)
                    
                    # Escribe el nombre del archivo en mayúsculas en MissingBoltsAllSpecs.txt
                    all_specs_report.write(f"\n{report_file_name.upper()}\n")
                    all_specs_report.writelines(report_lines)

print(f"Archivos .spec analizados y reportes generados exitosamente en {missing_bolts_folder}.")

# Vuelve a la carpeta 3_Specs y abre los archivos .spec que se encuentran en su interior, busca los ??? y los sustituye por =0
for spec_file in glob.glob(os.path.join(specs_folder, "*.spec")):
    if deletes_folder not in spec_file:
        with open(spec_file, 'r') as f:
            lines = f.readlines()
