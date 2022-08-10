/* La idea es cargar las observaciones de auditoria, para ello se solicitan datos para la carga inicial y se
determinar el riesgo de las mismas en funciónn de factores de criticidad y a la probabilidad de ocurrencia.
Ademas se pueden:
-generar reportes por  tipo, riesgo
-Verificar si existe una determinada observacion en el listado de observaciones

Para proximas entregas voy a dividirlo en 3 html

utilice algunos operadores avanzados, en cuanto a Spread de objetos la aplique en una funcion, 
pero despues lo voy a sacar al boton porque no creo que lo use.

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
/* const observaciones = [
    { codigo: 1, descripcion: "AUSENCIA DE PROCEDIMIENTO FORMALIZADO", riesgoasignado: "ALTO", tipo: "OPERATIVA", origen: "ENTE REGULADOR" },
    { codigo: 2, descripcion: "DEBILIDADES EN EL MANUAL DE USUARIO", riesgoasignado: "MEDIO", tipo: "SISTEMAS", origen: "INTERNA" },
    { codigo: 3, descripcion: "DEBILIDADES EN LA ASIGNACION DE PERFILES DE USUARIO", riesgoasignado: "BAJO", tipo: "SISTEMAS", origen: "OTROS" },
    { codigo: 4, descripcion: "AUSENCIA DE PLAN ESTRATEGICO", riesgoasignado: "ALTO", tipo: "SISTEMAS", origen: "ENTE REGULADOR" },

]; */
//localStorage.setItem('observaciones', JSON.stringify(observaciones));
//const observaciones = [];
const observaciones = JSON.parse(localStorage.getItem("observaciones"));

function cargar(valor1, valor2, valor3, valor4, valor5) {
    const orig = (valor5 === 3) ? "ENTE REGULADOR" : (valor5 == 2 ? "INTERNA" : "OTROS");
    /* if (valor5 === 3) {
        return observaciones.push(new observacion(valor1, valor2, valor3, valor4, "ENTE REGULADOR"));
    } else if (valor5 == 2) {
        return observaciones.push(new observacion(valor1, valor2, valor3, valor4, "INTERNA"));
    }
    else {
        return observaciones.push(new observacion(valor1, valor2, valor3, valor4, "OTROS"));
    } */
    return observaciones.push(new observacion(valor1, valor2, valor3, valor4, orig));
}

document.querySelector(".botonCargar").addEventListener("click", function () {
    let temp = 0;
    let criticidad = 0;
    let nvaObservacion = document.querySelector(".obsIngresada").value.toUpperCase();
    if (!nvaObservacion) {
        /*         document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
                document.querySelector(".modal_titulo").textContent = "ERROR";
                document.querySelector(".mensaje_modal").textContent = "No se ingresó ninguna observación";
         */
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
                                //observaciones=JSON.parse(localStorage.getItem("observaciones"));
                                if (riesgo <= 4) {
                                    cargar(observaciones.length + 1, nvaObservacion, "BAJO", tAuditoria, cumplimiento);
                                } else if (riesgo <= 11) {
                                    cargar(observaciones.length + 1, nvaObservacion, "MEDIO", tAuditoria, cumplimiento);
                                } else {
                                    cargar(observaciones.length + 1, nvaObservacion, "ALTO", tAuditoria, cumplimiento);
                                }
                                localStorage.setItem('observaciones', JSON.stringify(observaciones));
                            }
                            else {
                                /* document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
                                document.querySelector(".modal_titulo").textContent = "ERROR";
                                document.querySelector(".mensaje_modal").textContent = "Debe seleccionar un parámetro PROBABILIDAD DE OCURRENCIA correcto"; */
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Debe seleccionar un parámetro PROBABILIDAD DE OCURRENCIA correcto',
                                    icon: 'error',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: 'rgb(55, 128, 211)'
                                })
                            }
                        } else {
                            /* document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
                            document.querySelector(".modal_titulo").textContent = "ERROR";
                            document.querySelector(".mensaje_modal").textContent = "Debe seleccionar un Factor de Riesgo ANTIGÜEDAD correcto"; */
                            Swal.fire({
                                title: 'Error!',
                                text: 'Debe seleccionar un Factor de Riesgo ANTIGÜEDAD correcto',
                                icon: 'error',
                                confirmButtonText: 'OK',
                                confirmButtonColor: 'rgb(55, 128, 211)'
                            })
                        }
                    } else {
            /*             document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
                        document.querySelector(".modal_titulo").textContent = "ERROR";
                        document.querySelector(".mensaje_modal").textContent = "Debe seleccionar un Factor de Riesgo CUMPLIMIENTO correcto";
             */            Swal.fire({
                        title: 'Error!',
                        text: 'Debe seleccionar un Factor de Riesgo CUMPLIMIENTO correcto',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'rgb(55, 128, 211)'
                    })
                    }
                } else {
                    /* document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
                    document.querySelector(".modal_titulo").textContent = "ERROR";
                    document.querySelector(".mensaje_modal").textContent = "Debe seleccionar un Factor de Riesgo IMPACTO MONERARIO correcto"; */
                    Swal.fire({
                        title: 'Error!',
                        text: 'Debe seleccionar un Factor de Riesgo IMPACTO MONERARIO correcto',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'rgb(55, 128, 211)'
                    })
                }

            } else {
                /* document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
                document.querySelector(".modal_titulo").textContent = "ERROR";
                document.querySelector(".mensaje_modal").textContent = "Debe seleccionar un Factor de Riesgo INFORMACIÓN correcto"; */
                Swal.fire({
                    title: 'Error!',
                    text: 'Debe seleccionar un Factor de Riesgo INFORMACIÓN correcto',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: 'rgb(55, 128, 211)'
                })
            }

        } else {
            /* document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
            document.querySelector(".modal_titulo").textContent = "ERROR";
            document.querySelector(".mensaje_modal").textContent = "Debe seleccionar un Factor de Riesgo OPERACIONAL correcto"; */
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
);

