"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Find multiple documents in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to search.
 * @param {Object} [options.key={}] - An object with key-value pairs to use as a filter for the search.
 *   - allowedQuery (Set): A set of allowed query keys. If any provided query key is not in this set, the function will reject with an error.
 *   - paginate (boolean): If true, the function will return a paginated result. If false, it will return all matching documents.
 *   - populate (Object): An object with the following properties:
 *     - path (string): The field to populate.
 *     - select (string): A space-separated string of fields to select.
 *   - query (Object): An object with key-value pairs representing queries to filter the search by.
 *     - sortBy (string): A string in the format "field:order", where "field" is the field to sort by and "order" is either "asc" or "desc".
 *     - search (string): A string to search for in the collection.
 *     - page (number): The page number to return.
 *     - limit (number): The number of documents per page.
 *     - Any field of the provided table if allowed.
 * @returns {Promise} A promise that resolves with an array of found documents or an object with a `docs` array of found documents and metadata about the pagination, or rejects with an error if there is an issue with the query?.
 * @example
 * const result = await find({
 *   table: 'users',
 *   key: {
 *     allowedQuery: new Set(['sortBy', 'search']),
 *     paginate: true,
 *     populate: { path: 'profile', select: 'name' },
 *     query: { sortBy: 'name:asc', search: 'john', page: 2, limit: 20 }
 *   }
 * });
 */
const find = ({ table, key = {} }) => new Promise((resolve, reject) => {
    var _a, _b, _c, _d;
    const queryKeys = Object.keys((key === null || key === void 0 ? void 0 : key.query) || {});
    const verified = queryKeys.every((k) => (key.allowedQuery || new Set([])).has(k));
    if (!verified)
        return reject("Query validation issue");
    const noPaginate = key.paginate === false || key.query.paginate === "false" || ((_a = key.query) === null || _a === void 0 ? void 0 : _a.search);
    key.options = noPaginate
        ? { sort: {} }
        : Object.assign(Object.assign({}, (key.populate && { populate: Object.assign({}, key.populate) })), { page: Number((_b = key === null || key === void 0 ? void 0 : key.query) === null || _b === void 0 ? void 0 : _b.page) || 0, limit: Number((_c = key === null || key === void 0 ? void 0 : key.query) === null || _c === void 0 ? void 0 : _c.limit) || 10, sort: Object.assign({}, (!((_d = key === null || key === void 0 ? void 0 : key.query) === null || _d === void 0 ? void 0 : _d.sortBy) && { createdAt: -1 })) });
    // prepare query object with provied queries to find.
    queryKeys.forEach((k) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g, _h;
        if (typeof (key === null || key === void 0 ? void 0 : key.query[k]) === "string" && (key === null || key === void 0 ? void 0 : key.query[k].startsWith('{"')) && (key === null || key === void 0 ? void 0 : key.query[k].endsWith("}")))
            key.query[k] = JSON.parse(key === null || key === void 0 ? void 0 : key.query[k]);
        if (k === "sortBy") {
            const parts = (_e = key === null || key === void 0 ? void 0 : key.query) === null || _e === void 0 ? void 0 : _e.sortBy.split(":");
            return (key.options.sort[parts[0]] = parts[1] === "desc" ? -1 : 1);
        }
        if (k === "search") {
            const parts = (_f = key === null || key === void 0 ? void 0 : key.query) === null || _f === void 0 ? void 0 : _f.search.split(":");
            return (key.options[parts[0]] = { $regex: parts[1], $options: "i" });
        }
        if (k === "id") {
            key._id = (_g = key === null || key === void 0 ? void 0 : key.query) === null || _g === void 0 ? void 0 : _g.id;
            return (_h = key === null || key === void 0 ? void 0 : key.query) === null || _h === void 0 ? true : delete _h.id;
        }
        key[k] = key === null || key === void 0 ? void 0 : key.query[k];
    }));
    const method = noPaginate ? "find" : "paginate";
    const options = key.options;
    const populate = key.populate;
    delete key.allowedQuery;
    delete key.populate;
    delete key.paginate;
    delete key.options;
    key === null || key === void 0 ? true : delete key.query;
    const args = [key, ...(noPaginate ? [null] : []), options];
    // Ensure table[method](...args) returns a Promise
    const result = table[method](...args);
    // Resolve or reject the outer Promise based on the result
    if (noPaginate) {
        resolve(populate ? result.populate(populate) : result);
    }
    else {
        result.then((res) => resolve(res)).catch((e) => reject(e));
    }
});
/**
 * Find a single document in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to search.
 * @param {Object} [options.key={}] - An object with key-value pairs to use as a filter for the search.
 * @returns {Promise} A promise that resolves with the found document or null if no matching document is found, or rejects with an error if there is an issue with the query?.
 * @example
 * const result = await findOne({ table: 'users', key: { name: 'John' } });
 */
const findOne = ({ table, key = {} }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (key.id)
        key._id = key.id;
    delete key.id;
    if (Object.keys(key).length < 1)
        return null;
    try {
        const res = yield table.findOne(key).populate((_a = key.populate) === null || _a === void 0 ? void 0 : _a.path, (_c = (_b = key.populate) === null || _b === void 0 ? void 0 : _b.select) === null || _c === void 0 ? void 0 : _c.split(" "));
        return res;
    }
    catch (e) {
        throw e;
    }
});
/**
 * Create a new document in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to create the document in.
 * @param {Object} options.key - An object with key-value pairs representing the fields and values of the new document.
 * @param {Object} [options.key.populate] - An object with the following properties:
 *   - path (string): The field to populate.
 *   - select (string): A space-separated string of fields to select.
 * @returns {Promise} A promise that resolves with the created document, or rejects with an error if there is an issue with the creation.
 * @example
 * const result = await create({
 *   table: 'users',
 *   key: { name: 'John', age: 30, populate: { path: 'profile', select: 'name' } }
 * });
 */
