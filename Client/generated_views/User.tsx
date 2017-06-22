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
import * as RecipesViews from './Recipes'


export function User_User_Recipes_can_create(self:UserContext) {
  let state = self.state()
  return state.Recipes == "loading" ? false : state.Recipes.CanCreate
}
export function User_User_Recipes_can_delete(self:UserContext) {
  let state = self.state()
  return state.Recipes == "loading" ? false : state.Recipes.CanDelete
}
export function User_User_Recipes_page_index(self:UserContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 0 : state.Recipes.PageIndex
}
export function User_User_Recipes_page_size(self:UserContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 25 : state.Recipes.PageSize
}
export function User_User_Recipes_num_pages(self:UserContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 1 : state.Recipes.NumPages
}

export function load_relation_User_User_Recipes(self:UserContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_Recipes(current_User, current_Admin) ?
    Api.get_User_User_Recipess(self.props.entity, User_User_Recipes_page_index(self), User_User_Recipes_page_size(self)).then(Recipess =>
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

export function load_relations_User(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  load_relation_User_User_Recipes(self, self.props.current_User, self.props.current_Admin, 
        () => callback && callback())
}

export function set_size_User(self:UserContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(User_to_page(self.props.entity.Id))
  })
}

export function render_User_Username_editable_minimised(self:UserContext) : JSX.Element {
  if (!Permissions.can_edit_User(self.props.current_User, self.props.current_Admin)) return render_User_Username_minimised(self)
  else
    return !Permissions.can_view_User_Username(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute username">
  <label className="attribute-label attribute-label-username">{i18next.t(`User:Username`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        false,
        self.props.mode,
        () => self.props.entity.Username,
        v => self.props.set_entity({...self.props.entity, Username:v})) } 
  </div>
</div>
}

export function render_User_Language_editable_minimised(self:UserContext) : JSX.Element {
  if (!Permissions.can_edit_User(self.props.current_User, self.props.current_Admin)) return render_User_Language_minimised(self)
  else
    return !Permissions.can_view_User_Language(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute language">
  <label className="attribute-label attribute-label-language">{i18next.t(`User:Language`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Union(
          self.props.is_editable && Permissions.can_edit_User(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_User_Language(self.props.current_User, self.props.current_Admin),
          self.props.mode,
          Immutable.List<Components.UnionCase>([{ value:"en", label:"en" }]),
          () => self.props.entity.Language,
          (v:string) => self.props.set_entity({...self.props.entity, Language:v})) }
  </div>
</div>
}

export function render_User_Email_editable_minimised(self:UserContext) : JSX.Element {
  if (!Permissions.can_edit_User(self.props.current_User, self.props.current_Admin)) return render_User_Email_minimised(self)
  else
    return !Permissions.can_view_User_Email(self.props.current_User, self.props.current_Admin) ? <div /> :
          null
}


export function render_User_Username_editable_maximised(self:UserContext) : JSX.Element {
  if (!Permissions.can_edit_User(self.props.current_User, self.props.current_Admin)) return render_User_Username_maximised(self)
  else
    return !Permissions.can_view_User_Username(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute username">
  <label className="attribute-label attribute-label-username">{i18next.t(`User:Username`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        false,
        self.props.mode,
        () => self.props.entity.Username,
        v => self.props.set_entity({...self.props.entity, Username:v})) } 
  </div>
</div>
}

export function render_User_Language_editable_maximised(self:UserContext) : JSX.Element {
  if (!Permissions.can_edit_User(self.props.current_User, self.props.current_Admin)) return render_User_Language_maximised(self)
  else
    return !Permissions.can_view_User_Language(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute language">
  <label className="attribute-label attribute-label-language">{i18next.t(`User:Language`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Union(
          self.props.is_editable && Permissions.can_edit_User(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_User_Language(self.props.current_User, self.props.current_Admin),
          self.props.mode,
          Immutable.List<Components.UnionCase>([{ value:"en", label:"en" }]),
          () => self.props.entity.Language,
          (v:string) => self.props.set_entity({...self.props.entity, Language:v})) }
  </div>
</div>
}

export function render_User_Email_editable_maximised(self:UserContext) : JSX.Element {
  if (!Permissions.can_edit_User(self.props.current_User, self.props.current_Admin)) return render_User_Email_maximised(self)
  else
    return !Permissions.can_view_User_Email(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute email">
  <label className="attribute-label attribute-label-email">{i18next.t(`User:Email`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Email(
        false,
        self.props.mode,
        () => self.props.entity.Email,
        v => self.props.set_entity({...self.props.entity, Email:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_User(self:UserContext) {
  let attributes = (<div><button onClick={() => Api.reset_User_password(self.props.entity.Username, self.props.entity.Email)}>{self.props.entity.HasPassword ? i18next.t('common:Reset password') : i18next.t('common:Create password')}</button>
      {render_User_Username_editable_minimised(self)}
        {render_User_Language_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_User(self:UserContext) {
    let attributes = (<div><button onClick={() => Api.reset_User_password(self.props.entity.Username, self.props.entity.Email)}>{self.props.entity.HasPassword ? i18next.t('common:Reset password') : i18next.t('common:Create password')}</button>
        {render_User_Username_editable_maximised(self)}
        {render_User_Language_editable_maximised(self)}
        {render_User_Email_editable_maximised(self)}
      </div>)
    return attributes
  }

export function render_breadcrumb_User(self:UserContext) {
  return <div className="breadcrumb-user">User</div>
}

export function render_menu_User(self:UserContext) {
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

export function render_local_menu_User(self:UserContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this User')}
              </a>
            </div>
          
            {!Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin) ? null :
                  <div key={"User_Recipes"} className={`local_menu_entry${self.props.shown_relation == "User_Recipes" ? " local_menu_entry--active" : ""}`}>
                    <a onClick={() =>
                      load_relation_User_User_Recipes(self,
                        self.props.current_User, self.props.current_Admin, 
                        () => self.props.set_shown_relation("User_Recipes"))
                    }>
                      {i18next.t('User_Recipess')}
                    </a>
                  </div>
                }  
          </div>
        </div>
}

export function render_controls_User(self:UserContext) {
  return <div className="control">
    {self.props.allow_fullscreen && self.props.set_size ? <a className="user button button--fullscreen"
        onClick={() => set_size_User(self, self.props.size == "fullscreen" ? "large" : "fullscreen")}>
      </a> : null}
    {Permissions.can_delete_User(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_User(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="user button button--close"
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

export function render_content_User(self:UserContext) {
  return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
    {Permissions.can_view_User(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_User(self)
      : self.props.size == "large" ?
        render_large_User(self)
      : self.props.size == "fullscreen" ?
        render_large_User(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }
  </div>
}

export function render_User_Username_minimised(self:UserContext) : JSX.Element {
      return !Permissions.can_view_User_Username(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute username">
  <label className="attribute-label attribute-label-username">{i18next.t(`User:Username`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        false,
        self.props.mode,
        () => self.props.entity.Username,
        v => self.props.set_entity({...self.props.entity, Username:v})) } 
  </div>
</div>
      
}
        export function render_User_Language_minimised(self:UserContext) : JSX.Element {
      return !Permissions.can_view_User_Language(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute language">
  <label className="attribute-label attribute-label-language">{i18next.t(`User:Language`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Union(
          self.props.is_editable && Permissions.can_edit_User(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_User_Language(self.props.current_User, self.props.current_Admin),
          self.props.mode,
          Immutable.List<Components.UnionCase>([{ value:"en", label:"en" }]),
          () => self.props.entity.Language,
          (v:string) => self.props.set_entity({...self.props.entity, Language:v})) }
  </div>
</div>
      
}
        export function render_User_Email_minimised(self:UserContext) : JSX.Element {
      return null
}

export function render_User_Username_maximised(self:UserContext) : JSX.Element {
        return !Permissions.can_view_User_Username(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute username">
  <label className="attribute-label attribute-label-username">{i18next.t(`User:Username`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        false,
        self.props.mode,
        () => self.props.entity.Username,
        v => self.props.set_entity({...self.props.entity, Username:v})) } 
  </div>
</div>
}
        export function render_User_Language_maximised(self:UserContext) : JSX.Element {
        return !Permissions.can_view_User_Language(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute language">
  <label className="attribute-label attribute-label-language">{i18next.t(`User:Language`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Union(
          self.props.is_editable && Permissions.can_edit_User(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_User_Language(self.props.current_User, self.props.current_Admin),
          self.props.mode,
          Immutable.List<Components.UnionCase>([{ value:"en", label:"en" }]),
          () => self.props.entity.Language,
          (v:string) => self.props.set_entity({...self.props.entity, Language:v})) }
  </div>
</div>
}
        export function render_User_Email_maximised(self:UserContext) : JSX.Element {
        return !Permissions.can_view_User_Email(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute email">
  <label className="attribute-label attribute-label-email">{i18next.t(`User:Email`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Email(
        false,
        self.props.mode,
        () => self.props.entity.Email,
        v => self.props.set_entity({...self.props.entity, Email:v})) } 
  </div>
</div>
}

export function render_preview_User(self:UserContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_User(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_User_Username_minimised(self) }
        { render_User_Language_minimised(self) }
        { render_User_Email_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_User(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_User(self:UserContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_User(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_User_Username_maximised(self) }
        { render_User_Language_maximised(self) }
        { render_User_Email_maximised(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_User(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_User(self)}
    </div>)
}


export function render_User_User_Recipes(self:UserContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "User_Recipes") || !Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("user_user_recipes",
   "User",
   "Recipes",
   "Recipess",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Recipes != "loading" ? state.Recipes.Items : state.Recipes,
      User_User_Recipes_page_index(self),
      User_User_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Recipes != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Recipes: {
              ...state.Recipes,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_User_User_Recipes(self, self.props.current_User, self.props.current_Admin))
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
                  mode:self.props.mode == "edit" && (Permissions.can_edit_User_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_User_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_User_Recipes(self.props.current_User, self.props.current_Admin)) ?
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
                  unlink: !Permissions.can_delete_User_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_User_User_Recipess(self.props.entity, i.element).then(() =>
                      load_relation_User_User_Recipes(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_create_User_Recipes(self.props.current_User, self.props.current_Admin) && User_User_Recipes_can_create(self) ? render_new_User_User_Recipes(self) : null}
          {Permissions.can_create_User_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_User_User_Recipes(self) : null}
        </div>)
    }
    
    </div>
}



export function render_relations_User(self:UserContext) {
  return <div className="relations">
      { render_User_User_Recipes(self, "default") }
      
    </div>
}

export function render_add_existing_User_User_Recipes(self:UserContext) {
    
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
              relation_name:"user_user_recipes",
              source_name:"User",
              target_name:"Recipes",
              target_plural:"Recipess",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Recipes:"saving"}, () =>
                          Api.link_User_User_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Recipes:"closed"}, () =>
                              load_relation_User_User_Recipes(self, self.props.current_User, self.props.current_Admin))))
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
                { name: "Recipes", get: async(i,s) => Api.get_unlinked_User_User_Recipess(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  

export function render_new_User_User_Recipes(self:UserContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-recipes">
              <button 
                      className="new-recipes button button--new"
                      onClick={() =>
                          Api.create_linked_User_User_Recipess_Recipes(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Recipes(
                                ({ ...e[0], Picture:"", Name:"", Ingredients:"", Description:"", PreparationTime:0 } as Models.Recipes)).then(() =>
                                load_relation_User_User_Recipes(self, self.props.current_User, self.props.current_Admin, () =>
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
  

export function render_saving_animations_User(self:UserContext) {
  return self.state().dirty_Recipes.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type UserContext = {state:()=>UserState, props:Utils.EntityComponentProps<Models.User>, setState:(new_state:UserState, callback?:()=>void) => void}

export type UserState = {
    update_count:number
    add_step_Recipes:"closed"|"open"|"saving",
      dirty_Recipes:Immutable.Map<number,Models.Recipes>,
      Recipes:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Recipes>>|"loading"
  }
export class UserComponent extends React.Component<Utils.EntityComponentProps<Models.User>, UserState> {
  constructor(props:Utils.EntityComponentProps<Models.User>, context:any) {
    super(props, context)
    this.state = { update_count:0, add_step_Recipes:"closed", dirty_Recipes:Immutable.Map<number,Models.Recipes>(), Recipes:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.User>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_User ||this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_User ||new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_User(this.get_self(), new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_User(this.get_self(), this.props.current_User, this.props.current_Admin)

    this.thread = setInterval(() => {
      if (this.state.dirty_Recipes.count() > 0) {
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
      return Permissions.can_view_User(this.props.current_User, this.props.current_Admin) ?
              render_breadcrumb_User(this.get_self())
              : null
    }

    return <div id={`User_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model user`}>
      { render_saving_animations_User(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_User(this.get_self()) : null }
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
        { this.props.nesting_depth == 0 ? render_local_menu_User(this.get_self()) : null }
        { render_controls_User(this.get_self()) }
        { render_content_User(this.get_self()) }
      </div>
    </div>
  }
}

export let User = (props:Utils.EntityComponentProps<Models.User>) : JSX.Element =>
  <UserComponent {...props} />

export let User_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_User, Permissions.can_edit_User_Recipes, Permissions.can_edit_Recipes])
  return Utils.scene_to_page<Models.User>(can_edit, User, Api.get_User(id), Api.update_User, "User", "User", `/Users/${id}`)
}

export let User_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    User_to_page(id),
    current_User, current_Admin
  )
}
