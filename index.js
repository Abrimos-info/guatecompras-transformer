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
        case 'control_financiero':
            return controlFinancieroTransform(obj);
        case 'control_presupuesto':
            return controlPresupuestoTransform(obj);
        case 'cur_de_gasto':
            return curDeGastoTransform(obj);
        case 'cur_de_gasto_detalle':
            return curDeGastoDetalleTransform(obj);
        case 'ejecucion_insumo_detalle':
            return ejecucionInsumoDetalleTransform(obj);
        case 'nog':
            return nogTransform(obj);

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

function controlFinancieroTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "UNIDAD_EJECUTORA":
            case "FUENTE":
            case "ORGANISMO":
            case "CORRELATIVO":
            case "GRUPO_GASTO":
            case "PROGRAMA":
            case "SUBGGASTO":
            case "RENGLON":
            case "TIPO_REGISTRO":
                newObj[key] = safeToString(obj[key]); break;
            case "ASIGNADO":
            case "ADICION":
            case "DISMINUCION":
            case "TRASPASO_P":
            case "TRASPASO_N":
            case "COMPROMISO_PROG":
            case "COMPROMISO_REPROG":
            case "COMPROMISO":
            case "DEVENGADO_PROG":
            case "DEVENGADO_REPROG":
            case "DEVENGADO":
            case "COMP_PROG01":
            case "COMP_PROG02":
            case "COMP_PROG03":
            case "COMP_REPROG01":
            case "COMP_REPROG02":
            case "COMP_REPROG03":
            case "COMP_EJEC01":
            case "COMP_EJEC02":
            case "COMP_EJEC03":
            case "DEV_PROG01":
            case "DEV_PROG02":
            case "DEV_PROG03":
            case "DEV_PROG04":
            case "DEV_PROG05":
            case "DEV_PROG06":
            case "DEV_PROG07":
            case "DEV_PROG08":
            case "DEV_PROG09":
            case "DEV_PROG10":
            case "DEV_PROG11":
            case "DEV_PROG12":
            case "DEV_REPROG01":
            case "DEV_REPROG02":
            case "DEV_REPROG03":
            case "DEV_REPROG04":
            case "DEV_REPROG05":
            case "DEV_REPROG06":
            case "DEV_REPROG07":
            case "DEV_REPROG08":
            case "DEV_REPROG09":
            case "DEV_REPROG10":
            case "DEV_REPROG11":
            case "DEV_REPROG12":
            case "DEV_EJEC01":
            case "DEV_EJEC02":
            case "DEV_EJEC03":
            case "DEV_EJEC04":
            case "DEV_EJEC05":
            case "DEV_EJEC06":
                newObj[key] = stringToFloat(obj[key]); break;
        }
    });

    return removeNullFields(newObj);
}

function controlPresupuestoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "UNIDAD_EJECUTORA":
            case "PROGRAMA":
            case "SUBPROGRAMA":
            case "PROYECTO":
            case "ACTIVIDAD":
            case "OBRA":
            case "GEOGRAFICO":
            case "RENGLON":
            case "GRUPO_GASTO":
            case "FUENTE":
            case "ORGANISMO":
            case "CORRELATIVO":
            case "FUNCION":
            case "ECONOMICO":
            case "TIPO_PRESUPUESTO":
                newObj[key] = safeToString(obj[key]); break;
            case "ASIGNADO":
            case "ADICION":
            case "DISMINUCION":
            case "TRASPASO_P":
            case "TRASPASO_N":
            case "VIGENTE":
            case "COMPROMISO":
            case "DEVENGADO":
            case "PAGADO":
            case "ADICION_01":
            case "ADICION_02":
            case "ADICION_03":
            case "ADICION_04":
            case "ADICION_05":
            case "ADICION_06":
            case "DISMINUCION_01":
            case "DISMINUCION_02":
            case "DISMINUCION_03":
            case "DISMINUCION_04":
            case "DISMINUCION_05":
            case "DISMINUCION_06":
            case "TRASPASO_P01":
            case "TRASPASO_P02":
            case "TRASPASO_P03":
            case "TRASPASO_P04":
            case "TRASPASO_P05":
            case "TRASPASO_P06":
            case "TRASPASO_N01":
            case "TRASPASO_N02":
            case "TRASPASO_N03":
            case "TRASPASO_N04":
            case "TRASPASO_N05":
            case "TRASPASO_N06":
            case "COMPROMISO_01":
            case "COMPROMISO_02":
            case "COMPROMISO_03":
            case "COMPROMISO_04":
            case "COMPROMISO_05":
            case "COMPROMISO_06":
            case "DEVENGADO_01":
            case "DEVENGADO_02":
            case "DEVENGADO_03":
            case "DEVENGADO_04":
            case "DEVENGADO_05":
            case "DEVENGADO_06":
            case "PAGADO_01":
            case "PAGADO_02":
            case "PAGADO_03":
            case "PAGADO_04":
            case "PAGADO_05":
            case "PAGADO_06":
            case "PAGADO_07":
                newObj[key] = stringToFloat(obj[key]); break;
        }
    });

    return removeNullFields(newObj);
}

function curDeGastoTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "UNIDAD_EJECUTORA":
            case "NO_CUR":
            case "NO_ORIGINAL":
            case "NO_EXPEDIENTE":
            case "NOG":
            case "CLASE_REGISTRO":
            case "TIPO_DOCUMENTO":
            case "NO_SECUENCIA":
            case "NO_DOCUMENTO":
            case "NIT":
            case "DESCRIPCION":
                newObj[key] = safeToString(obj[key]); break;
            case "MONTO_GASTO":
            case "MONTO_DEDUCCION":
            case "MONTO_LIQUIDO":
            case "MONTO_SALDO":
                newObj[key] = stringToFloat(obj[key]); break;
            case "SOLICITUD_PAGO":
            case "PAGADO_TOTAL":
                newObj[key] = safeToString(obj[key]); break;
            case "FEC_IMPUTACION":
            case "FEC_SOLICITADO":
            case "FEC_APROBADO":
            case "FEC_SOLICITUD_PAGO":
            case "FEC_PAGADO_TOTAL":
                newObj[key] = dateToISOString(repairDateMonthFirst(obj[key])); break;
            case "NO_COMPROB_CONTAB":
            case "REPOSICION":
                newObj[key] = safeToString(obj[key]); break;
            case "FEC_REPOSICION":
                newObj[key] = dateToISOString(obj[key]); break;
            case "NO_REPOSICION":
            case "FUENTE":
            case "ORGANISMO":
            case "CORRELATIVO":
            case "USUARIO_SOLICITUD_PAGO":
            case "USUARIO_APROBO":
            case "USUARIO_REGISTRO":
            case "USUARIO_SOLICITO":
            case "DOCUMENTO_GESTION":
            case "NIT_UNIDAD_COMPRADORA":
            case "UNIDAD_COMPRADORA":
                newObj[key] = safeToString(obj[key]); break;
            case "MONTO_IVA_RETENIDO":
                newObj[key] = stringToFloat(obj[key]); break;
        }
    });

    return removeNullFields(newObj);
}

function curDeGastoDetalleTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "UNIDAD_EJECUTORA":
            case "PROGRAMA":
            case "SUBPROGRAMA":
            case "PROYECTO":
            case "ACTIVIDAD":
            case "OBRA":
            case "RENGLON":
            case "GEOGRAFICO":
            case "FUENTE":
            case "ORGANISMO":
            case "CORRELATIVO":
            case "NO_CUR":
            case "NO_ORIGINAL":
                newObj[key] = safeToString(obj[key]); break;
            case "MONTO_RENGLON":
            case "MONTO_SALDO":
                newObj[key] = stringToFloat(obj[key]); break;
            case "MES_GASTO":
            case "ECONOMICO":
                newObj[key] = safeToString(obj[key]); break;
        }
    });

    return removeNullFields(newObj);
}

function ejecucionInsumoDetalleTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "MES_REGISTRADO":
            case "NOG":
            case "NPG":
            case "UNIDAD_EJECUTORA":
            case "UNIDAD_EJECUTORA_NOMBRE":
            case "UNIDAD_COMPRADORA":
            case "UNIDAD_COMPRADORA_NOMBRE":
            case "TIPO_EJECUCION":
            case "ID_EXPEDIENTE":
            case "METODO_COMPRA":
            case "METODO_COMPRA_NOMBRE":
                newObj[key] = safeToString(obj[key]); break;
            case "FECHA_APROBADO":
                newObj[key] = dateToISOString(repairDateMonthFirst(obj[key])); break;
            case "NIT":
            case "NOMBRE_PROVEEDOR":
            case "DESCRIPCION":
            case "PROGRAMA":
            case "SUBPROGRAMA":
            case "RENGLON":
            case "RENGLON_NOMBRE":
            case "COMBINACION":
            case "COMBINACION_NOMBRE":
            case "CARACTERISTICAS":
            case "NOMBRE_PRESENTACION":
                newObj[key] = safeToString(obj[key]); break;
            case "PRECIO":
            case "CANTIDAD_LIQUIDADA":
            case "MONTO_DEVENGADO":
                newObj[key] = stringToFloat(obj[key]); break;
            case "PAGADO":
                newObj[key] = safeToString(obj[key]); break;
        }
    });

    return removeNullFields(newObj);
}

function nogTransform(obj) {
    let newObj = {};

    // dateToISOString(obj[key])
    // safeToString(obj[key])
    // stringToFloat(obj[key])
    Object.keys(obj).map( key => {
        switch(key) {
            case "NOG_CONCURSO":
            case "ENTIDAD_COMPRADORA":
            case "UNIDAD_COMPRADORA":
            case "DESCRIPCION":
            case "MODALIDAD":
            case "ESTATUS_CONCURSO":
                newObj[key] = safeToString(obj[key]); break;
            case "FECHA_CREACION":
            case "FECHA_PUBLICACION":
            case "FECHA_APERTURA_OFERTA":
            case "FECHA_ULTIMA_ADJUDICACION":
                newObj[key] = dateToISOString(repairDateDayFirst(obj[key])); break;
            case "MONTO_ADJUDICADO":
                newObj[key] = stringToFloat(obj[key]); break;
            case "ENTIDAD":
                newObj[key] = safeToString(obj[key]); break;
        }
    });

    return removeNullFields(newObj);
}

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

function stringToFloat(string) {
    return parseFloat( string.replace(/,/g, '') );
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

function repairDateMonthFirst(string) {
    if(!string || string.length < 10) return null;
    var [ date, time ] = string.split(' ');
    var [ month, day, year ] = date.split('/');

    if(year.length == 2) year = '20' + year;
    return day.padStart(2, '0') + '-' + month.padStart(2, '0') + '-' + year + ((time)? ' ' + time : '');
}

function repairDateDayFirst(string) {
    if(!string || string.length < 10) return null;
    var [ date, time ] = string.split(' ');
    var [ day, month, year ] = date.split('/');

    if(year.length == 2) year = '20' + year;
    return day.padStart(2, '0') + '-' + month.padStart(2, '0') + '-' + year + ((time)? ' ' + time : '');
}
