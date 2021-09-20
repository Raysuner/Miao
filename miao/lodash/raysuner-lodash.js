var raysuner = {
    getType: function (obj) {
        if (typeof obj  === "object") {
            return Object.prototype.toString
                .call(obj)
                .match(/\b[A-Z][a-z]+\b/)[0]
                .toLowerCase()
        }
        return typeof obj
    },

    keys: function (object) {
        let result = []
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                result.push(key)
            }
        }
        return result
    },

    isNumber: function (value) {
        return raysuner.getType(value) === "number"
    },

    isBoolean: function (value) {
        return raysuner.getType(value) === "boolean"
    },

    isString: function (value) {
        return raysuner.getType(value) === "string"
    },

    isNil: function (value) {
        return null == value
    },

    isNull: function (value) {
        return null === value
    },

    isNaN: function (value) {
        if (typeof value === "object" && !raysuner.isNull(value)) {
            value = value.valueOf()
        }
        return value !== value
    },

    isFunction: function (value) {
        return typeof value === "function"
    },

    isDate: function (value) {
        return raysuner.getType(value) === "date"
    },

    isError: function (value) {
        return value instanceof Error
    },

    isSet: function (value) {
        return value instanceof Set
    },

    isWeakSet: function (value) {
        return value instanceof WeakMap
    },

    isMap: function (value) {
        return value instanceof Map
    },

    isWeakMap: function (value) {
        return value instanceof WeakMap
    },

    isInfinity: function (value) {
        return value === Infinity || value === -Infinity
    },

    isFinite: function (value) {
        return raysuner.isNumber(value) && !raysuner.isInfinity(value)
    },

    isInteger: function (value) {
        return raysuner.isFinite(value) && Math.floor(value) === value
    },

    isLength: function (value) {
        return raysuner.isInteger(value) && -1 < value
    },

    isArray: function (value) {
        return value instanceof Array
    },

    isArrayBuffer: function (value) {
        return value instanceof ArrayBuffer
    },

    isArrayLike: function (value) {
        return !raysuner.isNull(value) && raysuner.isLength(value.length)
    },

    isObjectLike: function (value) {
        return !raysuner.isNull(value) && typeof value === "object"
    },

    isArrayLikeObject: function (value) {
        return raysuner.isArrayLike(value) && raysuner.isObjectLike(value)
    },

    isObject: function (value) {
        let type = typeof value
        return (
            !raysuner.isNull(value) &&
            (type === "object" || type === "function")
        )
    },

    isPlainObject: function (value) {
        return raysuner.getType(value) === "object"
    },

    isArguments: function (value) {
        return raysuner.isArrayLike(value) && value.hasOwnProperty("callee")
    },

    isEmpty: function (value) {
        if (
            (raysuner.isArrayLike(value) && raysuner.isArray(value)) ||
            raysuner.isString(value)
        ) {
            return !value.length
        } else if (raysuner.isObjectLike(value)) {
            return !raysuner.keys(value).length
        } else if (
            raysuner.isSet(value) ||
            raysuner.isWeakSet(value) ||
            raysuner.isMap(value) ||
            raysuner.isWeakSet(value)
        ) {
            return !value.size
        }
        return true
    },

    isElement: function (value) {},

    isEqualForBase: function (a, b) {
        return a === b || (raysuner.isNaN(a) && raysuner.isNaN(b))
    },

    isEqualForArray: function (array1, array2) {
        if (array1.length !== array2.length) {
            return false
        }

        for (let i = 0; i < array1.length; i++) {
            if (!raysuner.isEqual(array1[i], array2[i])) {
                return false
            }
        }
        return true
    },

    isEqualForObject: function (obj1, obj2) {
        if (raysuner.keys(obj1).length !== raysuner.keys(obj2).length) {
            return false
        }
        for (let key in obj1) {
            if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
                if (!raysuner.isEqual(obj1[key], obj2[key])) {
                    return false
                }
            }
        }
        return true
    },

    isEqual: function (obj1, obj2) {
        if (raysuner.getType(obj1) !== raysuner.getType(obj2)) {
            return false
        } else if (Array.isArray(obj1)) {
            return raysuner.isEqualForArray(obj1, obj2)
        } else if (raysuner.isPlainObject(obj1)) {
            return raysuner.isEqualForObject(obj1, obj2)
        }
        return raysuner.isEqualForBase(obj1, obj2)
    },

    isEqualWith: function (obj1, obj2, callback) {
        return callback()
    },

    isDigit: function (str) {
        return /\d+/.test(str)
    },

    isAlpha: function (str) {
        return /[a-zA-Z]+/.test(str)
    },

    isSplit: function (arg) {
        return (
            raysuner.includes(arg, ".") ||
            raysuner.includes(arg, "[") ||
            raysuner.includes(arg, "]")
        )
    },

    includes: function (collection, value, fromIndex = 0) {
        if (Array.isArray(collection)) {
            return raysuner.indexOf(collection, value, fromIndex) > -1
                ? true
                : false
        } else if (raysuner.isPlainObject(collection)) {
            for (let key in collection) {
                if (collection.hasOwnProperty(key)) {
                    if (raysuner.isEqual(collection[key], value)) {
                        return true
                    }
                }
            }
            return false
        } else if (typeof collection === "string") {
            return collection.includes(value)
        }
    },

    matchesProperty: function (key, value) {
        if (typeof key !== "string") {
            key = "" + key
        }
        if (typeof value !== "object") {
            return function (object) {
                if (object == null) {
                    return false
                }
                if (!raysuner.isPlainObject(object)) {
                    throw new Error(
                        "if your callback is type of string, please provide array or object with value of object"
                    )
                }
                return (
                    object[key] === value &&
                    (value !== undefined || key in object)
                )
            }
        } else {
            return function (object) {
                return raysuner.isEqual(object, value)
            }
        }
    },

    matchesProperties: function (srcObj) {
        return function (disObj) {
            if (!raysuner.isPlainObject(disObj)) {
                throw new Error("this param need to be a object")
            }
            for (let key in srcObj) {
                if (srcObj.hasOwnProperty(key) && disObj.hasOwnProperty(key)) {
                    if (!raysuner.isEqual(srcObj[key], disObj[key])) {
                        return false
                    }
                }
            }
            return true
        }
    },

    toPath: function (arg) {
        return raysuner.filter(arg.split(/\[|\]|\]\.|\./g), (it) => it)
    },

    get: function (object, path) {
        let obj = Object.create(object)
        if (Array.isArray(path)) {
            for (let item of path) {
                obj = obj[item]
            }
        }
        return obj
    },

    getCallbackFn: function (callback) {
        if (typeof callback === "function") {
            return callback
        } else if (Array.isArray(callback)) {
            return raysuner.matchesProperty(callback[0], callback[1])
        } else if (raysuner.isPlainObject(callback)) {
            return raysuner.matchesProperties(callback)
        } else {
            return function (object) {
                if (raysuner.isSplit(callback)) {
                    return raysuner.get(object, raysuner.toPath(callback))
                }
                return object[callback + ""]
            }
        }
    },

    subString: function (str, start, end = str.length) {
        let s = ""
        for (let i = start; i < end; i++) {
            s += str[i]
        }
        return s
    },

    split: function (str, separator, len = Infinity) {
        const result = []
        for (let i = 0, j = 0; j <= str.length && array.length < len; ) {
            if (str[j] === separator || j === str.length) {
                array.push(raysuner.subString(str, i, j))
                i = ++j
            }
            ++j
        }
        return result
    },

    forEach: function (collection, callback) {
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (Array.isArray(collection)) {
                    key = Number(key)
                }
                if (!callback(collection[key], key, collection)) {
                    break
                }
            }
        }
        return collection
    },

    map: function (collection, callback) {
        callback = raysuner.getCallbackFn(callback)
        let result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (Array.isArray(collection)) {
                    key = Number(key)
                }
                result.push(callback(collection[key], key, collection))
            }
        }
        return result
    },

    filter: function (collection, callback) {
        callback = raysuner.getCallbackFn(callback)
        const result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (Array.isArray(collection)) {
                    key = Number(key)
                }
                if (callback(collection[key], key, collection)) {
                    result.push(collection[key])
                }
            }
        }
        return result
    },

    reduce: function (collection, callback, initial = null) {
        callback = raysuner.getCallbackFn(callback)
        let start = initial ? 0 : 1
        let result
        if (Array.isArray(collection)) {
            result = initial ? initial : collection[0]
            for (let i = start; i < collection.length; i++) {
                result = callback(result, collection[i], i, collection)
            }
        } else if (raysuner.isPlainObject(collection)) {
            let keys = raysuner.keys(collection)
            result = initial ? initial : collection[keys[0]]
            for (let i = start; i < keys.length; i++) {
                result = callback(
                    result,
                    collection[keys[i]],
                    keys[i],
                    collection
                )
            }
        }
        return result
    },

    every: function (collection, callback) {
        callback = raysuner.getCallbackFn(callback)
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (Array.isArray(collection)) {
                    key = Number(key)
                }
                if (!callback(collection[key], key, collection)) {
                    return false
                }
            }
        }
        return true
    },

    some: function (collection, callback) {
        callback = raysuner.getCallbackFn(callback)
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (Array.isArray(collection)) {
                    key = Number(key)
                }
                if (callback(collection[key], key, collection)) {
                    return true
                }
            }
        }
        return false
    },

    /* @function 数组方法 */

    chunk: function (array, size = 1) {
        if (!Array.isArray(array)) {
            return []
        }
        const result = []
        let len = size
        for (let i = 0; i < array.length; ) {
            let temp = []
            while (i < array.length && len--) {
                temp.push(array[i++])
            }
            result.push(temp)
            len = size
        }
        return result
    },

    compact: function (array) {
        if (!Array.isArray(array)) {
            return []
        }
        const result = []
        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                result.push(array[i])
            }
        }
        return result
    },

    concat: function (array, ...args) {
        const result = []
        if (!Array.isArray(array)) {
            result.push(array)
        } else {
            for (let item of array) {
                result.push(item)
            }
        }
        for (let item of args) {
            if (Array.isArray(item)) {
                for (let it of item) {
                    result.push(it)
                }
            } else {
                result.push(item)
            }
        }
        return result
    },

    difference: function (array, ...values) {
        if (!Array.isArray(array)) {
            return []
        }

        return raysuner.filter(array, function (item) {
            // return !raysuner
            //     .reduce(
            //         values,
            //         function (accmulator, item) {
            //             return raysuner.concat(accmulator, item)
            //         },
            //         []
            //     )
            //     .includes(item)
            return !raysuner.includes(
                raysuner.reduce(
                    values,
                    function (accmulator, item) {
                        return raysuner.concat(accmulator, item)
                    },
                    []
                ),
                item
            )
        })
    },

    differenceBy: function (array, ...args) {
        let callback = null
        let filters = []
        if (!Array.isArray(array)) {
            return []
        }

        for (let i = 0; i < args.length - 1; i++) {
            filters = raysuner.concat(filters, args[i])
        }

        if (Array.isArray(args[args.length - 1])) {
            filters = raysuner.concat(filters, args[args.length - 1])
        } else {
            callback = raysuner.getCallbackFn(args.pop())
        }

        if (callback) {
            filters = raysuner.map(filters, callback)
        }

        return raysuner.filter(array, function (item) {
            return callback
                ? !raysuner.includes(filters, callback(item))
                : !raysuner.includes(filters, item)
        })
    },

    differenceWith: function (array, ...args) {
        let callback = args.pop()
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }

        if (!Array.isArray(array)) {
            return []
        }

        let filters = raysuner.reduce(
            args,
            function (accmulator, item) {
                return raysuner.concat(accmulator, item)
            },
            []
        )

        return raysuner.filter(array, function (item) {
            for (let it of filters) {
                return !callback(it, item)
            }
        })
    },

    drop: function (array, size = 1) {
        if (size >= array.length) {
            return []
        }
        if (size === 0) {
            return array
        }
        const result = []
        for (let i = size; i < array.length; i++) {
            result.push(array[i])
        }
        return result
    },

    dropWhile: function (array, callback) {
        callback = raysuner.getCallbackFn(callback)
        const result = []
        let i
        for (i = 0; i < array.length; i++) {
            if (!callback(array[i], i, array)) {
                break
            }
        }
        for (let j = i; j < array.length; j++) {
            result.push(array[j])
        }
        return result
    },

    dropRight: function (array, size = 1) {
        if (size === 0) {
            return array
        }
        if (size >= array.length) {
            return []
        }
        const result = []
        for (let i = 0; i < array.length - size; i++) {
            result.push(array[i])
        }
        return result
    },

    dropRightWhile: function (array, callback) {
        callback = raysuner.getCallbackFn(callback)
        let i
        for (i = array.length - 1; i >= 0; i--) {
            if (!callback(array[i])) {
                break
            }
        }

        const result = []
        for (let j = 0; j <= i; j++) {
            result.push(array[j])
        }
        return result
    },

    fill: function (array, val, start = 0, end = array.length) {
        for (let i = start; i < end; i++) {
            array[i] = val
        }
        return array
    },

    findIndex: function (array, callback, fromIndex = 0) {
        callback = raysuner.getCallbackFn(callback)
        for (let i = fromIndex; i < array.length; i++) {
            if (callback(array[i])) {
                return i
            }
        }
        return -1
    },

    findLastIndex: function (array, callback, fromIndex = array.length - 1) {
        callback = raysuner.getCallbackFn(callback)
        for (let i = fromIndex; i >= 0; i--) {
            if (callback(array[i])) {
                return i
            }
        }
        return -1
    },

    head: function (array) {
        return array[0]
    },

    flatten: function (array) {
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                return raysuner.concat(accmulator, item)
            },
            []
        )
    },

    flattenDeep: function (array) {
        function deep(array) {
            for (let item of array) {
                if (Array.isArray(item)) {
                    deep(item)
                } else {
                    result.push(item)
                }
            }
        }
        const result = []
        deep(array)
        return result
    },

    flattenDepth: function (array, depth = 1) {
        function deep(array, depth) {
            for (let item of array) {
                if (Array.isArray(item) && depth) {
                    deep(item, depth - 1)
                } else {
                    result.push(item)
                }
            }
        }
        const result = []
        deep(array, depth)
        return result
    },

    fromPairs: function (array) {
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                accmulator[item[0]] = item[1]
                return accmulator
            },
            {}
        )
    },

    indexOf: function (array, val, fromIndex = 0) {
        for (let i = fromIndex; i < array.length; i++) {
            if (raysuner.isEqual(array[i], val)) {
                return i
            }
        }
        return -1
    },

    initial: function (array) {
        const result = []
        for (let i = 0; i < array.length - 1; i++) {
            result.push(array[i])
        }
        return result
    },

    intersection: function (...arrays) {
        const result = []
        let first = arrays[0]
        for (let item of first) {
            let flag = true
            for (let i = 1; i < arrays.length; i++) {
                if (!raysuner.includes(arrays[i], item)) {
                    flag = false
                    break
                }
            }
            if (flag) {
                result.push(item)
            }
        }
        return result
    },

    intersectionBy: function (...args) {
        let callback = raysuner.getCallbackFn(args.pop())
        let first = args.shift()
        let firstByMap = raysuner.map(first, callback)
        return raysuner.reduce(
            firstByMap,
            function (accmulator, it, i) {
                let flag = raysuner.every(args, function (item) {
                    let filter = raysuner.map(item, callback)
                    return raysuner.includes(filter, it)
                })
                if (flag) {
                    accmulator.push(first[i])
                }
                return accmulator
            },
            []
        )
    },

    intersectionWith: function (...args) {
        let callback = args.pop()
        if (typeof callback !== "function") {
            throw new Error("comparator need to be function")
        }

        let first = args.pop()
        let second = raysuner.reduce(
            args,
            function (accmulator, item) {
                return raysuner.concat(accmulator, item)
            },
            []
        )

        return raysuner.filter(first, function (item) {
            for (let it of second) {
                if (raysuner.isPlainObject(it))
                    if (raysuner.isEqual(it, item)) {
                        return true
                    }
            }
        })
    },

    join: function (array, separator) {
        let str = "" + array[0]
        for (let i = 1; i < array.length; i++) {
            str += String(separator) + array[i]
        }
        return str
    },

    last: function (array) {
        return array[array.length - 1]
    },

    lastIndexOf: function (array, value, fromIndex = array.length - 1) {
        for (let i = fromIndex; i >= 0; i--) {
            if (value === array[i]) {
                return i
            }
        }
        return -1
    },

    nth: function (array, n = 0) {
        n = n < 0 ? n + array.length : n
        return array[n]
    },

    pull: function (array, ...filter) {
        for (let i = 0; i < array.length; i++) {
            if (raysuner.includes(filter, array[i])) {
                array.splice(i--, 1)
            }
        }
        return array
    },

    pullAll: function (array, filter) {
        return raysuner.pull(array, ...filter)
    },

    pullAllBy: function (array, values, callback) {
        callback = raysuner.getCallbackFn(callback)
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (callback(array[i]) === callback(values[j])) {
                    array.splice(i--, 1)
                    break
                }
            }
        }
        return array
    },

    pullAllWith: function (array, values, callback) {
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (callback(array[i], values[j])) {
                    array.splice(i--, 1)
                    break
                }
            }
        }
        return array
    },

    pullAt: function (array, ...indexs) {
        let values = raysuner.reduce(
            indexs,
            function (accmulator, item) {
                return raysuner.concat(accmulator, item)
            },
            []
        )

        const result = []
        for (let i = 0; i < values; i++) {
            if (typeof values[i] !== "number") {
                throw new Error("need to be member")
            }
            result.push(array[values[i]])
            array.splice(values[i], 1)
        }
        return result
    },

    remove: function (array, callback) {
        j
        callback = raysuner.getCallbackFn(callback)
        const result = []
        for (let i = 0; i < array.length; i++) {
            if (callback(array[i])) {
                result.push(array[i])
                array.splice(i--, 1)
            }
        }
        return result
    },

    reverse: function (array) {
        for (let i = 0, j = array.length - 1; i < j; i++, j--) {
            let temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    },

    slice: function (array, start = 0, end = array.length) {
        const result = []
        for (let i = start; i < end; i++) {
            result.push(array[i])
        }
        return result
    },

    sortedIndex: function (array, value) {
        let left = 0,
            right = array.length
        while (left < right) {
            let mid = left + ((right - left) >> 1)
            if (value <= array[mid]) {
                right = mid
            } else {
                left = mid + 1
            }
        }
        return right
    },

    sortedIndexBy: function (array, value, callback) {
        callback = raysuner.getCallbackFn(callback)
        let left = 0,
            right = array.length
        while (left < right) {
            let mid = left + ((right - left) >> 1)
            if (callback(value) <= callback(array[mid])) {
                right = mid
            } else {
                left = mid + 1
            }
        }
        return right
    },

    sortedIndexOf: function (array, value) {
        let left = 0,
            right = array.length
        while (left < right - 1) {
            let mid = left + ((right - left) >> 1)
            value <= array[mid] ? (right = mid) : (left = mid)
        }
        return array[right] === value ? right : -1
    },

    sortedLastIndex: function (array, value) {
        let left = 0,
            right = array.length
        while (left < right) {
            let mid = left + ((right - left) >> 1)
            if (value < array[mid]) {
                right = mid
            } else {
                left = mid + 1
            }
        }
        return left
    },

    sortedLastIndexBy: function (array, value, callback) {
        callback = raysuner.getCallbackFn(callback)
        let left = 0,
            right = array.length
        while (left < right) {
            let mid = left + ((right - left) >> 1)
            if (callback(value) < callback(array[mid])) {
                right = mid
            } else {
                left = mid + 1
            }
        }
        return left
    },

    sortedLastIndexOf: function (array, value) {
        let left = 0,
            right = array.length
        while (left < right - 1) {
            let mid = left + ((right - left) >> 1)
            value < array[mid] ? (right = mid) : (left = mid)
        }
        return array[left] === value ? left : -1
    },

    sortedUniq: function (array) {
        let i = 0,
            j = 0
        while (++j < array.length) {
            if (!raysuner.isEqual(array[i], array[j])) {
                array[++i] = array[j]
            }
        }

        let result = []
        for (let j = 0; j <= i; j++) {
            result.push(array[j])
        }
        return result
    },

    sortedUniqBy: function (array, callback) {
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }
        let i = 0,
            j = 0
        while (++j < array.length) {
            if (!raysuner.isEqual(callback(array[i]), callback(array[j]))) {
                array[++i] = array[j]
            }
        }

        const result = []
        for (let j = 0; j <= i; j++) {
            result.push(array[j])
        }
        return result
    },

    tail: function (array) {
        const result = new Array(array.length - 1)
        for (let i = 1; i < array.length; i++) {
            result[i - 1] = array[i]
        }
        return result
    },

    take: function (array, n = 1) {
        n = n > array.length ? array.length : n
        const result = new Array(n)
        for (let i = 0; i < n && i < array.length; i++) {
            result[i] = array[i]
        }
        return result
    },

    takeRight: function (array, n = 1) {
        let length = array.length
        n = n > length ? length : n
        const result = new Array(n)
        for (let i = length - n; i < length; i++) {
            result[i - length + n] = array[i]
        }
        return result
    },

    takeWhile: function (array, callback) {
        callback = raysuner.getCallbackFn(callback)
        const result = []
        for (let i = 0; i < array.length; i++) {
            if (callback(array[i])) {
                result.push(array[i])
            } else {
                break
            }
        }
        return result
    },

    takeRightWhile: function (array, callback) {
        callback = raysuner.getCallbackFn(callback)
        const result = []
        let i
        for (i = array.length - 1; i >= 0; i--) {
            if (!callback(array[i])) {
                break
            }
        }
        for (let j = i + 1; j < array.length; j++) {
            result.push(array[j])
        }
        return result
    },

    union: function (...arrays) {
        return raysuner.reduce(
            arrays,
            function (accmulator, item) {
                if (Array.isArray(item)) {
                    for (let it of item) {
                        if (!raysuner.includes(accmulator, it)) {
                            accmulator.push(it)
                        }
                    }
                }
                return accmulator
            },
            []
        )
    },

    unionBy: function (...args) {
        const callback = args.pop()
        const argByMap = []
        return raysuner.reduce(
            args,
            function (accmulator, item) {
                let filter = raysuner.map(item, callback)
                for (let i = 0; i < filter.length; i++) {
                    if (!raysuner.includes(argByMap, filter[i])) {
                        argByMap.push(filter[i])
                        accmulator.push(item[i])
                    }
                }
                return accmulator
            },
            []
        )
    },

    unionWith: function (...args) {
        let callback = args.pop()
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }

        let filters = raysuner.reduce(
            args,
            function (accmulator, item) {
                if (Array.isArray(item)) {
                    accmulator = raysuner.concat(accmulator, item)
                }
                return accmulator
            },
            []
        )
        return raysuner.reduce(
            filters,
            function (accmulator, item) {
                let flag = raysuner.some(accmulator, function (it) {
                    return callback(it, item)
                })
                if (!flag) {
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    uniq: function (array) {
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                if (!raysuner.includes(accmulator, item)) {
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    uniqBy: function (array, callback) {
        callback = raysuner.getCallbackFn(callback)
        const filters = []
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                let temp = callback(item)
                if (!raysuner.includes(filters, temp)) {
                    filters.push(temp)
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    uniqWith: function (array, callback) {
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                let flag = raysuner.some(accmulator, function (it) {
                    return callback(it, item)
                })
                if (!flag) {
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    zip: function (...args) {
        return raysuner.reduce(
            args[0],
            function (accmulator, _, i) {
                let subaccmu = raysuner.reduce(
                    args,
                    function (accmu, it) {
                        accmu.push(it[i])
                        return accmu
                    },
                    []
                )
                accmulator.push(subaccmu)
                return accmulator
            },
            []
        )
    },

    zipObject: function (keys, values) {
        return raysuner.reduce(
            keys,
            function (accmulator, _, i) {
                accmulator[keys[i]] = values[i]
                return accmulator
            },
            {}
        )
    },

    // zipObjectDeep: function (keys, values) {
    //     function deep(path, i) {
    //         if (i === path.length - 1) {
    //             if (raysuner.isDigit(path[i])) {
    //                 return values[path[i]]
    //             } else {
    //                 let index = i
    //                 while (!raysuner.isDigit(path[index])) {
    //                     --index
    //                 }
    //                 let key = path[i] + ""
    //                 let obj = {}
    //                 obj[key] = values[path[index]]
    //                 return obj
    //             }
    //         }
    //         if (raysuner.isDigit(path[i])) {
    //             return (result[path[i]] = [deep(path, i + 1)])
    //         } else {
    //             return (result[path[i]] = deep(path, i + 1))
    //         }
    //     }

    //     const result = {}
    //     const paths = raysuner.map(keys, raysuner.toPath)
    //     for (let path of paths) {
    //         deep(path, 0)
    //     }
    //     return result
    // function deep(path, i) {
    //     if (i === path.length - 1) {
    //         if (raysuner.isDigit(path[i])) {
    //             return values[path[i]]
    //         } else {
    //             let index = i
    //             while (!raysuner.isDigit(path[index])) {
    //                 --index
    //             }
    //             let key = path[i] + ""
    //             let obj = {}
    //             obj[key] = values[path[index]]
    //             return obj
    //         }
    //     }
    //     if (raysuner.isDigit(path[i])) {
    //         return [deep(path, i + 1)]
    //     } else {
    //         let key = path[i] + ""
    //         let obj = {}
    //         obj[key] = deep(path, i + 1)
    //         return obj
    //     }
    // }
    // },

    zipWith: function (...args) {
        let callback = args.pop()
        return raysuner.reduce(
            args[0],
            function (accmulator, _, i) {
                let subArr = raysuner.reduce(
                    args,
                    function (accmu, it) {
                        accmu.push(it[i])
                        return accmu
                    },
                    []
                )
                accmulator.push(callback(...subArr))
                return accmulator
            },
            []
        )
    },

    unzip: function (array) {
        return raysuner.reduce(
            array[0],
            function (accmulator, _, i) {
                let subaccmu = raysuner.reduce(
                    array,
                    function (accmu, it) {
                        accmu.push(it[i])
                        return accmu
                    },
                    []
                )
                accmulator.push(subaccmu)
                return accmulator
            },
            []
        )
    },

    unzipWith: function (array, callback) {
        return raysuner.reduce(
            array[0],
            function (accmulator, _, i) {
                let subaccmu = raysuner.reduce(
                    array,
                    function (accmu, it) {
                        accmu.push(it[i])
                        return accmu
                    },
                    []
                )
                accmulator.push(callback(...subaccmu))
                return accmulator
            },
            []
        )
    },

    without: function (array, ...args) {
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                if (!raysuner.includes(args, item)) {
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    xor: function (...arrays) {
        const array = raysuner.concat([], ...arrays)
        let map = raysuner.reduce(
            array,
            function (accmulator, item) {
                if (accmulator.has(item)) {
                    accmulator.set(item, accmulator.get(item) + 1)
                } else {
                    accmulator.set(item, 1)
                }
                return accmulator
            },
            new Map()
        )
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                if (map.has(item) && map.get(item) === 1) {
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    xorBy: function (...arrays) {
        let callback = raysuner.getCallbackFn(arrays.pop())
        let array = raysuner.concat([], ...arrays)
        let map = raysuner.reduce(
            array,
            function (accmulator, item) {
                let it = callback(item)
                if (accmulator.has(it)) {
                    accmulator.set(it, accmulator.get(it) + 1)
                } else {
                    accmulator.set(it, 1)
                }
                return accmulator
            },
            new Map()
        )
        return raysuner.reduce(
            array,
            function (accmulator, item) {
                let it = callback(item)
                if (map.has(it) && map.get(it) === 1) {
                    accmulator.push(item)
                }
                return accmulator
            },
            []
        )
    },

    xorWith: function (...arrays) {
        let callback = raysuner.getCallbackFn(arrays.pop())
        let array = raysuner.concat([], ...arrays)
        const result = []
        for (let i = 0; i < array.length; i++) {
            let flag = true
            for (let j = 0; j < array.length; j++) {
                if (i !== j && callback(array[i], array[j])) {
                    flag = false
                }
            }
            if (flag) {
                result.push(array[i])
            }
        }
        return result
    },

    /*@function 集合*/
    countBy: function (collection, callback) {
        let count = {}
        callback = raysuner.getCallbackFn(callback)
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let index = callback(collection[key], key, collection)
                if (index in count) {
                    count[index]++
                } else {
                    count[index] = 1
                }
            }
        }
        return count
    },

    forEachRight: function (collection, callback) {
        if (typeof callback !== "function") {
            throw new Error("callback need to be function")
        }
        if (Array.isArray(collection)) {
            for (let i = collection.length - 1; i >= 0; i--) {
                if (!callback(collection[i], i, collection)) {
                    break
                }
            }
        } else if (raysuner.isPlainObject(collection)) {
            let keys = raysuner.keys(collection)
            for (let i = keys.length - 1; i >= 0; i--) {
                if (!callback(collection[keys[i]], keys[i], collection)) {
                    break
                }
            }
        }
        return collection
    },

    find: function (collection, callback, fromIndex = 0) {
        callback = raysuner.getCallbackFn(callback)
        for (let i = fromIndex; i < collection.length; i++) {
            if (callback(collection[i], i, collection)) {
                return collection[i]
            }
        }
    },

    findLast: function (
        collection,
        callback,
        fromIndex = collection.length - 1
    ) {
        for (let i = fromIndex; i >= 0; i--) {
            if (callback(collection[i], i, collection)) {
                return collection[i]
            }
        }
    },

    flatMap: function (collection, callback) {
        callback = raysuner.getCallbackFn(callback)
        let result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                result = raysuner.concat(result, callback(collection[key]))
            }
        }
        return result
    },

    flatMapDeep: function (collection, callback) {
        function deep(response) {
            for (let item of response) {
                if (Array.isArray(item)) {
                    deep(item)
                } else {
                    result = raysuner.concat(result, item)
                }
            }
        }
        callback = raysuner.getCallbackFn(callback)
        let result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let response = callback(collection[key])
                deep(response)
            }
        }
        return result
    },

    flatMapDepth: function (collection, callback, depth = 1) {
        function deep(response, depth) {
            if (depth === 0 || !Array.isArray(response)) {
                result.push(response)
                return
            }
            for (let item of response) {
                deep(item, depth - 1)
            }
        }
        callback = raysuner.getCallbackFn(callback)
        let result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let response = callback(collection[key])
                deep(response, depth)
            }
        }
        return result
    },

    groupBy: function (collection, callback) {
        const res = {}
        callback = raysuner.getCallbackFn(callback)
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let resKey = callback(collection[key], key, collection)
                if (resKey in res) {
                    res[resKey].push(collection[key])
                } else {
                    res[resKey] = [collection[key]]
                }
            }
        }
        return res
    },

    invokeMap: function (collection, callback, ...args) {
        const result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (typeof callback === "string") {
                    callback = collection[key][callback]
                }
                result.push(callback.call(collection[key], ...args))
            }
        }
        return result
    },

    keyBy: function (collection, callback) {
        const res = {}
        callback = raysuner.getCallbackFn(callback)
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let resKey = callback(collection[key], key, collection)
                res[resKey] = collection[key]
            }
        }
        return res
    },

    sortBy: function (collection, compare) {
        if (typeof compare !== "function") {
            throw new Error("compare need to be function")
        }
        for (let i = 1; i < collection.length; i++) {
            let temp = collection[i]
            let j
            for (j = i - 1; j >= 0; j--) {
                if (compare(temp, collection[j]) < 0) {
                    collection[j + 1] = collection[j]
                } else {
                    break
                }
            }
            collection[j + 1] = temp
        }
    },

    orderBy: function (collection, callback, order) {},

    partition: function (collection, callback) {
        const result = [[], []]
        callback = raysuner.getCallbackFn(callback)
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (callback(collection[key])) {
                    result[0].push(collection[key])
                } else {
                    result[1].push(collection[key])
                }
            }
        }
        return result
    },

    reduceRight: function (collection, callback, initial = null) {
        callback = raysuner.getCallbackFn(callback)
        let result
        let start
        if (Array.isArray(collection)) {
            let length = collection.length
            start = initial ? length - 1 : length - 2
            result = initial ? initial : collection[length - 1]
            for (let i = start; i >= 0; i--) {
                result = callback(result, collection[i], i, collection)
            }
        } else if (raysuner.isPlainObject(collection)) {
            let keys = raysuner.keys(collection)
            let length = keys.length
            start = initial ? keys[length - 1] : keys[length - 2]
            result = initial ? initial : collection[keys[length - 1]]
            for (let i = start; i >= 0; i--) {
                result = callback(
                    result,
                    collection[keys[i]],
                    keys[i],
                    collection
                )
            }
        }
        return result
    },

    reject: function (collection, callback) {
        callback = raysuner.getCallbackFn(callback)
        const result = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (Array.isArray(collection)) {
                    key = Number(key)
                }
                if (!callback(collection[key], key, collection)) {
                    result.push(collection[key])
                }
            }
        }
        return result
    },

    sample: function (collection) {},

    sampleSize: function (collection, size = 1) {},

    shuffle: function (collection) {},

    size: function (collection) {
        if (raysuner.isPlainObject(collection)) {
            return raysuner.keys(collection).length
        }
        return collection.length
    },

    defer: function (func, ...args) {
        let saveThis = this
        return setTimeout(() => {
            func.apply(saveThis, args)
        }, 1)
    },

    delay: function (func, ms, ...args) {
        let saveThis = this
        return setTimeout(() => {
            func.apply(saveThis, args)
        }, ms)
    },

    castArray: function (value) {
        if (arguments.length === 0) {
            return []
        }
        if (Array.isArray(value)) {
            return value
        } else {
            return [value]
        }
    },

    conformsTo: function (object, source) {
        return raysuner.every(source, function (_, key) {
            return source[key](object[key])
        })
    },

    eq: function (obj1, obj2) {
        return raysuner.isEqualForBase(obj1, obj2)
    },

    gt: function (obj1, obj2) {
        return obj1 > obj2
    },

    gte: function (obj1, obj2) {
        return obj1 >= obj2
    },

    parseJson: function (arg) {
        function parse() {
            function parseTrue() {
                i += 4
                return true
            }

            function parseFalse() {
                i += 5
                return false
            }

            function parseString() {
                let ret = ""
                i++
                while (str[i] != '"') {
                    ret += str[i++]
                }
                i++
                return ret
            }

            function parseNumber() {
                let ret = ""
                while (str[i] >= "0" && str[i] <= "9") {
                    ret += str[i++]
                }
                return Number(ret)
            }

            function parseNull() {
                i += 4
                return null
            }

            function parseArray() {
                let ret = []
                i++
                while (str[i] !== "]") {
                    ret.push(parse())
                    if (str[i] === ",") {
                        i++
                    }
                }
                i++
                return ret
            }

            function parseObject() {
                let ret = {}
                i++
                while (str[i] !== "}") {
                    let key = parse()
                    i++
                    let val = parse()
                    ret[key] = val
                    if (str[i] === ",") {
                        i++
                    }
                }
                i++
                return ret
            }

            while (i < str.length) {
                if (str[i] === "{") {
                    return parseObject()
                } else if (str[i] === "[") {
                    return parseArray()
                } else if (str[i] === '"') {
                    return parseString()
                } else if (str[i] === "t") {
                    return parseTrue()
                } else if (str[i] === "f") {
                    return parseFalse()
                } else if (str[i] === "n") {
                    return parseNull()
                } else if (str[i] >= "0" && str[i] <= "9") {
                    return parseNumber()
                }
            }
        }
        let i = 0
        let str = arg
        return parse()
    },
}
