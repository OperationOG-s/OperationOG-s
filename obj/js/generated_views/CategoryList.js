"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Api = require("../generated_api");
const Permissions = require("./permissions");
const Utils = require("./view_utils");
const i18next = require("i18next");
const HomePageViews = require("./HomePage");
const BookmarksViews = require("./Bookmarks");
const CustomViews = require("../custom_views");
function load_relations_CategoryList(self, current_User, current_Admin, callback) {
    callback && callback();
}
exports.load_relations_CategoryList = load_relations_CategoryList;
function set_size_CategoryList(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.CategoryList_to_page(self.props.entity.Id));
    });
}
exports.set_size_CategoryList = set_size_CategoryList;
function render_CategoryList_CategoriesViewAtt_editable_minimised(self) {
    if (!Permissions.can_edit_CategoryList(self.props.current_User, self.props.current_Admin))
        return render_CategoryList_CategoriesViewAtt_minimised(self);
    else
        return !Permissions.can_view_CategoryList_CategoriesViewAtt(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute categoriesviewatt" },
                React.createElement("div", { className: "model__attribute-content" }, CustomViews.CategoriesView(Object.assign({}, self.props))));
}
exports.render_CategoryList_CategoriesViewAtt_editable_minimised = render_CategoryList_CategoriesViewAtt_editable_minimised;
function render_CategoryList_CategoriesViewAtt_editable_maximised(self) {
    if (!Permissions.can_edit_CategoryList(self.props.current_User, self.props.current_Admin))
        return render_CategoryList_CategoriesViewAtt_maximised(self);
    else
        return !Permissions.can_view_CategoryList_CategoriesViewAtt(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute categoriesviewatt" },
                React.createElement("div", { className: "model__attribute-content" }, CustomViews.CategoriesView(Object.assign({}, self.props))));
}
exports.render_CategoryList_CategoriesViewAtt_editable_maximised = render_CategoryList_CategoriesViewAtt_editable_maximised;
function render_editable_attributes_minimised_CategoryList(self) {
    let attributes = (React.createElement("div", null, CustomViews.CategoriesView(Object.assign({}, self.props))));
    return attributes;
}
exports.render_editable_attributes_minimised_CategoryList = render_editable_attributes_minimised_CategoryList;
function render_editable_attributes_maximised_CategoryList(self) {
    let state = self.state();
    let attributes = (React.createElement("div", null, CustomViews.CategoriesView(Object.assign({}, self.props))));
    return attributes;
}
exports.render_editable_attributes_maximised_CategoryList = render_editable_attributes_maximised_CategoryList;
function render_breadcrumb_CategoryList(self) {
    return React.createElement("div", { className: "breadcrumb-categorylist" }, "CategoryList");
}
exports.render_breadcrumb_CategoryList = render_breadcrumb_CategoryList;
function render_menu_CategoryList(self) {
    let state = self.state();
    return React.createElement("div", { className: "menu" },
        React.createElement("img", { className: "logo", src: "/images/logo.png", alt: "Logo" }),
        React.createElement("div", { className: "pages" },
            !Permissions.can_view_HomePage(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_HomePages(0, 1).then(e => e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))) }, i18next.t('HomePage'))),
            !Permissions.can_view_CategoryList(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { className: `menu_entry page_link active-page` },
                    React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('CategoryList'))),
            !Permissions.can_view_Bookmarks(self.props.current_User, self.props.current_Admin) ? null :
                React.createElement("div", { className: `menu_entry page_link` },
                    React.createElement("a", { onClick: () => Api.get_Bookmarkss(0, 1).then(e => e.Items.length > 0 && self.props.set_page(BookmarksViews.Bookmarks_to_page(e.Items[0].Item.Id))) }, i18next.t('Bookmarks'))),
            React.createElement("div", { className: "menu_entries" },
                React.createElement("div", { className: "menu_entry menu_entry--with-sub" }))));
}
exports.render_menu_CategoryList = render_menu_CategoryList;
function render_local_menu_CategoryList(self) {
    let state = self.state();
    return React.createElement("div", { className: "local-menu" },
        React.createElement("div", { className: "local_menu_entries" },
            React.createElement("div", { className: `local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}` },
                React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('About this CategoryList')))));
}
exports.render_local_menu_CategoryList = render_local_menu_CategoryList;
function render_controls_CategoryList(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_maximisation && self.props.set_size ? React.createElement("a", { className: `"categorylist button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`, onClick: () => {
                set_size_CategoryList(self, self.props.size == "preview" ? "large" : "preview");
            } }) : null,
        Permissions.can_delete_CategoryList(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? React.createElement("a", { className: "button button--delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_CategoryList(self.props.entity).then(() => self.props.force_reload(() => self.props.pop())) }) : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--unlink", onClick: () => self.props.unlink() })
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--delete", onClick: () => self.props.delete() })
            :
                null);
}
exports.render_controls_CategoryList = render_controls_CategoryList;
function render_content_CategoryList(self) {
    let actions = [
        self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
            () => set_size_CategoryList(self, self.props.size == "preview" ? "large" : "preview")
            :
                null,
    ].filter(a => a != null);
    let content = Permissions.can_view_CategoryList(self.props.current_User, self.props.current_Admin) ?
        self.props.size == "preview" ?
            render_preview_CategoryList(self)
            : self.props.size == "large" ?
                render_large_CategoryList(self)
                : self.props.size == "fullscreen" ?
                    render_large_CategoryList(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.";
    if (self.props.mode == "view" && actions.length == 1 && !false)
        return React.createElement("a", { onClick: () => actions[0]() },
            React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content));
    else
        return React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content);
}
exports.render_content_CategoryList = render_content_CategoryList;
function render_CategoryList_CategoriesViewAtt_minimised(self) {
    return !Permissions.can_view_CategoryList_CategoriesViewAtt(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute categoriesviewatt" },
        React.createElement("div", { className: "model__attribute-content" }, CustomViews.CategoriesView(Object.assign({}, self.props))));
}
exports.render_CategoryList_CategoriesViewAtt_minimised = render_CategoryList_CategoriesViewAtt_minimised;
function render_CategoryList_CategoriesViewAtt_maximised(self) {
    return !Permissions.can_view_CategoryList_CategoriesViewAtt(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute categoriesviewatt" },
        React.createElement("div", { className: "model__attribute-content" }, CustomViews.CategoriesView(Object.assign({}, self.props))));
}
exports.render_CategoryList_CategoriesViewAtt_maximised = render_CategoryList_CategoriesViewAtt_maximised;
function render_preview_CategoryList(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_CategoryList(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" }, render_CategoryList_CategoriesViewAtt_minimised(self)));
    else
        attributes = render_editable_attributes_minimised_CategoryList(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_CategoryList = render_preview_CategoryList;
function render_large_CategoryList(self) {
    let state = self.state();
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_CategoryList(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" }, render_CategoryList_CategoriesViewAtt_maximised(self)));
    else
        attributes = render_editable_attributes_maximised_CategoryList(self);
    return (React.createElement("div", { className: "block" },
        self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes,
        render_relations_CategoryList(self)));
}
exports.render_large_CategoryList = render_large_CategoryList;
function render_relations_CategoryList(self) {
    return React.createElement("div", { className: "relations" });
}
exports.render_relations_CategoryList = render_relations_CategoryList;
function render_saving_animations_CategoryList(self) {
    return;
}
exports.render_saving_animations_CategoryList = render_saving_animations_CategoryList;
class CategoryListComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, };
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
            load_relations_CategoryList(this.get_self(), new_props.current_User, new_props.current_Admin);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview") {
            load_relations_CategoryList(this.get_self(), this.props.current_User, this.props.current_Admin);
        }
        this.thread = setInterval(() => {
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        if (this.props.size == "breadcrumb") {
            return Permissions.can_view_CategoryList(this.props.current_User, this.props.current_Admin) ?
                render_breadcrumb_CategoryList(this.get_self())
                : null;
        }
        return React.createElement("div", { id: `CategoryList_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model categorylist` },
            render_saving_animations_CategoryList(this.get_self()),
            this.props.nesting_depth == 0 ? render_menu_CategoryList(this.get_self()) : null,
            React.createElement("div", { className: "content" },
                this.props.nesting_depth == 0 && !!this.props.toggle_button ?
                    React.createElement("div", { className: "topbar" },
                        this.props.breadcrumbs(),
                        React.createElement("div", { className: "topbar__buttons" },
                            this.props.toggle_button ? this.props.toggle_button() : null,
                            this.props.authentication_menu()))
                    :
                        null,
                render_controls_CategoryList(this.get_self()),
                render_content_CategoryList(this.get_self())));
    }
}
exports.CategoryListComponent = CategoryListComponent;
exports.CategoryList = (props) => React.createElement(CategoryListComponent, Object.assign({}, props));
exports.CategoryList_to_page = (id) => {
    let can_edit = Utils.any_of([Permissions.can_edit_CategoryList]);
    return Utils.scene_to_page(can_edit, exports.CategoryList, Api.get_CategoryList(id), Api.update_CategoryList, "CategoryList", "CategoryList", `/CategoryLists/${id}`);
};
exports.CategoryList_to = (id, target_element_id, current_User, current_Admin) => {
    Utils.render_page_manager(target_element_id, exports.CategoryList_to_page(id), current_User, current_Admin);
};
//# sourceMappingURL=CategoryList.js.map