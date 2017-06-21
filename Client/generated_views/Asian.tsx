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









export function load_relations_Asian(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  callback && callback()
}

export function set_size_Asian(self:AsianContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(Asian_to_page(self.props.entity.Id))
  })
}

export function render_Asian_Description_editable_minimised(self:AsianContext) : JSX.Element {
  if (!Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin)) return render_Asian_Description_minimised(self)
  else
    return !Permissions.can_view_Asian_Description(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Asian:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Asian_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}


export function render_Asian_Description_editable_maximised(self:AsianContext) : JSX.Element {
  if (!Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin)) return render_Asian_Description_maximised(self)
  else
    return !Permissions.can_view_Asian_Description(self.props.current_User, self.props.current_Admin) ? <div /> :
          <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Asian:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Asian_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}


export function render_editable_attributes_minimised_Asian(self:AsianContext) {
  let attributes = (<div>
      {render_Asian_Description_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_Asian(self:AsianContext) {
    let attributes = (<div>
        {render_Asian_Description_editable_maximised(self)}
      </div>)
    return attributes
  }

export function render_breadcrumb_Asian(self:AsianContext) {
  return <div className="breadcrumb-asian">Asian</div>
}

export function render_menu_Asian(self:AsianContext) {
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
          
            
                <div className="menu_entry menu_entry--with-sub">
                
                </div>  
          </div>
        </div>
      </div>
}

export function render_local_menu_Asian(self:AsianContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this Asian')}
              </a>
            </div>
          
              
          </div>
        </div>
}

export function render_controls_Asian(self:AsianContext) {
  return <div className="control">
    {Permissions.can_delete_Asian(self.props.current_User, self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_Asian(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="asian button button--close"
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

export function render_content_Asian(self:AsianContext) {
  return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
    {Permissions.can_view_Asian(self.props.current_User, self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_Asian(self)
      : self.props.size == "large" ?
        render_large_Asian(self)
      : self.props.size == "fullscreen" ?
        render_large_Asian(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    }
  </div>
}

export function render_Asian_Description_minimised(self:AsianContext) : JSX.Element {
      return !Permissions.can_view_Asian_Description(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Asian:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Asian_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
      
}

export function render_Asian_Description_maximised(self:AsianContext) : JSX.Element {
        return !Permissions.can_view_Asian_Description(self.props.current_User, self.props.current_Admin) ? null : <div className="model__attribute description">
  <label className="attribute-label attribute-label-description">{i18next.t(`Asian:Description`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
        self.props.is_editable && Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin) && Permissions.can_edit_Asian_Description(self.props.current_User, self.props.current_Admin),
        self.props.mode,
        () => self.props.entity.Description,
        v => self.props.set_entity({...self.props.entity, Description:v})) } 
  </div>
</div>
}

export function render_preview_Asian(self:AsianContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Asian_Description_minimised(self) }
    </div>)
  else
    attributes = render_editable_attributes_minimised_Asian(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_Asian(self:AsianContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_Asian(self.props.current_User, self.props.current_Admin))
    attributes = (<div className="model__attributes">
      { render_Asian_Description_maximised(self) }
    </div>)
  else
    attributes = render_editable_attributes_maximised_Asian(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_Asian(self)}
    </div>)
}




export function render_relations_Asian(self:AsianContext) {
  return <div className="relations">
      
      
    </div>
}





export function render_saving_animations_Asian(self:AsianContext) {
  return 
    
}

export type AsianContext = {state:()=>AsianState, props:Utils.EntityComponentProps<Models.Asian>, setState:(new_state:AsianState, callback?:()=>void) => void}

export type AsianState = {
    update_count:number
    
  }
export class AsianComponent extends React.Component<Utils.EntityComponentProps<Models.Asian>, AsianState> {
  constructor(props:Utils.EntityComponentProps<Models.Asian>, context:any) {
    super(props, context)
    this.state = { update_count:0,  }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.Asian>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_User ||this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_User ||new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {
      load_relations_Asian(this.get_self(), new_props.current_User, new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview")
      load_relations_Asian(this.get_self(), this.props.current_User, this.props.current_Admin)

    this.thread = setInterval(() => {
      

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_Asian(this.props.current_User, this.props.current_Admin) ?
              render_breadcrumb_Asian(this.get_self())
              : null
    }

    return <div id={`Asian_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model asian`}>
      { render_saving_animations_Asian(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_Asian(this.get_self()) : null }
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
        { this.props.nesting_depth == 0 ? render_local_menu_Asian(this.get_self()) : null }
        { render_controls_Asian(this.get_self()) }
        { render_content_Asian(this.get_self()) }
      </div>
    </div>
  }
}

export let Asian = (props:Utils.EntityComponentProps<Models.Asian>) : JSX.Element =>
  <AsianComponent {...props} />

export let Asian_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_Asian])
  return Utils.scene_to_page<Models.Asian>(can_edit, Asian, Api.get_Asian(id), Api.update_Asian, "Asian", "Asian", `/Asians/${id}`)
}

export let Asian_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    Asian_to_page(id),
    current_User, current_Admin
  )
}
