/* La idea es cargar las observaciones de auditoria, para ello se solicitan datos para la carga inicial y se
determinar el riesgo de las mismas en función de factores de criticidad (usando ponderadores a partir de una 
metodologia dada ) y a la probabilidad de ocurrencia.
Además se pueden:
-generar reportes por  tipo, riesgo
-generar estadisdisticas por riesgo
-Carga masiva de observaciones

Se toman datos del archivo json que contiene la tabla de observaciones

La idea es agregar mas campos para poder construir una base de observaciones que pueda ser utilizada para 
seguimiento de auditoria
*/
let ponderadorOperacional = 5;
let ponderadorInformacion = 4;
let ponderadorImpactoMonetario = 3;
let ponderadorCumplimiento = 3;
let ponderadorAntiguedad = 3;
let ponderadorInsignificante = 10;
let ponderadorMenor = 20;
let ponderadorMarcado = 40;
let ponderadorAlto = 60;

let divsuno = document.getElementById("divsuno");
let uno = document.createElement("div");
divsuno.appendChild(uno);

let divsdos = document.getElementById("divsdos");
let dos = document.createElement("div");
divsdos.appendChild(dos);

let divstres = document.getElementById("divstres");
let tres = document.createElement("div");
divstres.appendChild(tres);
let canvas = document.createElement("canvas");
tres.appendChild(canvas);

let estaUno = 0;
let estaDos = 0;
let estaTres = 0;

const boton = document.querySelector(".botonConfig");
boton.style.visibility = "visible";

let codInterno = 0;


//Funciones utilizadas para calcular el riesgo de una observación ingresada
function determinarAntiguedad(valor) {
    let resultado = 3;
    switch (valor) {
        case "1":
            resultado = 2;
            break
        case "2":
            resultado = 1;
            break;
        case "3":
            resultado = 0;
            break;
        default:
            break;
    }
    return resultado;
}

function determinarOperacionalImpactoMonetario(valor) {
    let resultado = 5;
    switch (valor) {
        case "1":
            resultado = 4;
            break
        case "2":
            resultado = 3;
            break;
        case "3":
            resultado = 2;
            break;
        case "4":
            resultado = 1;
            break;
        case "5":
            resultado = 0;
            break;
        default:
            break;
    }
    return resultado;
}

function determinarInformacion(valor) {
    let resultado = 0;
    switch (valor) {
        case "1":
            resultado = 6;
            break
        case "2":
            resultado = 5;
            break;
        case "3":
            resultado = 4;
            break;
        case "4":
            resultado = 3;
            break;
        case "5":
            resultado = 2;
            break;
        case "6":
            resultado = 1;
            break;
        default:
            break;
    }
    return resultado;
}

function determinarCumplimiento(valor) {
    let resultado = 0;
    switch (valor) {
        case "1":
            resultado = 3;
            break
        case "2":
            resultado = 2;
            break;
        case "3":
            resultado = 1;
            break;
        default:
            break;
    }
    return resultado;
}

function calcularNivelCriticidad(c) {
    let resultado = 0;
    if (c <= ponderadorInsignificante) {
        resultado = 1;
    }
    else if (c <= 20) {
        resultado = 2;
    }
    else if (c <= 40) {
        resultado = 3;
    }
    else if (c <= 60) {
        resultado = 4;
    }
    else {
        resultado = 5;
    }
    return resultado;
}

function calcularOcurrencia(valor) {
    let resultado = 0;
    switch (valor) {
        case "1":
            resultado = 1;
            break
        case "2":
            resultado = 2;
            break;
        case "3":
            resultado = 3;
            break;
        case "4":
            resultado = 4;
            break;
        default:
            break;
    }
    return resultado;

}

//const observaciones = [];
class observacion {
    constructor(codigo, descripcion, riesgoasignado, tipo, origen) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.riesgoasignado = riesgoasignado;
        this.tipo = tipo;
        this.origen = origen;
    }
}
// array de observaciones
let observaciones = [];

if (JSON.parse(localStorage.getItem("observaciones")) === null) {
    //cuando el localStorage esta vacio
    codInterno = 0;
}
else {
    observaciones = JSON.parse(localStorage.getItem("observaciones"));
}

