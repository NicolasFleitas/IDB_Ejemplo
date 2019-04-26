var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;

function startDB() {
    dataBase = indexedDB.open('DatosEmpleados', 1);
    dataBase.onupgradeneeded = function (_e) {
        var active = dataBase.result;
        var object = active.createObjectStore("empleados", {keyPath: 'id', autoIncrement: true});
        object.createIndex('id_empleado', 'id', {unique: true});
        object.createIndex('fecha_ingreso', 'fecha_actual', {unique: false});
        object.createIndex('nombre_empleado', 'nombre', {unique: false});
        object.createIndex('cedula_empleado', 'cedula', {unique: true});
        object.createIndex('apellido_empleado', 'apellido', {unique: false});
        object.createIndex('fechanaci_empleado', 'fechanaci', {unique: false});
        object.createIndex('edad_empleado', 'edad', {unique: false});
        object.createIndex('correo_empleado', 'correo', {unique: false});
        object.createIndex('sexo_empleado', 'sexo', {unique: false});
        object.createIndex('tipoempleado_elumno', 'tipoempleado', {unique: false});
        object.createIndex('cel_empleado', 'cel', {unique: false});
        object.createIndex('salario_empleado', 'salario', {unique: false});
    };

    dataBase.onsuccess = function (_e) {
        //  alert('Base de Datos Activa');
        CargaDb();
    };
    dataBase.onerror = function (_e) {
        alert('Error al inicializar la base de datos');
    };
}

function add() {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readwrite");
    var object = data.objectStore("empleados");
    var request = object.put({ // realizar un insert en el objeto
        cedula: document.querySelector("#cedula").value,
        nombre: document.querySelector("#nombre").value,
        apellido: document.querySelector("#apellido").value,
        fechanaci: document.querySelector("#fechanaci").value,
        edad: document.querySelector("#edad").value,
        correo: document.querySelector("#correo").value,
        sexo: document.querySelector("#sexo").value,
        tipoempleado: document.querySelector("#tipoempleado").value,
        cel: document.querySelector("#cel").value,
        fecha_actual: document.querySelector("#fecha_actual").value,
        salario: document.querySelector('#salario').value
    });
    request.onerror = function (_e) {
        $('#cedula').focus();
    };
    data.oncomplete = function (_e) {        
        $('#carga').fadeIn();
        $('#carga').fadeOut(3000);
        $('#cedula').focus();
        CargaDb();
        limpiarcampos();
    };
}
function limpiarcampos() {
    document.querySelector('#cedula').value = '';
        document.querySelector('#nombre').value = '';
        document.querySelector('#apellido').value = '';
        document.querySelector('#fechanaci').value = '';
        document.querySelector('#edad').value = '';
        document.querySelector('#correo').value = '';
        document.querySelector('#sexo').value = '';
        document.querySelector('#tipoempleado').value = '';
        document.querySelector('#cel').value = '';
        
        document.querySelector('#salario').value = '';
}
//Refresca la Base de Datos.
function CargaDb() {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readonly");
    var object = data.objectStore("empleados");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        var outerHTML = '';
        for (var key in elements) {
            outerHTML += '\n\
                        <tr>\n\
                            <td>' + elements[key].id + '</td>\n\
                            <td>' + elements[key].fecha_actual + '</td>\n\
                            <td>' + elements[key].cedula + '</td>\n\
                            <td>' + elements[key].nombre + '</td>\n\
                            <td>' + elements[key].apellido + '</td>\n\
                            <td>' + elements[key].sexo + '</td>\n\
                            <td>' + elements[key].tipoempleado + '</td>\n\
                            <td>' + elements[key].cel + ' </td> \n\
                            <td>' + elements[key].salario + '</td> \n\
                            <td>\n\<button type="button" onclick="recuperar(' + elements[key].id + ')" class="btn">Editar</button>\n\
                            <td>\n\<button type="button" onclick="eliminarRegistro(' + elements[key].id + ')" class="btn">Eliminar</button>\n\
                                                    </tr>';
        }
        elements = [];
        document.querySelector("#elementsList").innerHTML = outerHTML;
    };
}

