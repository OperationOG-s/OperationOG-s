"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Immutable = require("immutable");
const Api = require("./generated_api");
function get_all_remote_entities(get_page) {
    return __awaiter(this, void 0, void 0, function* () {
        let elems = yield get_page(0, 10);
        let elems_to_return = Immutable.List(elems.Items.map(e => e.Item));
        for (var index = 1; index < elems.NumPages; index++) {
            let elems = yield get_page(index, 10);
            elems_to_return = elems_to_return.concat(elems.Items.map(e => e.Item)).toList();
            // Api.get_User_User_Recipes()
            // Api.link_User_User_Recipes()
        }
        return elems_to_return;
    });
}
exports.get_all_remote_entities = get_all_remote_entities;
function get_correctRecipe(id, idCategorie, idRecipe) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CustomController/FindCorrectRecipe/${id}/${idCategorie}/${idRecipe}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        let json = yield res.json();
        console.log("received correct recipes", json);
        return { recipes: Immutable.List(json) };
    });
}
exports.get_correctRecipe = get_correctRecipe;
function get_recipe(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CustomController/FindRecipe/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        let json = yield res.json();
        return { recipe: json };
    });
}
exports.get_recipe = get_recipe;
function get_meals(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch(`/api/v1/CustomController/FindMeals/${id}`, { method: 'get', credentials: 'include', headers: { 'content-type': 'application/json' } });
        let json = yield res.json();
        console.log("received meals", json);
        return { meals: Immutable.List(json) };
    });
}
exports.get_meals = get_meals;
class CategoriesComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { categories: Immutable.List() };
    }
    componentWillMount() {
        get_all_remote_entities((index, amount) => Api.get_Categories(index, amount)).then(categories => this.setState(Object.assign({}, this.state, { categories: categories.map(category => {
                return {
                    category: category,
                    is_expanded: false
                };
            }).toList() })));
    }
    render() {
        return React.createElement("div", null,
            React.createElement("header", null,
                React.createElement("h2", null, "Recipes "),
                "Find and share everyday cooking inspiration on OperationOG's. Discover recipes, cooks and how-tos based on the food you love and the friends you follow."),
            this.state.categories.map(category => React.createElement(CategoryComponent, { is_expanded: category.is_expanded, category: category.category, update_me: value => {
                    this.setState(Object.assign({}, this.state, { categories: this.state.categories.map(category1 => {
                            if (category.category.Kind != category1.category.Kind) {
                                return category1;
                            }
                            else {
                                console.log('is expanded is :', value);
                                return Object.assign({}, category1, { is_expanded: value });
                            }
                        }).toList() }));
                } })),
            " ");
    }
}
class CategoryComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { meals: Immutable.List() };
    }
    componentWillMount() {
        console.log('right meal is loading');
        get_meals(this.props.category.Id).then(meals => this.setState(Object.assign({}, this.state, { meals: meals.meals.map((_meal) => {
                return {
                    meal: _meal,
                    is_expanded: false
                };
            }).toList() })));
    }
    render() {
        if (!this.props.is_expanded) {
            return React.createElement("h5", null,
                " ",
                React.createElement("button", { onClick: () => this.props.update_me(true) }, this.props.category.Kind),
                " ");
        }
        return React.createElement("div", null,
            React.createElement("h5", null,
                React.createElement("button", { onClick: () => this.props.update_me(false) },
                    " back to ",
                    this.props.category.Kind,
                    " ")),
            this.state.meals.map(meal => React.createElement(MealComponent, { is_expanded: meal.is_expanded, meal: meal.meal, update_me: value => {
                    this.setState(Object.assign({}, this.state, { meals: this.state.meals.map(meal1 => {
                            console.log();
                            if (meal.meal.Kind != meal1.meal.Kind) {
                                return meal1;
                            }
                            else {
                                console.log('yo', value);
                                return Object.assign({}, meal1, { is_expanded: value });
                            }
                        }).toList() }));
                } })),
            " ");
    }
}
class MealComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { recipes: Immutable.List() };
    }
    componentWillMount() {
        console.log('right meal is loading');
        get_correctRecipe(1, 1, 4).then(recipes => this.setState(Object.assign({}, this.state, { recipes: recipes.recipes.map((_recipe) => {
                return {
                    recipe: _recipe,
                    is_expanded: false,
                };
            }).toList() })));
    }
    render() {
        if (!this.props.is_expanded) {
            return React.createElement("h5", null,
                React.createElement("button", { onClick: () => this.props.update_me(true) }, this.props.meal.Kind));
        }
        return React.createElement("div", null,
            React.createElement("h4", null,
                " ",
                React.createElement("button", { onClick: () => this.props.update_me(false) },
                    "back to ",
                    this.props.meal.Kind),
                " "),
            React.createElement("div", null, this.state.recipes.map(item => React.createElement(RecipeComponent, { recipe: item.recipe, is_expanded: item.is_expanded, update_me: value => this.setState(Object.assign({}, this.state, { recipes: this.state.recipes.map(item1 => {
                        if (item.recipe.Id == item1.recipe.Id) {
                            return Object.assign({}, item1, { is_expanded: value });
                        }
                        else {
                            console.log('jeeeeeei');
                            return item1;
                        }
                    }).toList() })) }))),
            " ");
    }
    get_categories() {
        return __awaiter(this, void 0, void 0, function* () {
            let category_page = yield Api.get_Categories(0, 4);
            let loaded_category = Immutable.List(category_page.Items.map(r => r.Item));
            for (let i = 1; i < category_page.NumPages; i++) {
                let category = yield Api.get_Categories(i, 100);
                loaded_category = loaded_category.concat(Immutable.List(category.Items.map(r => r.Item))).toList();
            }
            return Immutable.List(loaded_category);
        });
    }
}
class StarsComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { stars: Immutable.List([{ value: 0, state: false }, { value: 1, state: false }, { value: 2, state: false }, { value: 3, state: false }, { value: 4, state: false }]) };
    }
    render() {
        return React.createElement("div", null,
            this.state.stars.map(star => React.createElement("button", { onMouseOver: () => this.setState(Object.assign({}, this.state, { stars: this.state.stars.map(star1 => { if (star1.value <= star.value)
                        return Object.assign({}, star1, { state: true });
                    else
                        return Object.assign({}, star1, { state: false }); }).toList() })), style: star.state ? {
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
                    }, onClick: () => console.log("Sarah its okay"), marginHeight: 10, marginWidth: 10, width: 10, height: 10 }, star.value)),
            " ");
    }
}
exports.StarsComponent = StarsComponent;
class RecipeComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { recipes: Immutable.List() };
    }
    componentWillMount() {
        console.log('right recipe is loading');
        get_correctRecipe(1, 1, 4).then(recipes => this.setState(Object.assign({}, this.state, { recipes: recipes.recipes.map((_recipe) => {
                return {
                    recipe: _recipe,
                    is_expanded: true
                };
            }).toList() })));
    }
    render() {
        return React.createElement("div", null,
            React.createElement("div", null, this.props.recipe.Name),
            React.createElement(StarsComponent, null));
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
exports.AppTest = (props) => {
    return React.createElement("div", null);
};
exports.BookmarksView = (props) => React.createElement("div", null);
exports.CategoriesView = (props) => {
    props.current_User;
    return React.createElement(CategoriesComponent, null);
};
//# sourceMappingURL=custom_views.js.map