/* document.getElementsByClassName("boton")[0].addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementsByClassName("fondo_transparente")[0].style.display = "none"
})
 */
function imprimirDetalle({ codigo, descripcion, riesgoasignado, tipo, origen }) {
    let nodo = document.createElement("div");
    tipo === "SISTEMAS" ? nodo.innerHTML = `<p>${codigo}: La observación ${descripcion}, es de Riesgo ${riesgoasignado} y es una observación de Auditoria de ${tipo}</p>` : nodo.innerHTML = `<p>${codigo}: La observación ${descripcion}, es de Riesgo ${riesgoasignado} y es una observación de Auditoria ${tipo}</p>`;
    /* if (tipo === "SISTEMAS") {
        nodo.innerHTML = `<p>${codigo}: La observación ${descripcion}, es de Riesgo ${riesgoasignado} y es una observación de Auditoria de ${tipo}</p>`
    } else {
        nodo.innerHTML = `<p>${codigo}: La observación ${descripcion}, es de Riesgo ${riesgoasignado} y es una observación de Auditoria ${tipo}</p>`
    } */
    contenedor.appendChild(nodo);
}

function agregarhtml(arreglo) {
    if (arreglo.length != 0) {
        let nodito = document.createElement("div");
        nodito.innerHTML = `<h4> Reporte de Observaciones:</h4>`;
        contenedor.appendChild(nodito);
        arreglo.forEach(i => {
            imprimirDetalle(i);
            /* let nodo = document.createElement("div");
            let { codigo, descripcion, riesgoasignado, tipo, origen} = i;
            if (tipo === "SISTEMAS") {
                nodo.innerHTML = `<p>${codigo}: La observación ${descripcion}, es de Riesgo ${riesgoasignado} y es una observación de Auditoria de ${tipo}</p>`
            } else {
                nodo.innerHTML = `<p>${codigo}: La observación ${descripcion}, es de Riesgo ${riesgoasignado} y es una observación de Auditoria ${tipo}</p>`
            } 
            contenedor.appendChild(nodo); */
        })
    } else {
        /* let nodo = document.createElement("div");
        nodo.innerHTML = `<p>No se encontraron observaciones para ese filtro aplicado</p>`
        contenedor.appendChild(nodo); */
        Swal.fire({
            title: 'Error!',
            text: 'No se encontraron observaciones para ese filtro aplicado',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: 'rgb(55, 128, 211)'
        })
    }
}

document.querySelector(".generarReporte").addEventListener("click", () => {
    let filtroListado1 = document.querySelector(".selectFRiesgo").value;
    let filtroListado2 = document.querySelector(".selectFTipo").value;
    //    let filtroListado3 = document.querySelector(".selectFTipo").value;
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
)


document.querySelector(".botonBuscar").addEventListener("click", (e) => {
    e.preventDefault();
    const observacionesStorage = JSON.parse(localStorage.getItem("observaciones"));
    let respuesta = document.querySelector(".etiquetaBuscar").value.toUpperCase();
    /*     document.getElementsByClassName("fondo_transparente")[0].style.display = "block";
        document.querySelector(".modal_titulo").textContent = "RESULTADO DE LA BUSQUEDA";
     */    /*     respuesta && observacionesStorage.some(i => i.descripcion === respuesta) ? document.querySelector(".mensaje_modal").textContent = `La observacion ${respuesta} existe en el listado de observaciones </p>` : document.querySelector(".mensaje_modal").textContent = `La observacion ${respuesta} NO existe en el listado de observaciones </p>`;
       } */
    if (respuesta) {
        if (observacionesStorage.some(i => i.descripcion === respuesta)) {
            /* document.querySelector(".mensaje_modal").textContent = `La observacion ${respuesta} existe en el listado de observaciones`; */
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
            /* document.querySelector(".mensaje_modal").textContent = `La observacion ${respuesta} NO existe en el listado de observaciones`; */
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
    nodo.innerHTML = `<p> La observacion ${buscadas.descripcion} fue la ultima buscada el dia ${buscadas.fecha}</p>`;
    contenedor.appendChild(nodo);
})


window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.getElementById("formulario").reset();
    }
})

