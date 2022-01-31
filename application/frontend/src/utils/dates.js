/* to manage dates */

// format date
export const formatDate = (dt) => {
    let initial_format = new Date(dt);
    return initial_format.getFullYear() + "-" + (initial_format.getMonth() + 1) + "-" + initial_format.getDate();
}