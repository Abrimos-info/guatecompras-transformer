#!/usr/bin/env node
const JSONStream = require('JSONStream');
const es = require('event-stream');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'transform', alias: 't', type: String }
];
const args = commandLineArgs(optionDefinitions);

process.stdin.setEncoding('utf8');

process.stdin
.pipe(JSONStream.parse())
.pipe(es.mapSync(function (obj) {
    switch(args.transform) {
        case 'finalizado_adjudicado':
            return finalizadoAdjudicadoTransform(obj);
        case 'finalizado_anulado':
            return finalizadoAnuladoTransform(obj);
        case 'finalizado_desierto':
            return finalizadoDesiertoTransform(obj);
        case 'terminado_adjudicado':
            return terminadoAdjudicadoTransform(obj);
        case 'publicados':
            return publicadoTransform(obj);
        default:
            return obj;
    }
}))
.pipe(JSONStream.stringify(false))
.pipe(process.stdout);

process.stdin.on('end', () => {
  process.stdout.write('\n');
});

function finalizadoAdjudicadoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "AÑO DE ADJUDICACIÓN":                 newObj['anio_adjudicacion'] = parseInt(obj[key]); break;
            case "AÑO DE CIERRE RECEPCIÓN":             newObj['anio_cierre_recepcion'] = parseInt(obj[key]); break;
            case "AÑO DE PUBLICACIÓN":                  newObj['anio_publicacion'] = parseInt(obj[key]); break;
            case "CATEGORIAS":
            case "CATEGORÍAS":                          newObj['categorias'] = safeToString(obj[key]); break;
            case "DESCRIPCION":
            case "DESCRIPCIÓN":                         newObj['descripcion'] = safeToString(obj[key]); break;
            case "ENTIDAD_COMPRADORA":
            case "ENTIDAD COMPRADORA":                  newObj['entidad_compradora'] = safeToString(obj[key]); break;
            case "ESTATUS":                             newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "ESTATUS DEL CONCURSO":                newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "FECHA CAMBIO ESTATUS":                newObj['fecha_cambio_estatus'] = dateToISOString(obj[key]); break;
            case "FECHA CIERRE RECEPCIÓN OFERTAS":      newObj['fecha_cierre_recepcion_ofertas'] = dateToISOString(obj[key]); break;
            case "FECHA DE ADJUDICACIÓN":
            case "FECHA_ADJUDICACION":                  newObj['fecha_adjudicacion'] = dateToISOString(obj[key]); break;
            case "FECHA_PUBLICACION":
            case "FECHA DE PUBLICACIÓN":                newObj['fecha_publicacion'] = dateToISOString(obj[key]); break;
            case "FECHA DE ULTIMA ADJUDICACIÓN":        newObj['fecha_ultima_adjudicacion'] = dateToISOString(obj[key]); break;
            case "NO":
            case "FILA":                                newObj['fila'] = parseInt(obj[key]); break;
            case "MES DE ADJUDICACIÓN":                 newObj['mes_adjudicacion'] = safeToString(obj[key]); break;
            case "MES DE CIERRE RECEPCIÓN":             newObj['mes_cierre_recepcion'] = safeToString(obj[key]); break;
            case "MES DE PUBLICACIÓN":                  newObj['mes_publicacion'] = safeToString(obj[key]); break;
            case "MODALIDAD":                           newObj['modalidad'] = safeToString(obj[key]); break;
            case "MONTO":                               newObj['monto'] = parseFloat(obj[key]); break;
            case "NIT":                                 newObj['nit'] = safeToString(obj[key]); break;
            case "NOG_CONCURSO":
            case "NOG CONCURSO":                        newObj['nog_concurso'] = safeToString(obj[key]); break;
            case "NOMBRE":                              newObj['nombre'] = safeToString(obj[key]); break;
            case "SUB_MODALIDAD":
            case "SUB MODALIDAD":                       newObj['sub_modalidad'] = safeToString(obj[key]); break;
            case "TIPO_ENTIDAD":
            case "TIPO DE ENTIDAD":                     newObj['tipo_entidad'] = safeToString(obj[key]); break;
            case "TIPO_ENTIDAD_PADRE":
            case "TIPO DE ENTIDAD PADRE":               newObj['tipo_entidad_padre'] = safeToString(obj[key]); break;
            case "TIPO_CONCURSO":                       newObj['tipo_concurso'] = safeToString(obj[key]); break;
            case "UNIDAD_COMPRADORA":
            case "UNIDAD COMPRADORA":                   newObj['unidad_compradora'] = safeToString(obj[key]); break;
        }
    } )

    return removeNullFields(newObj);
}

function finalizadoAnuladoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "AÑO DE CIERRE RECEPCIÓN":             newObj['anio_cierre_recepcion'] = parseInt(obj[key]); break;
            case "AÑO DE PUBLICACIÓN":                  newObj['anio_publicacion'] = parseInt(obj[key]); break;
            case "CATEGORÍAS":                          newObj['categorias'] = safeToString(obj[key]); break;
            case "DESCRIPCIÓN":                         newObj['descripcion'] = safeToString(obj[key]); break;
            case "ENTIDAD COMPRADORA":                  newObj['entidad_compradora'] = safeToString(obj[key]); break;
            case "ESTATUS DEL CONCURSO":                newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "FECHA CAMBIO ESTATUS":                newObj['fecha_cambio_estatus'] = dateToISOString(obj[key]); break;
            case "FECHA CIERRE RECEPCIÓN OFERTAS":      newObj['fecha_cierre_recepcion_ofertas'] = dateToISOString(obj[key]); break;
            case "FECHA DE PUBLICACIÓN":                newObj['fecha_publicacion'] = dateToISOString(obj[key]); break;
            case "FECHA DE ULTIMA ADJUDICACIÓN":        newObj['fecha_ultima_adjudicacion'] = dateToISOString(obj[key]); break;
            case "MES DE CIERRE RECEPCIÓN":             newObj['mes_cierre_recepcion'] = safeToString(obj[key]); break;
            case "MES DE PUBLICACIÓN":                  newObj['mes_publicacion'] = safeToString(obj[key]); break;
            case "MODALIDAD":                           newObj['modalidad'] = safeToString(obj[key]); break;
            case "NO":                                  newObj['fila'] = parseInt(obj[key]); break;
            case "NOG CONCURSO":                        newObj['nog_concurso'] = safeToString(obj[key]); break;
            case "SUB MODALIDAD":                       newObj['sub_modalidad'] = safeToString(obj[key]); break;
            case "TIPO ENTIDAD":                        newObj['tipo_entidad'] = safeToString(obj[key]); break;
            case "TIPO ENTIDAD PADRE":                  newObj['tipo_entidad_padre'] = safeToString(obj[key]); break;
            case "UNIDAD COMPRADORA":                   newObj['unidad_compradora'] = safeToString(obj[key]); break;
        }
    } )

    return removeNullFields(newObj);
}

function finalizadoDesiertoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "AÑO DE CIERRE RECEPCIÓN":             newObj['anio_cierre_recepcion'] = parseInt(obj[key]); break;
            case "AÑO DE PUBLICACIÓN":                  newObj['anio_publicacion'] = parseInt(obj[key]); break;
            case "CATEGORÍAS":                          newObj['categorias'] = safeToString(obj[key]); break;
            case "DESCRIPCIÓN":                         newObj['descripcion'] = safeToString(obj[key]); break;
            case "ENTIDAD COMPRADORA":                  newObj['entidad_compradora'] = safeToString(obj[key]); break;
            case "ESTATUS DEL CONCURSO":                newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "FECHA CAMBIO ESTATUS":                newObj['fecha_cambio_estatus'] = dateToISOString(obj[key]); break;
            case "FECHA CIERRE RECEPCIÓN OFERTAS":      newObj['fecha_cierre_recepcion_ofertas'] = dateToISOString(obj[key]); break;
            case "FECHA DE PUBLICACIÓN":                newObj['fecha_publicacion'] = dateToISOString(obj[key]); break;
            case "FECHA DE ULTIMA ADJUDICACIÓN":        newObj['fecha_ultima_adjudicacion'] = dateToISOString(obj[key]); break;
            case "MES DE CIERRE RECEPCIÓN":             newObj['mes_cierre_recepcion'] = safeToString(obj[key]); break;
            case "MES DE PUBLICACIÓN":                  newObj['mes_publicacion'] = safeToString(obj[key]); break;
            case "MODALIDAD":                           newObj['modalidad'] = safeToString(obj[key]); break;
            case "NO":                                  newObj['fila'] = parseInt(obj[key]); break;
            case "NOG CONCURSO":                        newObj['nog_concurso'] = safeToString(obj[key]); break;
            case "SUB MODALIDAD":                       newObj['sub_modalidad'] = safeToString(obj[key]); break;
            case "TIPO ENTIDAD":                        newObj['tipo_entidad'] = safeToString(obj[key]); break;
            case "TIPO ENTIDAD PADRE":                  newObj['tipo_entidad_padre'] = safeToString(obj[key]); break;
            case "UNIDAD COMPRADORA":                   newObj['unidad_compradora'] = safeToString(obj[key]); break;
        }
    } )

    return removeNullFields(newObj);
}

function terminadoAdjudicadoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "AÑO DE ADJUDICACIÓN":                 newObj['anio_adjudicacion'] = parseInt(obj[key]); break;
            case "AÑO DE CIERRE RECEPCIÓN":             newObj['anio_cierre_recepcion'] = parseInt(obj[key]); break;
            case "AÑO DE PUBLICACIÓN":                  newObj['anio_publicacion'] = parseInt(obj[key]); break;
            case "CATEGORÍAS":                          newObj['categorias'] = safeToString(obj[key]); break;
            case "DESCRIPCIÓN":                         newObj['descripcion'] = safeToString(obj[key]); break;
            case "ENTIDAD COMPRADORA":                  newObj['entidad_compradora'] = safeToString(obj[key]); break;
            case "ESTATUS DEL CONCURSO":                newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "FECHA CIERRE RECEPCIÓN OFERTAS":      newObj['fecha_cierre_recepcion_ofertas'] = dateToISOString(obj[key]); break;
            case "FECHA DE ADJUDICACIÓN":               newObj['fecha_adjudicacion'] = dateToISOString(obj[key]); break;
            case "FECHA DE PUBLICACIÓN":                newObj['fecha_publicacion'] = dateToISOString(obj[key]); break;
            case "FECHA DE ULTIMA ADJUDICACIÓN":        newObj['fecha_ultima_adjudicacion'] = dateToISOString(obj[key]); break;
            case "MES DE ADJUDICACIÓN":                 newObj['mes_adjudicacion'] = safeToString(obj[key]); break;
            case "MES DE CIERRE RECEPCIÓN":             newObj['mes_cierre_recepcion'] = safeToString(obj[key]); break;
            case "MES DE PUBLICACIÓN":                  newObj['mes_publicacion'] = safeToString(obj[key]); break;
            case "MODALIDAD":                           newObj['modalidad'] = safeToString(obj[key]); break;
            case "MONTO":                               newObj['monto'] = parseFloat(obj[key]); break;
            case "NO":                                  newObj['fila'] = parseInt(obj[key]); break;
            case "NIT":                                 newObj['nit'] = safeToString(obj[key]); break;
            case "NOG CONCURSO":                        newObj['nog_concurso'] = safeToString(obj[key]); break;
            case "NOMBRE":                              newObj['nombre'] = safeToString(obj[key]); break;
            case "SUB MODALIDAD":                       newObj['sub_modalidad'] = safeToString(obj[key]); break;
            case "TIPO DE ENTIDAD":                     newObj['tipo_entidad'] = safeToString(obj[key]); break;
            case "TIPO DE ENTIDAD PADRE":               newObj['tipo_entidad_padre'] = safeToString(obj[key]); break;
            case "UNIDAD COMPRADORA":                   newObj['unidad_compradora'] = safeToString(obj[key]); break;
        }
    } )

    return removeNullFields(newObj);
}

function publicadoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "AÑO DE CIERRE RECEPCIÓN":             newObj['anio_cierre_recepcion'] = parseInt(obj[key]); break;
            case "AÑO DE PUBLICACIÓN":                  newObj['anio_publicacion'] = parseInt(obj[key]); break;
            case "CATEGORIAS":
            case "CATEGORÍAS":                          newObj['categorias'] = safeToString(obj[key]); break;
            case "DESCRIPCION":
            case "DESCRIPCIÓN":                         newObj['descripcion'] = safeToString(obj[key]); break;
            case "ENTIDAD_COMPRADORA":
            case "ENTIDAD COMPRADORA":                  newObj['entidad_compradora'] = safeToString(obj[key]); break;
            case "ESTATUS":                             newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "ESTATUS DEL CONCURSO":                newObj['estatus_concurso'] = safeToString(obj[key]); break;
            case "FECHA CIERRE RECEPCIÓN OFERTAS":      newObj['fecha_cierre_recepcion_ofertas'] = dateToISOString(obj[key]); break;
            case "FECHA_ADJUDICACION":                  newObj['fecha_adjudicacion'] = dateToISOString(obj[key]); break;
            case "FECHA_PUBLICACION":
            case "FECHA DE PUBLICACIÓN":                newObj['fecha_publicacion'] = dateToISOString(obj[key]); break;
            case "FECHA DE ULTIMA ADJUDICACIÓN":        newObj['fecha_ultima_adjudicacion'] = dateToISOString(obj[key]); break;
            case "NO":
            case "FILA":                                newObj['fila'] = parseInt(obj[key]); break;
            case "MES DE CIERRE RECEPCIÓN":             newObj['mes_cierre_recepcion'] = safeToString(obj[key]); break;
            case "MES DE PUBLICACIÓN":                  newObj['mes_publicacion'] = safeToString(obj[key]); break;
            case "MODALIDAD":                           newObj['modalidad'] = safeToString(obj[key]); break;
            case "NOG_CONCURSO":
            case "NOG CONCURSO":                        newObj['nog_concurso'] = safeToString(obj[key]); break;
            case "SUB_MODALIDAD":
            case "SUB MODALIDAD":                       newObj['sub_modalidad'] = safeToString(obj[key]); break;
            case "TIPO_ENTIDAD":
            case "TIPO ENTIDAD":                        newObj['tipo_entidad'] = safeToString(obj[key]); break;
            case "TIPO_ENTIDAD_PADRE":
            case "TIPO ENTIDAD PADRE":                  newObj['tipo_entidad_padre'] = safeToString(obj[key]); break;
            case "TIPO_CONCURSO":                       newObj['tipo_concurso'] = safeToString(obj[key]); break;
            case "UNIDAD_COMPRADORA":
            case "UNIDAD COMPRADORA":                   newObj['unidad_compradora'] = safeToString(obj[key]); break;
        }
    } )

    return removeNullFields(newObj);
}

function removeNullFields(object) {
    Object.keys(object).map( key => {
        if(object[key] == null) delete object[key];
    } )
    return object;
}

function safeToString(value) {
    if(!value) return '';
    return value.toString();
}

function dateToISOString(string) {
    if(!string || string.length < 10) return null;
    if(string.indexOf('/') >= 0) string = repairDate(string);
    const [ date, time ] = string.split(' ');
    const [ day, month, year ] = date.split('-');
    if (time) {
        const [ hour, minute, second ] = time.split(':');
        if (second) {
            return new Date(Date.UTC(year, (+month -1), day, hour, minute, second)).toISOString();
        }
        return new Date(Date.UTC(year, (+month -1), day, hour, minute)).toISOString();
    }
    return new Date(Date.UTC(year, (+month -1), day)).toISOString();
}

function repairDate(string) {
    var [ date, time ] = string.split(' ');
    var [ month, day, year ] = date.split('/');

    if(year.length == 2) year = '20' + year;
    return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0') + ((time)? ' ' + time : '');
}
