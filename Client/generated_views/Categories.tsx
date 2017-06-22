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
import * as MealViews from './Meal'
import * as AmericanViews from './American'
import * as AsianViews from './Asian'
import * as MediterraneanViews from './Mediterranean'

export let Categories = (props:Utils.EntityComponentProps<Models.Categories>) : JSX.Element =>
  props.entity.Kind == "American" ?
      AmericanViews.American({...props,
            set_entity:(e,c) => props.set_entity(e as Models.Categories, c),
            entity:props.entity as Models.American})
       : props.entity.Kind == "Asian" ?
      AsianViews.Asian({...props,
            set_entity:(e,c) => props.set_entity(e as Models.Categories, c),
            entity:props.entity as Models.Asian})
       : props.entity.Kind == "Mediterranean" ?
      MediterraneanViews.Mediterranean({...props,
            set_entity:(e,c) => props.set_entity(e as Models.Categories, c),
            entity:props.entity as Models.Mediterranean})
       : null

export let Categories_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Categories, Permissions.can_edit_Categories_Meal, Permissions.can_edit_HomePage_Categories, Permissions.can_edit_Meal, Permissions.can_edit_HomePage])
  return Utils.scene_to_page<Models.Categories>(can_edit, Categories, Api.get_Categories(id), Api.update_Categories, "Categories", "Categories", `/Categoriess/${id}`)
}

export let Categories_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Categories_to_page(id),
    current_User, current_Admin
  )
}
