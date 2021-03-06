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
const RecipeViews = require("./Recipe");
function Rating_Recipe_Rating_can_create(self) {
    let state = self.state();
    return state.Recipe == "loading" ? false : state.Recipe.CanCreate;
}
exports.Rating_Recipe_Rating_can_create = Rating_Recipe_Rating_can_create;
function Rating_Recipe_Rating_can_delete(self) {
    let state = self.state();
    return state.Recipe == "loading" ? false : state.Recipe.CanDelete;
}
exports.Rating_Recipe_Rating_can_delete = Rating_Recipe_Rating_can_delete;
function Rating_Recipe_Rating_page_index(self) {
    let state = self.state();
    return state.Recipe == "loading" ? 0 : state.Recipe.PageIndex;
}
exports.Rating_Recipe_Rating_page_index = Rating_Recipe_Rating_page_index;
function Rating_Recipe_Rating_page_size(self) {
    let state = self.state();
    return state.Recipe == "loading" ? 25 : state.Recipe.PageSize;
}
exports.Rating_Recipe_Rating_page_size = Rating_Recipe_Rating_page_size;
function Rating_Recipe_Rating_search_query(self) {
    let state = self.state();
    return state.Recipe == "loading" ? null : state.Recipe.SearchQuery;
}
exports.Rating_Recipe_Rating_search_query = Rating_Recipe_Rating_search_query;
function Rating_Recipe_Rating_num_pages(self) {
    let state = self.state();
    return state.Recipe == "loading" ? 1 : state.Recipe.NumPages;
}
exports.Rating_Recipe_Rating_num_pages = Rating_Recipe_Rating_num_pages;
function load_relation_Rating_Recipe_Rating(self, force_first_page, current_User, current_Admin, callback) {
    let state = self.state();
    let prelude = force_first_page && state.Recipe != "loading" ?
        (c) => state.Recipe != "loading" && self.setState(Object.assign({}, state, { Recipe: Object.assign({}, state.Recipe, { PageIndex: 0 }) }), c)
        :
            (c) => c();
    Permissions.can_view_Recipe(current_User, current_Admin) ?
        prelude(() => Api.get_Rating_Recipe_Ratings(self.props.entity, Rating_Recipe_Rating_page_index(self), Rating_Recipe_Rating_page_size(self), Rating_Recipe_Rating_search_query(self)).then(Recipes => self.setState(Object.assign({}, self.state(), { update_count: self.state().update_count + 1, Recipe: Utils.raw_page_to_paginated_items((i, i_just_created) => {
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
exports.load_relation_Rating_Recipe_Rating = load_relation_Rating_Recipe_Rating;
function load_relations_Rating(self, current_User, current_Admin, callback) {
    load_relation_Rating_Recipe_Rating(self, false, self.props.current_User, self.props.current_Admin, () => callback && callback());
}
exports.load_relations_Rating = load_relations_Rating;
function set_size_Rating(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.Rating_to_page(self.props.entity.Id));
    });
}
exports.set_size_Rating = set_size_Rating;
function render_Rating_rating_editable_minimised(self) {
    if (!Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin))
        return render_Rating_rating_minimised(self);
    else
        return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute rating" },
                React.createElement("label", { className: "attribute-label attribute-label-rating" }, i18next.t(`Rating:rating`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.Number(self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.rating, v => self.props.set_entity(Object.assign({}, self.props.entity, { rating: v })))));
}
exports.render_Rating_rating_editable_minimised = render_Rating_rating_editable_minimised;
function render_Rating_rating_editable_maximised(self) {
    if (!Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin))
        return render_Rating_rating_maximised(self);
    else
        return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute rating" },
                React.createElement("label", { className: "attribute-label attribute-label-rating" }, i18next.t(`Rating:rating`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.Number(self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.rating, v => self.props.set_entity(Object.assign({}, self.props.entity, { rating: v })))));
}
exports.render_Rating_rating_editable_maximised = render_Rating_rating_editable_maximised;
function render_editable_attributes_minimised_Rating(self) {
    let attributes = (React.createElement("div", null, render_Rating_rating_editable_minimised(self)));
    return attributes;
}
exports.render_editable_attributes_minimised_Rating = render_editable_attributes_minimised_Rating;
function render_editable_attributes_maximised_Rating(self) {
    let state = self.state();
    let attributes = (React.createElement("div", null, render_Rating_rating_editable_maximised(self)));
    return attributes;
}
exports.render_editable_attributes_maximised_Rating = render_editable_attributes_maximised_Rating;
function render_breadcrumb_Rating(self) {
    return React.createElement("div", { className: "breadcrumb-rating" }, "Rating");
}
exports.render_breadcrumb_Rating = render_breadcrumb_Rating;
function render_menu_Rating(self) {
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
exports.render_menu_Rating = render_menu_Rating;
function render_local_menu_Rating(self) {
    let state = self.state();
    return React.createElement("div", { className: "local-menu" },
        React.createElement("div", { className: "local_menu_entries" },
            React.createElement("div", { className: `local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}` },
                React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('About this Rating')))));
}
exports.render_local_menu_Rating = render_local_menu_Rating;
function render_controls_Rating(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_maximisation && self.props.set_size ? React.createElement("a", { className: `"rating button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`, onClick: () => {
                set_size_Rating(self, self.props.size == "preview" ? "large" : "preview");
            } }) : null,
        self.props.allow_fullscreen && self.props.set_size ? React.createElement("a", { className: "rating button button--fullscreen", onClick: () => set_size_Rating(self, self.props.size == "fullscreen" ? "large" : "fullscreen") }) : null,
        Permissions.can_delete_Rating(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? React.createElement("a", { className: "button button--delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_Rating(self.props.entity).then(() => self.props.force_reload(() => self.props.pop())) }) : null,
        self.props.size == "fullscreen" && self.props.pages_count > 0 ? React.createElement("a", { className: "rating button button--close", onClick: () => self.props.pop() }) : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--unlink", onClick: () => self.props.unlink() })
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--delete", onClick: () => self.props.delete() })
            :
                null);
}
exports.render_controls_Rating = render_controls_Rating;
function render_content_Rating(self) {
    let actions = [
        self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
            () => set_size_Rating(self, self.props.size == "preview" ? "large" : "preview")
            :
                null, self.props.allow_fullscreen && self.props.set_size && self.props.size == "preview" ?
            () => set_size_Rating(self, self.props.size == "fullscreen" ? "large" : "fullscreen")
            :
                null,
    ].filter(a => a != null);
    let content = Permissions.can_view_Rating(self.props.current_User, self.props.current_Admin) ?
        self.props.size == "preview" ?
            render_preview_Rating(self)
            : self.props.size == "large" ?
                render_large_Rating(self)
                : self.props.size == "fullscreen" ?
                    render_large_Rating(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.";
    if (self.props.mode == "view" && actions.length == 1 && !false)
        return React.createElement("a", { onClick: () => actions[0]() },
            React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content));
    else
        return React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content);
}
exports.render_content_Rating = render_content_Rating;
function render_Rating_rating_minimised(self) {
    return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute rating" },
        React.createElement("label", { className: "attribute-label attribute-label-rating" }, i18next.t(`Rating:rating`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.Number(self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.rating, v => self.props.set_entity(Object.assign({}, self.props.entity, { rating: v })))));
}
exports.render_Rating_rating_minimised = render_Rating_rating_minimised;
function render_Rating_rating_maximised(self) {
    return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute rating" },
        React.createElement("label", { className: "attribute-label attribute-label-rating" }, i18next.t(`Rating:rating`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.Number(self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin), self.props.mode, () => self.props.entity.rating, v => self.props.set_entity(Object.assign({}, self.props.entity, { rating: v })))));
}
exports.render_Rating_rating_maximised = render_Rating_rating_maximised;
function render_preview_Rating(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Rating_rating_minimised(self)));
    else
        attributes = render_editable_attributes_minimised_Rating(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_Rating = render_preview_Rating;
function render_large_Rating(self) {
    let state = self.state();
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" }, render_Rating_rating_maximised(self)));
    else
        attributes = render_editable_attributes_maximised_Rating(self);
    return (React.createElement("div", { className: "block" },
        self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes,
        render_relations_Rating(self)));
}
exports.render_large_Rating = render_large_Rating;
function render_Rating_Recipe_Rating(self, context) {
    if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Recipe_Rating") || !Permissions.can_view_Recipe(self.props.current_User, self.props.current_Admin))
        return null;
    let state = self.state();
    return React.createElement("div", null, List.render_relation("rating_recipe_rating", "Rating", "Recipe", "Recipes", self.props.nesting_depth > 0, false, false, false)(state.Recipe != "loading" ?
        state.Recipe.IdsInServerOrder.map(id => state.Recipe != "loading" && state.Recipe.Items.get(id)) :
        state.Recipe, Rating_Recipe_Rating_page_index(self), Rating_Recipe_Rating_num_pages(self), new_page_index => {
        let state = self.state();
        state.Recipe != "loading" &&
            self.setState(Object.assign({}, self.state(), { update_count: self.state().update_count + 1, Recipe: Object.assign({}, state.Recipe, { PageIndex: new_page_index }) }), () => load_relation_Rating_Recipe_Rating(self, false, self.props.current_User, self.props.current_Admin));
    }, (i, _) => {
        let i_id = i.element.Id;
        let state = self.state();
        return React.createElement("div", { key: i_id, className: `model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Recipe != "loading" && state.Recipe.JustCreated.has(i_id) && state.Recipe.JustCreated.get(i_id) ? "newly-created" : ""}` },
            React.createElement("div", { key: i_id }, RecipeViews.Recipe(Object.assign({}, self.props, { entity: i.element, inline: false, nesting_depth: self.props.nesting_depth + 1, size: i.size, allow_maximisation: true, allow_fullscreen: true, mode: self.props.mode == "edit" && (Permissions.can_edit_Recipe_Rating(self.props.current_User, self.props.current_Admin)
                    || Permissions.can_create_Recipe_Rating(self.props.current_User, self.props.current_Admin)
                    || Permissions.can_delete_Recipe_Rating(self.props.current_User, self.props.current_Admin)) ?
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
                }, delete: undefined, unlink: !Permissions.can_delete_Recipe_Rating(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                        () => confirm(i18next.t('Are you sure?')) && Api.unlink_Recipe_Recipe_Ratings(i.element, self.props.entity).then(() => load_relation_Rating_Recipe_Rating(self, false, self.props.current_User, self.props.current_Admin)) }))));
    }, () => React.createElement("div", null,
        Permissions.can_create_Recipe(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Recipe_Rating(self.props.current_User, self.props.current_Admin) && Rating_Recipe_Rating_can_create(self) ? render_new_Rating_Recipe_Rating(self) : null,
        Permissions.can_create_Recipe_Rating(self.props.current_User, self.props.current_Admin) ? render_add_existing_Rating_Recipe_Rating(self) : null)));
}
exports.render_Rating_Recipe_Rating = render_Rating_Recipe_Rating;
function render_relations_Rating(self) {
    return React.createElement("div", { className: "relations" });
}
exports.render_relations_Rating = render_relations_Rating;
function render_add_existing_Rating_Recipe_Rating(self) {
    let state = self.state();
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" }, state.add_step_Recipe != "open" ?
            React.createElement(Buttons.Add, { disabled: state.Recipe == "loading" ? true : state.Recipe.TotalCount >= 1, onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "open" })), target_name: "Recipe" })
            :
                React.createElement(List.AddToRelation, {
                    relation_name: "rating_recipe_rating",
                    source_name: "Rating",
                    target_name: "Recipe",
                    target_plural: "Recipes",
                    page_size: 25,
                    render_target: (i, i_id) => React.createElement("div", { key: i_id, className: "group__item" },
                        React.createElement("a", { className: "group__button button button--existing", onClick: () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "saving" }), () => Api.link_Rating_Recipe_Ratings(self.props.entity, i).then(() => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "closed" }), () => load_relation_Rating_Recipe_Rating(self, false, self.props.current_User, self.props.current_Admin)))) }, "Add existing"),
                        React.createElement("div", { className: "group__title", disabled: true }, RecipeViews.Recipe(Object.assign({}, self.props, { entity: i, nesting_depth: self.props.nesting_depth + 1, size: "preview", mode: "view", is_editable: false, nested_entity_names: self.props.nested_entity_names.push("Recipe"), set_size: undefined, toggle_button: undefined, set_mode: undefined, set_entity: (new_entity, callback) => { }, unlink: undefined, delete: undefined })))),
                    cancel: () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "closed" })),
                    get_items: [
                        { name: "Recipe", get: (i, s) => __awaiter(this, void 0, void 0, function* () { return Api.get_unlinked_Rating_Recipe_Ratings(self.props.entity, i, s); }) },
                    ]
                }))
        :
            null;
}
exports.render_add_existing_Rating_Recipe_Rating = render_add_existing_Rating_Recipe_Rating;
function render_new_Rating_Recipe_Rating(self) {
    let state = self.state();
    return self.props.mode == "edit" ?
        React.createElement("div", { className: "button__actions" },
            React.createElement("div", { className: "new-recipe" },
                React.createElement("button", { disabled: state.Recipe == "loading" ? true : state.Recipe.TotalCount >= 1, className: "new-recipe button button--new", onClick: () => Api.create_linked_Rating_Recipe_Ratings_Recipe(self.props.entity).then(e => {
                        e.length > 0 &&
                            Api.update_Recipe(Object.assign({}, e[0], { Picture: "", Name: "", Ingredients: "", Description: "", PreparationTime: 0 })).then(() => load_relation_Rating_Recipe_Rating(self, true, self.props.current_User, self.props.current_Admin, () => self.setState(Object.assign({}, self.state(), { add_step_Recipe: "closed" }))));
                    }) }, i18next.t('Create new Recipe'))))
        :
            null;
}
exports.render_new_Rating_Recipe_Rating = render_new_Rating_Recipe_Rating;
function render_saving_animations_Rating(self) {
    return self.state().dirty_Recipe.count() > 0 ?
        React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "red" }, className: "saving" })
        : React.createElement("div", { style: { position: "fixed", zIndex: 10000, top: 0, left: 0, width: "20px", height: "20px", backgroundColor: "cornflowerblue" }, className: "saved" });
}
exports.render_saving_animations_Rating = render_saving_animations_Rating;
class RatingComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, add_step_Recipe: "closed", dirty_Recipe: Immutable.Map(), Recipe: "loading" };
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
            load_relations_Rating(this.get_self(), new_props.current_User, new_props.current_Admin);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview") {
            load_relations_Rating(this.get_self(), this.props.current_User, this.props.current_Admin);
        }
        this.thread = setInterval(() => {
            if (this.state.dirty_Recipe.count() > 0) {
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
            return Permissions.can_view_Rating(this.props.current_User, this.props.current_Admin) ?
                render_breadcrumb_Rating(this.get_self())
                : null;
        }
        return React.createElement("div", { id: `Rating_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model rating` },
            render_saving_animations_Rating(this.get_self()),
            this.props.nesting_depth == 0 ? render_menu_Rating(this.get_self()) : null,
            React.createElement("div", { className: "content" },
                this.props.nesting_depth == 0 && !!this.props.toggle_button ?
                    React.createElement("div", { className: "topbar" },
                        this.props.breadcrumbs(),
                        React.createElement("div", { className: "topbar__buttons" },
                            this.props.toggle_button ? this.props.toggle_button() : null,
                            this.props.authentication_menu()))
                    :
                        null,
                this.props.nesting_depth == 0 ? render_local_menu_Rating(this.get_self()) : null,
                render_controls_Rating(this.get_self()),
                render_content_Rating(this.get_self())));
    }
}
exports.RatingComponent = RatingComponent;
exports.Rating = (props) => React.createElement(RatingComponent, Object.assign({}, props));
exports.Rating_to_page = (id) => {
    let can_edit = Utils.any_of([Permissions.can_edit_Rating, Permissions.can_edit_Recipe_Rating, Permissions.can_edit_Recipe]);
    return Utils.scene_to_page(can_edit, exports.Rating, Api.get_Rating(id), Api.update_Rating, "Rating", "Rating", `/Ratings/${id}`);
};
exports.Rating_to = (id, target_element_id, current_User, current_Admin) => {
    Utils.render_page_manager(target_element_id, exports.Rating_to_page(id), current_User, current_Admin);
};
//# sourceMappingURL=Rating.js.map