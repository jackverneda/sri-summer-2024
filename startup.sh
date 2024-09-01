
# Variables
USER="tu_usuario"
DB_NAME="posgres"
SQL_FILE="bazar_api/bazardb.sql"

# Ejecutar el archivo SQL
psql -U $USER -d $DB_NAME -f $SQL_FILE

# Mostrar mensaje de éxito
echo "Archivo SQL ejecutado exitosamente en la base de datos $DB_NAME."

# Navegar a la carpeta del backend de FastAPI
cd bazar_api
uvicorn main:app --reload &

# Navegar a la carpeta del frontend de Angular
cd ../bazar_front
npm install
npm start &