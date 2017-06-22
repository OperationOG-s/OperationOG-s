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









export function load_relations_Rating(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  callback && callback()
}

export function set_size_Rating(self:RatingContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Rating_to_page(self.props.entity.Id))
  })
}

export function render_Rating_rating_editable_minimised(self:RatingContext) : JSX.Element {
  if (!Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin)) return render_Rating_rating_minimised(self)
  else
    return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute rating">
  <label className="attribute-label attribute-label-rating">{i18next.t(`Rating:rating`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.rating,
        v => self.props.set_entity({...self.props.entity, rating:v})) } 
  </div>
</div>
}


export function render_Rating_rating_editable_maximised(self:RatingContext) : JSX.Element {
  if (!Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin)) return render_Rating_rating_maximised(self)
  else
    return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute rating">
  <label className="attribute-label attribute-label-rating">{i18next.t(`Rating:rating`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.rating,
        v => self.props.set_entity({...self.props.entity, rating:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_Rating(self:RatingContext) {
  let attributes = (<div>
      {render_Rating_rating_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Rating(self:RatingContext) {
    let attributes = (<div>
        {render_Rating_rating_editable_maximised(self)}
      </div>)
    return attributes
  }

export function render_breadcrumb_Rating(self:RatingContext) {
  return <div className="breadcrumb-rating">Rating</div>
}

export function render_menu_Rating(self:RatingContext) {
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

export function render_local_menu_Rating(self:RatingContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this Rating')}
              </a>
            </div>
          
              
          </div>
        </div>
}

export function render_controls_Rating(self:RatingContext) {
  return <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"rating button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_Rating(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {self.props.allow_fullscreen && self.props.set_size ? <a className="rating button button--fullscreen"
        onClick={() => set_size_Rating(self, self.props.size == "fullscreen" ? "large" : "fullscreen")}>
      </a> : null}
    {Permissions.can_delete_Rating(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_Rating(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="rating button button--close"
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

export function render_content_Rating(self:RatingContext) {
  return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
    {Permissions.can_view_Rating(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_Rating(self)
      : self.props.size == "large" ?
        render_large_Rating(self)
      : self.props.size == "fullscreen" ?
        render_large_Rating(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }
  </div>
}

export function render_Rating_rating_minimised(self:RatingContext) : JSX.Element {
      return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute rating">
  <label className="attribute-label attribute-label-rating">{i18next.t(`Rating:rating`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.rating,
        v => self.props.set_entity({...self.props.entity, rating:v})) } 
  </div>
</div>
      
}

export function render_Rating_rating_maximised(self:RatingContext) : JSX.Element {
        return !Permissions.can_view_Rating_rating(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute rating">
  <label className="attribute-label attribute-label-rating">{i18next.t(`Rating:rating`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.Number(
        self.props.is_editable && Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Rating_rating(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.rating,
        v => self.props.set_entity({...self.props.entity, rating:v})) } 
  </div>
</div>
}

export function render_preview_Rating(self:RatingContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Rating_rating_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Rating(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Rating(self:RatingContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Rating(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Rating_rating_maximised(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Rating(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_Rating(self)}
    </div>)
}




export function render_relations_Rating(self:RatingContext) {
  return <div className="relations">
      
      
    </div>
}





export function render_saving_animations_Rating(self:RatingContext) {
  return 
    
}

export type RatingContext = {state:()=>RatingState, props:Utils.EntityComponentProps<Models.Rating>, setState:(new_state:RatingState, callback?:()=>void) => void}

export type RatingState = {
    update_count:number
    
  }
export class RatingComponent extends React.Component<Utils.EntityComponentProps<Models.Rating>, RatingState> {
  constructor(props:Utils.EntityComponentProps<Models.Rating>, context:any) {
    super(props, context)
    this.state = { update_count:0,  }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Rating>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_User ||this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_User ||new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Rating(this.get_self(), new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Rating(this.get_self(), this.props.current_User, this.props.current_Admin)

    this.thread = setInterval(() => {
      

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Rating(this.props.current_User, this.props.current_Admin) ?
              render_breadcrumb_Rating(this.get_self())
              : null
    }

    return <div id={`Rating_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model rating`}>
      { render_saving_animations_Rating(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_Rating(this.get_self()) : null }
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
        { this.props.nesting_depth == 0 ? render_local_menu_Rating(this.get_self()) : null }
        { render_controls_Rating(this.get_self()) }
        { render_content_Rating(this.get_self()) }
      </div>
    </div>
  }
}

export let Rating = (props:Utils.EntityComponentProps<Models.Rating>) : JSX.Element =>
  <RatingComponent {...props} />

export let Rating_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Rating])
  return Utils.scene_to_page<Models.Rating>(can_edit, Rating, Api.get_Rating(id), Api.update_Rating, "Rating", "Rating", `/Ratings/${id}`)
}

export let Rating_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Rating_to_page(id),
    current_User, current_Admin
  )
}
