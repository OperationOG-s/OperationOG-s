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
import * as UserViews from './User'
import * as DinnerViews from './Dinner'
import * as BreakfastViews from './Breakfast'
import * as LunchViews from './Lunch'


export function Recipes_User_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? false : state.User.CanCreate
}
export function Recipes_Dinner_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.Dinner == "loading" ? false : state.Dinner.CanCreate
}
export function Recipes_Breakfast_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.Breakfast == "loading" ? false : state.Breakfast.CanCreate
}
export function Recipes_Lunch_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.Lunch == "loading" ? false : state.Lunch.CanCreate
}
export function Recipes_User_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? false : state.User.CanDelete
}
export function Recipes_Dinner_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.Dinner == "loading" ? false : state.Dinner.CanDelete
}
export function Recipes_Breakfast_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.Breakfast == "loading" ? false : state.Breakfast.CanDelete
}
export function Recipes_Lunch_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.Lunch == "loading" ? false : state.Lunch.CanDelete
}
export function Recipes_User_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? 0 : state.User.PageIndex
}
export function Recipes_Dinner_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.Dinner == "loading" ? 0 : state.Dinner.PageIndex
}
export function Recipes_Breakfast_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.Breakfast == "loading" ? 0 : state.Breakfast.PageIndex
}
export function Recipes_Lunch_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.Lunch == "loading" ? 0 : state.Lunch.PageIndex
}
export function Recipes_User_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? 25 : state.User.PageSize
}
export function Recipes_Dinner_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.Dinner == "loading" ? 25 : state.Dinner.PageSize
}
export function Recipes_Breakfast_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.Breakfast == "loading" ? 25 : state.Breakfast.PageSize
}
export function Recipes_Lunch_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.Lunch == "loading" ? 25 : state.Lunch.PageSize
}
export function Recipes_User_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? 1 : state.User.NumPages
}
export function Recipes_Dinner_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.Dinner == "loading" ? 1 : state.Dinner.NumPages
}
export function Recipes_Breakfast_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.Breakfast == "loading" ? 1 : state.Breakfast.NumPages
}
export function Recipes_Lunch_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.Lunch == "loading" ? 1 : state.Lunch.NumPages
}

export function load_relation_Recipes_User_Recipes(self:RecipesContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_User(current_User, current_Admin) ?
    Api.get_Recipes_User_Recipess(self.props.entity, Recipes_User_Recipes_page_index(self), Recipes_User_Recipes_page_size(self)).then(Users =>
      self.setState({...self.state(), update_count:self.state().update_count+1,
          User:Utils.raw_page_to_paginated_items<Models.User, Utils.EntityAndSize<Models.User> & { shown_relation:string }>(i => {
            let state = self.state()
            return {
              element:i,
              size: state.User != "loading" && state.User.Items.has(i.Id) ? state.User.Items.get(i.Id).size : "preview",
              shown_relation:"all"}}, Users)
          }, callback))
  :
    callback && callback()
}

export function load_relation_Recipes_Dinner_Recipes(self:RecipesContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_Dinner(current_User, current_Admin) ?
    Api.get_Recipes_Dinner_Recipess(self.props.entity, Recipes_Dinner_Recipes_page_index(self), Recipes_Dinner_Recipes_page_size(self)).then(Dinners =>
      self.setState({...self.state(), update_count:self.state().update_count+1,
          Dinner:Utils.raw_page_to_paginated_items<Models.Dinner, Utils.EntityAndSize<Models.Dinner> & { shown_relation:string }>(i => {
            let state = self.state()
            return {
              element:i,
              size: state.Dinner != "loading" && state.Dinner.Items.has(i.Id) ? state.Dinner.Items.get(i.Id).size : "preview",
              shown_relation:"all"}}, Dinners)
          }, callback))
  :
    callback && callback()
}

export function load_relation_Recipes_Breakfast_Recipes(self:RecipesContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_Breakfast(current_User, current_Admin) ?
    Api.get_Recipes_Breakfast_Recipess(self.props.entity, Recipes_Breakfast_Recipes_page_index(self), Recipes_Breakfast_Recipes_page_size(self)).then(Breakfasts =>
      self.setState({...self.state(), update_count:self.state().update_count+1,
          Breakfast:Utils.raw_page_to_paginated_items<Models.Breakfast, Utils.EntityAndSize<Models.Breakfast> & { shown_relation:string }>(i => {
            let state = self.state()
            return {
              element:i,
              size: state.Breakfast != "loading" && state.Breakfast.Items.has(i.Id) ? state.Breakfast.Items.get(i.Id).size : "preview",
              shown_relation:"all"}}, Breakfasts)
          }, callback))
  :
    callback && callback()
}

