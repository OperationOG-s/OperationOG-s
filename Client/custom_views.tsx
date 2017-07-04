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


type CategoriesComponentProps = { reload:() => void, currentUser:Models.User } //Empty prop in the parents class, this parent has no parents that's why it is empty lol xD 
type CategoriesComponentState = { categories: Immutable.List<{ category: Models.Categorie, is_expanded: boolean }>, SearchedQuery: string }

type CategoryComponentProps = { reload:() => void, logged_in_user: Models.User, category: Models.Categorie, update_me: (boolean) => void, is_expanded: boolean, SearchedQuery : string  }
type CategoryComponentState = { meals: Immutable.List<{category: Models.Categorie, meal: Models.Meal, is_expanded: boolean }> }

type MealComponentProps = { reload:() => void, logged_in_user: Models.User, category: Models.Categorie ,meal: Models.Meal, update_me: (boolean) => void, is_expanded: boolean, SearchedQuery : string  }
type MealComponentState = { recipes: Immutable.List<{ recipe: Models.Recipe, is_expanded: boolean }> }

type RecipeComponentProps = { reload:() => void, logged_in_user: Models.User, recipe: Models.Recipe, update_me: (boolean) => void, is_expanded: boolean }
type RecipeComponentState = {recipes: Immutable.List<{ recipe: Models.Recipe, is_expanded: boolean }>, rating: Immutable.List<{ recipe: Models.Rating }> }

type Rate = { value: number, state: boolean }
type StarsComponentProps = {recipe: Models.Recipe, logged_in_user: Models.User }
type StarsComponentState = { stars: Immutable.List<Rate> }

type Bookmark = {recipe : Models.Recipe}
type ShowBookmarkComponentProps ={recipe : Models.Bookmarks}
type ShowBookmarkComponentState = {recipes: Immutable.List<{recipe : Models.Recipe}>}

type Bookmarks = {logged_in_user: Models.User, recipe : Models.Recipe }
type BookmarkComponentProps = {reload:()=>void,logged_in_user: Models.User, recipe : Models.Recipe }
type BookmarkComponentState = {is_bookmarked:boolean, bookmarks: Immutable.List<{ bookmark: Models.Recipe }> }



export async function get_all_remote_entities<T>(get_page: (index: number, amount: number) => Promise<Api.RawPage<T>>): Promise<Immutable.List<T>> {
    let elems = await get_page(0, 10)
    let elems_to_return = Immutable.List<T>(elems.Items.map(e => e.Item))
    for (var index = 1; index < elems.NumPages; index++) {
        let elems = await get_page(index, 10)
        elems_to_return = elems_to_return.concat(elems.Items.map(e => e.Item)).toList()
        // Api.get_User_User_Recipes()
        // Api.link_User_User_Recipes()

    }
    return elems_to_return
}

export async function get_correctRecipe(idMeal: number, idCategorie: number): Promise<{ recipes: Immutable.List<Models.Recipe> }> {
    let res = await fetch(`/api/v1/CustomController/FindCorrectRecipe/${idMeal}/${idCategorie}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
    let json = await res.json()
    console.log("received correct recipes", json)
    return { recipes: Immutable.List<Models.Recipe>(json) }
}
export async function get_bookmarked(idUser: number): Promise<{ recipes: Immutable.List<Models.Recipe> }> {
    let res = await fetch(`/api/v1/CustomController/Bookmarked/${idUser}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
    let json = await res.json()
    console.log("received correct Bookmark Recipes", json)
    return { recipes: Immutable.List<Models.Recipe>(json) }
}

export async function set_rating(rating: number, recipe: number, user: number) {
    let res = await fetch(`/api/v1/CustomController/UserRating/${rating}/${recipe}/${user}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } })
    console.log("set correct rating", rating)
}
export async function get_findrating(id: number,idRating: number, idRecipe: number): Promise<{ ratings: Immutable.List<Models.Rating> }> {
    let res = await fetch(`/api/v1/CustomController/FindRating/${id}/${idRating}/${idRecipe}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } })
    let json = await res.json()
    console.log(idRating);
    console.log("received correct rating" , json)
    return { ratings: Immutable.List<Models.Rating>(json) }
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

export async function get_userrating(rating: number, recipe_id:number, user_id:number)  {
    await fetch(`/api/v1/CustomController/UserRating/${rating}/${recipe_id}/${user_id}`, { method: 'post', credentials: 'include', headers: { 'content-type': 'application/json' } })
}


