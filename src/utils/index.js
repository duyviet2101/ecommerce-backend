const _ = require("lodash");

const getInfoData = ({fileds = [], object = {}}) => {
    return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const getUnSelectData = (unSelect = []) => {
    return Object.fromEntries(unSelect.map(el => [el, 0]));
}

// {
//     "product_attributes": {
//         "manufacturer": null,
//         "model": "Iphone 1",
//         "color": null
//     },
//     "product_name": "Iphone 14_1",
//     "product_type": null
// }

const removeUndefined = (object) => {
    const removeUndefinedRecursive = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] == 'object' && obj[key] !== null ) {
                console.log(typeof obj[key] )
                removeUndefinedRecursive(obj[key]);
            } else if (obj[key] === undefined || obj[key] === null) {
                delete obj[key];
            }
        }
    };

    removeUndefinedRecursive(object);
    return object;
}

const updateNestedObjectParser = (object) => {
    // console.log('[1]:::',object);
    const final = {};
    Object.keys(object).forEach(key => {
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const nested = updateNestedObjectParser(object[key]);
            Object.keys(nested).forEach(nestedKey => {
                final[`${key}.${nestedKey}`] = nested[nestedKey];
            });
        } else {
            final[key] = object[key];
        }
    });
    // console.log('[2]:::',final);
    return final;
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefined,
    updateNestedObjectParser
}