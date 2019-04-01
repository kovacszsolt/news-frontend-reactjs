class Util {

    static getTags = (tags) => {
        if (Array.isArray(tags)) {
            return tags;
        } else {
            return tags.split(',');
        }
    }
}

export default Util;
