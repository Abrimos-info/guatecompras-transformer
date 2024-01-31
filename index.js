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
        // Dataset Desafío GT
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

        // 2022
        case 'finalizado_adjudicado':
            return contractTransform(obj, 'gt_finalizado_adjudicado_2022');
        case 'finalizado_anulado':
            return contractTransform(obj, 'gt_finalizado_anulado_2022');
        case 'finalizado_desierto':
            return contractTransform(obj, 'gt_finalizado_desierto_2022');
        case 'terminado_adjudicado':
            return contractTransform(obj, 'gt_terminado_adjudicado_2022');
        case 'publicados':
            return contractTransform(obj, 'gt_publicado_2022');

        // 2023
        case '2023_adjudicado':
            return contractTransform(obj, 'gt_adjudicado_2023');
        case '2023_anulado':
            return contractTransform(obj, 'gt_anulado_2023');
        case '2023_desierto':
            return contractTransform(obj, 'gt_desierto_2023');
        default:
            return obj;
    }
}))
.pipe(JSONStream.stringify(false))
// .pipe(process.stdout);

process.stdin.on('end', () => {
  process.stdout.write('\n');
});

// 2023
function contractTransform(obj, type) {
    let newObj = { fuente: type }

    Object.keys(obj).map( key => {
        switch(key) {
            case "no":
            case "NO":
            case "FILA":
            case "fila":                                newObj['fila'] = parseInt(obj[key]); break;

            case "TIPO_ENTIDAD_PADRE":
            case "TIPO ENTIDAD PADRE":
            case "TIPO DE ENTIDAD PADRE":
            case "tipoDeEntidadPadre":
            case "tipoEntidadPadre":                    newObj['tipo_entidad_padre'] = safeToString(obj[key]); break;

            case "TIPO_ENTIDAD":
            case "TIPO ENTIDAD":
            case "TIPO DE ENTIDAD":
            case "tipoEntidad":
            case "tipoDeEntidad":                       newObj['tipo_entidad'] = safeToString(obj[key]); break;

            case "ENTIDAD_COMPRADORA":
            case "ENTIDAD COMPRADORA":
            case "entidadCompradora":                   newObj['entidad_compradora'] = safeToString(obj[key]); break;

            case "UNIDAD_COMPRADORA":
            case "UNIDAD COMPRADORA":
            case "unidadCompradora":                    newObj['unidad_compradora'] = safeToString(obj[key]); break;

            case "NOG_CONCURSO":
            case "NOG CONCURSO":
            case "nogConcurso":                         newObj['nog_concurso'] = safeToString(obj[key]); break;

            case "DESCRIPCION":
            case "DESCRIPCIÓN":
            case "descripción":                         newObj['descripcion'] = safeToString(obj[key]); break;

            case "MODALIDAD":
            case "modalidad":                           newObj['modalidad'] = safeToString(obj[key]); break;

            case "SUB_MODALIDAD":
            case "SUB MODALIDAD":
            case "subModalidad":                        newObj['sub_modalidad'] = safeToString(obj[key]); break;

            case "NIT":
            case "nit":                                 newObj['nit'] = safeToString(obj[key]); break;

            case "NOMBRE":
            case "nombre":                              newObj['nombre'] = safeToString(obj[key]); break;

            case "MONTO":
            case "monto":                               newObj['monto'] = parseFloat(obj[key]); break;

            case "FECHA_PUBLICACION":
            case "FECHA DE PUBLICACIÓN":
            case "fechaPublicación":
            case "fechaDePublicación":                  newObj['fecha_publicacion'] = dateToISOString(obj[key]); break;

            case "MES DE PUBLICACIÓN":
            case "mesDePublicación":                    newObj['mes_publicacion'] = safeToString(obj[key]).toUpperCase(); break;

            case "AÑO DE PUBLICACIÓN":
            case "añoDePublicación":                    newObj['anio_publicacion'] = parseInt(obj[key]); break;

            case "FECHA DE ULTIMA ADJUDICACIÓN":
            case "fechaÚltimaAdjudicación":
            case "fechaDeÚltimaAdjudicación":           newObj['fecha_ultima_adjudicacion'] = dateToISOString(obj[key]); break;

            case "FECHA DE ADJUDICACIÓN":
            case "FECHA_ADJUDICACION":
            case "fechaAdjudicación":
            case "fechaDeAdjudicación":                 newObj['fecha_adjudicacion'] = dateToISOString(obj[key]); break;

            case "MES DE ADJUDICACIÓN":
            case "mesDeAdjudicación":                   newObj['mes_adjudicacion'] = safeToString(obj[key]).toUpperCase(); break;

            case "AÑO DE ADJUDICACIÓN":
            case "añoDeAdjudicación":                   newObj['anio_adjudicacion'] = parseInt(obj[key]); break;

            case "CATEGORIAS":
            case "CATEGORÍAS":
            case "categorias":
            case "categorías":                          newObj['categorias'] = extractCategories(obj[key]); break;

            case "ESTATUS":
            case "ESTATUS DEL CONCURSO":
            case "estatusConcurso":
            case "estatusDelConcurso":                  newObj['estatus_concurso'] = safeToString(obj[key]); break;

            case "FECHA CIERRE RECEPCIÓN OFERTAS":
            case "fechaCierreRecepciónOfertas":         newObj['fecha_cierre_recepcion_ofertas'] = dateToISOString(obj[key]); break;

            case "MES DE CIERRE RECEPCIÓN":
            case "mesDeCierreRecepción":                newObj['mes_cierre_recepcion'] = safeToString(obj[key]).toUpperCase(); break;

            case "AÑO DE CIERRE RECEPCIÓN":
            case "añoDeCierreRecepción":                newObj['anio_cierre_recepcion'] = parseInt(obj[key]); break;

            case "FECHA CAMBIO ESTATUS":                newObj['fecha_cambio_estatus'] = dateToISOString(obj[key]); break;
            case "TIPO_CONCURSO":                       newObj['tipo_concurso'] = safeToString(obj[key]); break;

            default:
                console.log('UNKNOWN KEY:', key, obj[key]);
                process.exit(1);
        }
    } )

    // Date difference adjudicación vs cierre recepción
    if(newObj.hasOwnProperty('fecha_cierre_recepcion_ofertas') && newObj.fecha_cierre_recepcion_ofertas != null && newObj.hasOwnProperty('fecha_ultima_adjudicacion') && newObj.fecha_ultima_adjudicacion != null) {
        let time_diff = newObj.fecha_ultima_adjudicacion.getTime() - newObj.fecha_cierre_recepcion_ofertas.getTime();
        let dias_adjudicacion = time_diff / (1000*60*60*24);
        let dias_habiles = getDiasHabilesEntreFechas(newObj.fecha_cierre_recepcion_ofertas, newObj.fecha_ultima_adjudicacion);
        Object.assign(newObj, { dias_adjudicacion: dias_adjudicacion - dias_habiles });
    }

    // Date difference publicacion vs cierre recepción
    if(newObj.hasOwnProperty('fecha_cierre_recepcion_ofertas') && newObj.fecha_cierre_recepcion_ofertas != null && newObj.hasOwnProperty('fecha_publicacion') && newObj.fecha_publicacion != null) {
        let time_diff2 = newObj.fecha_cierre_recepcion_ofertas.getTime() - newObj.fecha_publicacion.getTime();
        let dias_ofertas = time_diff2 / (1000*60*60*24);
        let dias_habiles2 = getDiasHabilesEntreFechas(newObj.fecha_publicacion, newObj.fecha_cierre_recepcion_ofertas);
        Object.assign(newObj, { dias_oferta: dias_ofertas - dias_habiles2 });
    }

    return removeNullFields(newObj);
}

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
    if(!string || string.length < 8 || string == '01/01/0001 00:00:00') return null;
    if(string.indexOf('/') >= 0) string = repairDate(string);
    if(string.match(/\d{2}-\d{2}-\d{4}/)) string = reverseDate(string);
    const [ date, time ] = string.split(' ');
    const [ year, month, day ] = date.split('-');
    if (time) {
        const [ hour, minute, second ] = time.split(':');
        if (second) {
            return new Date(Date.UTC(year, (+month -1), day, hour, minute, second));
        }
        return new Date(Date.UTC(year, (+month -1), day, hour, minute));
    }
    return new Date(Date.UTC(year, (+month -1), day));
}

