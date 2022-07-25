/* La idea es cargar las observaciones de auditoria, para ello se solicitan datos para la carga inicial y se
determinar el riesgo de las mismas en funciónn de factores de criticidad y a la probabilidad de ocurrencia.
Ademas se pueden:
-generar reportes por  tipo, riesgo
-Verificar si existe una determinada observacion en el listado de observaciones
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
let contenedor = document.getElementById("contenedor");

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
const observaciones = [
    { codigo: 1, descripcion: "AUSENCIA DE PROCEDIMIENTO FORMALIZADO", riesgoasignado: "ALTO", tipo: "OPERATIVA", origen: "ENTE REGULADOR" },
    { codigo: 2, descripcion: "DEBILIDADES EN EL MANUAL DE USUARIO", riesgoasignado: "MEDIO", tipo: "SISTEMAS", origen: "INTERNA" },
    { codigo: 3, descripcion: "DEBILIDADES EN LA ASIGNACION DE PERFILES DE USUARIO", riesgoasignado: "BAJO", tipo: "SISTEMAS", origen: "OTROS" },
    { codigo: 4, descripcion: "AUSENCIA DE PLAN ESTRATEGICO", riesgoasignado: "ALTO", tipo: "SISTEMAS", origen: "ENTE REGULADOR" },

];

function cargar(valor1, valor2, valor3, valor4, valor5) {
    if (valor5 === 3) {
        return observaciones.push(new observacion(valor1, valor2, valor3, valor4, "ENTE REGULADOR"));
    } else if (valor5 == 2) {
        return observaciones.push(new observacion(valor1, valor2, valor3, valor4, "INTERNA"));
    }
    else {
        return observaciones.push(new observacion(valor1, valor2, valor3, valor4, "OTROS"));
    }

}

document.querySelector(".botonCargar").addEventListener("click", function () {
    let temp = 0;
    let criticidad = 0;
    let nvaObservacion = document.querySelector(".obsIngresada").value.toUpperCase();
    if (!nvaObservacion) {
        alert(`No se ingresó ninguna observación`);
    } else {
        let tAuditoria = document.querySelector('input[name="status"]:checked').value.toUpperCase();
        let operacional = document.querySelector(".selectOperacional").value;
        temp = determinarOperacionalImpactoMonetario(operacional);
        if (temp != 5) {
            criticidad = criticidad + temp * ponderadorOperacional;
            let informacion = document.querySelector(".selectInformacion").value;
            temp = determinarInformacion(informacion);
            if (temp != 0) {
                criticidad = criticidad + temp * ponderadorInformacion;
                let impactoMonetario = document.querySelector(".selectImpacto").value;
                temp = determinarOperacionalImpactoMonetario(impactoMonetario);
                if (temp != 5) {
                    criticidad = criticidad + temp * ponderadorImpactoMonetario;
                    let cumplimiento = document.querySelector(".selectCumplimiento").value;
                    temp = determinarCumplimiento(cumplimiento);
                    if (temp != 0) {
                        criticidad = criticidad + temp * ponderadorCumplimiento;
                        let antiguedad = document.querySelector(".selectAntiguedad").value;
                        temp = determinarAntiguedad(antiguedad);
                        if (temp != 3) {
                            criticidad = criticidad + temp * ponderadorAntiguedad;
                            let nivelCriticidad = calcularNivelCriticidad(criticidad);
                            let ocurrencia = document.querySelector(".selectOcurrencia").value;
                            temp = calcularOcurrencia(ocurrencia);
                            if (temp != 0) {
                                let riesgo = temp * nivelCriticidad;
                                if (riesgo <= 4) {
                                    cargar(observaciones.length + 1, nvaObservacion, "BAJO", tAuditoria, cumplimiento);
                                } else if (riesgo <= 11) {
                                    cargar(observaciones.length + 1, nvaObservacion, "MEDIO", tAuditoria, cumplimiento);
                                } else {
                                    cargar(observaciones.length + 1, nvaObservacion, "ALTO", tAuditoria, cumplimiento);
                                }
                            }
                            else {
                                alert(`Debe seleccionar un parámetro Probabilidad de Ocurrencia correcto`);
                            }
                        } else {
                            alert(`Debe seleccionar un Factor de Riesgo Antigüedad correcto`);
                        }
                    } else {
                        alert(`Debe seleccionar un Factor de Riesgo Cumplimiento correcto`);
                    }
                } else {
                    alert(`Debe seleccionar un Factor de Riesgo Impacto Monetario correcto`);
                }

            } else {
                alert(`Debe seleccionar un Factor de Riesgo Información correcto`);
            }

        } else {
            alert(`Debe seleccionar un Factor de Riesgo Operacional correcto`);
        }
    }
}
);

function agregarhtml(arreglo) {
    if (arreglo.length != 0) {
        arreglo.forEach(i => {
            let nodo = document.createElement("div");
            if (i.tipo === "SISTEMAS") {
                nodo.innerHTML = `<p>${i.codigo}: La observación "${i.descripcion}", es de Riesgo ${i.riesgoasignado} y es una observación de Auditoria de ${i.tipo}</p>`
            } else {
                nodo.innerHTML = `<p>${i.codigo}: La observación "${i.descripcion}", es de Riesgo ${i.riesgoasignado} y es una observación de Auditoria ${i.tipo}</p>`
            }
            contenedor.appendChild(nodo);
        })
    } else {
        let nodo = document.createElement("div");
        nodo.innerHTML = `<p>No se encontraron observaciones para ese filtro aplicado</p>`
        contenedor.appendChild(nodo);
    }
}

document.querySelector(".generarReporte").addEventListener("click", () => {
    let nodito = document.createElement("div");
    nodito.innerHTML = `<h4> Reporte de Observaciones:</h4>`;
    contenedor.appendChild(nodito);
    let filtroListado1 = document.querySelector(".selectFRiesgo").value;
    let filtroListado2 = document.querySelector(".selectFTipo").value;
    //    let filtroListado3 = document.querySelector(".selectFTipo").value;
    if (filtroListado1 === "1" && filtroListado2 === "1") {//todos
        agregarhtml(observaciones);
    } else if (filtroListado1 === "2" && filtroListado2 === "1") {
        let respuesta = "ALTO";
        const observacionesFiltradas = observaciones.filter(i => i.riesgoasignado === respuesta);
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "3" && filtroListado2 === "1") {
        let respuesta = "MEDIO";
        const observacionesFiltradas = observaciones.filter(i => i.riesgoasignado === respuesta);
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "4" && filtroListado2 === "1") {
        let respuesta = "BAJO";
        const observacionesFiltradas = observaciones.filter(i => i.riesgoasignado === respuesta);
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "1" && filtroListado2 === "2") {
        let respuestaTipo = "OPERATIVA";
        const observacionesFiltradas = observaciones.filter(i => i.tipo === respuestaTipo);
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "1" && filtroListado2 === "3") {
        let respuestaTipo = "SISTEMAS";
        const observacionesFiltradas = observaciones.filter(i => i.tipo === respuestaTipo);
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "2" && filtroListado2 === "2") {
        let respuestaTipo = "OPERATIVA";
        let respuesta = "ALTO";
        const observacionesFiltradas = observaciones.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
        agregarhtml(observacionesFiltradas);
    }
    else if (filtroListado1 === "2" && filtroListado2 === "3") {
        let respuestaTipo = "SISTEMAS";
        let respuesta = "ALTO";
        const observacionesFiltradas = observaciones.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "3" && filtroListado2 === "2") {
        let respuestaTipo = "OPERATIVA";
        let respuesta = "MEDIO";
        const observacionesFiltradas = observaciones.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
        agregarhtml(observacionesFiltradas);
    }
    else if (filtroListado1 === "3" && filtroListado2 === "3") {
        let respuestaTipo = "SISTEMAS";
        let respuesta = "MEDIO";
        const observacionesFiltradas = observaciones.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
        agregarhtml(observacionesFiltradas);
    } else if (filtroListado1 === "4" && filtroListado2 === "2") {
        let respuestaTipo = "OPERATIVA";
        let respuesta = "BAJO";
        const observacionesFiltradas = observaciones.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
        agregarhtml(observacionesFiltradas);
    }
    else if (filtroListado1 === "4" && filtroListado2 === "3") {
        let respuestaTipo = "SISTEMAS";
        let respuesta = "BAJO";
        const observacionesFiltradas = observaciones.filter(i => (i.tipo === respuestaTipo && i.riesgoasignado === respuesta));
        agregarhtml(observacionesFiltradas);
    }
}

)

document.querySelector(".botonBuscar").addEventListener("click", () => {
    let respuesta = document.querySelector(".etiquetaBuscar").value.toUpperCase();
    if (respuesta) {
        if (observaciones.some(i => i.descripcion === respuesta)) {
            alert(`La observacion "${respuesta}" existe en el listado de observaciones`);
        } else {
            alert(`La observacion "${respuesta}" NO existe en el listado de observaciones`);
        }
    }
})