// Para eliminar lo que se va creando en el html
function eliminar() {
    uno.remove();
    dos.remove();
    //canvas.remove();
    tres.remove();
}

// Es una funcion utilizada en el cada vez que se quiere cargar una observacion y se quiere calcular el riesgo
// es llamada al inicio
function cargaAsignacion() {
    if (estaUno !== 1) {
        boton.style.visibility = "visible";
        eliminar();
        canvas.remove();
        document.querySelector(".titulo").textContent = "Carga de observación y asignación de Riesgo"
        uno = document.createElement("div");
        uno.classList.add("uno");
        divsuno.appendChild(uno);
        uno.innerHTML = `<form action="" id="formulario">
        <section class="obs p-1">
    <div class="input-group">
        <span class="input-group-text">Observación</span>
        <textarea class="form-control obsIngresada" aria-label="With textarea"></textarea>
    </div>
    <div class="container p-1">
        <label>Tipo de Auditoria</label><br>
        <label> <input type="radio" name="status" value="operativa" id="operativa" checked>
            Auditoria Operativa</label>
        <br>
        <label><input type="radio" name="status" value="sistemas" id="sistemas">
            Auditoria de Sistemas</label>
        <br>
    </div>
    <div class="container p-1">
        <h3>Factores de Criticidad</h3>
        <div class="container p-1">
            <select class="form-select form-select-lg mb-2 selectOperacional"
                aria-label=".form-select-lg example">
                <option selected>Operacional</option>
                <option value="1">Muy Alto</option>
                <option value="2">Alto</option>
                <option value="3">Medio</option>
                <option value="4">Bajo</option>
                <option value="5">Sin Impacto</option>
            </select>

            <select class="form-select form-select-lg mb-2 selectInformacion"
                aria-label=".form-select-lg example">
                <option selected>Información</option>
                <option value="1">Integridad</option>
                <option value="2">Confidencialidad</option>
                <option value="3">Confiabilidad</option>
                <option value="4">Eficiencia</option>
                <option value="5">Efectividad</option>
                <option value="6">Disponibilidadad</option>
            </select>

            <select class="form-select form-select-lg mb-2 selectImpacto"
                aria-label=".form-select-lg example">
                <option selected>Impacto Monetario</option>
                <option value="1">Muy Alto</option>
                <option value="2">Alto</option>
                <option value="3">Medio</option>
                <option value="4">Bajo</option>
                <option value="5">Sin Impacto</option>
            </select>

            <select class="form-select form-select-lg mb-2 selectCumplimiento"
                aria-label=".form-select-lg example">
                <option selected>Cumplimiento</option>
                <option value="1">Ente Regulador</option>
                <option value="2">Interna</option>
                <option value="3">Otros</option>
            </select>

            <select class="form-select form-select-lg mb-2 selectAntiguedad"
                aria-label=".form-select-lg example">
                <option selected>Antigüedad</option>
                <option value="1">Mayor o igual a 18 meses</option>
                <option value="2">Mayor a doce meses y menor a 18 meses</option>
                <option value="3">Menor o igual a 12 meses</option>
            </select>
        </div>
    </div>
    <div class="container p-1">
        <h3>Probabilidad de Ocurrencia</h3>
        <select class="form-select form-select-lg mb-2 selectOcurrencia"
            aria-label=".form-select-lg example">
            <option selected>Ocurrencia</option>
            <option value="1">Poco Frecuente</option>
            <option value="2">Frecuencia Normal</option>
            <option value="3">Frecuente</option>
            <option value="4">Muy Frecuente</option>
        </select>
    </div>
    </section>
</form>
<div id="contenedor"> </div>`;
        document.querySelector(".botonConfig").textContent = "Cargar Observación";
        let contenedor = document.getElementById("contenedor");
    }
    estaDos = 0;
    estaUno = 1;
    estaTres = 0;
}

cargaAsignacion();

//Evento on click "cargaindividual"
document.querySelector(".cargaindividual").addEventListener("click", () => {
    cargaAsignacion();
})

