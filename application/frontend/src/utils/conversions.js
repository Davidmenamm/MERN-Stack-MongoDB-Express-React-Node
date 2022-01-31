/* manage any conversions */

// vaccine status
export const formatStatus = (st) => {
    let result = null;
    console.log('ST', st, typeof(st));
    switch(st){
        case "0":
            result = 'No';
            break;
        case "1":
            result = 'Activo';
            break;
        case "2":
            result = 'Completo';
            break;
    }
    console.log('STR', result, typeof(result));
    return result;
}