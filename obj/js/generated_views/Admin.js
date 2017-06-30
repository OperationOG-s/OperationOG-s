"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Immutable = require("immutable");
const Api = require("../generated_api");
const Components = require("../components/components");
const Permissions = require("./permissions");
const Utils = require("./view_utils");
const i18next = require("i18next");
const Moment = require("moment");
const HomePageViews = require("./HomePage");
const CategoryListViews = require("./CategoryList");
const BookmarksViews = require("./Bookmarks");
function load_relations_Admin(self, current_User, current_Admin, callback) {
    callback && callback();
}
exports.load_relations_Admin = load_relations_Admin;
function set_size_Admin(self, new_size) {
    self.props.set_size(new_size, () => {
        if (new_size == "fullscreen")
            self.props.push(exports.Admin_to_page(self.props.entity.Id));
    });
}
exports.set_size_Admin = set_size_Admin;
function render_Admin_Username_editable_minimised(self) {
    if (!Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        return render_Admin_Username_minimised(self);
    else
        return !Permissions.can_view_Admin_Username(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute username" },
                React.createElement("label", { className: "attribute-label attribute-label-username" }, i18next.t(`Admin:Username`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.String(false /* because username and email cannot be edited */, self.props.mode, () => self.props.entity.Username, v => self.props.set_entity(Object.assign({}, self.props.entity, { Username: v })))));
}
exports.render_Admin_Username_editable_minimised = render_Admin_Username_editable_minimised;
function render_Admin_Language_editable_minimised(self) {
    if (!Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        return render_Admin_Language_minimised(self);
    else
        return !Permissions.can_view_Admin_Language(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute language" },
                React.createElement("label", { className: "attribute-label attribute-label-language" }, i18next.t(`Admin:Language`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.Union(self.props.is_editable && Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Admin_Language(self.props.current_User, self.props.current_Admin), self.props.mode, Immutable.List([{ value: "en", label: "en" }]), () => self.props.entity.Language, (v) => self.props.set_entity(Object.assign({}, self.props.entity, { Language: v })))));
}
exports.render_Admin_Language_editable_minimised = render_Admin_Language_editable_minimised;
function render_Admin_Email_editable_minimised(self) {
    if (!Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        return render_Admin_Email_minimised(self);
    else
        return !Permissions.can_view_Admin_Email(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            null;
}
exports.render_Admin_Email_editable_minimised = render_Admin_Email_editable_minimised;
function render_Admin_Username_editable_maximised(self) {
    if (!Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        return render_Admin_Username_maximised(self);
    else
        return !Permissions.can_view_Admin_Username(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute username" },
                React.createElement("label", { className: "attribute-label attribute-label-username" }, i18next.t(`Admin:Username`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.String(false /* because username and email cannot be edited */, self.props.mode, () => self.props.entity.Username, v => self.props.set_entity(Object.assign({}, self.props.entity, { Username: v })))));
}
exports.render_Admin_Username_editable_maximised = render_Admin_Username_editable_maximised;
function render_Admin_Language_editable_maximised(self) {
    if (!Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        return render_Admin_Language_maximised(self);
    else
        return !Permissions.can_view_Admin_Language(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute language" },
                React.createElement("label", { className: "attribute-label attribute-label-language" }, i18next.t(`Admin:Language`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.Union(self.props.is_editable && Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Admin_Language(self.props.current_User, self.props.current_Admin), self.props.mode, Immutable.List([{ value: "en", label: "en" }]), () => self.props.entity.Language, (v) => self.props.set_entity(Object.assign({}, self.props.entity, { Language: v })))));
}
exports.render_Admin_Language_editable_maximised = render_Admin_Language_editable_maximised;
function render_Admin_Email_editable_maximised(self) {
    if (!Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        return render_Admin_Email_maximised(self);
    else
        return !Permissions.can_view_Admin_Email(self.props.current_User, self.props.current_Admin) ? React.createElement("div", null) :
            React.createElement("div", { className: "model__attribute email" },
                React.createElement("label", { className: "attribute-label attribute-label-email" }, i18next.t(`Admin:Email`, { context: self.props.inline ? "inline" : "" })),
                React.createElement("div", { className: "model__attribute-content" }, Components.Email(false, self.props.mode, () => self.props.entity.Email, v => self.props.set_entity(Object.assign({}, self.props.entity, { Email: v })))));
}
exports.render_Admin_Email_editable_maximised = render_Admin_Email_editable_maximised;
function render_editable_attributes_minimised_Admin(self) {
    let attributes = (React.createElement("div", null,
        render_Admin_Username_editable_minimised(self),
        render_Admin_Language_editable_minimised(self)));
    return attributes;
}
exports.render_editable_attributes_minimised_Admin = render_editable_attributes_minimised_Admin;
function render_editable_attributes_maximised_Admin(self) {
    let state = self.state();
    let attributes = (React.createElement("div", null,
        render_Admin_Username_editable_maximised(self),
        render_Admin_Language_editable_maximised(self),
        render_Admin_Email_editable_maximised(self),
        React.createElement("button", { onClick: () => Api.reset_Admin_password(self.props.entity.Username, self.props.entity.Email).then(() => location.reload()) }, self.props.entity.HasPassword ? i18next.t('common:Reset password') : i18next.t('common:Create password')),
        React.createElement("button", { onClick: () => Api.delete_Admin_sessions().then(() => location.reload()) }, i18next.t('common:Delete sessions')),
        state.active_sessions != "loading" ?
            React.createElement("div", { className: "active-user-sessions" },
                React.createElement("label", { className: "attribute-label attribute-label-active_sessions" }, i18next.t("Active sessions")),
                state.active_sessions.map(s => React.createElement("div", null,
                    s.Item1,
                    " - ",
                    Moment(s.Item2).format("DD/MM/YYYY"))))
            :
                React.createElement("div", { className: "loading" }, i18next.t("loading"))));
    return attributes;
}
exports.render_editable_attributes_maximised_Admin = render_editable_attributes_maximised_Admin;
function render_breadcrumb_Admin(self) {
    return React.createElement("div", { className: "breadcrumb-admin" }, "Admin");
}
exports.render_breadcrumb_Admin = render_breadcrumb_Admin;
function render_menu_Admin(self) {
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
exports.render_menu_Admin = render_menu_Admin;
function render_local_menu_Admin(self) {
    let state = self.state();
    return React.createElement("div", { className: "local-menu" },
        React.createElement("div", { className: "local_menu_entries" },
            React.createElement("div", { className: `local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}` },
                React.createElement("a", { onClick: () => self.props.set_shown_relation("none") }, i18next.t('About this Admin')))));
}
exports.render_local_menu_Admin = render_local_menu_Admin;
function render_controls_Admin(self) {
    return React.createElement("div", { className: "control" },
        self.props.allow_fullscreen && self.props.set_size ? React.createElement("a", { className: "admin button button--fullscreen", onClick: () => set_size_Admin(self, self.props.size == "fullscreen" ? "large" : "fullscreen") }) : null,
        Permissions.can_delete_Admin(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? React.createElement("a", { className: "button button--delete", onClick: () => confirm(i18next.t('Are you sure?')) &&
                Api.delete_Admin(self.props.entity).then(() => self.props.force_reload(() => self.props.pop())) }) : null,
        self.props.size == "fullscreen" && self.props.pages_count > 0 ? React.createElement("a", { className: "admin button button--close", onClick: () => self.props.pop() }) : null,
        self.props.unlink && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--unlink", onClick: () => self.props.unlink() })
            :
                null,
        self.props.delete && self.props.mode != "view" ?
            React.createElement("a", { className: "button button--delete", onClick: () => self.props.delete() })
            :
                null);
}
exports.render_controls_Admin = render_controls_Admin;
function render_content_Admin(self) {
    let actions = [
        self.props.allow_fullscreen && self.props.set_size && self.props.size == "preview" ?
            () => set_size_Admin(self, self.props.size == "fullscreen" ? "large" : "fullscreen")
            :
                null,
    ].filter(a => a != null);
    let content = Permissions.can_view_Admin(self.props.current_User, self.props.current_Admin) ?
        self.props.size == "preview" ?
            render_preview_Admin(self)
            : self.props.size == "large" ?
                render_large_Admin(self)
                : self.props.size == "fullscreen" ?
                    render_large_Admin(self)
                    : "Error: unauthorised access to entity."
        : "Error: unauthorised access to entity.";
    if (self.props.mode == "view" && actions.length == 1 && !false)
        return React.createElement("a", { onClick: () => actions[0]() },
            React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content));
    else
        return React.createElement("div", { className: `${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}` }, content);
}
exports.render_content_Admin = render_content_Admin;
function render_Admin_Username_minimised(self) {
    return !Permissions.can_view_Admin_Username(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute username" },
        React.createElement("label", { className: "attribute-label attribute-label-username" }, i18next.t(`Admin:Username`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.String(false /* because username and email cannot be edited */, self.props.mode, () => self.props.entity.Username, v => self.props.set_entity(Object.assign({}, self.props.entity, { Username: v })))));
}
exports.render_Admin_Username_minimised = render_Admin_Username_minimised;
function render_Admin_Language_minimised(self) {
    return !Permissions.can_view_Admin_Language(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute language" },
        React.createElement("label", { className: "attribute-label attribute-label-language" }, i18next.t(`Admin:Language`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.Union(self.props.is_editable && Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Admin_Language(self.props.current_User, self.props.current_Admin), self.props.mode, Immutable.List([{ value: "en", label: "en" }]), () => self.props.entity.Language, (v) => self.props.set_entity(Object.assign({}, self.props.entity, { Language: v })))));
}
exports.render_Admin_Language_minimised = render_Admin_Language_minimised;
function render_Admin_Email_minimised(self) {
    return null;
}
exports.render_Admin_Email_minimised = render_Admin_Email_minimised;
function render_Admin_Username_maximised(self) {
    return !Permissions.can_view_Admin_Username(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute username" },
        React.createElement("label", { className: "attribute-label attribute-label-username" }, i18next.t(`Admin:Username`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.String(false /* because username and email cannot be edited */, self.props.mode, () => self.props.entity.Username, v => self.props.set_entity(Object.assign({}, self.props.entity, { Username: v })))));
}
exports.render_Admin_Username_maximised = render_Admin_Username_maximised;
function render_Admin_Language_maximised(self) {
    return !Permissions.can_view_Admin_Language(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute language" },
        React.createElement("label", { className: "attribute-label attribute-label-language" }, i18next.t(`Admin:Language`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.Union(self.props.is_editable && Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Admin_Language(self.props.current_User, self.props.current_Admin), self.props.mode, Immutable.List([{ value: "en", label: "en" }]), () => self.props.entity.Language, (v) => self.props.set_entity(Object.assign({}, self.props.entity, { Language: v })))));
}
exports.render_Admin_Language_maximised = render_Admin_Language_maximised;
function render_Admin_Email_maximised(self) {
    return !Permissions.can_view_Admin_Email(self.props.current_User, self.props.current_Admin) ? null : React.createElement("div", { className: "model__attribute email" },
        React.createElement("label", { className: "attribute-label attribute-label-email" }, i18next.t(`Admin:Email`, { context: self.props.inline ? "inline" : "" })),
        React.createElement("div", { className: "model__attribute-content" }, Components.Email(false, self.props.mode, () => self.props.entity.Email, v => self.props.set_entity(Object.assign({}, self.props.entity, { Email: v })))));
}
exports.render_Admin_Email_maximised = render_Admin_Email_maximised;
function render_preview_Admin(self) {
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" },
            render_Admin_Username_minimised(self),
            render_Admin_Language_minimised(self),
            render_Admin_Email_minimised(self)));
    else
        attributes = render_editable_attributes_minimised_Admin(self);
    return (React.createElement("div", { className: "block" }, attributes));
}
exports.render_preview_Admin = render_preview_Admin;
function render_large_Admin(self) {
    let state = self.state();
    let attributes = null;
    if (self.props.mode == "view" || !Permissions.can_edit_Admin(self.props.current_User, self.props.current_Admin))
        attributes = (React.createElement("div", { className: "model__attributes" },
            render_Admin_Username_maximised(self),
            render_Admin_Language_maximised(self),
            render_Admin_Email_maximised(self),
            state.active_sessions != "loading" ?
                React.createElement("div", { className: "active-user-sessions" },
                    React.createElement("label", { className: "attribute-label attribute-label-active_sessions" }, i18next.t("Active sessions")),
                    state.active_sessions.map(s => React.createElement("div", null,
                        s.Item1,
                        " - ",
                        Moment(s.Item2).format("DD/MM/YYYY"))))
                :
                    React.createElement("div", { className: "loading" }, i18next.t("loading"))));
    else
        attributes = render_editable_attributes_maximised_Admin(self);
    return (React.createElement("div", { className: "block" },
        self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes,
        render_relations_Admin(self)));
}
exports.render_large_Admin = render_large_Admin;
function render_relations_Admin(self) {
    return React.createElement("div", { className: "relations" });
}
exports.render_relations_Admin = render_relations_Admin;
function render_saving_animations_Admin(self) {
    return;
}
exports.render_saving_animations_Admin = render_saving_animations_Admin;
class AdminComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.thread = null;
        this.state = { update_count: 0, active_sessions: "loading", };
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
            load_relations_Admin(this.get_self(), new_props.current_User, new_props.current_Admin);
        }
    }
    componentWillMount() {
        if (this.props.size == "breadcrumb")
            return;
        if (this.props.size != "preview") {
            Api.active_Admin_sessions().then(active_sessions => this.setState(Object.assign({}, this.state, { active_sessions: active_sessions })));
            load_relations_Admin(this.get_self(), this.props.current_User, this.props.current_Admin);
        }
        this.thread = setInterval(() => {
        }, 500);
    }
    componentWillUnmount() {
        clearInterval(this.thread);
    }
    render() {
        if (this.props.size == "breadcrumb") {
            return Permissions.can_view_Admin(this.props.current_User, this.props.current_Admin) ?
                render_breadcrumb_Admin(this.get_self())
                : null;
        }
        return React.createElement("div", { id: `Admin_${this.props.entity.Id.toString()}_${this.state.update_count}`, className: `model admin` },
            render_saving_animations_Admin(this.get_self()),
            this.props.nesting_depth == 0 ? render_menu_Admin(this.get_self()) : null,
            React.createElement("div", { className: "content" },
                this.props.nesting_depth == 0 && !!this.props.toggle_button ?
                    React.createElement("div", { className: "topbar" },
                        this.props.breadcrumbs(),
                        React.createElement("div", { className: "topbar__buttons" },
                            this.props.toggle_button ? this.props.toggle_button() : null,
                            this.props.authentication_menu()))
                    :
                        null,
                this.props.nesting_depth == 0 ? render_local_menu_Admin(this.get_self()) : null,
                render_controls_Admin(this.get_self()),
                render_content_Admin(this.get_self())));
    }
}
exports.AdminComponent = AdminComponent;
exports.Admin = (props) => React.createElement(AdminComponent, Object.assign({}, props));
exports.Admin_to_page = (id) => {
    let can_edit = Utils.any_of([Permissions.can_edit_Admin]);
    return Utils.scene_to_page(can_edit, exports.Admin, Api.get_Admin(id), Api.update_Admin, "Admin", "Admin", `/Admins/${id}`);
};
exports.Admin_to = (id, target_element_id, current_User, current_Admin) => {
    Utils.render_page_manager(target_element_id, exports.Admin_to_page(id), current_User, current_Admin);
};
//# sourceMappingURL=Admin.js.map