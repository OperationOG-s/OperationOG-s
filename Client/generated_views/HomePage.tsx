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
import * as RecipesViews from './Recipes'
import * as CategoriesViews from './Categories'


export function HomePage_HomePage_Recipes_can_create(self:HomePageContext) {
  let state = self.state()
  return state.Recipes == "loading" ? false : state.Recipes.CanCreate
}
export function HomePage_HomePage_Categories_can_create(self:HomePageContext) {
  let state = self.state()
  return state.Categories == "loading" ? false : state.Categories.CanCreate
}
export function HomePage_HomePage_Recipes_can_delete(self:HomePageContext) {
  let state = self.state()
  return state.Recipes == "loading" ? false : state.Recipes.CanDelete
}
export function HomePage_HomePage_Categories_can_delete(self:HomePageContext) {
  let state = self.state()
  return state.Categories == "loading" ? false : state.Categories.CanDelete
}
export function HomePage_HomePage_Recipes_page_index(self:HomePageContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 0 : state.Recipes.PageIndex
}
export function HomePage_HomePage_Categories_page_index(self:HomePageContext) {
  let state = self.state()
  return state.Categories == "loading" ? 0 : state.Categories.PageIndex
}
export function HomePage_HomePage_Recipes_page_size(self:HomePageContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 25 : state.Recipes.PageSize
}
export function HomePage_HomePage_Categories_page_size(self:HomePageContext) {
  let state = self.state()
  return state.Categories == "loading" ? 25 : state.Categories.PageSize
}
export function HomePage_HomePage_Recipes_search_query(self:HomePageContext) {
  let state = self.state()
  return state.Recipes == "loading" ? null : state.Recipes.SearchQuery
}
export function HomePage_HomePage_Categories_search_query(self:HomePageContext) {
  let state = self.state()
  return state.Categories == "loading" ? null : state.Categories.SearchQuery
}
export function HomePage_HomePage_Recipes_num_pages(self:HomePageContext) {
  let state = self.state()
  return state.Recipes == "loading" ? 1 : state.Recipes.NumPages
}
export function HomePage_HomePage_Categories_num_pages(self:HomePageContext) {
  let state = self.state()
  return state.Categories == "loading" ? 1 : state.Categories.NumPages
}

