"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api = require("../generated_api");
const Permissions = require("./permissions");
const Utils = require("./view_utils");
const AmericanViews = require("./American");
const AsianViews = require("./Asian");
const MediterraneanViews = require("./Mediterranean");
exports.Categorie = (props) => props.entity.Kind == "American" ?
    AmericanViews.American(Object.assign({}, props, { set_entity: (e, c) => props.set_entity(e, c), entity: props.entity }))
    : props.entity.Kind == "Asian" ?
        AsianViews.Asian(Object.assign({}, props, { set_entity: (e, c) => props.set_entity(e, c), entity: props.entity }))
        : props.entity.Kind == "Mediterranean" ?
            MediterraneanViews.Mediterranean(Object.assign({}, props, { set_entity: (e, c) => props.set_entity(e, c), entity: props.entity }))
            : null;
exports.Categorie_to_page = (id) => {
    let can_edit = Utils.any_of([Permissions.can_edit_Categorie, Permissions.can_edit_Categorie_Meal, Permissions.can_edit_Meal]);
    return Utils.scene_to_page(can_edit, exports.Categorie, Api.get_Categorie(id), Api.update_Categorie, "Categorie", "Categorie", `/Categories/${id}`);
};
exports.Categorie_to = (id, target_element_id, current_User, current_Admin) => {
    Utils.render_page_manager(target_element_id, exports.Categorie_to_page(id), current_User, current_Admin);
};
//# sourceMappingURL=Categorie.js.map