function recuperar(id) {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readonly");
    var object = data.objectStore("empleados");
    var index = object.index("id_empleado");
    var request = index.get(id);

    request.onsuccess = function () {
        var result = request.result;
        if (result !== undefined) {
            document.querySelector('#id').value = result.id;
            document.querySelector('#cedula').value = result.cedula;
            document.querySelector('#nombre').value = result.nombre;
            document.querySelector('#apellido').value = result.apellido;
            document.querySelector('#fechanaci').value = result.fechanaci;
            document.querySelector('#fecha_actual').value = result.fecha_actual;
            document.querySelector('#edad').value = result.edad;
            document.querySelector('#correo').value = result.correo;
            document.querySelector('#sexo').value = result.sexo;
            document.querySelector('#tipoempleado').value = result.tipoempleado;
            document.querySelector('#cel').value = result.cel;
            document.querySelector('#salario').value = result.salario;

            $('#btnEliminar').attr("disabled", false);
            $('#btnRegistrar').attr("disabled", true);
            $('#btnEditar').attr("disabled", false);
            $('#cedula').attr("disabled", true);
            $("#nombre").focus();
        }
    };
}


//Funcion que modifica los datos.
function modificar(cedula) {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readwrite");
    var objectStore = data.objectStore("empleados");
    var index = objectStore.index('cedula_empleado');
    index.openCursor(cedula).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var updateData = cursor.value;
            updateData.cedula = document.querySelector("#cedula").value;
            updateData.nombre = document.querySelector("#nombre").value;
            updateData.apellido = document.querySelector("#apellido").value;
            updateData.fechanaci = document.querySelector("#fechanaci").value;
            updateData.sexo = document.querySelector("#sexo").value;
            updateData.edad = document.querySelector("#edad").value;
            updateData.tipoempleado = document.querySelector("#tipoempleado").value;
            updateData.correo = document.querySelector("#correo").value;
            updateData.cel = document.querySelector("#cel").value;
            updateData.salario = document.querySelector("#salario").value;
            var request = cursor.update(updateData);
            request.onsuccess = function () {
                $("#modifi").fadeIn();
                $("#modifi").fadeOut(3000);
                $('#registrar').attr("disabled", false);
                $('#cedula').attr("disabled", false);
                CargaDb();
                limpiarcampos();
            };
            request.onerror = function () {
                alert('Error' + '/n/n' + request.error.name + '\n\n' + request.error.message);
                CargaDb();
            };
        }
    };
}

function eliminarRegistro(id) {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readwrite");
    var object = data.objectStore("empleados");
    var request = object.delete(id);
    request.onsuccess = function () {
        $("#cedula").focus();
        CargaDb();
    };
}

function buscarCi() {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readonly");
    var object = data.objectStore("empleados");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        for (var key in elements) {
            var cedula = elements[key].cedula;
            if (cedula === $("#cedula").val()) {
                recuperar(elements[key].id);
            }
        }
        elements = [];
    };
}

// Comprobar que no repita la ci
function buscarRegistroCi() {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readonly");
    var object = data.objectStore("empleados");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        for (var key in elements) {
            var cedula = elements[key].cedula;
            if (cedula === $("#cedula").val()) {
                $("#cedula").focus();
                $('#errorcarga').fadeIn();
                $('#errorcarga').fadeOut(2000);                
                recuperar(elements[key].id)
                $("#cedula").val("");
            }
        }
        elements = [];
    };
}
//Funcion que elimina los datos de la Base de Datos.
function eliminar(cedula) {
    var active = dataBase.result;
    var data = active.transaction(["empleados"], "readwrite");
    var object = data.objectStore("empleados");
    var request = object.delete(cedula);
    request.onsuccess = function () {
        $("#cedula").focus();
        CargaDb();
    };
}