class CategoriesComponent extends React.Component<CategoriesComponentProps, CategoriesComponentState>
{
    constructor(props: CategoriesComponentProps, context) {
        super(props, context)
        this.state = {  categories: Immutable.List<{  category: Models.Categorie, is_expanded: boolean }>(), SearchedQuery: ""}
    }

    componentWillMount() {
       // get_all_remote_entities((index, amount) => Api.get_User_User_Recipes(this.props. index, amount))
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

        return <div>
            <div>Search here your recipe </div>
            <input value={this.state.SearchedQuery} onChange={event => this.setState({ ...this.state, SearchedQuery: event.target.value })} />
            <header>
                <h2>Recipes </h2>
                Find and share everyday cooking inspiration on OperationOG's.
                    Discover recipes, cooks and how-tos based on the food you love and the friends you follow.</header>

            {this.state.categories.map(category => <CategoryComponent is_expanded={category.is_expanded}
                category={category.category}
                SearchedQuery={this.state.SearchedQuery}
                logged_in_user = {this.props.currentUser}
                reload={this.props.reload}
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
        this.state =  { meals: Immutable.List<{category: Models.Categorie, meal: Models.Meal, is_expanded: boolean }>() }
    }

    componentWillMount() {
        console.log('right meal is loading')
        get_meals(this.props.category.Id).then(meals => this.setState(
            {
                ...this.state,
                meals: meals.meals.map((_meal: Models.Meal) => {
                    return {
                        meal: _meal,
                        category : this.props.category ,
                        is_expanded: false
                    }
                }).toList()
            }))

    }


    render() {

        if (!this.props.is_expanded) {

            return <h5> <button onClick={() => this.props.update_me(true)}>{this.props.category.Kind}</button> </h5>
        }
        return <div>


            <h5><button onClick={() => this.props.update_me(false)}> back to {this.props.category.Kind} </button></h5>



            {this.state.meals.map(meal => <MealComponent is_expanded={meal.is_expanded}
                meal={meal.meal}
                logged_in_user = {this.props.logged_in_user}
                reload={this.props.reload}
                SearchedQuery={this.props.SearchedQuery}
                category= {meal.category}
                update_me={value => {
                    this.setState(
                        {
                            ... this.state, meals: this.state.meals.map(meal1 => {
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
        this.state = { recipes: Immutable.List<{ recipe: Models.Recipe, is_expanded: boolean }>() }

    }

    componentWillMount() {
        console.log('right meal is loading')
        //get_all_remote_entities((index, amount) => Api.get_Meal_Meal_Recipes(this.props.meal, index, amount)).then(recipes => this.setState(
        get_correctRecipe(this.props.meal.Id, this.props.category.Id).then(recipes => this.setState(
            {
                ...this.state,
                recipes: recipes.recipes.map((_recipe: Models.Recipe) => {
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
        return <div>
            <h4> <button onClick={() => this.props.update_me(false)}>back to {this.props.meal.Kind}</button> </h4>
            <div>

                {this.state.recipes.filter(item => this.props.SearchedQuery == "" || item.recipe.Name.startsWith(this.props.SearchedQuery)).map(item => <RecipeComponent
                    recipe={item.recipe}
                    is_expanded={item.is_expanded}
                    logged_in_user = {this.props.logged_in_user}
                    reload={this.props.reload}
                    update_me={value =>
                        this.setState({ 
                            ...this.state,
                            recipes: this.state.recipes.map(item1 => {
                                if (item.recipe.Name != item1.recipe.Name) {
                                    return { ...item1, is_expanded: value }

                                } 
                                else {
                                    console.log('jeeeeeei')
                                    return item1
                                }
                            }).toList()
                        })
                    } />)
                }</div> </div>



    }
    //    Api.get_User_User_Recipes()
    //     Api.link_User_User_Recipes()






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
    constructor(props: StarsComponentProps, context: any) {
        super(props, context)
        this.state = { stars: Immutable.List<Rate>([{ value: 0, state: false }, { value: 1, state: false }, { value: 2, state: false }, { value: 3, state: false }, { value: 4, state: false }]) }

    }
    CompnentWillMount(){
    this.props.
    //component: user * recipe => rating
    //when rating received => for every star in stars: IF star.value <= rating THEN star.state:True ELSE star.state: False   
    }
    

    render() {
        return <div>{this.state.stars.map(star => <button onMouseOver={() => this.setState({ ...this.state, stars: this.state.stars.map(star1 => { if (star1.value <= star.value) return { ...star1, state: true }; else return { ...star1, state: false } }).toList() })}
            style={star.state ? {
                borderColor: '#000066',
                backgroundColor: '#000066',
                borderWidth: 1,
                borderRadius: 10,
                background: '#b3e3ef'
            } :
                {
                    borderColor: '#000066',
                    borderWidth: 1,
                    borderRadius: 10,
                }}
            onClick={() => set_rating(star.value, this.props.recipe.Id, this.props.logged_in_user.Id)}
            //get_userrating(star.value, this.props.recipe.Id, this.props.logged_in_user.Id)
            
            marginHeight={10} marginWidth={10} width={10} height={10}>{star.value}</button>)} </div>
            
    }

}

class RecipeComponent extends React.Component<RecipeComponentProps, RecipeComponentState>
{
    constructor(props: RecipeComponentProps, context) {
        super(props, context)
        this.state = {recipes: Immutable.List<{ recipe: Models.Recipe, is_expanded: boolean }>(), rating: Immutable.List<{ recipe: Models.Rating }>() }
    }

    componentWillMount() {
        console.log('right recipe is loading')
         get_findrating(1, 1, this.props.recipe.Id);
        
        // get_findrating(1, 4).then(ratings => this.setState(
        //     {
        //         ...this.state,
        //         ratings: ratings.ratings.map((_rating: Models.Rating) => {
        //             return {
        //                 rating: _rating,
        //                 is_expanded: true
        //             }
        //         }).toList()
        //     }))
    }

   
    render() {
        return <div>
            <h2>Name:</h2> <h2>{this.props.recipe.Name}</h2>
            
           <h2>Description:</h2>  <div>{this.props.recipe.Description}/</div>
            
            <h2>Ingredients:</h2> <div>{this.props.recipe.Ingredients}</div> 
         
            <h2>PreparationTime:</h2> <div>{this.props.recipe.PreparationTime} </div>   
                         {/*<div>{this.props.rating}</div>*/}
            <StarsComponent logged_in_user ={this.props.logged_in_user} recipe = {this.props.recipe} />
            <BookmarkComponent 
                reload={this.props.reload}
                logged_in_user = {this.props.logged_in_user} 
                recipe = {this.props.recipe}/>
            {/*<BookmarkComponent logged_in_user ={props.current_User}/>*/}
        </div>
    }
}

class ShowBookmarkComponent extends React.Component<ShowBookmarkComponentProps, ShowBookmarkComponentState>
{
    constructor(props: ShowBookmarkComponentProps, context: any){
        super(props, context)
        this.state = {recipes: Immutable.List<{recipe : Models.Recipe}>()}
    }

    componentWillMount() {
         get_bookmarked(1).then(bookmarks => this.setState(
            {
                ...this.state,
                bookmark: bookmarks.recipes.map((_bookmark: Models.Recipe) => {
                    console.log('Recipe is bookmarked')
                              
                return  _bookmark
           
                 
                }).toList()
            }))
        
    }

     
    render() {
        return <div>
          {this.props.recipe.Id}
        </div>
    }
}

class BookmarkComponent extends React.Component<BookmarkComponentProps, BookmarkComponentState>
{
    constructor(props: BookmarkComponentProps, context) {
        super(props, context)
        console.log("props", props)
        this.state = { is_bookmarked: false, bookmarks: Immutable.List<{ bookmark: Models.Recipe }>() }
    }

    componentWillMount() {

          
        get_all_remote_entities((index, amount) => Api.get_User_User_Recipes(this.props.logged_in_user, index, amount))
            .then(recipes => this.setState({...this.state, is_bookmarked: recipes.find(elem => elem.Id==this.props.recipe.Id) != undefined }))

       
    }


    render() {

          return <div>
            {this.state.is_bookmarked ? 
            <button onClick= {() => Api.unlink_User_User_Recipes(this.props.logged_in_user, this.props.recipe).then(_ =>this.setState({...this.state, is_bookmarked:false}))}>Un-bookmark</button> :
            <button onClick= {() => Api.link_User_User_Recipes(this.props.logged_in_user, this.props.recipe).then(_ => this.setState({...this.state, is_bookmarked:true}))}>Bookmark</button>}
            {/*{console.log(this.props.Bookmarks.Name)}*/}
        </div>
      

    }

}




export let AppTest = (props: ViewUtils.EntityComponentProps<Models.HomePage>) => {
    return <div></div>
}

export let BookmarksView = (props: ViewUtils.EntityComponentProps<Models.Bookmarks>) =>
{   props.current_User
    return <ShowBookmarkComponent recipe = {props.entity}/>
                                
     
}


export let CategoriesView = (props: ViewUtils.EntityComponentProps<Models.CategoryList>) => {
    //props.current_User
   return <CategoriesComponent currentUser={props.current_User} reload={props.force_reload} />     
}