export function load_relation_HomePage_HomePage_Recipes(self:HomePageContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Recipes != "loading" ?
    (c:() => void) => state.Recipes != "loading" && self.setState({
      ...state,
      Recipes: {...state.Recipes, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Recipes(current_User, current_Admin) ?
    prelude(() =>
      Api.get_HomePage_HomePage_Recipess(self.props.entity, HomePage_HomePage_Recipes_page_index(self), HomePage_HomePage_Recipes_page_size(self), HomePage_HomePage_Recipes_search_query(self)).then(Recipess =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Recipes:Utils.raw_page_to_paginated_items<Models.Recipes, Utils.EntityAndSize<Models.Recipes> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Recipes != "loading" ?
                  (state.Recipes.Items.has(i.Id) ?
                    state.Recipes.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Recipess)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relation_HomePage_HomePage_Categories(self:HomePageContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Categories != "loading" ?
    (c:() => void) => state.Categories != "loading" && self.setState({
      ...state,
      Categories: {...state.Categories, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Categories(current_User, current_Admin) ?
    prelude(() =>
      Api.get_HomePage_HomePage_Categoriess(self.props.entity, HomePage_HomePage_Categories_page_index(self), HomePage_HomePage_Categories_page_size(self), HomePage_HomePage_Categories_search_query(self)).then(Categoriess =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Categories:Utils.raw_page_to_paginated_items<Models.Categories, Utils.EntityAndSize<Models.Categories> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Categories != "loading" ?
                  (state.Categories.Items.has(i.Id) ?
                    state.Categories.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Categoriess)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relations_HomePage(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  load_relation_HomePage_HomePage_Categories(self, false, self.props.current_User, self.props.current_Admin, 
        () => load_relation_HomePage_HomePage_Recipes(self, false, self.props.current_User, self.props.current_Admin, 
        () => callback && callback()))
}

export function set_size_HomePage(self:HomePageContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(HomePage_to_page(self.props.entity.Id))
  })
}





export function render_editable_attributes_minimised_HomePage(self:HomePageContext) {
  let attributes = (<div>
      
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_HomePage(self:HomePageContext) {
    let state = self.state()
    let attributes = (<div>
        
        
        
        
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
          
            {!Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin) ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Recipes" ? " active" : ""}`}>
                    <a onClick={() =>
                        {self.props.set_shown_relation("HomePage_Recipes")
                        }
                      }>
                      {i18next.t('HomePage_Recipess')}
                    </a>
                  </div>
                }
        {!Permissions.can_view_Categories(self.props.current_User, self.props.current_Admin) ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_Categories" ? " active" : ""}`}>
                    <a onClick={() =>
                        {self.props.set_shown_relation("HomePage_Categories")
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





export function render_preview_HomePage(self:HomePageContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      
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
      
        
    </div>)
  else
    attributes = render_editable_attributes_maximised_HomePage(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_HomePage(self)}
    </div>)
}


export function render_HomePage_HomePage_Recipes(self:HomePageContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Recipes") || !Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("homepage_homepage_recipes",
   "HomePage",
   "Recipes",
   "Recipess",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Recipes != "loading" ?
        state.Recipes.IdsInServerOrder.map(id => state.Recipes != "loading" && state.Recipes.Items.get(id)):
        state.Recipes,
      HomePage_HomePage_Recipes_page_index(self),
      HomePage_HomePage_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Recipes != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Recipes: {
              ...state.Recipes,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_HomePage_HomePage_Recipes(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Recipes != "loading" && state.Recipes.JustCreated.has(i_id) && state.Recipes.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
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
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_HomePage_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_HomePage_Recipes(self.props.current_User, self.props.current_Admin)) ?
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
                  unlink: undefined,
                    delete: !Permissions.can_delete_Recipes(self.props.current_User, self.props.current_Admin) || !HomePage_HomePage_Recipes_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_Recipes(i.element).then(() =>
                      load_relation_HomePage_HomePage_Recipes(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_create_HomePage_Recipes(self.props.current_User, self.props.current_Admin) && HomePage_HomePage_Recipes_can_create(self) ? render_new_HomePage_HomePage_Recipes(self) : null}
          
        </div>)
    }
    
    </div>
}


export function render_HomePage_HomePage_Categories(self:HomePageContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Categories") || !Permissions.can_view_Categories(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("homepage_homepage_categories",
   "HomePage",
   "Categories",
   "Categoriess",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Categories != "loading" ?
        state.Categories.IdsInServerOrder.map(id => state.Categories != "loading" && state.Categories.Items.get(id)):
        state.Categories,
      HomePage_HomePage_Categories_page_index(self),
      HomePage_HomePage_Categories_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Categories != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Categories: {
              ...state.Categories,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_HomePage_HomePage_Categories(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Categories != "loading" && state.Categories.JustCreated.has(i_id) && state.Categories.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
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
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_Categories(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_HomePage_Categories(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_HomePage_Categories(self.props.current_User, self.props.current_Admin)) ?
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
                  unlink: undefined,
                    delete: !Permissions.can_delete_Categories(self.props.current_User, self.props.current_Admin) || !HomePage_HomePage_Categories_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_Categories(i.element).then(() =>
                      load_relation_HomePage_HomePage_Categories(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Categories(self.props.current_User, self.props.current_Admin) && Permissions.can_create_HomePage_Categories(self.props.current_User, self.props.current_Admin) && HomePage_HomePage_Categories_can_create(self) ? render_new_HomePage_HomePage_Categories(self) : null}
          
        </div>)
    }
    
    </div>
}



export function render_relations_HomePage(self:HomePageContext) {
  return <div className="relations">
      { render_HomePage_HomePage_Recipes(self, "default") }
      { render_HomePage_HomePage_Categories(self, "default") }
      
    </div>
}



export function render_new_HomePage_HomePage_Recipes(self:HomePageContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-recipes">
              <button 
                      className="new-recipes button button--new"
                      onClick={() =>
                          Api.create_Recipes().then(e => {
                              Api.update_Recipes(
                                ({ ...e, Picture:"", Name:"", Ingredients:"", Description:"", PreparationTime:0 } as Models.Recipes)).then(() =>
                                load_relation_HomePage_HomePage_Recipes(self, true, self.props.current_User, self.props.current_Admin, () =>
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
  
export function render_new_HomePage_HomePage_Categories(self:HomePageContext) {
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
              <button 
                      className="new-american button button--new"
                      onClick={() =>
                          Api.create_American().then(e => {
                              Api.update_Categories(
                                ({ ...e, Kind:"American", Description:"" } as Models.American)).then(() =>
                                load_relation_HomePage_HomePage_Categories(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categories:"closed"})
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
                              Api.update_Categories(
                                ({ ...e, Kind:"Asian", Description:"" } as Models.Asian)).then(() =>
                                load_relation_HomePage_HomePage_Categories(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Categories:"closed"})
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
                              Api.update_Categories(
                                ({ ...e, Kind:"Mediterranean", Description:"" } as Models.Mediterranean)).then(() =>
                                load_relation_HomePage_HomePage_Categories(self, true, self.props.current_User, self.props.current_Admin, () =>
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
  

export function render_saving_animations_HomePage(self:HomePageContext) {
  return self.state().dirty_Recipes.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Categories.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type HomePageContext = {state:()=>HomePageState, props:Utils.EntityComponentProps<Models.HomePage>, setState:(new_state:HomePageState, callback?:()=>void) => void}

export type HomePageState = {
    update_count:number
    add_step_Recipes:"closed"|"open"|"saving",
      dirty_Recipes:Immutable.Map<number,Models.Recipes>,
      Recipes:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Recipes>>|"loading"
  add_step_Categories:"closed"|"open"|"saving"|"adding"|"creating",
      dirty_Categories:Immutable.Map<number,Models.Categories>,
      Categories:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Categories>>|"loading"
  }
export class HomePageComponent extends React.Component<Utils.EntityComponentProps<Models.HomePage>, HomePageState> {
  constructor(props:Utils.EntityComponentProps<Models.HomePage>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_Recipes:"closed", dirty_Recipes:Immutable.Map<number,Models.Recipes>(), Recipes:"loading", add_step_Categories:"closed", dirty_Categories:Immutable.Map<number,Models.Categories>(), Categories:"loading" }
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
      if (this.state.dirty_Recipes.count() > 0) {
         let first = this.state.dirty_Recipes.first()
         this.setState({...this.state, dirty_Recipes: this.state.dirty_Recipes.remove(first.Id)}, () =>
           Api.update_Recipes(first)
         )
       } else if (this.state.dirty_Categories.count() > 0) {
         let first = this.state.dirty_Categories.first()
         this.setState({...this.state, dirty_Categories: this.state.dirty_Categories.remove(first.Id)}, () =>
           Api.update_Categories(first)
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
  let can_edit = Utils.any_of([Permissions.can_edit_HomePage, Permissions.can_edit_HomePage_Recipes, Permissions.can_edit_HomePage_Categories, Permissions.can_edit_Recipes, Permissions.can_edit_Categories])
  return Utils.scene_to_page<Models.HomePage>(can_edit, HomePage, Api.get_HomePage(id), Api.update_HomePage, "HomePage", "HomePage", `/HomePages/${id}`)
}

export let HomePage_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    HomePage_to_page(id),
    current_User, current_Admin
  )
}
