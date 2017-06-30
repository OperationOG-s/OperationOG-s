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
const React = require("react");
const Immutable = require("immutable");
const Api = require("../generated_api");
const List = require("../containers/list");
const Components = require("../components/components");
const Buttons = require("../containers/button_utils");
const Permissions = require("./permissions");
const Utils = require("./view_utils");
const i18next = require("i18next");
const HomePageViews = require("./HomePage");
const CategoryListViews = require("./CategoryList");
const BookmarksViews = require("./Bookmarks");
const CategorieViews = require("./Categorie");
const RecipeViews = require("./Recipe");
function Dinner_Categorie_Meal_can_create(self) {
    let state = self.state();
    return state.Categorie == "loading" ? false : state.Categorie.CanCreate;
}
exports.Dinner_Categorie_Meal_can_create = Dinner_Categorie_Meal_can_create;
function Dinner_Meal_Recipe_can_create(self) {
    let state = self.state();
    return state.Recipe == "loading" ? false : state.Recipe.CanCreate;
}
exports.Dinner_Meal_Recipe_can_create = Dinner_Meal_Recipe_can_create;
function Dinner_Categorie_Meal_can_delete(self) {
    let state = self.state();
    return state.Categorie == "loading" ? false : state.Categorie.CanDelete;
}
exports.Dinner_Categorie_Meal_can_delete = Dinner_Categorie_Meal_can_delete;
function Dinner_Meal_Recipe_can_delete(self) {
    let state = self.state();
    return state.Recipe == "loading" ? false : state.Recipe.CanDelete;
}
exports.Dinner_Meal_Recipe_can_delete = Dinner_Meal_Recipe_can_delete;
function Dinner_Categorie_Meal_page_index(self) {
    let state = self.state();
    return state.Categorie == "loading" ? 0 : state.Categorie.PageIndex;
}
exports.Dinner_Categorie_Meal_page_index = Dinner_Categorie_Meal_page_index;
function Dinner_Meal_Recipe_page_index(self) {
    let state = self.state();
    return state.Recipe == "loading" ? 0 : state.Recipe.PageIndex;
}
exports.Dinner_Meal_Recipe_page_index = Dinner_Meal_Recipe_page_index;
function Dinner_Categorie_Meal_page_size(self) {
    let state = self.state();
    return state.Categorie == "loading" ? 25 : state.Categorie.PageSize;
}
exports.Dinner_Categorie_Meal_page_size = Dinner_Categorie_Meal_page_size;
function Dinner_Meal_Recipe_page_size(self) {
    let state = self.state();
    return state.Recipe == "loading" ? 25 : state.Recipe.PageSize;
}
exports.Dinner_Meal_Recipe_page_size = Dinner_Meal_Recipe_page_size;
function Dinner_Categorie_Meal_search_query(self) {
    let state = self.state();
    return state.Categorie == "loading" ? null : state.Categorie.SearchQuery;
}
exports.Dinner_Categorie_Meal_search_query = Dinner_Categorie_Meal_search_query;
function Dinner_Meal_Recipe_search_query(self) {
    let state = self.state();
    return state.Recipe == "loading" ? null : state.Recipe.SearchQuery;
}
exports.Dinner_Meal_Recipe_search_query = Dinner_Meal_Recipe_search_query;
function Dinner_Categorie_Meal_num_pages(self) {
    let state = self.state();
    return state.Categorie == "loading" ? 1 : state.Categorie.NumPages;
}
exports.Dinner_Categorie_Meal_num_pages = Dinner_Categorie_Meal_num_pages;
function Dinner_Meal_Recipe_num_pages(self) {
    let state = self.state();
    return state.Recipe == "loading" ? 1 : state.Recipe.NumPages;
}
exports.Dinner_Meal_Recipe_num_pages = Dinner_Meal_Recipe_num_pages;
function load_relation_Dinner_Categorie_Meal(self, force_first_page, current_User, current_Admin, callback) {
    let state = self.state();
    let prelude = force_first_page && state.Categorie != "loading" ?
        (c) => state.Categorie != "loading" && self.setState(Object.assign({}, state, { Categorie: Object.assign({}, state.Categorie, { PageIndex: 0 }) }), c)
        :
            (c) => c();
    Permissions.can_view_Categorie(current_User, current_Admin) ?
        prelude(() => Api.get_Meal_Categorie_Meals(self.props.entity, Dinner_Categorie_Meal_page_index(self), Dinner_Categorie_Meal_page_size(self), Dinner_Categorie_Meal_search_query(self)).then(Categories => self.setState(Object.assign({}, self.state(), { update_count: self.state().update_count + 1, Categorie: Utils.raw_page_to_paginated_items((i, i_just_created) => {
                let state = self.state();
                return {
                    element: i,
                    size: state.Categorie != "loading" ?
                        (state.Categorie.Items.has(i.Id) ?
                            state.Categorie.Items.get(i.Id).size
                            :
                                "preview" /* i_just_created ? "large" : "preview" */)
                        :
                            "preview" /* i_just_created ? "large" : "preview" */,
                    shown_relation: "all"
                };
            }, Categories) }), callback)))
        :
            prelude(() => callback && callback());
}
exports.load_relation_Dinner_Categorie_Meal = load_relation_Dinner_Categorie_Meal;
function load_relation_Dinner_Meal_Recipe(self, force_first_page, current_User, current_Admin, callback) {
    let state = self.state();
    let prelude = force_first_page && state.Recipe != "loading" ?
        (c) => state.Recipe != "loading" && self.setState(Object.assign({}, state, { Recipe: Object.assign({}, state.Recipe, { PageIndex: 0 }) }), c)
        :
            (c) => c();
    Permissions.can_view_Recipe(current_User, current_Admin) ?
        prelude(() => Api.get_Meal_Meal_Recipes(self.props.entity, Dinner_Meal_Recipe_page_index(self), Dinner_Meal_Recipe_page_size(self), Dinner_Meal_Recipe_search_query(self)).then(Recipes => self.setState(Object.assign({}, self.state(), { update_count: self.state().update_count + 1, Recipe: Utils.raw_page_to_paginated_items((i, i_just_created) => {
                let state = self.state();
                return {
                    element: i,
                    size: state.Recipe != "loading" ?
                        (state.Recipe.Items.has(i.Id) ?
                            state.Recipe.Items.get(i.Id).size
                            :
                                "preview" /* i_just_created ? "large" : "preview" */)
                        :
                            "preview" /* i_just_created ? "large" : "preview" */,
                    shown_relation: "all"
                };
            }, Recipes) }), callback)))
        :
            prelude(() => callback && callback());
}
exports.load_relation_Dinner_Meal_Recipe = load_relation_Dinner_Meal_Recipe;
function load_relations_Dinner(self, current_User, current_Admin, callback) {
    load_relation_Dinner_Meal_Recipe(self, false, self.props.current_User, self.props.current_Admin, () => load_relation_Dinner_Categorie_Meal(self, false, self.props.current_User, self.props.current_Admin, () => callback && callback()));
}
exports.load_relations_Dinner = load_relations_Dinner;
function set_size_Dinner(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.Dinner_to_page(self.props.entity.Id));
    });
}
exports.set_size_Dinner = set_size_Dinner;
function render_Dinner_Description_editable_minimised(self) {
    if (!Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin))
        return render_Dinner_Description_minimised(self);
    else
        return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute description" },
                React.createElement("label", { className: "attribute-label attribute-label-description" }, i18next.t(`Dinner:Description`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.String(self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.Description, v => self.props.set_entity(Object.assign({}, self.props.entity, { Description: v })))));
}
exports.render_Dinner_Description_editable_minimised = render_Dinner_Description_editable_minimised;
function render_Dinner_Description_editable_maximised(self) {
    if (!Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin))
        return render_Dinner_Description_maximised(self);
    else
        return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute description" },
                React.createElement("label", { className: "attribute-label attribute-label-description" }, i18next.t(`Dinner:Description`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.String(self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.Description, v => self.props.set_entity(Object.assign({}, self.props.entity, { Description: v })))));
}
exports.render_Dinner_Description_editable_maximised = render_Dinner_Description_editable_maximised;
function render_editable_attributes_minimised_Dinner(self) {
    let attributes = (React.createElement("div", null, render_Dinner_Description_editable_minimised(self)));
    return attributes;
}
exports.render_editable_attributes_minimised_Dinner = render_editable_attributes_minimised_Dinner;
function render_editable_attributes_maximised_Dinner(self) {
    let state = self.state();
    let attributes = (React.createElement("div", null, render_Dinner_Description_editable_maximised(self)));
    return attributes;
}
exports.render_editable_attributes_maximised_Dinner = render_editable_attributes_maximised_Dinner;
function render_breadcrumb_Dinner(self) {
    return React.createElement("div", { className: "breadcrumb-dinner" }, "Dinner");
}
exports.render_breadcrumb_Dinner = render_breadcrumb_Dinner;
function render_menu_Dinner(self) {
    let state = self.state();
    return React.createElement("div", { className: "menu" },
        React.createElement("img", { className: "logo", src: "/images/logo.png", alt: "Logo" }),
        React.createElement("div", { className: "pages" },
            !Permissions.can_view_HomePage(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_HomePages(0, 1).then(e => e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))) }, i18next.t('HomePage'))),
            !Permissions.can_view_CategoryList(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_CategoryLists(0, 1).then(e => e.Items.length > 0 && self.props.set_page(CategoryListViews.CategoryList_to_page(e.Items[0].Item.Id))) }, i18next.t('CategoryList'))),
            !Permissions.can_view_Bookmarks(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_Bookmarkss(0, 1).then(e => e.Items.length > 0 && self.props.set_page(BookmarksViews.Bookmarks_to_page(e.Items[0].Item.Id))) }, i18next.t('Bookmarks'))),
            React.createElement("div", { className: "menu_entries" },
                React.createElement("div", { className: "menu_entry menu_entry--with-sub" }))));
}
exports.render_menu_Dinner = render_menu_Dinner;
function render_local_menu_Dinner(self) {
    let state = self.state();
    return React.createElement("div", { className: "local-menu" },
        React.createElement("div", { className: "local_menu_entries" },
            React.createElement("div", { className: `local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}` },
                React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('About this Dinner'))),
            !Permissions.can_view_Recipe(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { key: "Meal_Recipe", className: `local_menu_entry${self.props.shown_relation == "Meal_Recipe" ? " local_menu_entry--active" : ""}` },
                    React.createElement("a", { onClick: () => load_relation_Dinner_Meal_Recipe(self, false, self.props.current_User, self.props.current_Admin, () => self.props.set_shown_relation("Meal_Recipe")) }, i18next.t('Meal_Recipes')))));
}
exports.render_local_menu_Dinner = render_local_menu_Dinner;
function render_controls_Dinner(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_maximisation && self.props.set_size ? React.createElement("a", { className: `"dinner button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`, onClick: () => {
                set_size_Dinner(self, self.props.size == "preview" ? "large" : "preview");
            } }) : null,
        self.props.allow_fullscreen && self.props.set_size ? React.createElement("a", { className: "dinner button button--fullscreen", onClick: () => set_size_Dinner(self, self.props.size == "fullscreen" ? "large" : "fullscreen") }) : null,
        Permissions.can_delete_Dinner(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? React.createElement("a", { className: "button button--delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_Dinner(self.props.entity).then(() => self.props.force_reload(() => self.props.pop())) }) : null,
        self.props.size == "fullscreen" && self.props.pages_count > 0 ? React.createElement("a", { className: "dinner button button--close", onClick: () => self.props.pop() }) : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--unlink", onClick: () => self.props.unlink() })
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--delete", onClick: () => self.props.delete() })
            :
                null);
}
exports.render_controls_Dinner = render_controls_Dinner;
function render_content_Dinner(self) {
    let actions = [
        self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
            () => set_size_Dinner(self, self.props.size == "preview" ? "large" : "preview")
            :
                null, self.props.allow_fullscreen && self.props.set_size && self.props.size == "preview" ?
            () => set_size_Dinner(self, self.props.size == "fullscreen" ? "large" : "fullscreen")
            :
                null,
    ].filter(a => a != null);
    let content = Permissions.can_view_Dinner(self.props.current_User, self.props.current_Admin) ?
        self.props.size == "preview" ?
            render_preview_Dinner(self)
            : self.props.size == "large" ?
                render_large_Dinner(self)
                : self.props.size == "fullscreen" ?
                    render_large_Dinner(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.";
    if (self.props.mode == "view" && actions.length == 1 && !false)
        return React.createElement("a", { onClick: () => actions[0]() },
            React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content));
    else
        return React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content);
}
exports.render_content_Dinner = render_content_Dinner;
function render_Dinner_Description_minimised(self) {
    return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute description" },
        React.createElement("label", { className: "attribute-label attribute-label-description" }, i18next.t(`Dinner:Description`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.String(self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.Description, v => self.props.set_entity(Object.assign({}, self.props.entity, { Description: v })))));
}
exports.render_Dinner_Description_minimised = render_Dinner_Description_minimised;
function render_Dinner_Description_maximised(self) {
    return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute description" },
        React.createElement("label", { className: "attribute-label attribute-label-description" }, i18next.t(`Dinner:Description`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.String(self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.Description, v => self.props.set_entity(Object.assign({}, self.props.entity, { Description: v })))));
}
exports.render_Dinner_Description_maximised = render_Dinner_Description_maximised;
function render_preview_Dinner(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Dinner_Description_minimised(self)));
    else
        attributes = render_editable_attributes_minimised_Dinner(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_Dinner = render_preview_Dinner;
function render_large_Dinner(self) {
    let state = self.state();
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Dinner_Description_maximised(self)));
    else
        attributes = render_editable_attributes_maximised_Dinner(self);
    return (React.createElement("div", { className: "block" },
        self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes,
        render_relations_Dinner(self)));
}
exports.render_large_Dinner = render_large_Dinner;
function render_Dinner_Categorie_Meal(self, context) {
    if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Categorie_Meal") || !Permissions.can_view_Categorie(self.props.current_User, self.props.current_Admin))
        return null;
    let state = self.state();
    return React.createElement("div", null, List.render_relation("dinner_categorie_meal", "Meal", "Categorie", "Categories", self.props.nesting_depth > 0, false, false, false)(state.Categorie != "loading" ?
        state.Categorie.IdsInServerOrder.map(id => state.Categorie != "loading" && state.Categorie.Items.get(id)) :
        state.Categorie, Dinner_Categorie_Meal_page_index(self), Dinner_Categorie_Meal_num_pages(self), new_page_index => {
        let state = self.state();
        state.Categorie != "loading" &&
            self.setState(Object.assign({}, self.state(), { update_count: self.state().update_count + 1, Categorie: Object.assign({}, state.Categorie, { PageIndex: new_page_index }) }), () => load_relation_Dinner_Categorie_Meal(self, false, self.props.current_User, self.props.current_Admin));
    }, (i, _) => {
        let i_id = i.element.Id;
        let state = self.state();
        return React.createElement("div", { key: i_id, className: `model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Categorie != "loading" && state.Categorie.JustCreated.has(i_id) && state.Categorie.JustCreated.get(i_id) ? "newly-created" : ""}` },
            React.createElement("div", { key: i_id }, CategorieViews.Categorie(Object.assign({}, self.props, { entity: i.element, inline: false, nesting_depth: self.props.nesting_depth + 1, size: i.size, allow_maximisation: true, allow_fullscreen: true, mode: self.props.mode == "edit" && (Permissions.can_edit_Categorie_Meal(self.props.current_User, self.props.current_Admin)
                    || Permissions.can_create_Categorie_Meal(self.props.current_User, self.props.current_Admin)
                    || Permissions.can_delete_Categorie_Meal(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view", is_editable: state.Categorie != "loading" && state.Categorie.Editable.get(i_id), shown_relation: i.shown_relation, set_shown_relation: (new_shown_relation, callback) => {
                    let state = self.state();
                    state.Categorie != "loading" &&
                        self.setState(Object.assign({}, self.state(), { Categorie: Object.assign({}, state.Categorie, { Items: state.Categorie.Items.set(i_id, Object.assign({}, state.Categorie.Items.get(i_id), { shown_relation: new_shown_relation })) }) }), callback);
                }, nested_entity_names: self.props.nested_entity_names.push("Categorie"), set_size: (new_size, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation;
                    let state = self.state();
                    state.Categorie != "loading" &&
                        self.setState(Object.assign({}, self.state(), { Categorie: Object.assign({}, state.Categorie, { Items: state.Categorie.Items.set(i_id, Object.assign({}, state.Categorie.Items.get(i_id), { size: new_size, shown_relation: new_shown_relation })) }) }), callback);
                }, toggle_button: undefined, set_mode: undefined, set_entity: (new_entity, callback, force_update_count_increment) => {
                    let state = self.state();
                    state.Categorie != "loading" &&
                        self.setState(Object.assign({}, self.state(), { dirty_Categorie: state.dirty_Categorie.set(i_id, new_entity), update_count: force_update_count_increment ? self.state().update_count + 1 : state.update_count, Categorie: Object.assign({}, state.Categorie, { Items: state.Categorie.Items.set(i_id, Object.assign({}, state.Categorie.Items.get(i_id), { element: new_entity })) }) }), callback);
                }, delete: undefined, unlink: !Permissions.can_delete_Categorie_Meal(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                        () => confirm(i18next.t('Are you sure?')) && Api.unlink_Categorie_Categorie_Meals(i.element, self.props.entity).then(() => load_relation_Dinner_Categorie_Meal(self, false, self.props.current_User, self.props.current_Admin)) }))));
    }, () => React.createElement("div", null,
        Permissions.can_create_Categorie(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Categorie_Meal(self.props.current_User, self.props.current_Admin) && Dinner_Categorie_Meal_can_create(self) ? render_new_Dinner_Categorie_Meal(self) : null,
        Permissions.can_create_Categorie_Meal(self.props.current_User, self.props.current_Admin) ? render_add_existing_Dinner_Categorie_Meal(self) : null)));
}
exports.render_Dinner_Categorie_Meal = render_Dinner_Categorie_Meal;
function render_Dinner_Meal_Recipe(self, context) {
    if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Meal_Recipe") || !Permissions.can_view_Recipe(self.props.current_User, self.props.current_Admin))
        return null;
    let state = self.state();
    return React.createElement("div", null, List.render_relation("dinner_meal_recipe", "Meal", "Recipe", "Recipes", self.props.nesting_depth > 0, false, false, false)(state.Recipe != "loading" ?
        state.Recipe.IdsInServerOrder.map(id => state.Recipe != "loading" && state.Recipe.Items.get(id)) :
        state.Recipe, Dinner_Meal_Recipe_page_index(self), Dinner_Meal_Recipe_num_pages(self), new_page_index => {
        let state = self.state();
        state.Recipe != "loading" &&
            self.setState(Object.assign({}, self.state(), { update_count: self.state().update_count + 1, Recipe: Object.assign({}, state.Recipe, { PageIndex: new_page_index }) }), () => load_relation_Dinner_Meal_Recipe(self, false, self.props.current_User, self.props.current_Admin));
    }, (i, _) => {
        let i_id = i.element.Id;
        let state = self.state();
        return React.createElement("div", { key: i_id, className: `model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Recipe != "loading" && state.Recipe.JustCreated.has(i_id) && state.Recipe.JustCreated.get(i_id) ? "newly-created" : ""}` },
            React.createElement("div", { key: i_id }, RecipeViews.Recipe(Object.assign({}, self.props, { entity: i.element, inline: false, nesting_depth: self.props.nesting_depth + 1, size: i.size, allow_maximisation: true, allow_fullscreen: true, mode: self.props.mode == "edit" && (Permissions.can_edit_Meal_Recipe(self.props.current_User, self.props.current_Admin)
                    || Permissions.can_create_Meal_Recipe(self.props.current_User, self.props.current_Admin)
                    || Permissions.can_delete_Meal_Recipe(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view", is_editable: state.Recipe != "loading" && state.Recipe.Editable.get(i_id), shown_relation: i.shown_relation, set_shown_relation: (new_shown_relation, callback) => {
                    let state = self.state();
                    state.Recipe != "loading" &&
                        self.setState(Object.assign({}, self.state(), { Recipe: Object.assign({}, state.Recipe, { Items: state.Recipe.Items.set(i_id, Object.assign({}, state.Recipe.Items.get(i_id), { shown_relation: new_shown_relation })) }) }), callback);
                }, nested_entity_names: self.props.nested_entity_names.push("Recipe"), set_size: (new_size, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation;
                    let state = self.state();
                    state.Recipe != "loading" &&
                        self.setState(Object.assign({}, self.state(), { Recipe: Object.assign({}, state.Recipe, { Items: state.Recipe.Items.set(i_id, Object.assign({}, state.Recipe.Items.get(i_id), { size: new_size, shown_relation: new_shown_relation })) }) }), callback);
                }, toggle_button: undefined, set_mode: undefined, set_entity: (new_entity, callback, force_update_count_increment) => {
                    let state = self.state();
                    state.Recipe != "loading" &&
                        self.setState(Object.assign({}, self.state(), { dirty_Recipe: state.dirty_Recipe.set(i_id, new_entity), update_count: force_update_count_increment ? self.state().update_count + 1 : state.update_count, Recipe: Object.assign({}, state.Recipe, { Items: state.Recipe.Items.set(i_id, Object.assign({}, state.Recipe.Items.get(i_id), { element: new_entity })) }) }), callback);
                }, delete: undefined, unlink: !Permissions.can_delete_Meal_Recipe(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                        () => confirm(i18next.t('Are you sure?')) && Api.unlink_Meal_Meal_Recipes(self.props.entity, i.element).then(() => load_relation_Dinner_Meal_Recipe(self, false, self.props.current_User, self.props.current_Admin)) }))));
    }, () => React.createElement("div", null,
        Permissions.can_create_Recipe(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Meal_Recipe(self.props.current_User, self.props.current_Admin) && Dinner_Meal_Recipe_can_create(self) ? render_new_Dinner_Meal_Recipe(self) : null,
        Permissions.can_create_Meal_Recipe(self.props.current_User, self.props.current_Admin) ? render_add_existing_Dinner_Meal_Recipe(self) : null)));
}
exports.render_Dinner_Meal_Recipe = render_Dinner_Meal_Recipe;
function render_relations_Dinner(self) {
    return React.createElement("div", { className: "relations" }, render_Dinner_Meal_Recipe(self, "default"));
}
exports.render_relations_Dinner = render_relations_Dinner;
function render_add_existing_Dinner_Categorie_Meal(self) {
    let state = self.state();
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" }, state.add_step_Categorie != "open" ?
            React.createElement(Buttons.Add, { disabled: state.Categorie == "loading" ? true : state.Categorie.TotalCount >= 1, onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "open" })), target_name: "Categorie" })
            :
                React.createElement(List.AddToRelation, {
                    relation_name: "dinner_categorie_meal",
                    source_name: "Meal",
                    target_name: "Categorie",
                    target_plural: "Categories",
                    page_size: 25,
                    render_target: (i, i_id) => React.createElement("div", { key: i_id, className: "group__item" },
                        React.createElement("a", { className: "group__button button button--existing", onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "saving" }), () => Api.link_Meal_Categorie_Meals(self.props.entity, i).then(() => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "closed" }), () => load_relation_Dinner_Categorie_Meal(self, false, self.props.current_User, self.props.current_Admin)))) }, "Add existing"),
                        React.createElement("div", { className: "group__title", disabled: true }, CategorieViews.Categorie(Object.assign({}, self.props, { entity: i, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "view", is_editable: false, nested_entity_names: self.props.nested_entity_names.push("Categorie"), set_size: undefined, toggle_button: undefined, set_mode: undefined, set_entity: (new_entity, callback) => { }, unlink: undefined, delete: undefined })))),
                    cancel: () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "closed" })),
                    get_items: [
                        { name: "American", get: (i, s) => __awaiter(this, void 0, void 0, function* () { return Api.get_unlinked_Meal_Categorie_Meals_American(self.props.entity, i, s); }) },
                        { name: "Asian", get: (i, s) => __awaiter(this, void 0, void 0, function* () { return Api.get_unlinked_Meal_Categorie_Meals_Asian(self.props.entity, i, s); }) },
                        { name: "Mediterranean", get: (i, s) => __awaiter(this, void 0, void 0, function* () { return Api.get_unlinked_Meal_Categorie_Meals_Mediterranean(self.props.entity, i, s); }) }
                    ]
                }))
        :
            null;
}
exports.render_add_existing_Dinner_Categorie_Meal = render_add_existing_Dinner_Categorie_Meal;
function render_add_existing_Dinner_Meal_Recipe(self) {
    let state = self.state();
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" }, state.add_step_Recipe != "open" ?
            React.createElement(Buttons.Add, { onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "open" })), target_name: "Recipe" })
            :
                React.createElement(List.AddToRelation, {
                    relation_name: "dinner_meal_recipe",
                    source_name: "Meal",
                    target_name: "Recipe",
                    target_plural: "Recipes",
                    page_size: 25,
                    render_target: (i, i_id) => React.createElement("div", { key: i_id, className: "group__item" },
                        React.createElement("a", { className: "group__button button button--existing", onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "saving" }), () => Api.link_Meal_Meal_Recipes(self.props.entity, i).then(() => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "closed" }), () => load_relation_Dinner_Meal_Recipe(self, false, self.props.current_User, self.props.current_Admin)))) }, "Add existing"),
                        React.createElement("div", { className: "group__title", disabled: true }, RecipeViews.Recipe(Object.assign({}, self.props, { entity: i, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "view", is_editable: false, nested_entity_names: self.props.nested_entity_names.push("Recipe"), set_size: undefined, toggle_button: undefined, set_mode: undefined, set_entity: (new_entity, callback) => { }, unlink: undefined, delete: undefined })))),
                    cancel: () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "closed" })),
                    get_items: [
                        { name: "Recipe", get: (i, s) => __awaiter(this, void 0, void 0, function* () { return Api.get_unlinked_Meal_Meal_Recipes(self.props.entity, i, s); }) },
                    ]
                }))
        :
            null;
}
exports.render_add_existing_Dinner_Meal_Recipe = render_add_existing_Dinner_Meal_Recipe;
function render_new_Dinner_Categorie_Meal(self) {
    let state = self.state();
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            React.createElement(Buttons.Create, { target_name: "Categorie", onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "creating" })) }),
            state.add_step_Categorie != "creating" ?
                null
                :
                    React.createElement("div", { className: "overlay__item overlay__item--new" },
                        React.createElement("div", { className: "new-american" },
                            React.createElement("button", { disabled: state.Categorie == "loading" ? true : state.Categorie.TotalCount >= 1, className: "new-american button button--new", onClick: () => Api.create_linked_Meal_Categorie_Meals_American(self.props.entity).then(e => {
                                    e.length > 0 &&
                                        Api.update_American(Object.assign({}, e[0], { Kind: "American", Description: "" })).then(() => load_relation_Dinner_Categorie_Meal(self, true, self.props.current_User, self.props.current_Admin, () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "closed" }))));
                                }) }, i18next.t('Create new American'))),
                        React.createElement("div", { className: "new-asian" },
                            React.createElement("button", { disabled: state.Categorie == "loading" ? true : state.Categorie.TotalCount >= 1, className: "new-asian button button--new", onClick: () => Api.create_linked_Meal_Categorie_Meals_Asian(self.props.entity).then(e => {
                                    e.length > 0 &&
                                        Api.update_Asian(Object.assign({}, e[0], { Kind: "Asian", Description: "" })).then(() => load_relation_Dinner_Categorie_Meal(self, true, self.props.current_User, self.props.current_Admin, () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "closed" }))));
                                }) }, i18next.t('Create new Asian'))),
                        React.createElement("div", { className: "new-mediterranean" },
                            React.createElement("button", { disabled: state.Categorie == "loading" ? true : state.Categorie.TotalCount >= 1, className: "new-mediterranean button button--new", onClick: () => Api.create_linked_Meal_Categorie_Meals_Mediterranean(self.props.entity).then(e => {
                                    e.length > 0 &&
                                        Api.update_Mediterranean(Object.assign({}, e[0], { Kind: "Mediterranean", Description: "" })).then(() => load_relation_Dinner_Categorie_Meal(self, true, self.props.current_User, self.props.current_Admin, () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "closed" }))));
                                }) }, i18next.t('Create new Mediterranean'))),
                        React.createElement(Buttons.Cancel, { onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Categorie: "closed" })) })))
        :
            null;
}
exports.render_new_Dinner_Categorie_Meal = render_new_Dinner_Categorie_Meal;
function render_new_Dinner_Meal_Recipe(self) {
    let state = self.state();
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            React.createElement("div", { className: "new-recipe" },
                React.createElement("button", { className: "new-recipe button button--new", onClick: () => Api.create_linked_Meal_Meal_Recipes_Recipe(self.props.entity).then(e => {
                        e.length > 0 &&
                            Api.update_Recipe(Object.assign({}, e[0], { Picture: "", Name: "", Ingredients: "", Description: "", PreparationTime: 0 })).then(() => load_relation_Dinner_Meal_Recipe(self, true, self.props.current_User, self.props.current_Admin, () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "closed" }))));
                    }) }, i18next.t('Create new Recipe'))))
        :
            null;
}
exports.render_new_Dinner_Meal_Recipe = render_new_Dinner_Meal_Recipe;
function render_saving_animations_Dinner(self) {
    return self.state().dirty_Categorie.count() > 0 ?
        React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" }) :
        self.state().dirty_Recipe.count() > 0 ?
            React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" })
            : React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "cornflowerblue" }, className: "saved" });
}
exports.render_saving_animations_Dinner = render_saving_animations_Dinner;
class DinnerComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, add_step_Categorie: "closed", dirty_Categorie: Immutable.Map(), Categorie: "loading", add_step_Recipe: "closed", dirty_Recipe: Immutable.Map(), Recipe: "loading" };
    }
    get_self() {
        return { state: () => this.state, props: this.props, setState: (ns, c) => this.setState(ns, c) };
    }
    componentWillReceiveProps(new_props) {
        if (new_props.size == "breadcrumb")
            return;
        let current_logged_in_entity = this.props.current_User || this.props.current_Admin || null;
        let new_logged_in_entity = new_props.current_User || new_props.current_Admin || null;
        if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
            new_props.logic_frame != this.props.logic_frame ||
            (current_logged_in_entity && !new_logged_in_entity) ||
            (!current_logged_in_entity && new_logged_in_entity) ||
            (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
            load_relations_Dinner(this.get_self(), new_props.current_User, new_props.current_Admin);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview") {
            load_relations_Dinner(this.get_self(), this.props.current_User, this.props.current_Admin);
        }
        this.thread = setInterval(() => {
            if (this.state.dirty_Categorie.count() > 0) {
                let first = this.state.dirty_Categorie.first();
                this.setState(Object.assign({}, this.state, { dirty_Categorie: this.state.dirty_Categorie.remove(first.Id) }), () => Api.update_Categorie(first));
            }
            else if (this.state.dirty_Recipe.count() > 0) {
                let first = this.state.dirty_Recipe.first();
                this.setState(Object.assign({}, this.state, { dirty_Recipe: this.state.dirty_Recipe.remove(first.Id) }), () => Api.update_Recipe(first));
            }
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        if (this.props.size == "breadcrumb") {
            return Permissions.can_view_Dinner(this.props.current_User, this.props.current_Admin) ?
                render_breadcrumb_Dinner(this.get_self())
                : null;
        }
        return React.createElement("div", { id: `Dinner_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model dinner` },
            render_saving_animations_Dinner(this.get_self()),
            this.props.nesting_depth == 0 ? render_menu_Dinner(this.get_self()) : null,
            React.createElement("div", { className: "content" },
                this.props.nesting_depth == 0 && !!this.props.toggle_button ?
                    React.createElement("div", { className: "topbar" },
                        this.props.breadcrumbs(),
                        React.createElement("div", { className: "topbar__buttons" },
                            this.props.toggle_button ? this.props.toggle_button() : null,
                            this.props.authentication_menu()))
                    :
                        null,
                this.props.nesting_depth == 0 ? render_local_menu_Dinner(this.get_self()) : null,
                render_controls_Dinner(this.get_self()),
                render_content_Dinner(this.get_self())));
    }
}
exports.DinnerComponent = DinnerComponent;
exports.Dinner = (props) => React.createElement(DinnerComponent, Object.assign({}, props));
exports.Dinner_to_page = (id) => {
    let can_edit = Utils.any_of([Permissions.can_edit_Dinner, Permissions.can_edit_Categorie_Meal, Permissions.can_edit_Meal_Recipe, Permissions.can_edit_Categorie, Permissions.can_edit_Recipe]);
    return Utils.scene_to_page(can_edit, exports.Dinner, Api.get_Dinner(id), Api.update_Dinner, "Dinner", "Dinner", `/Dinners/${id}`);
};
exports.Dinner_to = (id, target_element_id, current_User, current_Admin) => {
    Utils.render_page_manager(target_element_id, exports.Dinner_to_page(id), current_User, current_Admin);
};
//# sourceMappingURL=Dinner.js.map