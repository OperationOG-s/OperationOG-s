import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as List from './containers/list'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'


type IComponentProps = {props:ViewUtils.EntityComponentProps<Models.HomePage>}
type IcomponentState = {i : number, j : number, z:number, recipes : Immutable.List<Models.Recipe>}

export default class IComponent extends React.Component<IComponentProps, IcomponentState>{
    constructor(props: IComponentProps, context)
    {
        super(props, context)
        this.state = {i : 0, j:0, z:0, recipes: Immutable.List<Models.Recipe>()}
    }

    componentWillMount(){
         var thread = setInterval(() => 
    {
         this.setState({...this.state, i : this.state.i + 1})
        }, 1000)  

        this.get_recipes().then(online_recipes => this.setState({...this.state, recipes:online_recipes})  )       
    }

    async get_recipes(){
        let recipes_page = await Api.get_Recipes(0,100)
        let loaded_recipes = Immutable.List<Models.Recipe>(recipes_page.Items.map(r => r.Item))

        for(let i = 1; i < recipes_page.NumPages; i++){
            let recipes = await Api.get_Recipes(i,100)
            loaded_recipes = loaded_recipes.concat(Immutable.List<Models.Recipe>(recipes.Items.map(r => r.Item))).toList()
        }
        return Immutable.List<Models.Recipe>(loaded_recipes)
    }
    
      
    



    render(){
                console.log(this.props.props)
               // Api.get_Recipes()
                if(this.props.props.current_User == undefined) return <div>Log in first...</div>
                return <div>
                        <div>Hello{this.props.props.current_User.Username}</div>
                        <div> 
                            {this.state.recipes.map(recipe => <div>{recipe.Name} </div>)}
                        </div>
                        <div>{this.state.i}</div>
                        </div>

            }

}

export let AppTest = (props:ViewUtils.EntityComponentProps<Models.HomePage>) => 




{
    return<IComponent props={props}/> 

    // let i = 1

    // var thread = setInterval(() => {
    //     i = i + 1
    //     console.log(i)},1000)

    // return <div>
    //             <div>{i}</div>
    //             <div>hi</div>
    //         </div>
}