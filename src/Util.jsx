class Util {
    static isWebSQL = () => {
        //return false;

        if (window.openDatabase === undefined) {
            return false;
        } else {
            return true;
        }

    }

    static getTags = (tags) => {
        if (Array.isArray(tags)) {
            return tags;
        } else {
            return tags.split(',');
        }
    }
}

export default Util;
