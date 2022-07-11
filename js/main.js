/* La idea es determinar el riesgo de observaciones de auditoria ingresadas en funcion de factores de criticidad y 
a la probabilidad de ocurrencia*/

let ponderadorOperacional = 5;
let ponderadorInformacion = 4;
let ponderadorImpactoMonetario = 3;
let ponderadorCumplimiento = 3;
let ponderadorAntiguedad = 3;
let ponderadorInsignificante = 10;
let ponderadorMenor = 20;
let ponderadorMarcado = 40;
let ponderadorAlto = 60;
let contador = 0;

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

let respuesta = prompt("¿Desea calificar una observacion? Si/No").toUpperCase();;
while (respuesta == "SI") {
    let temp = 0;
    let criticidad = 0;
    let observacion = prompt("Ingrese la Observación a calificar").toUpperCase();
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
                            contador = contador + 1;
                            let riesgo = temp * nivelCriticidad;
                            if (riesgo <= 4) {
                                alert(`La observación "${observacion}" de Auditoria-${tipoAuditoria}, es de riesgo BAJO`);
                            } else if (riesgo <= 11) {
                                alert(`La observación "${observacion}" de Auditoria-${tipoAuditoria}, es de riesgo MEDIO`);
                            } else {
                                alert(`La observación "${observacion}" de Auditoria-${tipoAuditoria}, es de riesgo ALTO`);
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
        alert(`Error en el parámetro Tipo de Auditroria (se ingresó ${tipoAuditoria}). No se puede calcular el riesgo`);
    }
    respuesta = prompt("¿Desea calificar otra observacion? Si/No").toUpperCase();
}
alert(`Se han calificado ${contador} observaciones`);