//Evento on click "cargamasiva"
document.querySelector(".cargamasiva").addEventListener("click", () => {
    boton.style.visibility = "hidden";
    eliminar();
    canvas.remove();
    estaDos = 0;
    estaUno = 0;
    estaTres = 0;
    document.querySelector(".titulo").textContent = "Carga masiva de observaciones";
    fetch("./baseobservaciones.json")
        .then(response => response.json())
        .then(result => {
            result.forEach(obs => {
                observaciones.push(new observacion(obs.codigo, obs.descripcion, obs.riesgoasignado, obs.tipo, obs.origen));
            })
            localStorage.setItem('observaciones', JSON.stringify(observaciones));
            codInterno = JSON.parse(localStorage.getItem("observaciones")).length;
        })
        .catch(error => console.log(error))
        .finally(() => {
            Swal.fire({
                title: 'Proceso de carga masiva de observaciones',
                text: `Se cargaron todas las observaciones`,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: 'rgb(55, 128, 211)'
            })
        })
})

//Evento on click "reportes"
document.querySelector(".reportes").addEventListener("click", () => {
    if (estaDos !== 1) {
        boton.style.visibility = "visible";
        eliminar();
        canvas.remove();
        document.querySelector(".titulo").textContent = "Generar Reporte";
        dos = document.createElement("div");
        dos.classList.add("dos");
        divsdos.appendChild(dos);
        dos.innerHTML = `<div class="container p-1">
        <h3>Filtrar por Riesgo</h3>
        <select class="form-select form-select-lg mb-2 selectFRiesgo"
            aria-label=".form-select-lg example">
            <option value="1" selected>Todos los Riesgos</option>
            <option value="2">Alto</option>
            <option value="3">Medio</option>
            <option value="4">Bajo</option>
        </select>
    </div>
    <div class="container p-1">
        <h3>Filtrar por Tipo</h3>
        <select class="form-select form-select-lg mb-2 selectFTipo"
            aria-label=".form-select-lg example">
            <option value="1" selected>Operativa y Sistemas</option>
            <option value="2">Operativa</option>
            <option value="3">Sistemas</option>
        </select>
    </div>
    
    <div id="contenedor"> </div>`;
        let contenedor = document.getElementById("contenedor");
        document.querySelector(".botonConfig").textContent = "Generar Reporte";
    }
    estaDos = 1;
    estaUno = 0;
    estaTres = 0;
})

