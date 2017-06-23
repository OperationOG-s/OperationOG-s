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
import * as RecipeViews from './Recipe'
import * as CategorieViews from './Categorie'
import * as CustomViews from '../custom_views'

export function HomePage_HomePage_Recipe_can_create(self:HomePageContext) {
  let state = self.state()
  return state.Recipe == "loading" ? false : state.Recipe.CanCreate
}
export function HomePage_HomePage_Categorie_can_create(self:HomePageContext) {
  let state = self.state()
  return state.Categorie == "loading" ? false : state.Categorie.CanCreate
}
export function HomePage_HomePage_Recipe_can_delete(self:HomePageContext) {
  let state = self.state()
  return state.Recipe == "loading" ? false : state.Recipe.CanDelete
}
export function HomePage_HomePage_Categorie_can_delete(self:HomePageContext) {
  let state = self.state()
  return state.Categorie == "loading" ? false : state.Categorie.CanDelete
}
export function HomePage_HomePage_Recipe_page_index(self:HomePageContext) {
  let state = self.state()
  return state.Recipe == "loading" ? 0 : state.Recipe.PageIndex
}
export function HomePage_HomePage_Categorie_page_index(self:HomePageContext) {
  let state = self.state()
  return state.Categorie == "loading" ? 0 : state.Categorie.PageIndex
}
export function HomePage_HomePage_Recipe_page_size(self:HomePageContext) {
  let state = self.state()
  return state.Recipe == "loading" ? 25 : state.Recipe.PageSize
}
export function HomePage_HomePage_Categorie_page_size(self:HomePageContext) {
  let state = self.state()
  return state.Categorie == "loading" ? 25 : state.Categorie.PageSize
}
export function HomePage_HomePage_Recipe_search_query(self:HomePageContext) {
  let state = self.state()
  return state.Recipe == "loading" ? null : state.Recipe.SearchQuery
}
export function HomePage_HomePage_Categorie_search_query(self:HomePageContext) {
  let state = self.state()
  return state.Categorie == "loading" ? null : state.Categorie.SearchQuery
}
export function HomePage_HomePage_Recipe_num_pages(self:HomePageContext) {
  let state = self.state()
  return state.Recipe == "loading" ? 1 : state.Recipe.NumPages
}
export function HomePage_HomePage_Categorie_num_pages(self:HomePageContext) {
  let state = self.state()
  return state.Categorie == "loading" ? 1 : state.Categorie.NumPages
}