export function load_relation_Recipes_Lunch_Recipes(self:RecipesContext, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  Permissions.can_view_Lunch(current_User, current_Admin) ?
    Api.get_Recipes_Lunch_Recipess(self.props.entity, Recipes_Lunch_Recipes_page_index(self), Recipes_Lunch_Recipes_page_size(self)).then(Lunches =>
      self.setState({...self.state(), update_count:self.state().update_count+1,
          Lunch:Utils.raw_page_to_paginated_items<Models.Lunch, Utils.EntityAndSize<Models.Lunch> & { shown_relation:string }>(i => {
            let state = self.state()
            return {
              element:i,
              size: state.Lunch != "loading" && state.Lunch.Items.has(i.Id) ? state.Lunch.Items.get(i.Id).size : "preview",
              shown_relation:"all"}}, Lunches)
          }, callback))
  :
    callback && callback()
}

export function load_relations_Recipes(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  load_relation_Recipes_Lunch_Recipes(self, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Recipes_Breakfast_Recipes(self, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Recipes_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Recipes_User_Recipes(self, self.props.current_User, self.props.current_Admin, 
        () => callback && callback()))))
}

export function set_size_Recipes(self:RecipesContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Recipes_to_page(self.props.entity.Id))
  })
}

export function render_Recipes_Picture_editable_minimised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Picture_minimised(self)
  else
    return !Permissions.can_view_Recipes_Picture(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute picture">
  <label className="attribute-label attribute-label-picture">{i18next.t(`Recipes:Picture`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Image(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Picture(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => Api.get_Recipes_Picture(self.props.entity),
        (new_src:string) => Api.update_Recipes_Picture(self.props.entity, new_src)) }
  </div>
</div>
}

export function render_Recipes_Name_editable_minimised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Name_minimised(self)
  else
    return !Permissions.can_view_Recipes_Name(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Recipes:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Name(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}

export function render_Recipes_Ingredients_editable_minimised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Ingredients_minimised(self)
  else
    return !Permissions.can_view_Recipes_Ingredients(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute ingredients">
  <label className="attribute-label attribute-label-ingredients">{i18next.t(`Recipes:Ingredients`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Ingredients(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Ingredients,
        v => self.props.set_entity({...self.props.entity, Ingredients:v})) } 
  </div>
</div>
}

export function render_Recipes_Description_editable_minimised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Description_minimised(self)
  else
    return !Permissions.can_view_Recipes_Description(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Recipes:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}

export function render_Recipes_PreparationTime_editable_minimised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_PreparationTime_minimised(self)
  else
    return !Permissions.can_view_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute preparationtime">
  <label className="attribute-label attribute-label-preparationtime">{i18next.t(`Recipes:PreparationTime`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.PreparationTime,
        v => self.props.set_entity({...self.props.entity, PreparationTime:v})) } 
  </div>
</div>
}


export function render_Recipes_Picture_editable_maximised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Picture_maximised(self)
  else
    return !Permissions.can_view_Recipes_Picture(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute picture">
  <label className="attribute-label attribute-label-picture">{i18next.t(`Recipes:Picture`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Image(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Picture(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => Api.get_Recipes_Picture(self.props.entity),
        (new_src:string) => Api.update_Recipes_Picture(self.props.entity, new_src)) }
  </div>
</div>
}

export function render_Recipes_Name_editable_maximised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Name_maximised(self)
  else
    return !Permissions.can_view_Recipes_Name(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Recipes:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Name(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}

export function render_Recipes_Ingredients_editable_maximised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Ingredients_maximised(self)
  else
    return !Permissions.can_view_Recipes_Ingredients(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute ingredients">
  <label className="attribute-label attribute-label-ingredients">{i18next.t(`Recipes:Ingredients`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Ingredients(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Ingredients,
        v => self.props.set_entity({...self.props.entity, Ingredients:v})) } 
  </div>
</div>
}

export function render_Recipes_Description_editable_maximised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_Description_maximised(self)
  else
    return !Permissions.can_view_Recipes_Description(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Recipes:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}

export function render_Recipes_PreparationTime_editable_maximised(self:RecipesContext) : JSX.Element {
  if (!Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin)) return render_Recipes_PreparationTime_maximised(self)
  else
    return !Permissions.can_view_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute preparationtime">
  <label className="attribute-label attribute-label-preparationtime">{i18next.t(`Recipes:PreparationTime`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.PreparationTime,
        v => self.props.set_entity({...self.props.entity, PreparationTime:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_Recipes(self:RecipesContext) {
  let attributes = (<div>
      {render_Recipes_Picture_editable_minimised(self)}
        {render_Recipes_Name_editable_minimised(self)}
        {render_Recipes_Ingredients_editable_minimised(self)}
        {render_Recipes_Description_editable_minimised(self)}
        {render_Recipes_PreparationTime_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Recipes(self:RecipesContext) {
    let attributes = (<div>
        {render_Recipes_Picture_editable_maximised(self)}
        {render_Recipes_Name_editable_maximised(self)}
        {render_Recipes_Ingredients_editable_maximised(self)}
        {render_Recipes_Description_editable_maximised(self)}
        {render_Recipes_PreparationTime_editable_maximised(self)}
      </div>)
    return attributes
  }

export function render_breadcrumb_Recipes(self:RecipesContext) {
  return <div className="breadcrumb-recipes">Recipes</div>
}

export function render_menu_Recipes(self:RecipesContext) {
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

export function render_local_menu_Recipes(self:RecipesContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this Recipes')}
              </a>
            </div>
          
              
          </div>
        </div>
}

export function render_controls_Recipes(self:RecipesContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"recipes button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_Recipes(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {self.props.allow_fullscreen && self.props.set_size ? <a className="recipes button button--fullscreen"
        onClick={() => set_size_Recipes(self, self.props.size == "fullscreen" ? "large" : "fullscreen")}>
      </a> : null}
    {Permissions.can_delete_Recipes(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_Recipes(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="recipes button button--close"
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

export function render_content_Recipes(self:RecipesContext) {
  return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
    {Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_Recipes(self)
      : self.props.size == "large" ?
        render_large_Recipes(self)
      : self.props.size == "fullscreen" ?
        render_large_Recipes(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }
  </div>
}

export function render_Recipes_Picture_minimised(self:RecipesContext) : JSX.Element {
      return !Permissions.can_view_Recipes_Picture(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute picture">
  <label className="attribute-label attribute-label-picture">{i18next.t(`Recipes:Picture`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Image(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Picture(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => Api.get_Recipes_Picture(self.props.entity),
        (new_src:string) => Api.update_Recipes_Picture(self.props.entity, new_src)) }
  </div>
</div>
      
}
        export function render_Recipes_Name_minimised(self:RecipesContext) : JSX.Element {
      return !Permissions.can_view_Recipes_Name(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Recipes:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Name(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
      
}
        export function render_Recipes_Ingredients_minimised(self:RecipesContext) : JSX.Element {
      return !Permissions.can_view_Recipes_Ingredients(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute ingredients">
  <label className="attribute-label attribute-label-ingredients">{i18next.t(`Recipes:Ingredients`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Ingredients(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Ingredients,
        v => self.props.set_entity({...self.props.entity, Ingredients:v})) } 
  </div>
</div>
      
}
        export function render_Recipes_Description_minimised(self:RecipesContext) : JSX.Element {
      return !Permissions.can_view_Recipes_Description(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Recipes:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
      
}
        export function render_Recipes_PreparationTime_minimised(self:RecipesContext) : JSX.Element {
      return !Permissions.can_view_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute preparationtime">
  <label className="attribute-label attribute-label-preparationtime">{i18next.t(`Recipes:PreparationTime`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.PreparationTime,
        v => self.props.set_entity({...self.props.entity, PreparationTime:v})) } 
  </div>
</div>
      
}

export function render_Recipes_Picture_maximised(self:RecipesContext) : JSX.Element {
        return !Permissions.can_view_Recipes_Picture(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute picture">
  <label className="attribute-label attribute-label-picture">{i18next.t(`Recipes:Picture`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Image(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Picture(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => Api.get_Recipes_Picture(self.props.entity),
        (new_src:string) => Api.update_Recipes_Picture(self.props.entity, new_src)) }
  </div>
</div>
}
        export function render_Recipes_Name_maximised(self:RecipesContext) : JSX.Element {
        return !Permissions.can_view_Recipes_Name(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute name">
  <label className="attribute-label attribute-label-name">{i18next.t(`Recipes:Name`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Name(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Name,
        v => self.props.set_entity({...self.props.entity, Name:v})) } 
  </div>
</div>
}
        export function render_Recipes_Ingredients_maximised(self:RecipesContext) : JSX.Element {
        return !Permissions.can_view_Recipes_Ingredients(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute ingredients">
  <label className="attribute-label attribute-label-ingredients">{i18next.t(`Recipes:Ingredients`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Ingredients(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Ingredients,
        v => self.props.set_entity({...self.props.entity, Ingredients:v})) } 
  </div>
</div>
}
        export function render_Recipes_Description_maximised(self:RecipesContext) : JSX.Element {
        return !Permissions.can_view_Recipes_Description(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Recipes:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}
        export function render_Recipes_PreparationTime_maximised(self:RecipesContext) : JSX.Element {
        return !Permissions.can_view_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute preparationtime">
  <label className="attribute-label attribute-label-preparationtime">{i18next.t(`Recipes:PreparationTime`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Recipes_PreparationTime(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.PreparationTime,
        v => self.props.set_entity({...self.props.entity, PreparationTime:v})) } 
  </div>
</div>
}

export function render_preview_Recipes(self:RecipesContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Recipes_Picture_minimised(self) }
        { render_Recipes_Name_minimised(self) }
        { render_Recipes_Ingredients_minimised(self) }
        { render_Recipes_Description_minimised(self) }
        { render_Recipes_PreparationTime_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Recipes(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Recipes(self:RecipesContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Recipes(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Recipes_Picture_maximised(self) }
        { render_Recipes_Name_maximised(self) }
        { render_Recipes_Ingredients_maximised(self) }
        { render_Recipes_Description_maximised(self) }
        { render_Recipes_PreparationTime_maximised(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Recipes(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_Recipes(self)}
    </div>)
}


export function render_Recipes_User_Recipes(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "User_Recipes") || !Permissions.can_view_User(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("recipes_user_recipes",
   "Recipes",
   "User",
   "Users",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.User != "loading" ? state.User.Items : state.User,
      Recipes_User_Recipes_page_index(self),
      Recipes_User_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.User != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            User: {
              ...state.User,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_User_Recipes(self, self.props.current_User, self.props.current_Admin))
        },
      (i,i_id) => {
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""} ` }
          
            >
            <div key={i_id}>
              {
                UserViews.User({
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
                  is_editable:state.User != "loading" && state.User.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.User != "loading" &&
                    self.setState({...self.state(),
                      User:
                        {
                          ...state.User,
                          Items:state.User.Items.set(i_id,{...state.User.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("User"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.User != "loading" &&
                    self.setState({...self.state(),
                      User:
                        {
                          ...state.User,
                          Items:state.User.Items.set(i_id,
                            {...state.User.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.User, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.User != "loading" &&
                    self.setState({...self.state(),
                      dirty_User:state.dirty_User.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      User:
                        {
                          ...state.User,
                          Items:state.User.Items.set(i_id,{...state.User.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_User_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_User_User_Recipess(i.element, self.props.entity).then(() =>
                      load_relation_Recipes_User_Recipes(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_User(self.props.current_User, self.props.current_Admin) && Permissions.can_create_User_Recipes(self.props.current_User, self.props.current_Admin) && Recipes_User_Recipes_can_create(self) ? render_new_Recipes_User_Recipes(self) : null}
          {Permissions.can_create_User_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_Recipes_User_Recipes(self) : null}
        </div>)
    }
    
    </div>
}


export function render_Recipes_Dinner_Recipes(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Dinner_Recipes") || !Permissions.can_view_Dinner(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("recipes_dinner_recipes",
   "Recipes",
   "Dinner",
   "Dinners",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Dinner != "loading" ? state.Dinner.Items : state.Dinner,
      Recipes_Dinner_Recipes_page_index(self),
      Recipes_Dinner_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Dinner != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Dinner: {
              ...state.Dinner,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin))
        },
      (i,i_id) => {
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""} ` }
          
            >
            <div key={i_id}>
              {
                DinnerViews.Dinner({
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
                  is_editable:state.Dinner != "loading" && state.Dinner.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Dinner != "loading" &&
                    self.setState({...self.state(),
                      Dinner:
                        {
                          ...state.Dinner,
                          Items:state.Dinner.Items.set(i_id,{...state.Dinner.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Dinner"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Dinner != "loading" &&
                    self.setState({...self.state(),
                      Dinner:
                        {
                          ...state.Dinner,
                          Items:state.Dinner.Items.set(i_id,
                            {...state.Dinner.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Dinner, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Dinner != "loading" &&
                    self.setState({...self.state(),
                      dirty_Dinner:state.dirty_Dinner.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Dinner:
                        {
                          ...state.Dinner,
                          Items:state.Dinner.Items.set(i_id,{...state.Dinner.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Dinner_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Dinner_Dinner_Recipess(i.element, self.props.entity).then(() =>
                      load_relation_Recipes_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Dinner(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Dinner_Recipes(self.props.current_User, self.props.current_Admin) && Recipes_Dinner_Recipes_can_create(self) ? render_new_Recipes_Dinner_Recipes(self) : null}
          {Permissions.can_create_Dinner_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_Recipes_Dinner_Recipes(self) : null}
        </div>)
    }
    
    </div>
}


export function render_Recipes_Breakfast_Recipes(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Breakfast_Recipes") || !Permissions.can_view_Breakfast(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("recipes_breakfast_recipes",
   "Recipes",
   "Breakfast",
   "Breakfasts",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Breakfast != "loading" ? state.Breakfast.Items : state.Breakfast,
      Recipes_Breakfast_Recipes_page_index(self),
      Recipes_Breakfast_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Breakfast != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Breakfast: {
              ...state.Breakfast,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_Breakfast_Recipes(self, self.props.current_User, self.props.current_Admin))
        },
      (i,i_id) => {
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""} ` }
          
            >
            <div key={i_id}>
              {
                BreakfastViews.Breakfast({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Breakfast_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_Breakfast_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_Breakfast_Recipes(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Breakfast != "loading" && state.Breakfast.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Breakfast != "loading" &&
                    self.setState({...self.state(),
                      Breakfast:
                        {
                          ...state.Breakfast,
                          Items:state.Breakfast.Items.set(i_id,{...state.Breakfast.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Breakfast"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Breakfast != "loading" &&
                    self.setState({...self.state(),
                      Breakfast:
                        {
                          ...state.Breakfast,
                          Items:state.Breakfast.Items.set(i_id,
                            {...state.Breakfast.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Breakfast, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Breakfast != "loading" &&
                    self.setState({...self.state(),
                      dirty_Breakfast:state.dirty_Breakfast.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Breakfast:
                        {
                          ...state.Breakfast,
                          Items:state.Breakfast.Items.set(i_id,{...state.Breakfast.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Breakfast_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Breakfast_Breakfast_Recipess(i.element, self.props.entity).then(() =>
                      load_relation_Recipes_Breakfast_Recipes(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Breakfast(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Breakfast_Recipes(self.props.current_User, self.props.current_Admin) && Recipes_Breakfast_Recipes_can_create(self) ? render_new_Recipes_Breakfast_Recipes(self) : null}
          {Permissions.can_create_Breakfast_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_Recipes_Breakfast_Recipes(self) : null}
        </div>)
    }
    
    </div>
}


export function render_Recipes_Lunch_Recipes(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Lunch_Recipes") || !Permissions.can_view_Lunch(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    { List.render_relation("recipes_lunch_recipes",
   "Recipes",
   "Lunch",
   "Lunches",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Lunch != "loading" ? state.Lunch.Items : state.Lunch,
      Recipes_Lunch_Recipes_page_index(self),
      Recipes_Lunch_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Lunch != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Lunch: {
              ...state.Lunch,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_Lunch_Recipes(self, self.props.current_User, self.props.current_Admin))
        },
      (i,i_id) => {
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""} ` }
          
            >
            <div key={i_id}>
              {
                LunchViews.Lunch({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Lunch_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_Lunch_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_Lunch_Recipes(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Lunch != "loading" && state.Lunch.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Lunch != "loading" &&
                    self.setState({...self.state(),
                      Lunch:
                        {
                          ...state.Lunch,
                          Items:state.Lunch.Items.set(i_id,{...state.Lunch.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Lunch"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Lunch != "loading" &&
                    self.setState({...self.state(),
                      Lunch:
                        {
                          ...state.Lunch,
                          Items:state.Lunch.Items.set(i_id,
                            {...state.Lunch.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Lunch, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Lunch != "loading" &&
                    self.setState({...self.state(),
                      dirty_Lunch:state.dirty_Lunch.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Lunch:
                        {
                          ...state.Lunch,
                          Items:state.Lunch.Items.set(i_id,{...state.Lunch.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Lunch_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Lunch_Lunch_Recipess(i.element, self.props.entity).then(() =>
                      load_relation_Recipes_Lunch_Recipes(self, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Lunch(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Lunch_Recipes(self.props.current_User, self.props.current_Admin) && Recipes_Lunch_Recipes_can_create(self) ? render_new_Recipes_Lunch_Recipes(self) : null}
          {Permissions.can_create_Lunch_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_Recipes_Lunch_Recipes(self) : null}
        </div>)
    }
    
    </div>
}



export function render_relations_Recipes(self:RecipesContext) {
  return <div className="relations">
      
      
    </div>
}

export function render_add_existing_Recipes_User_Recipes(self:RecipesContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_User != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_User:"open"}) }
                  target_name={"User"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"recipes_user_recipes",
              source_name:"Recipes",
              target_name:"User",
              target_plural:"Users",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_User:"saving"}, () =>
                          Api.link_Recipes_User_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_User:"closed"}, () =>
                              load_relation_Recipes_User_Recipes(self, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      UserViews.User({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("User"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.User, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_User:"closed"}),
              get_items:[
                { name: "User", get: async(i,s) => Api.get_unlinked_Recipes_User_Recipess(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  
export function render_add_existing_Recipes_Dinner_Recipes(self:RecipesContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Dinner != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Dinner:"open"}) }
                  target_name={"Dinner"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"recipes_dinner_recipes",
              source_name:"Recipes",
              target_name:"Dinner",
              target_plural:"Dinners",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Dinner:"saving"}, () =>
                          Api.link_Recipes_Dinner_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Dinner:"closed"}, () =>
                              load_relation_Recipes_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      DinnerViews.Dinner({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Dinner"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Dinner, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Dinner:"closed"}),
              get_items:[
                { name: "Dinner", get: async(i,s) => Api.get_unlinked_Recipes_Dinner_Recipess(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  
export function render_add_existing_Recipes_Breakfast_Recipes(self:RecipesContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Breakfast != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Breakfast:"open"}) }
                  target_name={"Breakfast"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"recipes_breakfast_recipes",
              source_name:"Recipes",
              target_name:"Breakfast",
              target_plural:"Breakfasts",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Breakfast:"saving"}, () =>
                          Api.link_Recipes_Breakfast_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Breakfast:"closed"}, () =>
                              load_relation_Recipes_Breakfast_Recipes(self, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      BreakfastViews.Breakfast({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Breakfast"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Breakfast, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Breakfast:"closed"}),
              get_items:[
                { name: "Breakfast", get: async(i,s) => Api.get_unlinked_Recipes_Breakfast_Recipess(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  
export function render_add_existing_Recipes_Lunch_Recipes(self:RecipesContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Lunch != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Lunch:"open"}) }
                  target_name={"Lunch"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"recipes_lunch_recipes",
              source_name:"Recipes",
              target_name:"Lunch",
              target_plural:"Lunches",
              page_size:10,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Lunch:"saving"}, () =>
                          Api.link_Recipes_Lunch_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Lunch:"closed"}, () =>
                              load_relation_Recipes_Lunch_Recipes(self, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      LunchViews.Lunch({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Lunch"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Lunch, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Lunch:"closed"}),
              get_items:[
                { name: "Lunch", get: async(i,s) => Api.get_unlinked_Recipes_Lunch_Recipess(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  

export function render_new_Recipes_User_Recipes(self:RecipesContext) {
    let state = self.state()
    return state.create_step_User != "none" ?
            <div className="overlay__item overlay__item--new">
              <label>
                {i18next.t('Username')}
                <input type="text"
                  value={state.create_step_User.username}
                  onChange={(e) =>
                    state.create_step_User != "none" &&
                    self.setState({...self.state(),
                      create_step_User: {...state.create_step_User,
                        username: (e.target as HTMLInputElement).value }})
                  }/>
              </label>
              <label>
                {i18next.t('Email')}
                <input type="email"
                  value={state.create_step_User.email}
                  onChange={(e) =>
                    state.create_step_User != "none" &&
                    self.setState({...self.state(),
                      create_step_User: {...state.create_step_User,
                        email: (e.target as HTMLInputElement).value }})
                  }/>
              </label>
              <label>
                {i18next.t('Email confirmation')}
                <input type="email"
                  value={state.create_step_User.email_confirmation}
                  onChange={(e) =>
                    state.create_step_User != "none" &&
                    self.setState({...self.state(),
                      create_step_User: {...state.create_step_User,
                        email_confirmation: (e.target as HTMLInputElement).value }})
                  }/>
              </label>
              { state.create_step_User.validation == "validating" ?
                <div className="loading">{i18next.t('Validating')}</div>
              :
                <Buttons.Create onClick={() =>
                  state.create_step_User != "none" &&
                  Api.validate_User(state.create_step_User.username, state.create_step_User.email, state.create_step_User.email_confirmation).then(is_valid =>
                    {
                      if (state.create_step_User != "none" && is_valid) {
                        Api.register_User(state.create_step_User.username, state.create_step_User.email, state.create_step_User.email_confirmation).then(() =>
                          load_relation_Recipes_User_Recipes(self, self.props.current_User, self.props.current_Admin, () =>
                            self.setState({...self.state(), create_step_User:"none"})
                          )
                        )
                      } else {
                        state.create_step_User != "none" &&
                        self.setState({...self.state(),
                          create_step_User: {...state.create_step_User, validation: "invalid" } }, () =>
                          alert(i18next.t('The username and email combination is invalid or it might already be in use. Please try a different combination.')))
                      }
                    }).catch(() =>
                      state.create_step_User != "none" &&
                      self.setState({...self.state(),
                        create_step_User: {...state.create_step_User, validation: "invalid" } }, () =>
                        alert(i18next.t('The username and email combination is invalid or it might already be in use. Please try a different combination.')))
                    )
                } target_name="User" />
              }
              <Buttons.Cancel onClick={() => self.setState({...self.state(), create_step_User:"none"})} />
            </div>
      :  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-user">
              <button 
                      className="new-user button button--new"
                      onClick={() =>
                          self.setState({...self.state(), create_step_User:{ validation:"invalid", username:"", email:"", email_confirmation:"" }
                          })
                      }>
                  {i18next.t('Create new User')}
              </button>
            </div>
        </div>
      :
      null
    }
  
export function render_new_Recipes_Dinner_Recipes(self:RecipesContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-dinner">
              <button 
                      className="new-dinner button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Dinner_Recipess_Dinner(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Dinner(
                                ({ ...e[0], Kind:"Dinner", Description:"" } as Models.Dinner)).then(() =>
                                load_relation_Recipes_Dinner_Recipes(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Dinner:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Dinner')}
              </button>
            </div>
        </div>
      :
      null
    }
  
export function render_new_Recipes_Breakfast_Recipes(self:RecipesContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-breakfast">
              <button 
                      className="new-breakfast button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Breakfast_Recipess_Breakfast(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Breakfast(
                                ({ ...e[0], Kind:"Breakfast", Description:"" } as Models.Breakfast)).then(() =>
                                load_relation_Recipes_Breakfast_Recipes(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Breakfast:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Breakfast')}
              </button>
            </div>
        </div>
      :
      null
    }
  
export function render_new_Recipes_Lunch_Recipes(self:RecipesContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-lunch">
              <button 
                      className="new-lunch button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Lunch_Recipess_Lunch(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Lunch(
                                ({ ...e[0], Kind:"Lunch", Description:"" } as Models.Lunch)).then(() =>
                                load_relation_Recipes_Lunch_Recipes(self, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Lunch:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Lunch')}
              </button>
            </div>
        </div>
      :
      null
    }
  

export function render_saving_animations_Recipes(self:RecipesContext) {
  return self.state().dirty_User.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Dinner.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Breakfast.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Lunch.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type RecipesContext = {state:()=>RecipesState, props:Utils.EntityComponentProps<Models.Recipes>, setState:(new_state:RecipesState, callback?:()=>void) => void}

export type RecipesState = {
    update_count:number
    add_step_User:"closed"|"open"|"saving",
      create_step_User:{ validation:"valid"|"validating"|"invalid", username:string, email:string, email_confirmation:string }|"none",dirty_User:Immutable.Map<number,Models.User>,
      User:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.User>>|"loading"
  add_step_Dinner:"closed"|"open"|"saving",
      dirty_Dinner:Immutable.Map<number,Models.Dinner>,
      Dinner:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Dinner>>|"loading"
  add_step_Breakfast:"closed"|"open"|"saving",
      dirty_Breakfast:Immutable.Map<number,Models.Breakfast>,
      Breakfast:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Breakfast>>|"loading"
  add_step_Lunch:"closed"|"open"|"saving",
      dirty_Lunch:Immutable.Map<number,Models.Lunch>,
      Lunch:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Lunch>>|"loading"
  }
export class RecipesComponent extends React.Component<Utils.EntityComponentProps<Models.Recipes>, RecipesState> {
  constructor(props:Utils.EntityComponentProps<Models.Recipes>, context:any) {
    super(props, context)
    this.state = { update_count:0, add_step_User:"closed", create_step_User:"none",dirty_User:Immutable.Map<number,Models.User>(), User:"loading", add_step_Dinner:"closed", dirty_Dinner:Immutable.Map<number,Models.Dinner>(), Dinner:"loading", add_step_Breakfast:"closed", dirty_Breakfast:Immutable.Map<number,Models.Breakfast>(), Breakfast:"loading", add_step_Lunch:"closed", dirty_Lunch:Immutable.Map<number,Models.Lunch>(), Lunch:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Recipes>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_User ||this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_User ||new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Recipes(this.get_self(), new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Recipes(this.get_self(), this.props.current_User, this.props.current_Admin)

    this.thread = setInterval(() => {
      if (this.state.dirty_User.count() > 0) {
         let first = this.state.dirty_User.first()
         this.setState({...this.state, dirty_User: this.state.dirty_User.remove(first.Id)}, () =>
           Api.update_User(first)
         )
       } else if (this.state.dirty_Dinner.count() > 0) {
         let first = this.state.dirty_Dinner.first()
         this.setState({...this.state, dirty_Dinner: this.state.dirty_Dinner.remove(first.Id)}, () =>
           Api.update_Dinner(first)
         )
       } else if (this.state.dirty_Breakfast.count() > 0) {
         let first = this.state.dirty_Breakfast.first()
         this.setState({...this.state, dirty_Breakfast: this.state.dirty_Breakfast.remove(first.Id)}, () =>
           Api.update_Breakfast(first)
         )
       } else if (this.state.dirty_Lunch.count() > 0) {
         let first = this.state.dirty_Lunch.first()
         this.setState({...this.state, dirty_Lunch: this.state.dirty_Lunch.remove(first.Id)}, () =>
           Api.update_Lunch(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Recipes(this.props.current_User, this.props.current_Admin) ?
              render_breadcrumb_Recipes(this.get_self())
              : null
    }

    return <div id={`Recipes_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model recipes`}>
      { render_saving_animations_Recipes(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_Recipes(this.get_self()) : null }
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
        { this.props.nesting_depth == 0 ? render_local_menu_Recipes(this.get_self()) : null }
        { render_controls_Recipes(this.get_self()) }
        { render_content_Recipes(this.get_self()) }
      </div>
    </div>
  }
}

export let Recipes = (props:Utils.EntityComponentProps<Models.Recipes>) : JSX.Element =>
  <RecipesComponent {...props} />

export let Recipes_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Recipes, Permissions.can_edit_User_Recipes, Permissions.can_edit_Dinner_Recipes, Permissions.can_edit_Breakfast_Recipes, Permissions.can_edit_Lunch_Recipes, Permissions.can_edit_User, Permissions.can_edit_Dinner, Permissions.can_edit_Breakfast, Permissions.can_edit_Lunch])
  return Utils.scene_to_page<Models.Recipes>(can_edit, Recipes, Api.get_Recipes(id), Api.update_Recipes, "Recipes", "Recipes", `/Recipess/${id}`)
}

export let Recipes_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Recipes_to_page(id),
    current_User, current_Admin
  )
}
