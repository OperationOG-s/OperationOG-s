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









export function load_relations_User(self, current_User:Models.User, current_Admin:Models.Admin, callback?:()=>void) {
  callback && callback()
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




export function render_relations_User(self:UserContext) {
  return <div className="relations">
      
      
    </div>
}





export function render_saving_animations_User(self:UserContext) {
  return 
    
}

export type UserContext = {state:()=>UserState, props:Utils.EntityComponentProps<Models.User>, setState:(new_state:UserState, callback?:()=>void) => void}

export type UserState = {
    update_count:number
    
  }
export class UserComponent extends React.Component<Utils.EntityComponentProps<Models.User>, UserState> {
  constructor(props:Utils.EntityComponentProps<Models.User>, context:any) {
    super(props, context)
    this.state = { update_count:0,  }
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
  let can_edit = Utils.any_of([Permissions.can_edit_User])
  return Utils.scene_to_page<Models.User>(can_edit, User, Api.get_User(id), Api.update_User, "User", "User", `/Users/${id}`)
}

export let User_to = (id:number, target_element_id:string, current_User:Models.User, current_Admin:Models.Admin) => {
  Utils.render_page_manager(target_element_id,
    User_to_page(id),
    current_User, current_Admin
  )
}
