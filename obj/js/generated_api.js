"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moment = require("moment");
require("whatwg-fetch");
exports.parse_date = (e) => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); };
exports.make_page = (res, parse_other_args) => {
    return {
        Items: res.Items.map((i) => { return Object.assign({}, i, { Item: exports.parse_date(i.Item) }); }).map((i) => { return Object.assign({}, i, { Item: parse_other_args(i.Item) }); }),
        PageIndex: res.PageIndex,
        SearchQuery: res.SearchQuery,
        NumPages: res.NumPages,
        PageSize: res.PageSize,
        TotalCount: res.TotalCount,
        CanCreate: res.CanCreate,
        CanDelete: res.CanDelete
    };
};
function create_American() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/American/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_American = create_American;
function update_American(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/American/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_American = update_American;
function delete_American(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/American/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_American = delete_American;
function get_American(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/American/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_American = get_American;
function get_Americans(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/American?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Americans = get_Americans;
function get_Meal_Categorie_Meals(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Meal_Categorie_Meals = get_Meal_Categorie_Meals;
function get_Meal_Categorie_Meals_Categorie(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Meal_Categorie_Meals_Categorie = get_Meal_Categorie_Meals_Categorie;
function get_Meal_Categorie_Meals_Categorie_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Meal_Categorie_Meals_Categorie_by_id = get_Meal_Categorie_Meals_Categorie_by_id;
function get_unlinked_Meal_Categorie_Meals(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Meal_Categorie_Meals = get_unlinked_Meal_Categorie_Meals;
function get_unlinked_Meal_Categorie_Meals_American(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals/American?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Meal_Categorie_Meals_American = get_unlinked_Meal_Categorie_Meals_American;
function get_unlinked_Meal_Categorie_Meals_Asian(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals/Asian?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Meal_Categorie_Meals_Asian = get_unlinked_Meal_Categorie_Meals_Asian;
function get_unlinked_Meal_Categorie_Meals_Mediterranean(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals/Mediterranean?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Meal_Categorie_Meals_Mediterranean = get_unlinked_Meal_Categorie_Meals_Mediterranean;
function create_linked_Meal_Categorie_Meals_American(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals_American`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Meal_Categorie_Meals_American = create_linked_Meal_Categorie_Meals_American;
function create_linked_Meal_Categorie_Meals_Asian(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals_Asian`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Meal_Categorie_Meals_Asian = create_linked_Meal_Categorie_Meals_Asian;
function create_linked_Meal_Categorie_Meals_Mediterranean(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals_Mediterranean`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Meal_Categorie_Meals_Mediterranean = create_linked_Meal_Categorie_Meals_Mediterranean;
function link_Meal_Categorie_Meals(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Meal_Categorie_Meals = link_Meal_Categorie_Meals;
function unlink_Meal_Categorie_Meals(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Meal_Categorie_Meals = unlink_Meal_Categorie_Meals;
function get_Meal_Meal_Recipes(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Meal_Meal_Recipes = get_Meal_Meal_Recipes;
function get_Meal_Meal_Recipes_Recipe(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Meal_Meal_Recipes_Recipe = get_Meal_Meal_Recipes_Recipe;
function get_Meal_Meal_Recipes_Recipe_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Meal_Meal_Recipes_Recipe_by_id = get_Meal_Meal_Recipes_Recipe_by_id;
function get_unlinked_Meal_Meal_Recipes(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/unlinked/Meal_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Meal_Meal_Recipes = get_unlinked_Meal_Meal_Recipes;
function create_linked_Meal_Meal_Recipes_Recipe(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes_Recipe`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Meal_Meal_Recipes_Recipe = create_linked_Meal_Meal_Recipes_Recipe;
function link_Meal_Meal_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Meal_Meal_Recipes = link_Meal_Meal_Recipes;
function unlink_Meal_Meal_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Meal_Meal_Recipes = unlink_Meal_Meal_Recipes;
function create_Meal() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Meal = create_Meal;
function update_Meal(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = item.Kind == "Lunch" ? yield update_Lunch(item) : item.Kind == "Dinner" ? yield update_Dinner(item) : item.Kind == "Breakfast" ? yield update_Breakfast(item) : null;
        return;
    });
}
exports.update_Meal = update_Meal;
function delete_Meal(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Meal = delete_Meal;
function get_Meal(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Meal = get_Meal;
function get_Meals(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Meal?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Meals = get_Meals;
function create_Asian() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Asian/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Asian = create_Asian;
function update_Asian(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Asian/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Asian = update_Asian;
function delete_Asian(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Asian/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Asian = delete_Asian;
function get_Asian(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Asian/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Asian = get_Asian;
function get_Asians(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Asian?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Asians = get_Asians;
function create_Lunch() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lunch/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Lunch = create_Lunch;
function update_Lunch(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lunch/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Lunch = update_Lunch;
function delete_Lunch(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lunch/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Lunch = delete_Lunch;
function get_Lunch(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lunch/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Lunch = get_Lunch;
function get_Lunches(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Lunch?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Lunches = get_Lunches;
function get_User_User_Recipes(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/User_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_User_User_Recipes = get_User_User_Recipes;
function get_User_User_Recipes_Recipe(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_User_User_Recipes_Recipe = get_User_User_Recipes_Recipe;
function get_User_User_Recipes_Recipe_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_User_User_Recipes_Recipe_by_id = get_User_User_Recipes_Recipe_by_id;
function get_unlinked_User_User_Recipes(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/unlinked/User_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_User_User_Recipes = get_unlinked_User_User_Recipes;
function create_linked_User_User_Recipes_Recipe(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/User_Recipes_Recipe`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_User_User_Recipes_Recipe = create_linked_User_User_Recipes_Recipe;
function link_User_User_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/User_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_User_User_Recipes = link_User_User_Recipes;
function unlink_User_User_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}/User_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_User_User_Recipes = unlink_User_User_Recipes;
function create_User() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_User = create_User;
function update_User(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_User = update_User;
function delete_User(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_User = delete_User;
function get_User(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_User = get_User;
function get_Users(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Users = get_Users;
function delete_User_sessions() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/DeleteSessions`, { method: 'post', credentials: 'include',
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        return;
    });
}
exports.delete_User_sessions = delete_User_sessions;
function active_User_sessions() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/ActiveSessions`, { method: 'post', credentials: 'include',
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            return [];
        let json = yield res.json();
        return json;
    });
}
exports.active_User_sessions = active_User_sessions;
function validate_User(username, email, email_confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/Validate`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, EmailConfirmation: email_confirmation }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            return false;
        let json = yield res.json();
        return !!json;
    });
}
exports.validate_User = validate_User;
function register_User(username, email, email_confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/Register`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, EmailConfirmation: email_confirmation }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.register_User = register_User;
function login_User(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/Login`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, Password: password }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.login_User = login_User;
function logout_User() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/Logout`, { method: 'post', credentials: 'include',
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.logout_User = logout_User;
function change_User_password(username, email, password, new_password, new_password_confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/ChangePassword`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, Password: password, NewPassword: new_password, NewPasswordConfirmation: new_password_confirmation }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.change_User_password = change_User_password;
function reset_User_password(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/User/ResetPassword`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.reset_User_password = reset_User_password;
function create_HomePage() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_HomePage = create_HomePage;
function update_HomePage(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_HomePage = update_HomePage;
function delete_HomePage(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_HomePage = delete_HomePage;
function get_HomePage(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_HomePage = get_HomePage;
function get_HomePages(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/HomePage?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_HomePages = get_HomePages;
function get_Recipe_User_Recipes(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/User_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Recipe_User_Recipes = get_Recipe_User_Recipes;
function get_Recipe_User_Recipes_User(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Recipe_User_Recipes_User = get_Recipe_User_Recipes_User;
function get_Recipe_User_Recipes_User_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Recipe_User_Recipes_User_by_id = get_Recipe_User_Recipes_User_by_id;
function get_unlinked_Recipe_User_Recipes(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/unlinked/User_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Recipe_User_Recipes = get_unlinked_Recipe_User_Recipes;
function create_linked_Recipe_User_Recipes_User(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/User_Recipes_User`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Recipe_User_Recipes_User = create_linked_Recipe_User_Recipes_User;
function link_Recipe_User_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Recipe_User_Recipes = link_Recipe_User_Recipes;
function unlink_Recipe_User_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Recipe_User_Recipes = unlink_Recipe_User_Recipes;
function get_Recipe_Recipe_Ratings(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Recipe_Recipe_Ratings = get_Recipe_Recipe_Ratings;
function get_Recipe_Recipe_Ratings_Rating(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Recipe_Recipe_Ratings_Rating = get_Recipe_Recipe_Ratings_Rating;
function get_Recipe_Recipe_Ratings_Rating_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Recipe_Recipe_Ratings_Rating_by_id = get_Recipe_Recipe_Ratings_Rating_by_id;
function get_unlinked_Recipe_Recipe_Ratings(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/unlinked/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Recipe_Recipe_Ratings = get_unlinked_Recipe_Recipe_Ratings;
function create_linked_Recipe_Recipe_Ratings_Rating(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings_Rating`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Recipe_Recipe_Ratings_Rating = create_linked_Recipe_Recipe_Ratings_Rating;
function link_Recipe_Recipe_Ratings(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Recipe_Recipe_Ratings = link_Recipe_Recipe_Ratings;
function unlink_Recipe_Recipe_Ratings(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Recipe_Recipe_Ratings = unlink_Recipe_Recipe_Ratings;
function get_Recipe_Meal_Recipes(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Recipe_Meal_Recipes = get_Recipe_Meal_Recipes;
function get_Recipe_Meal_Recipes_Meal(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Recipe_Meal_Recipes_Meal = get_Recipe_Meal_Recipes_Meal;
function get_Recipe_Meal_Recipes_Meal_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Recipe_Meal_Recipes_Meal_by_id = get_Recipe_Meal_Recipes_Meal_by_id;
function get_unlinked_Recipe_Meal_Recipes(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Recipe_Meal_Recipes = get_unlinked_Recipe_Meal_Recipes;
function get_unlinked_Recipe_Meal_Recipes_Lunch(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes/Lunch?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Recipe_Meal_Recipes_Lunch = get_unlinked_Recipe_Meal_Recipes_Lunch;
function get_unlinked_Recipe_Meal_Recipes_Dinner(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes/Dinner?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Recipe_Meal_Recipes_Dinner = get_unlinked_Recipe_Meal_Recipes_Dinner;
function get_unlinked_Recipe_Meal_Recipes_Breakfast(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes/Breakfast?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Recipe_Meal_Recipes_Breakfast = get_unlinked_Recipe_Meal_Recipes_Breakfast;
function create_linked_Recipe_Meal_Recipes_Lunch(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes_Lunch`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Recipe_Meal_Recipes_Lunch = create_linked_Recipe_Meal_Recipes_Lunch;
function create_linked_Recipe_Meal_Recipes_Dinner(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes_Dinner`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Recipe_Meal_Recipes_Dinner = create_linked_Recipe_Meal_Recipes_Dinner;
function create_linked_Recipe_Meal_Recipes_Breakfast(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes_Breakfast`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Recipe_Meal_Recipes_Breakfast = create_linked_Recipe_Meal_Recipes_Breakfast;
function link_Recipe_Meal_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Recipe_Meal_Recipes = link_Recipe_Meal_Recipes;
function unlink_Recipe_Meal_Recipes(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Recipe_Meal_Recipes = unlink_Recipe_Meal_Recipes;
function create_Recipe() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Recipe = create_Recipe;
function update_Recipe(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined, Picture: "" })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Recipe = update_Recipe;
function delete_Recipe(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Recipe = delete_Recipe;
function get_Recipe(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Recipe = get_Recipe;
function get_Recipes(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Recipes = get_Recipes;
function get_Recipe_Picture(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${item.Id}/Picture`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.Content;
    });
}
exports.get_Recipe_Picture = get_Recipe_Picture;
function update_Recipe_Picture(item, new_src) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Recipe/${item.Id}/Picture`, { method: 'put', body: JSON.stringify({ Content: new_src }), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Recipe_Picture = update_Recipe_Picture;
function create_Admin() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Admin = create_Admin;
function update_Admin(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Admin = update_Admin;
function delete_Admin(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Admin = delete_Admin;
function get_Admin(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Admin = get_Admin;
function get_Admins(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Admins = get_Admins;
function delete_Admin_sessions() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/DeleteSessions`, { method: 'post', credentials: 'include',
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        return;
    });
}
exports.delete_Admin_sessions = delete_Admin_sessions;
function active_Admin_sessions() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/ActiveSessions`, { method: 'post', credentials: 'include',
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            return [];
        let json = yield res.json();
        return json;
    });
}
exports.active_Admin_sessions = active_Admin_sessions;
function validate_Admin(username, email, email_confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/Validate`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, EmailConfirmation: email_confirmation }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            return false;
        let json = yield res.json();
        return !!json;
    });
}
exports.validate_Admin = validate_Admin;
function register_Admin(username, email, email_confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/Register`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, EmailConfirmation: email_confirmation }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.register_Admin = register_Admin;
function login_Admin(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/Login`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, Password: password }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: new Date(json.CreatedDate) });
    });
}
exports.login_Admin = login_Admin;
function logout_Admin() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/Logout`, { method: 'post', credentials: 'include',
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.logout_Admin = logout_Admin;
function change_Admin_password(username, email, password, new_password, new_password_confirmation) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/ChangePassword`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email, Password: password, NewPassword: new_password, NewPasswordConfirmation: new_password_confirmation }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.change_Admin_password = change_Admin_password;
function reset_Admin_password(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Admin/ResetPassword`, { method: 'post', credentials: 'include',
            body: JSON.stringify({ Username: username, Email: email }),
            headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.reset_Admin_password = reset_Admin_password;
function create_Dinner() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Dinner/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Dinner = create_Dinner;
function update_Dinner(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Dinner/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Dinner = update_Dinner;
function delete_Dinner(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Dinner/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Dinner = delete_Dinner;
function get_Dinner(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Dinner/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Dinner = get_Dinner;
function get_Dinners(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Dinner?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Dinners = get_Dinners;
function get_Categorie_Categorie_Meals(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Categorie_Categorie_Meals = get_Categorie_Categorie_Meals;
function get_Categorie_Categorie_Meals_Meal(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Categorie_Categorie_Meals_Meal = get_Categorie_Categorie_Meals_Meal;
function get_Categorie_Categorie_Meals_Meal_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Categorie_Categorie_Meals_Meal_by_id = get_Categorie_Categorie_Meals_Meal_by_id;
function get_unlinked_Categorie_Categorie_Meals(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Categorie_Categorie_Meals = get_unlinked_Categorie_Categorie_Meals;
function get_unlinked_Categorie_Categorie_Meals_Lunch(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals/Lunch?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Categorie_Categorie_Meals_Lunch = get_unlinked_Categorie_Categorie_Meals_Lunch;
function get_unlinked_Categorie_Categorie_Meals_Dinner(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals/Dinner?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Categorie_Categorie_Meals_Dinner = get_unlinked_Categorie_Categorie_Meals_Dinner;
function get_unlinked_Categorie_Categorie_Meals_Breakfast(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals/Breakfast?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Categorie_Categorie_Meals_Breakfast = get_unlinked_Categorie_Categorie_Meals_Breakfast;
function create_linked_Categorie_Categorie_Meals_Lunch(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals_Lunch`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Categorie_Categorie_Meals_Lunch = create_linked_Categorie_Categorie_Meals_Lunch;
function create_linked_Categorie_Categorie_Meals_Dinner(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals_Dinner`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Categorie_Categorie_Meals_Dinner = create_linked_Categorie_Categorie_Meals_Dinner;
function create_linked_Categorie_Categorie_Meals_Breakfast(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals_Breakfast`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Categorie_Categorie_Meals_Breakfast = create_linked_Categorie_Categorie_Meals_Breakfast;
function link_Categorie_Categorie_Meals(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Categorie_Categorie_Meals = link_Categorie_Categorie_Meals;
function unlink_Categorie_Categorie_Meals(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Categorie_Categorie_Meals = unlink_Categorie_Categorie_Meals;
function create_Categorie() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Categorie = create_Categorie;
function update_Categorie(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = item.Kind == "American" ? yield update_American(item) : item.Kind == "Asian" ? yield update_Asian(item) : item.Kind == "Mediterranean" ? yield update_Mediterranean(item) : null;
        return;
    });
}
exports.update_Categorie = update_Categorie;
function delete_Categorie(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Categorie = delete_Categorie;
function get_Categorie(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Categorie = get_Categorie;
function get_Categories(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Categorie?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Categories = get_Categories;
function create_Mediterranean() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Mediterranean/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Mediterranean = create_Mediterranean;
function update_Mediterranean(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Mediterranean/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Mediterranean = update_Mediterranean;
function delete_Mediterranean(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Mediterranean/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Mediterranean = delete_Mediterranean;
function get_Mediterranean(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Mediterranean/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Mediterranean = get_Mediterranean;
function get_Mediterraneans(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Mediterranean?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Mediterraneans = get_Mediterraneans;
function create_Breakfast() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Breakfast/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Breakfast = create_Breakfast;
function update_Breakfast(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Breakfast/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Breakfast = update_Breakfast;
function delete_Breakfast(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Breakfast/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Breakfast = delete_Breakfast;
function get_Breakfast(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Breakfast/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Breakfast = get_Breakfast;
function get_Breakfasts(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Breakfast?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Breakfasts = get_Breakfasts;
function create_CategoryList() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CategoryList/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_CategoryList = create_CategoryList;
function update_CategoryList(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CategoryList/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_CategoryList = update_CategoryList;
function delete_CategoryList(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CategoryList/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_CategoryList = delete_CategoryList;
function get_CategoryList(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CategoryList/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_CategoryList = get_CategoryList;
function get_CategoryLists(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CategoryList?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_CategoryLists = get_CategoryLists;
function get_Rating_Recipe_Ratings(source, page_index, page_size, query_string = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Rating_Recipe_Ratings = get_Rating_Recipe_Ratings;
function get_Rating_Recipe_Ratings_Recipe(source, page_index, page_size, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Rating_Recipe_Ratings_Recipe = get_Rating_Recipe_Ratings_Recipe;
function get_Rating_Recipe_Ratings_Recipe_by_id(source, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.get_Rating_Recipe_Ratings_Recipe_by_id = get_Rating_Recipe_Ratings_Recipe_by_id;
function get_unlinked_Rating_Recipe_Ratings(source, page_index, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/unlinked/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_unlinked_Rating_Recipe_Ratings = get_unlinked_Rating_Recipe_Ratings;
function create_linked_Rating_Recipe_Ratings_Recipe(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings_Recipe`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return json.map(e => { return Object.assign({}, e, { CreatedDate: Moment.utc(e.CreatedDate) }); });
    });
}
exports.create_linked_Rating_Recipe_Ratings_Recipe = create_linked_Rating_Recipe_Ratings_Recipe;
function link_Rating_Recipe_Ratings(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.link_Rating_Recipe_Ratings = link_Rating_Recipe_Ratings;
function unlink_Rating_Recipe_Ratings(source, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.unlink_Rating_Recipe_Ratings = unlink_Rating_Recipe_Ratings;
function create_Rating() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Rating = create_Rating;
function update_Rating(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Rating = update_Rating;
function delete_Rating(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Rating = delete_Rating;
function get_Rating(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Rating = get_Rating;
function get_Ratings(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Rating?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Ratings = get_Ratings;
function create_Bookmarks() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Bookmarks/`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json',
                'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return Object.assign({}, json, { CreatedDate: Moment.utc(json.CreatedDate) });
    });
}
exports.create_Bookmarks = create_Bookmarks;
function update_Bookmarks(item) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Bookmarks/`, { method: 'put',
            body: JSON.stringify(Object.assign({}, item, { CreatedDate: undefined })), credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.update_Bookmarks = update_Bookmarks;
function delete_Bookmarks(source) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Bookmarks/${source.Id}`, { method: 'delete', credentials: 'include', headers: { 'content-type': 'application/json', 'X-XSRF-TOKEN': document.getElementsByName("__RequestVerificationToken")[0].value } });
        if (!res.ok)
            throw Error(res.statusText);
        return;
    });
}
exports.delete_Bookmarks = delete_Bookmarks;
function get_Bookmarks(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Bookmarks/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return { Item: Object.assign({}, json.Item, { CreatedDate: Moment.utc(json.Item.CreatedDate) }),
            Editable: !!json.Editable, JustCreated: false };
    });
}
exports.get_Bookmarks = get_Bookmarks;
function get_Bookmarkss(page_index, page_size, search_query = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/Bookmarks?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        if (!res.ok)
            throw Error(res.statusText);
        let json = yield res.json();
        return exports.make_page(json, e => { return Object.assign({}, e); });
    });
}
exports.get_Bookmarkss = get_Bookmarkss;
//# sourceMappingURL=generated_api.js.map