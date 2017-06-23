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
import * as RatingViews from './Rating'
import * as MealViews from './Meal'


export function Recipes_User_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? false : state.User.CanCreate
}
export function Recipes_Recipes_Rating_can_create(self:RecipesContext) {
  let state = self.state()
  return state.Rating == "loading" ? false : state.Rating.CanCreate
}
export function Recipes_Meal_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.Meal == "loading" ? false : state.Meal.CanCreate
}
export function Recipes_HomePage_Recipes_can_create(self:RecipesContext) {
  let state = self.state()
  return state.HomePage == "loading" ? false : state.HomePage.CanCreate
}
export function Recipes_User_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? false : state.User.CanDelete
}
export function Recipes_Recipes_Rating_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.Rating == "loading" ? false : state.Rating.CanDelete
}
export function Recipes_Meal_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.Meal == "loading" ? false : state.Meal.CanDelete
}
export function Recipes_HomePage_Recipes_can_delete(self:RecipesContext) {
  let state = self.state()
  return state.HomePage == "loading" ? false : state.HomePage.CanDelete
}
export function Recipes_User_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? 0 : state.User.PageIndex
}
export function Recipes_Recipes_Rating_page_index(self:RecipesContext) {
  let state = self.state()
  return state.Rating == "loading" ? 0 : state.Rating.PageIndex
}
export function Recipes_Meal_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.Meal == "loading" ? 0 : state.Meal.PageIndex
}
export function Recipes_HomePage_Recipes_page_index(self:RecipesContext) {
  let state = self.state()
  return state.HomePage == "loading" ? 0 : state.HomePage.PageIndex
}
export function Recipes_User_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? 25 : state.User.PageSize
}
export function Recipes_Recipes_Rating_page_size(self:RecipesContext) {
  let state = self.state()
  return state.Rating == "loading" ? 25 : state.Rating.PageSize
}
export function Recipes_Meal_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.Meal == "loading" ? 25 : state.Meal.PageSize
}
export function Recipes_HomePage_Recipes_page_size(self:RecipesContext) {
  let state = self.state()
  return state.HomePage == "loading" ? 25 : state.HomePage.PageSize
}
export function Recipes_User_Recipes_search_query(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? null : state.User.SearchQuery
}
export function Recipes_Recipes_Rating_search_query(self:RecipesContext) {
  let state = self.state()
  return state.Rating == "loading" ? null : state.Rating.SearchQuery
}
export function Recipes_Meal_Recipes_search_query(self:RecipesContext) {
  let state = self.state()
  return state.Meal == "loading" ? null : state.Meal.SearchQuery
}
export function Recipes_HomePage_Recipes_search_query(self:RecipesContext) {
  let state = self.state()
  return state.HomePage == "loading" ? null : state.HomePage.SearchQuery
}
export function Recipes_User_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.User == "loading" ? 1 : state.User.NumPages
}
export function Recipes_Recipes_Rating_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.Rating == "loading" ? 1 : state.Rating.NumPages
}
export function Recipes_Meal_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.Meal == "loading" ? 1 : state.Meal.NumPages
}
export function Recipes_HomePage_Recipes_num_pages(self:RecipesContext) {
  let state = self.state()
  return state.HomePage == "loading" ? 1 : state.HomePage.NumPages
}