//Evento on click "estadistica"
document.querySelector(".estadistica").addEventListener("click", () => {
    if (estaTres !== 1) {
        eliminar();
        //canvas.remove();
        document.querySelector(".titulo").textContent = "Estadísticas";
        tres = document.createElement("div");
        tres.classList.add("tres");
        divstres.appendChild(tres);

        let canvas = document.createElement("canvas");
        tres.appendChild(canvas);
        canvas.id = "myChart";

        const ctx = document.getElementById('myChart');

        //Calculo de la cantidad de observaciones de cada Riesgo Asignado
        let alto = 0;
        let medio = 0;
        let bajo = 0;

        if (JSON.parse(localStorage.getItem("observaciones")) !== null) {
            //cuando el localStorage no esta vacio
            const observacionesStorage = JSON.parse(localStorage.getItem("observaciones"));
            const obsRiesgoAlto = observacionesStorage.filter(i => i.riesgoasignado === "ALTO");
            alto = obsRiesgoAlto.length;
            const obsRiesgoMedio = observacionesStorage.filter(i => i.riesgoasignado === "MEDIO");
            medio = obsRiesgoMedio.length;
            const obsRiesgoBajo = observacionesStorage.filter(i => i.riesgoasignado === "BAJO");
            bajo = obsRiesgoBajo.length;
        }
        else {
            Swal.fire({
                title: 'Error!',
                text: 'No se encontraron observaciones',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'rgb(55, 128, 211)'
            })
        }

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Alto', 'Medio', 'Bajo'],
                datasets: [{
                    label: 'Observaciones clasificadas por Riesgo',
                    data: [alto, medio, bajo],
                    backgroundColor: [
                        'rgb(204, 18, 18)',
                        'rgb(201, 204, 18)',
                        'rgb(41, 185, 60)'
                    ],
                    borderColor: [
                        'rgb(204, 18, 18)',
                        'rgb(201, 204, 18)',
                        'rgb(41, 185, 60)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        boton.style.visibility = "hidden";
    }
    estaDos = 0;
    estaUno = 0;
    estaTres = 1;
})

//Funcion para agregar los elementos al array de objetos durante la carga individual
function cargar(valor1, valor2, valor3, valor4, valor5) {
    const orig = (valor5 === 3) ? "ENTE REGULADOR" : (valor5 == 2 ? "INTERNA" : "OTROS");
    return observaciones.push(new observacion(valor1, valor2, valor3, valor4, orig));
}

// Hay un solo boton para Cargar observacion individual y Generar Reportes
document.querySelector(".botonConfig").addEventListener("click", function () {
    if (document.querySelector(".botonConfig").textContent === "Generar Reporte") {
        //Reporte
        let filtroListado1 = document.querySelector(".selectFRiesgo").value;
        let filtroListado2 = document.querySelector(".selectFTipo").value;
        //    let filtroListado3 = document.querySelector(".selectFTipo").value;
        //Verifico si hay observaciones en el Storage
        if (JSON.parse(localStorage.getItem("observaciones")) !== null) {
            const observacionesStorage = JSON.parse(localStorage.getItem("observaciones"));
            if (filtroListado1 === "1" && filtroListado2 === "1") {//todos
                agregarhtml(observacionesStorage);
            } else if (filtroListado1 === "2" && filtroListado2 === "1") {
                let respuesta = "ALTO";
                const observacionesFiltradas = observacionesStorage.filter(i => i.riesgoasignado === respuesta);
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "3" && filtroListado2 === "1") {
                let respuesta = "MEDIO";
                const observacionesFiltradas = observacionesStorage.filter(i => i.riesgoasignado === respuesta);
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "4" && filtroListado2 === "1") {
                let respuesta = "BAJO";
                const observacionesFiltradas = observacionesStorage.filter(i => i.riesgoasignado === respuesta);
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "1" && filtroListado2 === "2") {
                let respuestaTipo = "OPERATIVA";
                const observacionesFiltradas = observacionesStorage.filter(i => i.tipo === respuestaTipo);
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "1" && filtroListado2 === "3") {
                let respuestaTipo = "SISTEMAS";
                const observacionesFiltradas = observacionesStorage.filter(i => i.tipo === respuestaTipo);
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "2" && filtroListado2 === "2") {
                let respuestaTipo = "OPERATIVA";
                let respuesta = "ALTO";
                const observacionesFiltradas = observacionesStorage.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
                agregarhtml(observacionesFiltradas);
            }
            else if (filtroListado1 === "2" && filtroListado2 === "3") {
                let respuestaTipo = "SISTEMAS";
                let respuesta = "ALTO";
                const observacionesFiltradas = observacionesStorage.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "3" && filtroListado2 === "2") {
                let respuestaTipo = "OPERATIVA";
                let respuesta = "MEDIO";
                const observacionesFiltradas = observacionesStorage.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
                agregarhtml(observacionesFiltradas);
            }
            else if (filtroListado1 === "3" && filtroListado2 === "3") {
                let respuestaTipo = "SISTEMAS";
                let respuesta = "MEDIO";
                const observacionesFiltradas = observacionesStorage.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
                agregarhtml(observacionesFiltradas);
            } else if (filtroListado1 === "4" && filtroListado2 === "2") {
                let respuestaTipo = "OPERATIVA";
                let respuesta = "BAJO";
                const observacionesFiltradas = observacionesStorage.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
                agregarhtml(observacionesFiltradas);
            }
            else if (filtroListado1 === "4" && filtroListado2 === "3") {
                let respuestaTipo = "SISTEMAS";
                let respuesta = "BAJO";
                const observacionesFiltradas = observacionesStorage.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
                agregarhtml(observacionesFiltradas);
            }
        }
        else {
            Swal.fire({
                title: 'Error!',
                text: 'No se encontraron observaciones',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'rgb(55, 128, 211)'
            })
        }
    } else {
        //Carga de observacion individual
        let temp = 0;
        let criticidad = 0;
        let nvaObservacion = document.querySelector(".obsIngresada").value.toUpperCase();
        if (!nvaObservacion) {
            Swal.fire({
                title: 'Error!',
                text: 'No se ingresó ninguna observación',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'rgb(55, 128, 211)'
            })
        } else {
            let tAuditoria = document.querySelector('input[name="status"]:checked').value.toUpperCase();
            let operacional = document.querySelector(".selectOperacional").value;
            temp = determinarOperacionalImpactoMonetario(operacional);
            if (temp != 5) {
                criticidad += temp * ponderadorOperacional;
                let informacion = document.querySelector(".selectInformacion").value;
                temp = determinarInformacion(informacion);
                if (temp != 0) {
                    criticidad += temp * ponderadorInformacion;
                    let impactoMonetario = document.querySelector(".selectImpacto").value;
                    temp = determinarOperacionalImpactoMonetario(impactoMonetario);
                    if (temp != 5) {
                        criticidad += temp * ponderadorImpactoMonetario;
                        temp = determinarCumplimiento(document.querySelector(".selectCumplimiento").value);
                        if (temp != 0) {
                            let cumplimiento = temp;
                            criticidad += temp * ponderadorCumplimiento;
                            let antiguedad = document.querySelector(".selectAntiguedad").value;
                            temp = determinarAntiguedad(antiguedad);
                            if (temp != 3) {
                                criticidad += temp * ponderadorAntiguedad;
                                let nivelCriticidad = calcularNivelCriticidad(criticidad);
                                let ocurrencia = document.querySelector(".selectOcurrencia").value;
                                temp = calcularOcurrencia(ocurrencia);
                                if (temp != 0) {
                                    let riesgo = temp * nivelCriticidad;
                                    if (codInterno === 0) {
                                        codInterno++;
                                    }
                                    else {
                                        codInterno = JSON.parse(localStorage.getItem("observaciones")).length + 1;
                                    }
                                    if (riesgo <= 4) {
                                        cargar(codInterno, nvaObservacion, "BAJO", tAuditoria, cumplimiento);
                                    } else if (riesgo <= 11) {
                                        cargar(codInterno, nvaObservacion, "MEDIO", tAuditoria, cumplimiento);
                                    } else {
                                        cargar(codInterno, nvaObservacion, "ALTO", tAuditoria, cumplimiento);
                                    }
                                    localStorage.setItem('observaciones', JSON.stringify(observaciones));
                                    Swal.fire({
                                        title: 'Exito!',
                                        text: 'Nueva observación cargada',
                                        icon: 'success',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: 'rgb(55, 128, 211)'
                                    })
                                    document.getElementById("formulario").reset();
                                }
                                else {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: 'Debe seleccionar un parámetro PROBABILIDAD DE OCURRENCIA correcto',
                                        icon: 'error',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: 'rgb(55, 128, 211)'
                                    })
                                }
                            } else {
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Debe seleccionar un Factor de Riesgo ANTIGÜEDAD correcto',
                                    icon: 'error',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: 'rgb(55, 128, 211)'
                                })
                            }
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Debe seleccionar un Factor de Riesgo CUMPLIMIENTO correcto',
                                icon: 'error',
                                confirmButtonText: 'OK',
                                confirmButtonColor: 'rgb(55, 128, 211)'
                            })
                        }
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Debe seleccionar un Factor de Riesgo IMPACTO MONERARIO correcto',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: 'rgb(55, 128, 211)'
                        })
                    }

                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Debe seleccionar un Factor de Riesgo INFORMACIÓN correcto',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'rgb(55, 128, 211)'
                    })
                }

            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Debe seleccionar un Factor de Riesgo OPERACIONAL correcto',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: 'rgb(55, 128, 211)'
                })
            }
        }
    }
})

