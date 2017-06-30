import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as List from './containers/list'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'

//The   use things from the parents that why it uses the models.Cat for example. And in the state you say what you are going to work with for example the list you will be working with.
// Expanded is used to display the hidden information.

//type IcomponentState = {i : number, j : number, z:number, recipes : Immutable.List<Models.Recipe>}
//type IComponentProps = {props:ViewUtils.EntityComponentProps<Models.HomePage>}


type CategoriesComponentProps = {} //Empty prop in the parents class, this parent has no parents that's why it is empty lol xD 
type CategoriesComponentState = { categories: Immutable.List<{ category: Models.Categorie, is_expanded: boolean }> } 

type CategoryComponentProps = { category: Models.Categorie, update_me: (boolean) => void, is_expanded: boolean }
type CategoryComponentState = { meals: Immutable.List<{ meal: Models.Meal, is_expanded: boolean }> }

type MealComponentProps = { meal: Models.Meal, update_me: (boolean) => void, is_expanded: boolean}
type MealComponentState = { recipes: Immutable.List<{ recipe: Models.Recipe, is_expanded: boolean}> }

type RecipeComponentProps = {recipe: Models.Recipe, update_me:(boolean) => void, is_expanded: boolean}
type RecipeComponentState = {}

type Rate = {value : number, state:boolean}
type StarsComponentProps = {}
type StarsComponentState = {stars:Immutable.List<Rate>}

export async function get_all_remote_entities<T>(get_page: (index: number, amount: number) => Promise<Api.RawPage<T>>): Promise<Immutable.List<T>> {
    let elems = await get_page(0, 10)
    let elems_to_return = Immutable.List<T>(elems.Items.map(e => e.Item))
    for (var index = 1; index < elems.NumPages; index++) {
        let elems = await get_page(index, 10)
        elems_to_return = elems_to_return.concat(elems.Items.map(e => e.Item)).toList()
        Api.get_User_User_Recipes()
        Api.link_User_User_Recipes()
        
    }
    return elems_to_return
}

