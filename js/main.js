/* La idea es cargar las observaciones de auditoria, para ello se solicitan datos para la carga inicial y se
determinar el riesgo de las mismas en funciónn de factores de criticidad y a la probabilidad de ocurrencia.
Ademas se pueden:
-generar reportes por  tipo, riesgo, origen
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
//let contador = 0;

function determinarAntiguedad(valor) {
    let resultado = valor;
    if (valor >= 2) {
        resultado = 2;
    }
    return resultado;
}

function determinarOperacionalImpactoMonetario(valor) {
    let resultado = 5;
    switch (valor) {
        case "MUY ALTO":
            resultado = 4;
            break
        case "ALTO":
            resultado = 3;
            break;
        case "MEDIO":
            resultado = 2;
            break;
        case "BAJO":
            resultado = 1;
            break;
        case "SIN IMPACTO":
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
        case "INTEGRIDAD":
            resultado = 6;
            break
        case "CONFIDENCIABILIDAD":
            resultado = 5;
            break;
        case "CONFIABILIDAD":
            resultado = 4;
            break;
        case "EFICIENCIA":
            resultado = 3;
            break;
        case "EFECTIVIDAD":
            resultado = 2;
            break;
        case "DISPONIBILIDAD":
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
        case "ENTE REGULADOR":
            resultado = 3;
            break
        case "INTERNA":
            resultado = 2;
            break;
        case "OTROS":
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
        case "ESCASA":
            resultado = 1;
            break
        case "BAJA":
            resultado = 2;
            break;
        case "MEDIA":
            resultado = 3;
            break;
        case "ALTA":
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
        this.riesgoasignado = riesgoasignado.toUpperCase();
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
    return observaciones.push(new observacion(valor1, valor2, valor3, valor4, valor5));
}

let respuesta = prompt("¿Desea calificar una observacion? Si/No").toUpperCase();
while (respuesta == "SI") {
    let temp = 0;
    let criticidad = 0;
    let nvaObservacion = prompt("Ingrese la Observación a calificar").toUpperCase();
    let tipoAuditoria = prompt("Ingrese tipo de auditoria (Operativa / Sistemas)").toUpperCase();;
    if (tipoAuditoria == "OPERATIVA" || tipoAuditoria == "SISTEMAS") {
        let operacional = prompt("Ingrese el valor de criticidad Operacional: Muy Alto / Alto / Medio / Bajo / Sin Impacto").toUpperCase();
        temp = determinarOperacionalImpactoMonetario(operacional);
        if (temp != 5) {
            criticidad = criticidad + temp * ponderadorOperacional;
            let informacion = prompt("Ingrese el valor de criticidad Información: Integridad / Confidencialidad / Confiabilidad / Eficiencia / Efectividad / Disponibilidad").toUpperCase();
            temp = determinarInformacion(informacion);
            if (temp != 0) {
                criticidad = criticidad + temp * ponderadorInformacion;
                let impactoMonetario = prompt("Ingrese el valor de criticidad Impacto Monetario: Muy Alto / Alto / Medio / Bajo / Sin Impacto").toUpperCase();
                temp = determinarOperacionalImpactoMonetario(impactoMonetario);
                if (temp != 5) {
                    criticidad = criticidad + temp * ponderadorImpactoMonetario;
                    let cumplimiento = prompt("Ingrese el valor de criticidad Cumplimiento: Ente Regulador / Interna / Otros").toUpperCase();
                    temp = determinarCumplimiento(cumplimiento);
                    if (temp != 0) {
                        let antiguedad = parseInt(prompt("Ingrese la Antiguedad de la observacion en años:"));
                        criticidad = criticidad + temp * ponderadorCumplimiento + determinarAntiguedad(antiguedad) * ponderadorAntiguedad;
                        //alert(`${criticidad}`);
                        let nivelCriticidad = calcularNivelCriticidad(criticidad);
                        let ocurrencia = prompt("Ingrese el valor de la probabilidad de ocurrencia: Escasa / Baja / Media / Alta").toUpperCase();
                        temp = calcularOcurrencia(ocurrencia);
                        if (temp != 0) {
                            //contador = contador + 1;
                            let riesgo = temp * nivelCriticidad;
                            if (riesgo <= 4) {
                                cargar(observaciones.length + 1, nvaObservacion, "bajo", tipoAuditoria, cumplimiento);
                            } else if (riesgo <= 11) {
                                cargar(observaciones.length + 1, nvaObservacion, "medio", tipoAuditoria, cumplimiento);
                            } else {
                                cargar(observaciones.length + 1, nvaObservacion, "alto", tipoAuditoria, cumplimiento);
                            }
                        }
                        else {
                            alert(`Error en el parámetro Probabilidad de Ocurrencia (se ingresó ${ocurrencia}). No se puede calcular el riesgo`);
                        }

                    } else {
                        alert(`Error en el parámetro Factor de Riesgo Cumplimiento (se ingresó ${cumplimiento}). No se puede calcular el riesgo`);
                    }
                } else {
                    alert(`Error en el parámetro Factor de Riesgo Impacto Monetario (se ingresó ${impactoMonetario}). No se puede calcular el riesgo`);
                }

            } else {
                alert(`Error en el parámetro Factor de Riesgo Información (se ingresó ${informacion}). No se puede calcular el riesgo`);
            }

        } else {
            alert(`Error en el parámetro Factor de Riesgo Operacional (se ingresó ${operacional}). No se puede calcular el riesgo`);
        }
    } else {
        alert(`Error en el parámetro Tipo de Auditoria (se ingresó ${tipoAuditoria}). No se puede calcular el riesgo`);
    }
    respuesta = prompt("¿Desea calificar otra observacion? Si/No").toUpperCase();
}
//console.log(observaciones);

/*if (observaciones.length != 0) {
    respuesta = prompt("¿Desea imprimir el listado de observaciones?").toUpperCase();
    if (respuesta == "SI") {
        console.log("Listado de Observaciones");
        for (const observacion of observaciones) {
            if (observacion.tipo === "SISTEMAS") {
                console.log(`La observación "${observacion.descripcion}", es de Riesgo ${observacion.riesgoasignado} y es una observación de Auditoria de ${observacion.tipo}`)
            } else {
                console.log(`La observación "${observacion.descripcion}", es de Riesgo ${observacion.riesgoasignado} y es una observación de Auditoria ${observacion.tipo}`)
            }
        }
    }
}*/

