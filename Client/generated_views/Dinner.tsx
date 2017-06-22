import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../containers/list'
import * as Components from '../components/components'
import * as Buttons from '../containers/button_utils'
import * as ToggleContainer from '../containers/toggle_container'
import * as Permissions from './permissions'
import * as Utils from './view_utils'
import * as Draft from 'draft-js'
import * as i18next from 'i18next'
import * as Moment from 'moment'
import * as HomePageViews from './HomePage'
import * as CategoriesViews from './Categories'
import * as RecipesViews from './Recipes'


export function Dinner_Categories_Meal_can_create(self:DinnerContext) {
  let state = self.state()
  return state.Categories == "loading" ? false : state.Categories.CanCreate
}
export function Dinner_Dinner_Recipes_can_create(self:DinnerContext) {
  let state = self.state()
  return state.Recipes == "loading" ? false : state.Recipes.CanCreate
}
export function Dinner_Categories_Meal_can_delete(self:DinnerContext) {
  let state = self.state()
  return state.Categories == "loading" ? false : state.Categories.CanDelete
}
export function Dinner_Dinner_Recipes_can_delete(self:DinnerContext) {
  let state = self.state()
  return state.Recipes == "loading" ? false : state.Recipes.CanDelete
}
export function Dinner_Categories_Meal_page_index(self:DinnerContext) {
  let state = self.state()
  return state.Categories == "loading" ? 0 : state.Categories.PageIndex
}
export function Dinner_Dinner_Recipes_page_index(self:DinnerContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 0 : state.Recipes.PageIndex
}
export function Dinner_Categories_Meal_page_size(self:DinnerContext) {
  let state = self.state()
  return state.Categories == "loading" ? 25 : state.Categories.PageSize
}
export function Dinner_Dinner_Recipes_page_size(self:DinnerContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 25 : state.Recipes.PageSize
}
export function Dinner_Categories_Meal_num_pages(self:DinnerContext) {
  let state = self.state()
  return state.Categories == "loading" ? 1 : state.Categories.NumPages
}
export function Dinner_Dinner_Recipes_num_pages(self:DinnerContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 1 : state.Recipes.NumPages
}

export function load_relation_Dinner_Categories_Meal(self:DinnerContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_Categories(current_User, current_Admin) ?
    Api.get_Meal_Categories_Meals(self.props.entity, Dinner_Categories_Meal_page_index(self), Dinner_Categories_Meal_page_size(self)).then(Categoriess =>
      self.setState({...self.state(), update_count:self.state().update_count+1,
          Categories:Utils.raw_page_to_paginated_items<Models.Categories, Utils.EntityAndSize<Models.Categories> & { shown_relation:string }>(i => {
            let state = self.state()
            return {
              element:i,
              size: state.Categories != "loading" && state.Categories.Items.has(i.Id) ? state.Categories.Items.get(i.Id).size : "preview",
              shown_relation:"all"}}, Categoriess)
          }, callback))
  :
    callback && callback()
}

export function load_relation_Dinner_Dinner_Recipes(self:DinnerContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_Recipes(current_User, current_Admin) ?
    Api.get_Dinner_Dinner_Recipess(self.props.entity, Dinner_Dinner_Recipes_page_index(self), Dinner_Dinner_Recipes_page_size(self)).then(Recipess =>
      self.setState({...self.state(), update_count:self.state().update_count+1,
          Recipes:Utils.raw_page_to_paginated_items<Models.Recipes, Utils.EntityAndSize<Models.Recipes> & { shown_relation:string }>(i => {
            let state = self.state()
            return {
              element:i,
              size: state.Recipes != "loading" && state.Recipes.Items.has(i.Id) ? state.Recipes.Items.get(i.Id).size : "preview",
              shown_relation:"all"}}, Recipess)
          }, callback))
  :
    callback && callback()
}

export function load_relations_Dinner(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  load_relation_Dinner_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin, 
        () => callback && callback()))
}