export async function get_correctRecipe(id: number, idCategorie: number, idRecipe: number): Promise<{ recipes: Immutable.List<Models.Recipe> }> {
    let res = await fetch(`/api/v1/CustomController/FindCorrectRecipe/${id}/${idCategorie}/${idRecipe}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
    let json = await res.json()
    console.log("received correct recipes", json)
    return { recipes: Immutable.List<Models.Recipe>(json) }
}

export async function get_recipe(id: number): Promise<{ recipe: Models.Recipe }> {
    let res = await fetch(`/api/v1/CustomController/FindRecipe/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
    let json = await res.json()
    return { recipe: json }
}

export async function get_meals(id: number): Promise<{ meals: Immutable.List<Models.Meal> }> {
    let res = await fetch(`/api/v1/CustomController/FindMeals/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
    let json = await res.json()
    console.log("received meals", json)
    return { meals: Immutable.List<Models.Meal>(json) }
}

class CategoriesComponent extends React.Component<CategoriesComponentProps, CategoriesComponentState>
{
    constructor(props: CategoryComponentProps, context) {
        super(props, context)
        this.state = { categories: Immutable.List<{ category: Models.Categorie, is_expanded: boolean }>() }
    }

    componentWillMount() {
        get_all_remote_entities((index, amount) => Api.get_Categories(index, amount)).then(categories =>
            this.setState({
                ... this.state,
                categories: categories.map(category => {
                    return {
                        category: category,
                        is_expanded: false
                    }
                }).toList()
            }))
    }

    render() {

        return<div> 
            
             <header> 
                    <h2>Recipes </h2>
                    Find and share everyday cooking inspiration on OperationOG's. 
                    Discover recipes, cooks and how-tos based on the food you love and the friends you follow.</header>
            
            {this.state.categories.map(category => <CategoryComponent is_expanded={category.is_expanded}
            category={category.category}
            
            update_me={value => {
                this.setState(
                    {
                        ... this.state, categories: this.state.categories.map(category1 => {
                            if (category.category.Kind != category1.category.Kind) {
                                return category1
                            }
                            else {
                                console.log('is expanded is :', value) 
                                return { ...category1, is_expanded: value }
                            }
                        }).toList()
                    })
            }} />)} </div>
    }
}

class CategoryComponent extends React.Component<CategoryComponentProps, CategoryComponentState>
{
    constructor(props: CategoryComponentProps, context) {
        super(props, context)
        this.state = { meals: Immutable.List<{ meal: Models.Meal, is_expanded: boolean }>() }
    }

    componentWillMount() {
        console.log('right meal is loading')
        get_meals(this.props.category.Id).then(meals => this.setState(
            {
                ...this.state,
                meals: meals.meals.map((_meal: Models.Meal) => {
                    return {
                        meal: _meal,
                        is_expanded: false
                    }
                }).toList()
            }))

    }


    render() {

        if (!this.props.is_expanded) {
            
            return  <h5> <button onClick={() => this.props.update_me(true)}>{this.props.category.Kind}</button> </h5>
        }
        return <div>


            <h5><button onClick={() => this.props.update_me(false)}> back to {this.props.category.Kind} </button></h5>
          

         {this.state.meals.map(meal => <MealComponent is_expanded={meal.is_expanded}
            meal={meal.meal}
            
            update_me={value => {
                this.setState(
                    {
                        ... this.state, meals: this.state.meals.map(meal1=> {
                            console.log()
                            if (meal.meal.Kind != meal1.meal.Kind) {
                                return meal1
                            }
                            else {
                                console.log('yo', value) 
                                return { ...meal1, is_expanded: value }
                            }
                        }).toList()
                    })
            }} />)} </div>
    }
}


class MealComponent extends React.Component<MealComponentProps, MealComponentState>
{
    constructor(props: MealComponentProps, context) {
        super(props, context)
        this.state =  { recipes: Immutable.List<{ recipe: Models.Recipe, is_expanded: boolean}>() }

    }

    componentWillMount() {
        console.log('right meal is loading')
        get_correctRecipe(1,1,4).then(recipes => this.setState(
            {
                ...this.state,
                recipes: recipes.recipes.map((_recipe : Models.Recipe) => {
                    return {
                        recipe: _recipe,
                        is_expanded: false,
                    
                    }
                }).toList()
            }))

    }


    render() {
        if (!this.props.is_expanded) {
            return <h5><button onClick={() => this.props.update_me(true)}>{this.props.meal.Kind}</button></h5>
        }
         return<div>
            <h4> <button onClick={() => this.props.update_me(false)}>back to {this.props.meal.Kind}</button> </h4>
            <div>
            
            {this.state.recipes.map(item => <RecipeComponent
                recipe = {item.recipe}
                is_expanded={item.is_expanded}
                update_me={value =>
                    this.setState({
                        ...this.state,
                        recipes: this.state.recipes.map(item1 => {
                            if (item.recipe.Id == item1.recipe.Id) {
                                return { ...item1, is_expanded: value }
                                
                            }
                            else { console.log('jeeeeeei')
                                return item1 } 
                        }).toList() 
                    })
                } />) 
            }</div> </div>


           
    } 

    async get_categories() {
        let category_page = await Api.get_Categories(0, 4)
        let loaded_category = Immutable.List<Models.Categorie>(category_page.Items.map(r => r.Item))
        for (let i = 1; i < category_page.NumPages; i++) {
            let category = await Api.get_Categories(i, 100)
            loaded_category = loaded_category.concat(Immutable.List<Models.Categorie>(category.Items.map(r => r.Item))).toList()
        }
        return Immutable.List<Models.Categorie>(loaded_category)
    }
}

export class StarsComponent extends React.Component<StarsComponentProps, StarsComponentState> {
  constructor(props:StarsComponentProps, context:any) {
    super(props, context)
    this.state = { stars:Immutable.List<Rate>([{value : 0, state:false}, {value : 1, state:false}, {value : 2, state:false}, {value : 3, state:false}, {value : 4, state:false}]) }
  }
  render(){
    return <div>{this.state.stars.map(star => <button onMouseOver={() => this.setState({...this.state, stars: this.state.stars.map(star1 => {if(star1.value <= star.value) return {...star1, state: true}; else return {...star1, state: false}}).toList()})}  
                                                      style={star.state?{
                                                                          borderColor: '#000066',
                                                                          backgroundColor: '#000066',
                                                                          borderWidth: 1,
                                                                          borderRadius: 10,
                                                                          background: '#b3e3ef'
                                                                        }:
                                                                        {
                                                                          borderColor: '#000066',
                                                                          borderWidth: 1,
                                                                          borderRadius: 10,
                                                                        }}
                                                      onClick={()=> console.log("Sarah its okay")}
                                                      marginHeight={10} marginWidth={10} width={10} height={10}>{star.value}</button>)} </div>
  }

}

class RecipeComponent extends React.Component<RecipeComponentProps, RecipeComponentState>
{
    constructor(props: RecipeComponentProps, context) 
    {
        super(props, context)
        this.state = {recipes: Immutable.List<{recipe: Models.Recipe, is_expanded: boolean }>()}
    }

    componentWillMount() 
    {
        console.log('right recipe is loading')
        get_correctRecipe(1,1,4).then(recipes => this.setState(
            {
                ...this.state,
                recipes: recipes.recipes.map((_recipe: Models.Recipe) => {return {
                                                                            recipe: _recipe,
                                                                            is_expanded: true}
                                                                          }).toList()
            }))

    }


    render() {
          return<div> 
                    <div>{this.props.recipe.Name}</div>
                    <StarsComponent/>
                </div>
    }
}





// class ItemComponent extends React.Component<{ title: string, info: string, is_expanded: boolean, update_me: (boolean) => void }, {}>
// { 
//     constructor(props: { title: string, info: string, is_expanded: boolean, update_me: (boolean) => void }, context) {
//         super(props, context)
//         this.state = {}
//     }

//     render() {
//         return <div >
//             <span>{this.props.title}</span>
//             {this.props.is_expanded ? <div>{this.props.info}</div> : <span />}
//             {!this.props.is_expanded ? <button onClick={() => this.props.update_me(true)}>+</button> :
//                 <button onClick={() => this.props.update_me(false)}>-</button>}
//         </div>
//     }
// }

export let AppTest = (props: ViewUtils.EntityComponentProps<Models.HomePage>) => {
    return <div></div>
}

export let BookmarksView = (props: ViewUtils.EntityComponentProps<Models.Bookmarks>) =>
    <div></div>

export let CategoriesView = (props: ViewUtils.EntityComponentProps<Models.CategoryList>) => {
    props.current_User
    return <CategoriesComponent />
}