function imprimir(arreglo) {
    arreglo.forEach(i => {
        if (i.tipo === "SISTEMAS") {
            console.log(`${i.codigo}: La observación "${i.descripcion}", es de Riesgo ${i.riesgoasignado} y es una observación de Auditoria de ${i.tipo}`);
        } else {
            console.log(`${i.codigo}: La observación "${i.descripcion}", es de Riesgo ${i.riesgoasignado} y es una observación de Auditoria ${i.tipo}`);
        }
    })
}



respuesta = prompt("Reporte por tipo de observacion: Operativa/ Sistemas").toUpperCase();
if (respuesta == "OPERATIVA" || respuesta == "SISTEMAS") {
    const observacionesFiltradas = observaciones.filter(i => i.tipo === respuesta);
    console.log(`Listado de observaciones: ${respuesta}`)
    imprimir(observacionesFiltradas);
} else {
    alert(`No se puede generar el reporte, error en el Tipo de Auditoria ingresado`);
}

respuesta = prompt("Reporte por riesgo de la observacion: Alto / Medio / Bajo").toUpperCase();
if (respuesta == "BAJO" || respuesta == "MEDIO" || respuesta == "ALTO") {
    const observacionesFiltradas = observaciones.filter(i => i.riesgoasignado === respuesta);
    console.log(`Listado de observaciones: Riesgo ${respuesta}`)
    imprimir(observacionesFiltradas);
} else {
    alert(`No se puede generar el reporte, error en el riesgo ingresado`);
}

respuesta = prompt("Reporte por origen de la observacion: Ente Regulador / Interna / Otros").toUpperCase();
if (respuesta == "ENTE REGULADOR" || respuesta == "INTERNA" || respuesta == "OTROS") {
    const observacionesFiltradas = observaciones.filter(i => i.origen === respuesta);
    console.log(`Listado de observaciones: Origen ${respuesta}`)
    imprimir(observacionesFiltradas);
} else {
    alert(`No se puede generar el reporte, error en el origen ingresado`);
}

respuesta = prompt("Ingrese la observacion a buscar").toUpperCase();
if (observaciones.some(i => i.descripcion === respuesta)) {
    console.log(`La observacion "${respuesta}" existe en el listado de observaciones`);
} else {
    console.log(`La observacion "${respuesta}" NO existe en el listado de observaciones`);
}