export function set_size_Dinner(self:DinnerContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Dinner_to_page(self.props.entity.Id))
  })
}

export function render_Dinner_Description_editable_minimised(self:DinnerContext) : JSX.Element {
  if (!Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin)) return render_Dinner_Description_minimised(self)
  else
    return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Dinner:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}


export function render_Dinner_Description_editable_maximised(self:DinnerContext) : JSX.Element {
  if (!Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin)) return render_Dinner_Description_maximised(self)
  else
    return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Dinner:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_Dinner(self:DinnerContext) {
  let attributes = (<div>
      {render_Dinner_Description_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Dinner(self:DinnerContext) {
    let attributes = (<div>
        {render_Dinner_Description_editable_maximised(self)}
      </div>)
    return attributes
  }

export function render_breadcrumb_Dinner(self:DinnerContext) {
  return <div className="breadcrumb-dinner">Dinner</div>
}

export function render_menu_Dinner(self:DinnerContext) {
  let state = self.state()
  return <div className="menu">
        <img className="logo" src={"/images/logo.png"} alt="Logo"/>
        <div className="pages">
          {!Permissions.can_view_HomePage(self.props.current_User, self.props.current_Admin) ? null :
              <div className={`menu_entry page_link`}>
                <a onClick={() => 
                  Api.get_HomePages(0, 1).then(e =>
                    e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))
                  )
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
          <div className="menu_entries">
          
            {!Permissions.can_view_Categories(self.props.current_User, self.props.current_Admin) ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Categories" ? " active" : ""}`}>
                    <a onClick={() =>
                        {
                            Api.get_HomePages(0, 1).then(e =>
                              e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id),
                                () => self.props.set_shown_relation("HomePage_Categories"))
                            )
                        }
                      }>
                      {i18next.t('HomePage_Categoriess')}
                    </a>
                  </div>
                }
                <div className="menu_entry menu_entry--with-sub">
                
                </div>  
          </div>
        </div>
      </div>
}

export function render_local_menu_Dinner(self:DinnerContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this Dinner')}
              </a>
            </div>
          
            {!Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin) ? null :
                  <div key={"Dinner_Recipes"} className={`local_menu_entry${self.props.shown_relation == "Dinner_Recipes" ? " local_menu_entry--active" : ""}`}>
                    <a onClick={() =>
                      load_relation_Dinner_Dinner_Recipes(self,
                        self.props.current_User, self.props.current_Admin, 
                        () => self.props.set_shown_relation("Dinner_Recipes"))
                    }>
                      {i18next.t('Dinner_Recipess')}
                    </a>
                  </div>
                }  
          </div>
        </div>
}