function imprimirDetalle({ codigo, descripcion, riesgoasignado, tipo, origen }) {
    let columnaDos = document.createElement("td");
    columnaDos.textContent = codigo;
    tabla.appendChild(columnaDos);

    columnaDos = document.createElement("td");
    columnaDos.textContent = descripcion;
    tabla.appendChild(columnaDos);

    columnaDos = document.createElement("td");
    columnaDos.textContent = riesgoasignado;
    tabla.appendChild(columnaDos);

    columnaDos = document.createElement("td");
    columnaDos.textContent = tipo;
    tabla.appendChild(columnaDos);

    columnaDos = document.createElement("td");
    columnaDos.textContent = origen;
    tabla.appendChild(columnaDos);
}

let tabla = document.createElement("table");
let nodito = document.createElement("div");

//Funcion utilizada para crear una tabla en funcion del reporte seleccionado
function agregarhtml(arreglo) {
    tabla.remove();
    nodito.remove();
    if (arreglo.length != 0) {
        tabla = document.createElement("table");
        nodito = document.createElement("div");
        nodito.innerHTML = `<h4 > Reporte de Observaciones</h4>`;
        contenedor.appendChild(nodito);
        contenedor.appendChild(tabla);
        let fila = document.createElement("tr");
        tabla.appendChild(fila);
        let columnaUno = document.createElement("th");
        columnaUno.textContent = "Codigo";
        tabla.appendChild(columnaUno);
        columnaUno = document.createElement("th");
        columnaUno.textContent = "Descripción";
        tabla.appendChild(columnaUno);
        columnaUno = document.createElement("th");
        columnaUno.textContent = "Riesgo Asignado";
        tabla.appendChild(columnaUno);
        columnaUno = document.createElement("th");
        columnaUno.textContent = "Tipo de Auditoria";
        tabla.appendChild(columnaUno);
        columnaUno = document.createElement("th");
        columnaUno.textContent = "Origen";
        tabla.appendChild(columnaUno);
        const llamarObs = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(arreglo);
                }, 5000);
            })
        }
        llamarObs()
            .then(arreglo.forEach(i => {
                fila = document.createElement("tr");
                tabla.appendChild(fila);
                imprimirDetalle(i);
            }))
            .catch(error => contenedor.innerHTML = error);
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'No se encontraron observaciones para ese filtro aplicado',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: 'rgb(55, 128, 211)'
        })
    }
}


