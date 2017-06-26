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
import * as CategoryListViews from './CategoryList'
import * as BookmarksViews from './Bookmarks'
import * as MealViews from './Meal'
import * as AmericanViews from './American'
import * as AsianViews from './Asian'
import * as MediterraneanViews from './Mediterranean'
import * as CustomViews from '../custom_views'
export let Categorie = (props:Utils.EntityComponentProps<Models.Categorie>) : JSX.Element =>
  props.entity.Kind == "American" ?
      AmericanViews.American({...props,
            set_entity:(e,c) => props.set_entity(e as Models.Categorie, c),
            entity:props.entity as Models.American})
       : props.entity.Kind == "Asian" ?
      AsianViews.Asian({...props,
            set_entity:(e,c) => props.set_entity(e as Models.Categorie, c),
            entity:props.entity as Models.Asian})
       : props.entity.Kind == "Mediterranean" ?
      MediterraneanViews.Mediterranean({...props,
            set_entity:(e,c) => props.set_entity(e as Models.Categorie, c),
            entity:props.entity as Models.Mediterranean})
       : null

export let Categorie_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Categorie, Permissions.can_edit_Categorie_Meal, Permissions.can_edit_Meal])
  return Utils.scene_to_page<Models.Categorie>(can_edit, Categorie, Api.get_Categorie(id), Api.update_Categorie, "Categorie", "Categorie", `/Categories/${id}`)
}

export let Categorie_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Categorie_to_page(id),
    current_User, current_Admin
  )
}