export function load_relation_Recipes_User_Recipes(self:RecipesContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.User != "loading" ?
    (c:() => void) => state.User != "loading" && self.setState({
      ...state,
      User: {...state.User, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_User(current_User, current_Admin) ?
    prelude(() =>
      Api.get_Recipes_User_Recipess(self.props.entity, Recipes_User_Recipes_page_index(self), Recipes_User_Recipes_page_size(self), Recipes_User_Recipes_search_query(self)).then(Users =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            User:Utils.raw_page_to_paginated_items<Models.User, Utils.EntityAndSize<Models.User> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.User != "loading" ?
                  (state.User.Items.has(i.Id) ?
                    state.User.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Users)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relation_Recipes_Recipes_Rating(self:RecipesContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Rating != "loading" ?
    (c:() => void) => state.Rating != "loading" && self.setState({
      ...state,
      Rating: {...state.Rating, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Rating(current_User, current_Admin) ?
    prelude(() =>
      Api.get_Recipes_Recipes_Ratings(self.props.entity, Recipes_Recipes_Rating_page_index(self), Recipes_Recipes_Rating_page_size(self), Recipes_Recipes_Rating_search_query(self)).then(Ratings =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Rating:Utils.raw_page_to_paginated_items<Models.Rating, Utils.EntityAndSize<Models.Rating> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Rating != "loading" ?
                  (state.Rating.Items.has(i.Id) ?
                    state.Rating.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Ratings)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relation_Recipes_Meal_Recipes(self:RecipesContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.Meal != "loading" ?
    (c:() => void) => state.Meal != "loading" && self.setState({
      ...state,
      Meal: {...state.Meal, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_Meal(current_User, current_Admin) ?
    prelude(() =>
      Api.get_Recipes_Meal_Recipess(self.props.entity, Recipes_Meal_Recipes_page_index(self), Recipes_Meal_Recipes_page_size(self), Recipes_Meal_Recipes_search_query(self)).then(Meals =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            Meal:Utils.raw_page_to_paginated_items<Models.Meal, Utils.EntityAndSize<Models.Meal> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.Meal != "loading" ?
                  (state.Meal.Items.has(i.Id) ?
                    state.Meal.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, Meals)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relation_Recipes_HomePage_Recipes(self:RecipesContext, force_first_page:boolean, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.HomePage != "loading" ?
    (c:() => void) => state.HomePage != "loading" && self.setState({
      ...state,
      HomePage: {...state.HomePage, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_HomePage(current_User, current_Admin) ?
    prelude(() =>
      Api.get_Recipes_HomePage_Recipess(self.props.entity, Recipes_HomePage_Recipes_page_index(self), Recipes_HomePage_Recipes_page_size(self), Recipes_HomePage_Recipes_search_query(self)).then(HomePages =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            HomePage:Utils.raw_page_to_paginated_items<Models.HomePage, Utils.EntityAndSize<Models.HomePage> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.HomePage != "loading" ?
                  (state.HomePage.Items.has(i.Id) ?
                    state.HomePage.Items.get(i.Id).size
                  :
                    "preview" /* i_just_created ? "large" : "preview" */)
                  :
                    "preview" /* i_just_created ? "large" : "preview" */,
                shown_relation:"all"}}, HomePages)
            }, callback)))
    :
      prelude(() => callback && callback())
}

export function load_relations_Recipes(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  load_relation_Recipes_HomePage_Recipes(self, false, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Recipes_Meal_Recipes(self, false, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Recipes_Recipes_Rating(self, false, self.props.current_User, self.props.current_Admin, 
        () => load_relation_Recipes_User_Recipes(self, false, self.props.current_User, self.props.current_Admin, 
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
    let state = self.state()
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
          
            {!Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin) ? null :
                  <div className={`menu_entry active`}>
                    <a onClick={() =>
                        {
                            Api.get_HomePages(0, 1).then(e =>
                              e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id),
                                () => self.props.set_shown_relation("HomePage_Recipes"))
                            )
                        }
                      }>
                      {i18next.t('HomePage_Recipess')}
                    </a>
                  </div>
                }
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
          
            {!Permissions.can_view_Rating(self.props.current_User, self.props.current_Admin) ? null :
                  <div key={"Recipes_Rating"} className={`local_menu_entry${self.props.shown_relation == "Recipes_Rating" ? " local_menu_entry--active" : ""}`}>
                    <a onClick={() =>
                      load_relation_Recipes_Recipes_Rating(self,
                        false,
                        self.props.current_User, self.props.current_Admin, 
                        () => self.props.set_shown_relation("Recipes_Rating"))
                    }>
                      {i18next.t('Recipes_Ratings')}
                    </a>
                  </div>
                }  
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
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_Recipes(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,self.props.allow_fullscreen && self.props.set_size && self.props.size == "preview" ?
        () => set_size_Recipes(self, self.props.size == "fullscreen" ? "large" : "fullscreen")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_Recipes(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_Recipes(self)
      : self.props.size == "large" ?
        render_large_Recipes(self)
      : self.props.size == "fullscreen" ?
        render_large_Recipes(self)
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
  let state = self.state()
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
      state.User != "loading" ?
        state.User.IdsInServerOrder.map(id => state.User != "loading" && state.User.Items.get(id)):
        state.User,
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
          }, () =>  load_relation_Recipes_User_Recipes(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.User != "loading" && state.User.JustCreated.has(i_id) && state.User.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
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
                      load_relation_Recipes_User_Recipes(self, false, self.props.current_User, self.props.current_Admin))
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


export function render_Recipes_Recipes_Rating(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Recipes_Rating") || !Permissions.can_view_Rating(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("recipes_recipes_rating",
   "Recipes",
   "Rating",
   "Ratings",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Rating != "loading" ?
        state.Rating.IdsInServerOrder.map(id => state.Rating != "loading" && state.Rating.Items.get(id)):
        state.Rating,
      Recipes_Recipes_Rating_page_index(self),
      Recipes_Recipes_Rating_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Rating != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Rating: {
              ...state.Rating,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_Recipes_Rating(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Rating != "loading" && state.Rating.JustCreated.has(i_id) && state.Rating.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                RatingViews.Rating({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Recipes_Rating(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_Recipes_Rating(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_Recipes_Rating(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Rating != "loading" && state.Rating.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Rating != "loading" &&
                    self.setState({...self.state(),
                      Rating:
                        {
                          ...state.Rating,
                          Items:state.Rating.Items.set(i_id,{...state.Rating.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Rating"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Rating != "loading" &&
                    self.setState({...self.state(),
                      Rating:
                        {
                          ...state.Rating,
                          Items:state.Rating.Items.set(i_id,
                            {...state.Rating.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Rating, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Rating != "loading" &&
                    self.setState({...self.state(),
                      dirty_Rating:state.dirty_Rating.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Rating:
                        {
                          ...state.Rating,
                          Items:state.Rating.Items.set(i_id,{...state.Rating.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Recipes_Rating(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Recipes_Recipes_Ratings(self.props.entity, i.element).then(() =>
                      load_relation_Recipes_Recipes_Rating(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Recipes_Rating(self.props.current_User, self.props.current_Admin) && Recipes_Recipes_Rating_can_create(self) ? render_new_Recipes_Recipes_Rating(self) : null}
          {Permissions.can_create_Recipes_Rating(self.props.current_User, self.props.current_Admin) ? render_add_existing_Recipes_Recipes_Rating(self) : null}
        </div>)
    }
    
    </div>
}


export function render_Recipes_Meal_Recipes(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "Meal_Recipes") || !Permissions.can_view_Meal(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("recipes_meal_recipes",
   "Recipes",
   "Meal",
   "Meals",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.Meal != "loading" ?
        state.Meal.IdsInServerOrder.map(id => state.Meal != "loading" && state.Meal.Items.get(id)):
        state.Meal,
      Recipes_Meal_Recipes_page_index(self),
      Recipes_Meal_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.Meal != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            Meal: {
              ...state.Meal,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_Meal_Recipes(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.Meal != "loading" && state.Meal.JustCreated.has(i_id) && state.Meal.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                MealViews.Meal({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_Meal_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_create_Meal_Recipes(self.props.current_User, self.props.current_Admin)
                        || Permissions.can_delete_Meal_Recipes(self.props.current_User, self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.Meal != "loading" && state.Meal.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.Meal != "loading" &&
                    self.setState({...self.state(),
                      Meal:
                        {
                          ...state.Meal,
                          Items:state.Meal.Items.set(i_id,{...state.Meal.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("Meal"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.Meal != "loading" &&
                    self.setState({...self.state(),
                      Meal:
                        {
                          ...state.Meal,
                          Items:state.Meal.Items.set(i_id,
                            {...state.Meal.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.Meal, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.Meal != "loading" &&
                    self.setState({...self.state(),
                      dirty_Meal:state.dirty_Meal.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      Meal:
                        {
                          ...state.Meal,
                          Items:state.Meal.Items.set(i_id,{...state.Meal.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  delete: undefined,
                  unlink: !Permissions.can_delete_Meal_Recipes(self.props.current_User, self.props.current_Admin) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.unlink_Meal_Meal_Recipess(i.element, self.props.entity).then(() =>
                      load_relation_Recipes_Meal_Recipes(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_Meal(self.props.current_User, self.props.current_Admin) && Permissions.can_create_Meal_Recipes(self.props.current_User, self.props.current_Admin) && Recipes_Meal_Recipes_can_create(self) ? render_new_Recipes_Meal_Recipes(self) : null}
          {Permissions.can_create_Meal_Recipes(self.props.current_User, self.props.current_Admin) ? render_add_existing_Recipes_Meal_Recipes(self) : null}
        </div>)
    }
    
    </div>
}


export function render_Recipes_HomePage_Recipes(self:RecipesContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_Recipes") || !Permissions.can_view_HomePage(self.props.current_User, self.props.current_Admin))
    return null
  let state = self.state()
  return <div>
    
    { List.render_relation("recipes_homepage_recipes",
   "Recipes",
   "HomePage",
   "HomePages",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.HomePage != "loading" ?
        state.HomePage.IdsInServerOrder.map(id => state.HomePage != "loading" && state.HomePage.Items.get(id)):
        state.HomePage,
      Recipes_HomePage_Recipes_page_index(self),
      Recipes_HomePage_Recipes_num_pages(self),
      new_page_index => {
          let state = self.state()
          state.HomePage != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            HomePage: {
              ...state.HomePage,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_Recipes_HomePage_Recipes(self, false, self.props.current_User, self.props.current_Admin))
        },
      (i,_) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.HomePage != "loading" && state.HomePage.JustCreated.has(i_id) && state.HomePage.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={i_id}>
              {
                HomePageViews.HomePage({
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
                  is_editable:state.HomePage != "loading" && state.HomePage.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.HomePage != "loading" &&
                    self.setState({...self.state(),
                      HomePage:
                        {
                          ...state.HomePage,
                          Items:state.HomePage.Items.set(i_id,{...state.HomePage.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("HomePage"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.HomePage != "loading" &&
                    self.setState({...self.state(),
                      HomePage:
                        {
                          ...state.HomePage,
                          Items:state.HomePage.Items.set(i_id,
                            {...state.HomePage.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.HomePage, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.HomePage != "loading" &&
                    self.setState({...self.state(),
                      dirty_HomePage:state.dirty_HomePage.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      HomePage:
                        {
                          ...state.HomePage,
                          Items:state.HomePage.Items.set(i_id,{...state.HomePage.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                    delete: !Permissions.can_delete_HomePage(self.props.current_User, self.props.current_Admin) || !Recipes_HomePage_Recipes_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_HomePage(i.element).then(() =>
                      load_relation_Recipes_HomePage_Recipes(self, false, self.props.current_User, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          
          
        </div>)
    }
    
    </div>
}



export function render_relations_Recipes(self:RecipesContext) {
  return <div className="relations">
      { render_Recipes_Recipes_Rating(self, "default") }
      
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
              page_size:25,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_User:"saving"}, () =>
                          Api.link_Recipes_User_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_User:"closed"}, () =>
                              load_relation_Recipes_User_Recipes(self, false, self.props.current_User, self.props.current_Admin))))
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
  
export function render_add_existing_Recipes_Recipes_Rating(self:RecipesContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Rating != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Rating:"open"}) }
                  target_name={"Rating"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"recipes_recipes_rating",
              source_name:"Recipes",
              target_name:"Rating",
              target_plural:"Ratings",
              page_size:25,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Rating:"saving"}, () =>
                          Api.link_Recipes_Recipes_Ratings(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Rating:"closed"}, () =>
                              load_relation_Recipes_Recipes_Rating(self, false, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      RatingViews.Rating({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Rating"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Rating, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Rating:"closed"}),
              get_items:[
                { name: "Rating", get: async(i,s) => Api.get_unlinked_Recipes_Recipes_Ratings(self.props.entity, i, s) },
              ]
            })
        }
      </div>
    :
      null
    }
  
export function render_add_existing_Recipes_Meal_Recipes(self:RecipesContext) {
    
    let state = self.state()
    return self.props.mode == "edit" ?
      <div className="button__actions">
        {
          state.add_step_Meal != "open" ?
            <Buttons.Add 
              onClick={() =>
                self.setState({...self.state(), add_step_Meal:"open"}) }
                  target_name={"Meal"} />
          :
          React.createElement(List.AddToRelation,
            {
              relation_name:"recipes_meal_recipes",
              source_name:"Recipes",
              target_name:"Meal",
              target_plural:"Meals",
              page_size:25,
              render_target:(i,i_id) =>
                <div key={i_id} className="group__item">
                  <a className="group__button button button--existing"
                    onClick={() =>
                        self.setState({...self.state(), add_step_Meal:"saving"}, () =>
                          Api.link_Recipes_Meal_Recipess(self.props.entity, i).then(() =>
                            self.setState({...self.state(), add_step_Meal:"closed"}, () =>
                              load_relation_Recipes_Meal_Recipes(self, false, self.props.current_User, self.props.current_Admin))))
                      }>
                      Add existing
                  </a>
                  <div className="group__title" disabled={true}>
                    {
                      MealViews.Meal({
                        ...self.props,
                        entity:i,
                        nesting_depth:self.props.nesting_depth+1,
                        size:"preview",
                        mode:"view",
                        is_editable:false,
                        nested_entity_names: self.props.nested_entity_names.push("Meal"),
                        set_size:undefined,
                        toggle_button:undefined,
                        set_mode:undefined,
                        set_entity:(new_entity:Models.Meal, callback?:()=>void) => {},
                        unlink: undefined,
                        delete: undefined
                      })
                    }
                  </div>
                </div>,
              cancel:() => self.setState({...self.state(), add_step_Meal:"closed"}),
              get_items:[
                { name: "Lunch", get: async(i,s) => Api.get_unlinked_Recipes_Meal_Recipess_Lunch(self.props.entity, i, s) }, 
                { name: "Dinner", get: async(i,s) => Api.get_unlinked_Recipes_Meal_Recipess_Dinner(self.props.entity, i, s) }, 
                { name: "Breakfast", get: async(i,s) => Api.get_unlinked_Recipes_Meal_Recipess_Breakfast(self.props.entity, i, s) }
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
                          load_relation_Recipes_User_Recipes(self, false, self.props.current_User, self.props.current_Admin, () =>
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
  
export function render_new_Recipes_Recipes_Rating(self:RecipesContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <div className="new-rating">
              <button 
                      className="new-rating button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Recipes_Ratings_Rating(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Rating(
                                ({ ...e[0], rating:0 } as Models.Rating)).then(() =>
                                load_relation_Recipes_Recipes_Rating(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Rating:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Rating')}
              </button>
            </div>
        </div>
      :
      null
    }
  
export function render_new_Recipes_Meal_Recipes(self:RecipesContext) {
    let state = self.state()
    return  self.props.mode == "edit" ?
      <div className="button__actions">
        <Buttons.Create target_name={"Meal"} onClick={() => self.setState({...self.state(), add_step_Meal:"creating"})}  />
            {
            state.add_step_Meal != "creating" ?
            null
            :
            <div className="overlay__item overlay__item--new">
              <div className="new-lunch">
              <button 
                      className="new-lunch button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Meal_Recipess_Lunch(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Lunch(
                                ({ ...e[0], Kind:"Lunch", Description:"" } as Models.Lunch)).then(() =>
                                load_relation_Recipes_Meal_Recipes(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Meal:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Lunch')}
              </button>
            </div>
            <div className="new-dinner">
              <button 
                      className="new-dinner button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Meal_Recipess_Dinner(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Dinner(
                                ({ ...e[0], Kind:"Dinner", Description:"" } as Models.Dinner)).then(() =>
                                load_relation_Recipes_Meal_Recipes(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Meal:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Dinner')}
              </button>
            </div>
            <div className="new-breakfast">
              <button 
                      className="new-breakfast button button--new"
                      onClick={() =>
                          Api.create_linked_Recipes_Meal_Recipess_Breakfast(self.props.entity).then(e => {
                              e.length > 0 &&
                              Api.update_Breakfast(
                                ({ ...e[0], Kind:"Breakfast", Description:"" } as Models.Breakfast)).then(() =>
                                load_relation_Recipes_Meal_Recipes(self, true, self.props.current_User, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_Meal:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new Breakfast')}
              </button>
            </div>
              <Buttons.Cancel onClick={() => self.setState({...self.state(), add_step_Meal:"closed"})} />
            </div>
            }
        </div>
      :
      null
    }
  

export function render_saving_animations_Recipes(self:RecipesContext) {
  return self.state().dirty_User.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Rating.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_Meal.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/> : 
    self.state().dirty_HomePage.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type RecipesContext = {state:()=>RecipesState, props:Utils.EntityComponentProps<Models.Recipes>, setState:(new_state:RecipesState, callback?:()=>void) => void}

export type RecipesState = {
    update_count:number
    add_step_User:"closed"|"open"|"saving",
      create_step_User:{ validation:"valid"|"validating"|"invalid", username:string, email:string, email_confirmation:string }|"none",dirty_User:Immutable.Map<number,Models.User>,
      User:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.User>>|"loading"
  add_step_Rating:"closed"|"open"|"saving",
      dirty_Rating:Immutable.Map<number,Models.Rating>,
      Rating:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Rating>>|"loading"
  add_step_Meal:"closed"|"open"|"saving"|"adding"|"creating",
      dirty_Meal:Immutable.Map<number,Models.Meal>,
      Meal:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.Meal>>|"loading"
  add_step_HomePage:"closed"|"open"|"saving",
      dirty_HomePage:Immutable.Map<number,Models.HomePage>,
      HomePage:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.HomePage>>|"loading"
  }
export class RecipesComponent extends React.Component<Utils.EntityComponentProps<Models.Recipes>, RecipesState> {
  constructor(props:Utils.EntityComponentProps<Models.Recipes>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_User:"closed", create_step_User:"none",dirty_User:Immutable.Map<number,Models.User>(), User:"loading", add_step_Rating:"closed", dirty_Rating:Immutable.Map<number,Models.Rating>(), Rating:"loading", add_step_Meal:"closed", dirty_Meal:Immutable.Map<number,Models.Meal>(), Meal:"loading", add_step_HomePage:"closed", dirty_HomePage:Immutable.Map<number,Models.HomePage>(), HomePage:"loading" }
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
      load_relations_Recipes(this.get_self(),  new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_Recipes(this.get_self(), this.props.current_User, this.props.current_Admin)
    }

    this.thread = setInterval(() => {
      if (this.state.dirty_User.count() > 0) {
         let first = this.state.dirty_User.first()
         this.setState({...this.state, dirty_User: this.state.dirty_User.remove(first.Id)}, () =>
           Api.update_User(first)
         )
       } else if (this.state.dirty_Rating.count() > 0) {
         let first = this.state.dirty_Rating.first()
         this.setState({...this.state, dirty_Rating: this.state.dirty_Rating.remove(first.Id)}, () =>
           Api.update_Rating(first)
         )
       } else if (this.state.dirty_Meal.count() > 0) {
         let first = this.state.dirty_Meal.first()
         this.setState({...this.state, dirty_Meal: this.state.dirty_Meal.remove(first.Id)}, () =>
           Api.update_Meal(first)
         )
       } else if (this.state.dirty_HomePage.count() > 0) {
         let first = this.state.dirty_HomePage.first()
         this.setState({...this.state, dirty_HomePage: this.state.dirty_HomePage.remove(first.Id)}, () =>
           Api.update_HomePage(first)
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
  let can_edit = Utils.any_of([Permissions.can_edit_Recipes, Permissions.can_edit_User_Recipes, Permissions.can_edit_Recipes_Rating, Permissions.can_edit_Meal_Recipes, Permissions.can_edit_HomePage_Recipes, Permissions.can_edit_User, Permissions.can_edit_Rating, Permissions.can_edit_Meal, Permissions.can_edit_HomePage])
  return Utils.scene_to_page<Models.Recipes>(can_edit, Recipes, Api.get_Recipes(id), Api.update_Recipes, "Recipes", "Recipes", `/Recipess/${id}`)
}

export let Recipes_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Recipes_to_page(id),
    current_User, current_Admin
  )
}
