import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as List from './containers/list'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'


type IComponentProps = {props:ViewUtils.EntityComponentProps<Models.HomePage>}
type CategoryComponentProps = {props:ViewUtils.EntityComponentProps<Models.CategoryList>} 
type IcomponentState = {i : number, j : number, z:number, recipes : Immutable.List<Models.Recipe>}
type CategoryComponentState = {categories : Immutable.List<Models.Categorie>, recipes:Immutable.List<Models.Recipe> }

export async function get_recipe(id: number): Promise<{ recipe: Models.Recipe}> {
  let res = await fetch(`/api/v1/CustomController/FindRecipe/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
  let json = await res.json()
  return { recipe:json }
}
export async function get_meals(id: number, idMeals: number): Promise<{ meals: Models.Categorie_Meal}> {
  let res = await fetch(`/api/v1/CustomController/FindMeals/${id}/${idMeals}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
  let json = await res.json()
  return { meals:json }
}

export default class IComponent extends React.Component<IComponentProps, IcomponentState>{
    constructor(props: IComponentProps, context)
    {
        super(props, context)
        this.state = {i : 0, j:0, z:0, recipes: Immutable.List<Models.Recipe>()}
    }


    componentWillMount(){
    //   get_recipe(7).then(result => console.log("the recipe is: ", result.recipe))
      
    //      var thread = setInterval(() => 
    // {
    //      this.setState({...this.state, i : this.state.i + 1})
    //     }, 1000)  

    //     this.get_recipes().then(online_recipes => this.setState({...this.state, recipes:online_recipes})  )       
    // }
    }
    // async get_recipes(){
    //     let recipes_page = await Api.get_Recipes(0,100)
    //     let loaded_recipes = Immutable.List<Models.Recipe>(recipes_page.Items.map(r => r.Item))

    //     for(let i = 1; i < recipes_page.NumPages; i++){
    //         let recipes = await Api.get_Recipes(i,100)
    //         loaded_recipes = loaded_recipes.concat(Immutable.List<Models.Recipe>(recipes.Items.map(r => r.Item))).toList()
    //     }
    //     return Immutable.List<Models.Recipe>(loaded_recipes)
    // }
    // prints out in the console everytime the button is clicked
    // clicked(){
    //     console.log('the button was clicked:Y recipe is bookmarked!');
    // }
    
      
    render(){
                console.log(this.props.props)
               // Api.get_Recipes()
                if(this.props.props.current_User == undefined) return <div>Log in first...</div>
                return <div>
                        <div>
                            <img src="http://s.eatthis-cdn.com/media/images/ext/336492655/fast-food.jpg" alt="food" width="428px" height="428px"/>
                            Welcome {this.props.props.current_User.Username}!
                        </div>
                        {/*makes a clickable button*/}
                        {/*<button onClick={ (e) => {e.preventDefault(); this.clicked(); }}> Bookmark</button>*/}
                        <div>
                            Here you can find recipes!
                        </div>
                        {/*<div> 
                            {this.state.recipes.map(recipe => <div>{recipe.Name} </div>)}
                        </div>*/}
                        {/*<div>{this.state.i}</div>*/}
                        </div>
            }
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
class CategoryComponent extends React.Component<CategoryComponentProps, CategoryComponentState>{
    
    constructor(props: CategoryComponentProps, context)
    {
        super(props, context)
        this.state = {categories: Immutable.List<Models.Categorie>(),  recipes:Immutable.List<Models.Recipe>()}
    }
   componentWillMount()
   { 
     get_recipe(7).then(result => this.setState({...this.state, recipe : result}))
     this.get_categories().then(online_categories => this.setState({...this.state, categories:online_categories}) )
     this.get_recipes().then(online_recipes => this.setState({...this.state, recipes:online_recipes})  ) 
     
      }
   async get_categories(){
        let category_page = await Api.get_Categories(0,4)
        let loaded_category = Immutable.List<Models.Categorie>(category_page.Items.map(r => r.Item))
        for(let i = 1; i < category_page.NumPages; i++){
            let category= await Api.get_Categories(i,100)
            loaded_category= loaded_category.concat(Immutable.List<Models.Categorie>(category.Items.map(r => r.Item))).toList()
        }
        return Immutable.List<Models.Categorie>(loaded_category)
     }
    async get_recipes(){
        let recipes_page = await Api.get_Recipes(0,100)
        let loaded_recipes = Immutable.List<Models.Recipe>(recipes_page.Items.map(r => r.Item))

        for(let i = 1; i < recipes_page.NumPages; i++){
            let recipes = await Api.get_Recipes(i,100)
            loaded_recipes = loaded_recipes.concat(Immutable.List<Models.Recipe>(recipes.Items.map(r => r.Item))).toList()
        }
        return Immutable.List<Models.Recipe>(loaded_recipes)}
    clicked(){
        console.log('the button was clicked: recipe is bookmarked!');
    }

    render(){
                console.log(this.props.props)
                //get_recipe(7).then(result => console.log("the recipe is: ", result.recipe))
                                            //<button onClick={ (e) => {e.preventDefault(); this.clicked(); }}> Bookmark</button>
                get_meals(1,1).then(result => console.log("the meal is: ", result.meals))                            
                return <div>
                        {/*makes a clickable button*/}                        
                        <div>{this.state.categories.map(category => 
                            <div>
                                <button>{category.Kind}</button>
                            </div>)}
                        </div>
                        <div> {this.state.recipes.map(recipe => 
                            <div>
                                {recipe.Name} 
                            </div>)}
                        </div>
                    <div>{}</div>
                         {/*<div>{get_recipe(7).then(result => 
                               <div>  
                                   {result.recipe.Name} </div> )}
                               </div>*/}

                        </div>
           }
}

export let AppTest = (props:ViewUtils.EntityComponentProps<Models.HomePage>) =>
{
    return<IComponent props={props}/>
}

export let BookmarksView = (props:ViewUtils.EntityComponentProps<Models.Bookmarks>) =>
  <div>
      <div>
        <div>test 1</div>
        <button>test 1 click me </button>
      </div>
      <div>
        <div>test 2</div>
        <button>test 2 click me </button>
      </div>
  </div>

export let CategoriesView = (props:ViewUtils.EntityComponentProps<Models.CategoryList>) => 
{
    return<CategoryComponent props={props}/> 
    
}