function repairDate(string) {
    var [ date, time ] = string.split(' ');
    var [ month, day, year ] = date.split('/');

    if(year.length == 2) year = '20' + year;
    return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0') + ((time)? ' ' + time : '');
}

function reverseDate(string) {
    let [ day, month, year ] = string.split('-');
    return year + '-' + month + '-' + day;
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

function getDiasHabilesEntreFechas(fecha1, fecha2) {
    let diaMillis = 1 * 1000 * 60 * 60 * 24;
    let dias_habiles = 0;

    while(fecha1 < fecha2) {
        //Si es sábado o domingo o feriado
        if (fecha1.getDay() == 6 || fecha1.getDay() == 0 || esFeriado(fecha1)) {
            dias_habiles++
        }
        fecha1 = new Date(fecha1.setTime(fecha1.getTime() + diaMillis));
    }
    return dias_habiles;
}

function stringToArray(string, separator=',') {
    if( string.indexOf(separator) < 0 ) return [ string ];
    return string.split(separator);
}

function extractCategories(string) {
    if(string.length == 0) return [];
    let categoryList = [
        { lookup: "Alimentos y semillas", value: "Alimentos y semillas" },
        { lookup: "Computación y telecomunicaciones", value: "Computación y telecomunicaciones" },
        { lookup: "Construcción y materiales afines", value: "Construcción y materiales afines" },
        { lookup: "Electricidad y aire acondicionado", value: "Electricidad y aire acondicionado" },
        { lookup: "Limpieza, fumigación y artículos afines", value: "Limpieza, fumigación y artículos afines" },
        { lookup: "Muebles y mobiliario de oficina", value: "Muebles y mobiliario de oficina" },
        { lookup: "Papelería y artículos de librería", value: "Papelería y artículos de librería" },
        { lookup: "Publicidad, campañas y vallas", value: "Publicidad, campañas y vallas" },
        { lookup: "Salud e insumos hospitalarios", value: "Salud e insumos hospitalarios" },
        { lookup: "Seguridad y armament", value: "Seguridad y armamento" },
        { lookup: "Seguridad y armamento", value: "Seguridad y armamento" },
        { lookup: "Seguros, fianzas y servicios bancarios", value: "Seguros, fianzas y servicios bancarios" },
        { lookup: "Textiles, ropa y calzado", value: "Textiles, ropa y calzado" },
        { lookup: "Transporte, repuestos y combustibles", value: "Transporte, repuestos y combustibles" },
        { lookup: "Otros tipos de bienes o servicios", value: "Otros tipos de bienes o servicios" },
        { lookup: "Bienes Inmuebles", value: "Bienes Inmuebles" }
    ]

    let categories = [];
    categoryList.map(c => {
        if(string.match(c.lookup)) categories.push(c.value)
    });

    return categories;
}

const feriados = [
    { anio: 2003, mes: 0, dia: 1 },
    { anio: 2003, mes: 1, dia: 5 },
    { anio: 2003, mes: 2, dia: 21 },
    { anio: 2003, mes: 4, dia: 1 },
    { anio: 2003, mes: 8, dia: 16 },
    { anio: 2003, mes: 10, dia: 20 },
    { anio: 2003, mes: 11, dia: 25 },
    { anio: 2004, mes: 0, dia: 1 },
    { anio: 2004, mes: 1, dia: 5 },
    { anio: 2004, mes: 2, dia: 21 },
    { anio: 2004, mes: 4, dia: 1 },
    { anio: 2004, mes: 8, dia: 16 },
    { anio: 2004, mes: 10, dia: 20 },
    { anio: 2004, mes: 11, dia: 25 },
    { anio: 2005, mes: 0, dia: 1 },
    { anio: 2005, mes: 1, dia: 5 },
    { anio: 2005, mes: 2, dia: 21 },
    { anio: 2005, mes: 4, dia: 1 },
    { anio: 2005, mes: 8, dia: 16 },
    { anio: 2005, mes: 10, dia: 20 },
    { anio: 2005, mes: 11, dia: 25 },
    { anio: 2006, mes: 0, dia: 1 },
    { anio: 2006, mes: 1, dia: 5 },
    { anio: 2006, mes: 2, dia: 21 },
    { anio: 2006, mes: 4, dia: 1 },
    { anio: 2006, mes: 6, dia: 2 },
    { anio: 2006, mes: 8, dia: 16 },
    { anio: 2006, mes: 10, dia: 20 },
    { anio: 2006, mes: 11, dia: 1 },
    { anio: 2006, mes: 11, dia: 25 },
    { anio: 2007, mes: 0, dia: 1 },
    { anio: 2007, mes: 1, dia: 5 },
    { anio: 2007, mes: 2, dia: 19 },
    { anio: 2007, mes: 4, dia: 1 },
    { anio: 2007, mes: 8, dia: 16 },
    { anio: 2007, mes: 10, dia: 19 },
    { anio: 2007, mes: 10, dia: 20 },
    { anio: 2007, mes: 11, dia: 25 },
    { anio: 2008, mes: 0, dia: 1 },
    { anio: 2008, mes: 1, dia: 4 },
    { anio: 2008, mes: 2, dia: 17 },
    { anio: 2008, mes: 4, dia: 1 },
    { anio: 2008, mes: 8, dia: 16 },
    { anio: 2008, mes: 10, dia: 17 },
    { anio: 2008, mes: 10, dia: 20 },
    { anio: 2008, mes: 11, dia: 25 },
    { anio: 2009, mes: 0, dia: 1 },
    { anio: 2009, mes: 1, dia: 2 },
    { anio: 2009, mes: 2, dia: 16 },
    { anio: 2009, mes: 4, dia: 1 },
    { anio: 2009, mes: 8, dia: 16 },
    { anio: 2009, mes: 10, dia: 16 },
    { anio: 2009, mes: 10, dia: 20 },
    { anio: 2009, mes: 11, dia: 25 },
    { anio: 2010, mes: 0, dia: 1 },
    { anio: 2010, mes: 1, dia: 1 },
    { anio: 2010, mes: 2, dia: 15 },
    { anio: 2010, mes: 4, dia: 1 },
    { anio: 2010, mes: 8, dia: 16 },
    { anio: 2010, mes: 10, dia: 20 },
    { anio: 2010, mes: 10, dia: 22 },
    { anio: 2010, mes: 11, dia: 25 },
    { anio: 2011, mes: 0, dia: 1 },
    { anio: 2011, mes: 1, dia: 7 },
    { anio: 2011, mes: 2, dia: 21 },
    { anio: 2011, mes: 4, dia: 1 },
    { anio: 2011, mes: 8, dia: 16 },
    { anio: 2011, mes: 11, dia: 25 },
    { anio: 2012, mes: 0, dia: 1 },
    { anio: 2012, mes: 1, dia: 6 },
    { anio: 2012, mes: 2, dia: 19 },
    { anio: 2012, mes: 4, dia: 1 },
    { anio: 2012, mes: 6, dia: 1 },
    { anio: 2012, mes: 8, dia: 16 },
    { anio: 2012, mes: 11, dia: 1 },
    { anio: 2012, mes: 11, dia: 25 },
    { anio: 2013, mes: 0, dia: 1 },
    { anio: 2013, mes: 1, dia: 4 },
    { anio: 2013, mes: 2, dia: 18 },
    { anio: 2013, mes: 4, dia: 1 },
    { anio: 2013, mes: 8, dia: 16 },
    { anio: 2013, mes: 11, dia: 25 },
    { anio: 2014, mes: 0, dia: 1 },
    { anio: 2014, mes: 1, dia: 3 },
    { anio: 2014, mes: 2, dia: 17 },
    { anio: 2014, mes: 4, dia: 1 },
    { anio: 2014, mes: 8, dia: 16 },
    { anio: 2014, mes: 11, dia: 25 },
    { anio: 2015, mes: 0, dia: 1 },
    { anio: 2015, mes: 1, dia: 2 },
    { anio: 2015, mes: 2, dia: 16 },
    { anio: 2015, mes: 4, dia: 1 },
    { anio: 2015, mes: 8, dia: 16 },
    { anio: 2015, mes: 11, dia: 25 },
    { anio: 2016, mes: 0, dia: 1 },
    { anio: 2016, mes: 1, dia: 1 },
    { anio: 2016, mes: 2, dia: 21 },
    { anio: 2016, mes: 4, dia: 1 },
    { anio: 2016, mes: 8, dia: 16 },
    { anio: 2016, mes: 11, dia: 25 },
    { anio: 2017, mes: 0, dia: 1 },
    { anio: 2017, mes: 1, dia: 6 },
    { anio: 2017, mes: 2, dia: 20 },
    { anio: 2017, mes: 4, dia: 1 },
    { anio: 2017, mes: 8, dia: 16 },
    { anio: 2017, mes: 11, dia: 25 },
    { anio: 2018, mes: 0, dia: 1 },
    { anio: 2018, mes: 1, dia: 5 },
    { anio: 2018, mes: 2, dia: 19 },
    { anio: 2018, mes: 4, dia: 1 },
    { anio: 2018, mes: 6, dia: 1 },
    { anio: 2018, mes: 8, dia: 16 },
    { anio: 2018, mes: 11, dia: 1 },
    { anio: 2018, mes: 11, dia: 25 },
    { anio: 2019, mes: 0, dia: 1 },
    { anio: 2019, mes: 1, dia: 4 },
    { anio: 2019, mes: 2, dia: 18 },
    { anio: 2019, mes: 4, dia: 1 },
    { anio: 2019, mes: 8, dia: 16 },
    { anio: 2019, mes: 11, dia: 25 },
    { anio: 2020, mes: 0, dia: 1 },
    { anio: 2020, mes: 1, dia: 3 },
    { anio: 2020, mes: 2, dia: 16 },
    { anio: 2020, mes: 4, dia: 1 },
    { anio: 2020, mes: 8, dia: 16 },
    { anio: 2020, mes: 11, dia: 25 },
    { anio: 2021, mes: 0, dia: 1 },
    { anio: 2021, mes: 1, dia: 1 },
    { anio: 2021, mes: 2, dia: 15 },
    { anio: 2021, mes: 4, dia: 1 },
    { anio: 2021, mes: 8, dia: 16 },
    { anio: 2021, mes: 11, dia: 25 },
    { anio: 2022, mes: 0, dia: 1 },
    { anio: 2022, mes: 1, dia: 7 },
    { anio: 2022, mes: 2, dia: 21 },
    { anio: 2022, mes: 4, dia: 1 },
    { anio: 2022, mes: 8, dia: 16 },
    { anio: 2022, mes: 11, dia: 25 },
    { anio: 2023, mes: 0, dia: 1 },
    { anio: 2023, mes: 1, dia: 6 },
    { anio: 2023, mes: 2, dia: 20 },
    { anio: 2023, mes: 4, dia: 1 },
    { anio: 2023, mes: 8, dia: 16 },
    { anio: 2023, mes: 10, dia: 20 },
    { anio: 2023, mes: 11, dia: 25 }
];

function esFeriado(dia) {

    for (let f in feriados) {
        if (dia.getFullYear() == feriados[f].anio && dia.getMonth() == feriados[f].mes && dia.getDate() == feriados[f].dia) {
            return true;
        }
    }
    return false;
}