const create = ({ table, key }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const elem = yield new table(key);
        const res = yield elem.save();
        key.populate && (yield res.populate(key.populate));
        return res;
    }
    catch (e) {
        console.log(e);
    }
});
/**
 * Update an existing document in a specified MongoDB collection.
 * @param {Object} options - An object with the following properties:
 * @param {string} options.table - The name of the collection to update the document in.
 * @param {Object} options.key - An object with key-value pairs representing the fields to update and their new values.
 *   - id (string): The ID of the document to update.
 *   - body (Object): An object with key-value pairs representing the fields to update and their new values.
 *   - populate (Object): An object with the following properties:
 *     - path (string): The field to populate.
 *     - select (string): A space-separated string of fields to select.
 * @returns {Promise} A promise that resolves with the updated document, or rejects with an error if there is an issue with the update.
 * @example
 * const result = await update({
 *   table: 'users',
 *   key: { id: '123', body: { name: 'John', age: 30 }, populate: { path: 'profile', select: 'name' } }
 * });
 */
const update = ({ table, key }) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        if (key.id)
            key._id = key.id;
        delete key.id;
        const element = yield table.findOne(key);
        if (!element)
            return Promise.resolve(element);
        Object.keys(key.body || {}).forEach((param) => (element[param] = key.body[param]));
        const res = yield element.save();
        key.populate && (yield res.populate((_d = key.populate) === null || _d === void 0 ? void 0 : _d.path, (_f = (_e = key.populate) === null || _e === void 0 ? void 0 : _e.select) === null || _f === void 0 ? void 0 : _f.split(" ")));
        return Promise.resolve(element);
    }
    catch (e) {
        return Promise.reject(e);
    }
});
/**
 * remove - Removes an element from the specified table that matches the provided key.
 *
 * @param {Object} options - An object containing the following fields:
 *   - table {string}: The name of the table to remove the element from.
 *   - key {Object}: The key to use to identify the element to remove.
 * @return {Promise} A promise that resolves with the removed element if it was found and removed successfully,
 *   or with `null` if no element was found. Rejects with an error if there was an issue removing the element.
 */
const remove = (target) => __awaiter(void 0, void 0, void 0, function* () {
    const { table, key, _id } = target;
    try {
        if (_id) {
            //if mongodb instance found then delete with obj.remove method.
            yield target.remove();
            return Promise.resolve(target);
        }
        if (key.id)
            key._id = key.id;
        delete key.id;
        const element = yield table.findOne(key);
        if (!element)
            return Promise.resolve(element);
        yield element.remove();
        return Promise.resolve(element);
    }
    catch (e) {
        Promise.reject(e);
    }
});
/**
 * removeAll - Removes all elements from the specified table.
 *
 * @param {Object} options - An object containing the following field:
 *   - table {string}: The name of the table to remove all elements from.
 * @return {Promise} A promise that resolves with an object containing information about the deleted elements.
 *   Rejects with an error if there was an issue deleting the elements.
 */
const removeAll = ({ table, key }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield table.deleteMany(key);
        return Promise.resolve(res);
    }
    catch (e) {
        Promise.reject(e);
    }
});
const updateMany = ({ table, key }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, update, options, callback } = key;
        const res = yield table.updateMany(filter, update, options, callback);
        return Promise.resolve(res);
    }
    catch (err) {
        Promise.reject(err);
    }
});
/**
 * save - Saves an element to the database.
 *
 * @param {Object} data - The element to save.
 * @return {Promise}approved A promise that resolves with the saved element if it was saved successfully.
 *   Rejects with an error if there was an issue saving the element.
 */
const save = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield data.save(); });
/**
 * Asynchronously populates the specified field(s) of a Mongoose model instance with documents from other collections.
 *
 * @param {Model} data - The Mongoose model instance to populate.
 * @param {Object|String} payload - An object or string specifying the field(s) to populate and any additional options.
 * @returns {Promise<Model>} A Promise that resolves to the populated model instance.
 * @throws {Error} If data is not a valid Mongoose model instance or if payload is not a valid object or string.
 * @throws {Error} If an error occurs while populating the model instance.
 */
const populate = (data, payload = {}) => __awaiter(void 0, void 0, void 0, function* () { return yield data.populate(payload); });
const sort = (data, payload = {}) => __awaiter(void 0, void 0, void 0, function* () { return yield data.sort(payload); });
const aggr = ({ table, key }) => __awaiter(void 0, void 0, void 0, function* () { return yield table.aggregate(key); });
const bulkCreate = ({ table, docs }) => __awaiter(void 0, void 0, void 0, function* () {
    yield table.insertMany(docs, { ordered: false });
});
module.exports = {
    find,
    findOne,
    create,
    remove,
    update,
    save,
    removeAll,
    populate,
    sort,
    aggr,
    updateMany,
    bulkCreate,
};
//# sourceMappingURL=operations.js.map