/* Esto es para buscar una observacion en particular
document.querySelector(".botonBuscar").addEventListener("click", (e) => {
    e.preventDefault();
    const observacionesStorage = JSON.parse(localStorage.getItem("observaciones"));
    let respuesta = document.querySelector(".etiquetaBuscar").value.toUpperCase();
        if (respuesta) {
        if (observacionesStorage.some(i => i.descripcion === respuesta)) {
                Swal.fire({
                title: 'SI EXISTE',
                text: `La observacion "${respuesta}" existe en el listado de observaciones`,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: 'rgb(55, 128, 211)'
            })
            const obsBuscada = observacionesStorage.filter(i => i.descripcion === respuesta);
            const objetoBuscado = {
                ...obsBuscada[0],
                fecha: Date()
            }
            localStorage.setItem('observacionesBuscadas', JSON.stringify(objetoBuscado));
        } else {
                Swal.fire({
                title: 'NO EXISTE',
                text: `La observacion "${respuesta}" no existe en el listado de observaciones`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: 'rgb(55, 128, 211)'
            })
        }
    }
})

document.querySelector(".buscados").addEventListener("click", () => {
    let nodito = document.createElement("div");
    nodito.innerHTML = `<h4> Ultimas observación buscada:</h4>`;
    contenedor.appendChild(nodito);
    const buscadas = JSON.parse(localStorage.getItem("observacionesBuscadas"));
    let nodo = document.createElement("div");
    if (buscadas === null) {
        nodo.innerHTML = `<p> No se realizó ninguna busqueda aún</p>`;
    } else {
        nodo.innerHTML = `<p> La observacion ${buscadas.descripcion} fue la ultima buscada el dia ${buscadas.fecha}</p>`;
    }
    contenedor.appendChild(nodo);
}) */

// Para resetear el formulario
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        estaUno === 1 && document.getElementById("formulario").reset();
    }
})