export function render_controls_Dinner(self:DinnerContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"dinner button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_Dinner(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {self.props.allow_fullscreen && self.props.set_size ? <a className="dinner button button--fullscreen"
        onClick={() => set_size_Dinner(self, self.props.size == "fullscreen" ? "large" : "fullscreen")}>
      </a> : null}
    {Permissions.can_delete_Dinner(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_Dinner(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="dinner button button--close"
        onClick={() => self.props.pop()}>
    </a> : null}
    {self.props.unlink && self.props.mode != "view" ?
      <a className="button button--unlink"
          onClick={() => self.props.unlink()}>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ?
      <a className="button button--delete"
          onClick={() => self.props.delete()}>
      </a>
      :
      null
    }
  </div>
}

export function render_content_Dinner(self:DinnerContext) {
  return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
    {Permissions.can_view_Dinner(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_Dinner(self)
      : self.props.size == "large" ?
        render_large_Dinner(self)
      : self.props.size == "fullscreen" ?
        render_large_Dinner(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }
  </div>
}

export function render_Dinner_Description_minimised(self:DinnerContext) : JSX.Element {
      return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Dinner:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
      
}

export function render_Dinner_Description_maximised(self:DinnerContext) : JSX.Element {
        return !Permissions.can_view_Dinner_Description(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Dinner:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Dinner_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}

export function render_preview_Dinner(self:DinnerContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Dinner_Description_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Dinner(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Dinner(self:DinnerContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Dinner(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Dinner_Description_maximised(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Dinner(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_Dinner(self)}
    </div>)
}


export function render_Dinner_Categories_Meal(self:DinnerContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Categories_Meal") || !Permissions.can_view_Categories(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("dinner_categories_meal",
   "Meal",
   "Categories",
   "Categoriess",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Categories != "loading" ? state.Categories.Items : state.Categories,
      Dinner_Categories_Meal_page_index(self),
      Dinner_Categories_Meal_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Categories != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Categories: {
              ...state.Categories,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin))
        },
      (i,i_id) => {
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""} ` }
          
            >
            <div key={i_id}>
              {
                CategoriesViews.Categories({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Categories_Meal(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_Categories_Meal(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_Categories_Meal(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Categories != "loading" && state.Categories.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Categories != "loading" &&
                    self.setState({...self.state(),
                      Categories:
                        {
                          ...state.Categories,
                          Items:state.Categories.Items.set(i_id,{...state.Categories.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Categories"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Categories != "loading" &&
                    self.setState({...self.state(),
                      Categories:
                        {
                          ...state.Categories,
                          Items:state.Categories.Items.set(i_id,
                            {...state.Categories.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Categories, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Categories != "loading" &&
                    self.setState({...self.state(),
                      dirty_Categories:state.dirty_Categories.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Categories:
                        {
                          ...state.Categories,
                          Items:state.Categories.Items.set(i_id,{...state.Categories.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Categories_Meal(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Categories_Categories_Meals(i.element, self.props.entity).then(() =>
                      load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Categories(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Categories_Meal(self.props.current_User, self.props.current_Admin) && Dinner_Categories_Meal_can_create(self) ? render_new_Dinner_Categories_Meal(self) : null}
          {Permissions.can_create_Categories_Meal(self.props.current_User, self.props.current_Admin) ? render_add_existing_Dinner_Categories_Meal(self) : null}
        </div>)
    }
    
    </div>
}


export function render_Dinner_Dinner_Recipes(self:DinnerContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Dinner_Recipes") || !Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("dinner_dinner_recipes",
   "Dinner",
   "Recipes",
   "Recipess",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Recipes != "loading" ? state.Recipes.Items : state.Recipes,
      Dinner_Dinner_Recipes_page_index(self),
      Dinner_Dinner_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Recipes != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Recipes: {
              ...state.Recipes,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Dinner_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin))
        },
      (i,i_id) => {
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""} ` }
          
            >
            <div key={i_id}>
              {
                RecipesViews.Recipes({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Dinner_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_Dinner_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_Dinner_Recipes(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Recipes != "loading" && state.Recipes.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Recipes != "loading" &&
                    self.setState({...self.state(),
                      Recipes:
                        {
                          ...state.Recipes,
                          Items:state.Recipes.Items.set(i_id,{...state.Recipes.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Recipes"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Recipes != "loading" &&
                    self.setState({...self.state(),
                      Recipes:
                        {
                          ...state.Recipes,
                          Items:state.Recipes.Items.set(i_id,
                            {...state.Recipes.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Recipes, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Recipes != "loading" &&
                    self.setState({...self.state(),
                      dirty_Recipes:state.dirty_Recipes.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Recipes:
                        {
                          ...state.Recipes,
                          Items:state.Recipes.Items.set(i_id,{...state.Recipes.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Dinner_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Dinner_Dinner_Recipess(self.props.entity, i.element).then(() =>
                      load_relation_Dinner_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Dinner_Recipes(self.props.current_User, self.props.current_Admin) && Dinner_Dinner_Recipes_can_create(self) ? render_new_Dinner_Dinner_Recipes(self) : null}
          {Permissions.can_create_Dinner_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_Dinner_Dinner_Recipes(self) : null}
        </div>)
    }
    
    </div>
}



export function render_relations_Dinner(self:DinnerContext) {
  return <div className="relations">
      { render_Dinner_Dinner_Recipes(self, "default") }
      
    </div>
}

export function render_add_existing_Dinner_Categories_Meal(self:DinnerContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Categories != "open" ?
            <Buttons.Add disabled={state.Categories == "loading" ? true : state.Categories.TotalCount >= 1} 
              onClick={() =>
                self.setState({...self.state(), add_step_Categories:"open"}) }
                  target_name={"Categories"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"dinner_categories_meal",
              source_name:"Meal",
              target_name:"Categories",
              target_plural:"Categoriess",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Categories:"saving"}, () =>
                          Api.link_Meal_Categories_Meals(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Categories:"closed"}, () =>
                              load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      CategoriesViews.Categories({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Categories"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Categories, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Categories:"closed"}),
              get_items:[
                { name: "American", get: async(i,s) => Api.get_unlinked_Meal_Categories_Meals_American(self.props.entity, i, s) }, 
                { name: "Asian", get: async(i,s) => Api.get_unlinked_Meal_Categories_Meals_Asian(self.props.entity, i, s) }, 
                { name: "Mediterranean", get: async(i,s) => Api.get_unlinked_Meal_Categories_Meals_Mediterranean(self.props.entity, i, s) }
              ]
            })
        }
      </div>
    :
      null
    }
  
export function render_add_existing_Dinner_Dinner_Recipes(self:DinnerContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Recipes != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Recipes:"open"}) }
                  target_name={"Recipes"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"dinner_dinner_recipes",
              source_name:"Dinner",
              target_name:"Recipes",
              target_plural:"Recipess",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Recipes:"saving"}, () =>
                          Api.link_Dinner_Dinner_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Recipes:"closed"}, () =>
                              load_relation_Dinner_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      RecipesViews.Recipes({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Recipes"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Recipes, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Recipes:"closed"}),
              get_items:[
                { name: "Recipes", get: async(i,s) => Api.get_unlinked_Dinner_Dinner_Recipess(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  

export function render_new_Dinner_Categories_Meal(self:DinnerContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <Buttons.Create target_name={"Categories"} onClick={() => self.setState({...self.state(), add_step_Categories:"creating"})}  />
            {
            state.add_step_Categories != "creating" ?
            null
            :
            <div className="overlay__item overlay__item--new">
              <div className="new-american">
              <button disabled={state.Categories == "loading" ? true : state.Categories.TotalCount >= 1} 
                      className="new-american button button--new"
                      onClick={() =>
                          Api.create_linked_Meal_Categories_Meals_American(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_American(
                                ({ ...e[0], Kind:"American", Description:"" } as Models.American)).then(() =>
                                load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categories:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new American')}
              </button>
            </div>
            <div className="new-asian">
              <button disabled={state.Categories == "loading" ? true : state.Categories.TotalCount >= 1} 
                      className="new-asian button button--new"
                      onClick={() =>
                          Api.create_linked_Meal_Categories_Meals_Asian(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Asian(
                                ({ ...e[0], Kind:"Asian", Description:"" } as Models.Asian)).then(() =>
                                load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categories:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Asian')}
              </button>
            </div>
            <div className="new-mediterranean">
              <button disabled={state.Categories == "loading" ? true : state.Categories.TotalCount >= 1} 
                      className="new-mediterranean button button--new"
                      onClick={() =>
                          Api.create_linked_Meal_Categories_Meals_Mediterranean(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Mediterranean(
                                ({ ...e[0], Kind:"Mediterranean", Description:"" } as Models.Mediterranean)).then(() =>
                                load_relation_Dinner_Categories_Meal(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categories:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Mediterranean')}
              </button>
            </div>
              <Buttons.Cancel onClick={() => self.setState({...self.state(), add_step_Categories:"closed"})} />
            </div>
            }
        </div>
      :
      null
    }
  
export function render_new_Dinner_Dinner_Recipes(self:DinnerContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-recipes">
              <button 
                      className="new-recipes button button--new"
                      onClick={() =>
                          Api.create_linked_Dinner_Dinner_Recipess_Recipes(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Recipes(
                                ({ ...e[0], Picture:"", Name:"", Ingredients:"", Description:"", PreparationTime:0 } as Models.Recipes)).then(() =>
                                load_relation_Dinner_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Recipes:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Recipes')}
              </button>
            </div>
        </div>
      :
      null
    }
  

export function render_saving_animations_Dinner(self:DinnerContext) {
  return self.state().dirty_Categories.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Recipes.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type DinnerContext = {state:()=>DinnerState, props:Utils.EntityComponentProps<Models.Dinner>, setState:(new_state:DinnerState, callback?:()=>void) => void}

export type DinnerState = {
    update_count:number
    add_step_Categories:"closed"|"open"|"saving"|"adding"|"creating",
      dirty_Categories:Immutable.Map<number,Models.Categories>,
      Categories:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Categories>>|"loading"
  add_step_Recipes:"closed"|"open"|"saving",
      dirty_Recipes:Immutable.Map<number,Models.Recipes>,
      Recipes:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Recipes>>|"loading"
  }
export class DinnerComponent extends React.Component<Utils.EntityComponentProps<Models.Dinner>, DinnerState> {
  constructor(props:Utils.EntityComponentProps<Models.Dinner>, context:any) {
    super(props, context)
    this.state = { update_count:0, add_step_Categories:"closed", dirty_Categories:Immutable.Map<number,Models.Categories>(), Categories:"loading", add_step_Recipes:"closed", dirty_Recipes:Immutable.Map<number,Models.Recipes>(), Recipes:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Dinner>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_User ||this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_User ||new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Dinner(this.get_self(), new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Dinner(this.get_self(), this.props.current_User, this.props.current_Admin)

    this.thread = setInterval(() => {
      if (this.state.dirty_Categories.count() > 0) {
         let first = this.state.dirty_Categories.first()
         this.setState({...this.state, dirty_Categories: this.state.dirty_Categories.remove(first.Id)}, () =>
           Api.update_Categories(first)
         )
       } else if (this.state.dirty_Recipes.count() > 0) {
         let first = this.state.dirty_Recipes.first()
         this.setState({...this.state, dirty_Recipes: this.state.dirty_Recipes.remove(first.Id)}, () =>
           Api.update_Recipes(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Dinner(this.props.current_User, this.props.current_Admin) ?
              render_breadcrumb_Dinner(this.get_self())
              : null
    }

    return <div id={`Dinner_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model dinner`}>
      { render_saving_animations_Dinner(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_Dinner(this.get_self()) : null }
      <div className="content" >
        {
          this.props.nesting_depth == 0 && !!this.props.toggle_button ?
          <div className="topbar">
            { this.props.breadcrumbs() }
            <div className="topbar__buttons">
              
                {this.props.toggle_button ? this.props.toggle_button() : null}
              { this.props.authentication_menu() }
            </div>
          </div>
          :
          null
        }
        { this.props.nesting_depth == 0 ? render_local_menu_Dinner(this.get_self()) : null }
        { render_controls_Dinner(this.get_self()) }
        { render_content_Dinner(this.get_self()) }
      </div>
    </div>
  }
}

export let Dinner = (props:Utils.EntityComponentProps<Models.Dinner>) : JSX.Element =>
  <DinnerComponent {...props} />

export let Dinner_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Dinner, Permissions.can_edit_Categories_Meal, Permissions.can_edit_Dinner_Recipes, Permissions.can_edit_Categories, Permissions.can_edit_Recipes])
  return Utils.scene_to_page<Models.Dinner>(can_edit, Dinner, Api.get_Dinner(id), Api.update_Dinner, "Dinner", "Dinner", `/Dinners/${id}`)
}

export let Dinner_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Dinner_to_page(id),
    current_User, current_Admin
  )
}
