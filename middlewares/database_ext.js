async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

exports.toMassive = async function (results) {
    let massive = [];
    await asyncForEach(results, function (result) {
        massive.push(result.price)
    });
    return massive;
};

exports.minimum = function (massive) {
    return Math.min(...massive);
};

exports.maximum = function (massive) {
    return Math.max(...massive);
};

exports.average = function (massive) {
    if (massive.length) {
        let sum = massive.reduce(function (a, b) {
            return a + b;
        });
        return sum / massive.length;
    }
};

