$(document).ready(function () {
    $('#btnEditar').attr("disabled", true);
    $('#btnEliminar').attr("disabled", true);
    $('#errorcarga').css('display', 'none');
    $('#carga').css('display', 'none');
    $('#edit').css('display', 'none');
   
    $('#cedula').focus();
    $('#nombre').css('text-transform', 'capitalize');
    $('#apellido').css('text-transform', 'capitalize');    
    $('#modifi').css('display', 'none');
    
    
    $(document).ready(function () {
        $("#fecha_actual").datepicker({
            dateFormat: 'dd-MM-yy'
        }).datepicker("setDate", new Date());
    });

    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#elementsList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});


function format(input) {
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        input.value = num;
    } else {
        alert('Solo se permiten numeros');
        input.value = input.value.replace(/[^\d\.]*/g, '');
    }
}
function ValidNum() {
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
    }
}
//FUNCION PARA VALIDAR LOS CAMPOS
(function validarcampos() {
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#cedula').focus();
                    form.classList.add('was-validated');
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    add();
                    form.classList.remove('was-validated');
                    if (document.getElementById("btnRegistrar").hasAttribute("disabled")) {
                        modificar($("#cedula").val());
                    }
                }
            }, false);
        });
    }, false);
})();

function limpiarcampos() {
    $("#cedula").val("");
    $("#nombre").val("");
    $("#apellido").val("");
    $("#fechanaci").val("");
    $("#edad").val("");
    $("#sexo").val("");
    $("#correo").val("");
    $("#tipoempleado").val("");
    $("#cel").val("");
    $("#salario").val("");
    $("#cedula").focus();
}

$(document).ready(function () {
    $("#cedula").focusout(function () {
        buscarRegistroCi();
    });
});