export function load_relation_HomePage_HomePage_Recipe(self:HomePageContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Recipe != "loading" ?
    (c:() => void) => state.Recipe != "loading" && self.setState({
      ...state,
      Recipe: {...state.Recipe, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Recipe(current_User, current_Admin) ?
    prelude(() =>
      Api.get_HomePage_HomePage_Recipes(self.props.entity, HomePage_HomePage_Recipe_page_index(self), HomePage_HomePage_Recipe_page_size(self), HomePage_HomePage_Recipe_search_query(self)).then(Recipes =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Recipe:Utils.raw_page_to_paginated_items<Models.Recipe, Utils.EntityAndSize<Models.Recipe> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Recipe != "loading" ?
                  (state.Recipe.Items.has(i.Id) ?
                    state.Recipe.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Recipes)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relation_HomePage_HomePage_Categorie(self:HomePageContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Categorie != "loading" ?
    (c:() => void) => state.Categorie != "loading" && self.setState({
      ...state,
      Categorie: {...state.Categorie, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Categorie(current_User, current_Admin) ?
    prelude(() =>
      Api.get_HomePage_HomePage_Categories(self.props.entity, HomePage_HomePage_Categorie_page_index(self), HomePage_HomePage_Categorie_page_size(self), HomePage_HomePage_Categorie_search_query(self)).then(Categories =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Categorie:Utils.raw_page_to_paginated_items<Models.Categorie, Utils.EntityAndSize<Models.Categorie> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Categorie != "loading" ?
                  (state.Categorie.Items.has(i.Id) ?
                    state.Categorie.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Categories)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relations_HomePage(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  load_relation_HomePage_HomePage_Categorie(self, false, self.props.current_User, self.props.current_Admin, 
        () => load_relation_HomePage_HomePage_Recipe(self, false, self.props.current_User, self.props.current_Admin, 
        () => callback && callback()))
}

export function set_size_HomePage(self:HomePageContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(HomePage_to_page(self.props.entity.Id))
  })
}

export function render_HomePage_AppTest_editable_minimised(self:HomePageContext) : JSX.Element {
  if (!Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin)) return render_HomePage_AppTest_minimised(self)
  else
    return !Permissions.can_view_HomePage_AppTest(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute apptest">
  <div className="model__attribute-content">
    {CustomViews.AppTest({...self.props})}
  </div>
</div>
}

export function render_HomePage_Test_editable_minimised(self:HomePageContext) : JSX.Element {
  if (!Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin)) return render_HomePage_Test_minimised(self)
  else
    return !Permissions.can_view_HomePage_Test(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute test">
  <label className="attribute-label attribute-label-test">{i18next.t(`HomePage:Test`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_HomePage_Test(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Test,
        v => self.props.set_entity({...self.props.entity, Test:v})) } 
  </div>
</div>
}


export function render_HomePage_AppTest_editable_maximised(self:HomePageContext) : JSX.Element {
  if (!Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin)) return render_HomePage_AppTest_maximised(self)
  else
    return !Permissions.can_view_HomePage_AppTest(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute apptest">
  <div className="model__attribute-content">
    {CustomViews.AppTest({...self.props})}
  </div>
</div>
}

export function render_HomePage_Test_editable_maximised(self:HomePageContext) : JSX.Element {
  if (!Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin)) return render_HomePage_Test_maximised(self)
  else
    return !Permissions.can_view_HomePage_Test(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute test">
  <label className="attribute-label attribute-label-test">{i18next.t(`HomePage:Test`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_HomePage_Test(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Test,
        v => self.props.set_entity({...self.props.entity, Test:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_HomePage(self:HomePageContext) {
  let attributes = (<div>
      {render_HomePage_Test_editable_minimised(self)}{CustomViews.AppTest({...self.props})}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_HomePage(self:HomePageContext) {
    let state = self.state()
    let attributes = (<div>
        {render_HomePage_Test_editable_maximised(self)}{CustomViews.AppTest({...self.props})}
        
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_HomePage(self:HomePageContext) {
  return <div className="breadcrumb-homepage">HomePage</div>
}

export function render_menu_HomePage(self:HomePageContext) {
  let state = self.state()
  return <div className="menu">
        <img className="logo" src={"/images/logo.png"} alt="Logo"/>
        <div className="pages">
          {!Permissions.can_view_HomePage(self.props.current_User, self.props.current_Admin) ? null :
              <div className={`menu_entry page_link active-page`}>
                <a onClick={() => 
                  self.props.set_shown_relation("none")
                  
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
          <div className="menu_entries">
          
            {!Permissions.can_view_Recipe(self.props.current_User, self.props.current_Admin) ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Recipe" ? " active" : ""}`}>
                    <a onClick={() =>
                        {self.props.set_shown_relation("HomePage_Recipe")
                        }
                      }>
                      {i18next.t('HomePage_Recipes')}
                    </a>
                  </div>
                }
        {!Permissions.can_view_Categorie(self.props.current_User, self.props.current_Admin) ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Categorie" ? " active" : ""}`}>
                    <a onClick={() =>
                        {self.props.set_shown_relation("HomePage_Categorie")
                        }
                      }>
                      {i18next.t('HomePage_Categories')}
                    </a>
                  </div>
                }
                <div className="menu_entry menu_entry--with-sub">
                
                </div>  
          </div>
        </div>
      </div>
}

export function render_local_menu_HomePage(self:HomePageContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this HomePage')}
              </a>
            </div>
          
          </div>
        </div>
}

export function render_controls_HomePage(self:HomePageContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"homepage button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {Permissions.can_delete_HomePage(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_HomePage(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
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

export function render_content_HomePage(self:HomePageContext) {
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_HomePage(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_HomePage(self)
      : self.props.size == "large" ?
        render_large_HomePage(self)
      : self.props.size == "fullscreen" ?
        render_large_HomePage(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
  if (self.props.mode == "view" && actions.length == 1 && !false)
    return <a onClick={() => actions[0]()}>
      <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
        {content}
      </div>
    </a>
  else
    return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
      {content}
    </div>
}

export function render_HomePage_AppTest_minimised(self:HomePageContext) : JSX.Element {
      return !Permissions.can_view_HomePage_AppTest(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute apptest">
  <div className="model__attribute-content">
    {CustomViews.AppTest({...self.props})}
  </div>
</div>
      
}
        export function render_HomePage_Test_minimised(self:HomePageContext) : JSX.Element {
      return !Permissions.can_view_HomePage_Test(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute test">
  <label className="attribute-label attribute-label-test">{i18next.t(`HomePage:Test`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_HomePage_Test(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Test,
        v => self.props.set_entity({...self.props.entity, Test:v})) } 
  </div>
</div>
      
}

export function render_HomePage_AppTest_maximised(self:HomePageContext) : JSX.Element {
        return !Permissions.can_view_HomePage_AppTest(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute apptest">
  <div className="model__attribute-content">
    {CustomViews.AppTest({...self.props})}
  </div>
</div>
}
        export function render_HomePage_Test_maximised(self:HomePageContext) : JSX.Element {
        return !Permissions.can_view_HomePage_Test(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute test">
  <label className="attribute-label attribute-label-test">{i18next.t(`HomePage:Test`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_HomePage_Test(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Test,
        v => self.props.set_entity({...self.props.entity, Test:v})) } 
  </div>
</div>
}

export function render_preview_HomePage(self:HomePageContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_HomePage_AppTest_minimised(self) }
        { render_HomePage_Test_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_HomePage(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_HomePage(self:HomePageContext) {
  let state = self.state()
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_HomePage_AppTest_maximised(self) }
        { render_HomePage_Test_maximised(self) }
        
    </div>)
  else
    attributes = render_editable_attributes_maximised_HomePage(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_HomePage(self)}
    </div>)
}


export function render_HomePage_HomePage_Recipe(self:HomePageContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Recipe") || !Permissions.can_view_Recipe(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("homepage_homepage_recipe",
   "HomePage",
   "Recipe",
   "Recipes",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Recipe != "loading" ?
        state.Recipe.IdsInServerOrder.map(id => state.Recipe != "loading" && state.Recipe.Items.get(id)):
        state.Recipe,
      HomePage_HomePage_Recipe_page_index(self),
      HomePage_HomePage_Recipe_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Recipe != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Recipe: {
              ...state.Recipe,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_HomePage_HomePage_Recipe(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Recipe != "loading" && state.Recipe.JustCreated.has(i_id) && state.Recipe.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                RecipeViews.Recipe({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Recipe(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_HomePage_Recipe(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_HomePage_Recipe(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Recipe != "loading" && state.Recipe.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Recipe != "loading" &&
                    self.setState({...self.state(),
                      Recipe:
                        {
                          ...state.Recipe,
                          Items:state.Recipe.Items.set(i_id,{...state.Recipe.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Recipe"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Recipe != "loading" &&
                    self.setState({...self.state(),
                      Recipe:
                        {
                          ...state.Recipe,
                          Items:state.Recipe.Items.set(i_id,
                            {...state.Recipe.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Recipe, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Recipe != "loading" &&
                    self.setState({...self.state(),
                      dirty_Recipe:state.dirty_Recipe.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Recipe:
                        {
                          ...state.Recipe,
                          Items:state.Recipe.Items.set(i_id,{...state.Recipe.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                    delete: !Permissions.can_delete_Recipe(self.props.current_User, self.props.current_Admin) || !HomePage_HomePage_Recipe_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_Recipe(i.element).then(() =>
                      load_relation_HomePage_HomePage_Recipe(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Recipe(self.props.current_User, self.props.current_Admin) && Permissions.can_create_HomePage_Recipe(self.props.current_User, self.props.current_Admin) && HomePage_HomePage_Recipe_can_create(self) ? render_new_HomePage_HomePage_Recipe(self) : null}
          
        </div>)
    }
    
    </div>
}


export function render_HomePage_HomePage_Categorie(self:HomePageContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Categorie") || !Permissions.can_view_Categorie(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("homepage_homepage_categorie",
   "HomePage",
   "Categorie",
   "Categories",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Categorie != "loading" ?
        state.Categorie.IdsInServerOrder.map(id => state.Categorie != "loading" && state.Categorie.Items.get(id)):
        state.Categorie,
      HomePage_HomePage_Categorie_page_index(self),
      HomePage_HomePage_Categorie_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Categorie != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Categorie: {
              ...state.Categorie,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_HomePage_HomePage_Categorie(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Categorie != "loading" && state.Categorie.JustCreated.has(i_id) && state.Categorie.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                CategorieViews.Categorie({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Categorie(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_HomePage_Categorie(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_HomePage_Categorie(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Categorie != "loading" && state.Categorie.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Categorie != "loading" &&
                    self.setState({...self.state(),
                      Categorie:
                        {
                          ...state.Categorie,
                          Items:state.Categorie.Items.set(i_id,{...state.Categorie.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Categorie"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Categorie != "loading" &&
                    self.setState({...self.state(),
                      Categorie:
                        {
                          ...state.Categorie,
                          Items:state.Categorie.Items.set(i_id,
                            {...state.Categorie.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Categorie, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Categorie != "loading" &&
                    self.setState({...self.state(),
                      dirty_Categorie:state.dirty_Categorie.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Categorie:
                        {
                          ...state.Categorie,
                          Items:state.Categorie.Items.set(i_id,{...state.Categorie.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                    delete: !Permissions.can_delete_Categorie(self.props.current_User, self.props.current_Admin) || !HomePage_HomePage_Categorie_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_Categorie(i.element).then(() =>
                      load_relation_HomePage_HomePage_Categorie(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Categorie(self.props.current_User, self.props.current_Admin) && Permissions.can_create_HomePage_Categorie(self.props.current_User, self.props.current_Admin) && HomePage_HomePage_Categorie_can_create(self) ? render_new_HomePage_HomePage_Categorie(self) : null}
          
        </div>)
    }
    
    </div>
}



export function render_relations_HomePage(self:HomePageContext) {
  return <div className="relations">
      { render_HomePage_HomePage_Recipe(self, "default") }
      { render_HomePage_HomePage_Categorie(self, "default") }
      
    </div>
}



export function render_new_HomePage_HomePage_Recipe(self:HomePageContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-recipe">
              <button 
                      className="new-recipe button button--new"
                      onClick={() =>
                          Api.create_Recipe().then(e => {
                              Api.update_Recipe(
                                ({ ...e, Picture:"", Name:"", Ingredients:"", Description:"", PreparationTime:0 } as Models.Recipe)).then(() =>
                                load_relation_HomePage_HomePage_Recipe(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Recipe:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Recipe')}
              </button>
            </div>
        </div>
      :
      null
    }
  
export function render_new_HomePage_HomePage_Categorie(self:HomePageContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <Buttons.Create target_name={"Categorie"} onClick={() => self.setState({...self.state(), add_step_Categorie:"creating"})}  />
            {
            state.add_step_Categorie != "creating" ?
            null
            :
            <div className="overlay__item overlay__item--new">
              <div className="new-american">
              <button 
                      className="new-american button button--new"
                      onClick={() =>
                          Api.create_American().then(e => {
                              Api.update_Categorie(
                                ({ ...e, Kind:"American", Description:"" } as Models.American)).then(() =>
                                load_relation_HomePage_HomePage_Categorie(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categorie:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new American')}
              </button>
            </div>
            <div className="new-asian">
              <button 
                      className="new-asian button button--new"
                      onClick={() =>
                          Api.create_Asian().then(e => {
                              Api.update_Categorie(
                                ({ ...e, Kind:"Asian", Description:"" } as Models.Asian)).then(() =>
                                load_relation_HomePage_HomePage_Categorie(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categorie:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Asian')}
              </button>
            </div>
            <div className="new-mediterranean">
              <button 
                      className="new-mediterranean button button--new"
                      onClick={() =>
                          Api.create_Mediterranean().then(e => {
                              Api.update_Categorie(
                                ({ ...e, Kind:"Mediterranean", Description:"" } as Models.Mediterranean)).then(() =>
                                load_relation_HomePage_HomePage_Categorie(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categorie:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Mediterranean')}
              </button>
            </div>
              <Buttons.Cancel onClick={() => self.setState({...self.state(), add_step_Categorie:"closed"})} />
            </div>
            }
        </div>
      :
      null
    }
  

export function render_saving_animations_HomePage(self:HomePageContext) {
  return self.state().dirty_Recipe.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Categorie.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type HomePageContext = {state:()=>HomePageState, props:Utils.EntityComponentProps<Models.HomePage>, setState:(new_state:HomePageState, callback?:()=>void) => void}

export type HomePageState = {
    update_count:number
    add_step_Recipe:"closed"|"open"|"saving",
      dirty_Recipe:Immutable.Map<number,Models.Recipe>,
      Recipe:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Recipe>>|"loading"
  add_step_Categorie:"closed"|"open"|"saving"|"adding"|"creating",
      dirty_Categorie:Immutable.Map<number,Models.Categorie>,
      Categorie:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Categorie>>|"loading"
  }
export class HomePageComponent extends React.Component<Utils.EntityComponentProps<Models.HomePage>, HomePageState> {
  constructor(props:Utils.EntityComponentProps<Models.HomePage>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_Recipe:"closed", dirty_Recipe:Immutable.Map<number,Models.Recipe>(), Recipe:"loading", add_step_Categorie:"closed", dirty_Categorie:Immutable.Map<number,Models.Categorie>(), Categorie:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.HomePage>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_User ||this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_User ||new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_HomePage(this.get_self(),  new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_HomePage(this.get_self(), this.props.current_User, this.props.current_Admin)
    }

    this.thread = setInterval(() => {
      if (this.state.dirty_Recipe.count() > 0) {
         let first = this.state.dirty_Recipe.first()
         this.setState({...this.state, dirty_Recipe: this.state.dirty_Recipe.remove(first.Id)}, () =>
           Api.update_Recipe(first)
         )
       } else if (this.state.dirty_Categorie.count() > 0) {
         let first = this.state.dirty_Categorie.first()
         this.setState({...this.state, dirty_Categorie: this.state.dirty_Categorie.remove(first.Id)}, () =>
           Api.update_Categorie(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_HomePage(this.props.current_User, this.props.current_Admin) ?
              render_breadcrumb_HomePage(this.get_self())
              : null
    }

    return <div id={`HomePage_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model homepage`}>
      { render_saving_animations_HomePage(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_HomePage(this.get_self()) : null }
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
        
        { render_controls_HomePage(this.get_self()) }
        { render_content_HomePage(this.get_self()) }
      </div>
    </div>
  }
}

export let HomePage = (props:Utils.EntityComponentProps<Models.HomePage>) : JSX.Element =>
  <HomePageComponent {...props} />

export let HomePage_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_HomePage, Permissions.can_edit_HomePage_Recipe, Permissions.can_edit_HomePage_Categorie, Permissions.can_edit_Recipe, Permissions.can_edit_Categorie])
  return Utils.scene_to_page<Models.HomePage>(can_edit, HomePage, Api.get_HomePage(id), Api.update_HomePage, "HomePage", "HomePage", `/HomePages/${id}`)
}

export let HomePage_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    HomePage_to_page(id),
    current_User, current_Admin
  )
}
