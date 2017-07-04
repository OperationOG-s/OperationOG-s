import * as Models from './generated_models'
import * as Immutable from 'immutable'
import * as Moment from 'moment'
import 'whatwg-fetch'

export type ItemWithEditable<T> = {Item:T, Editable:boolean, JustCreated:boolean}

export type RawPage<T> = {
  Items:ItemWithEditable<T>[]
  PageIndex:number
  SearchQuery:string
  NumPages:number
  PageSize:number
  TotalCount:number
  CanCreate:boolean
  CanDelete:boolean
}

export let parse_date = <T>(e:any) : T&{CreatedDate:Moment.Moment} => { return { ...e, CreatedDate: Moment.utc(e.CreatedDate) }}

export let make_page = <T>(res:any, parse_other_args:(e:any) => T) : RawPage<T> => { return {
  Items: res.Items.map((i:any) => { return{ ...i, Item:parse_date(i.Item)} }).map((i:any) => { return{ ...i, Item:parse_other_args(i.Item)} }),
  PageIndex: res.PageIndex,
  SearchQuery:res.SearchQuery,
  NumPages: res.NumPages,
  PageSize: res.PageSize,
  TotalCount: res.TotalCount,
  CanCreate: res.CanCreate,
  CanDelete: res.CanDelete
}}

export async function create_American() : Promise<Models.American> {
  let res = await fetch(`/api/v1/American/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.American
}

export async function update_American(item:Models.American) : Promise<void> {
  let res = await fetch(`/api/v1/American/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_American(source:Models.American) : Promise<void> {
  let res = await fetch(`/api/v1/American/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_American(id:number) : Promise<ItemWithEditable<Models.American>> {
  let res = await fetch(`/api/v1/American/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.American,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Americans(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.American>> {
  let res = await fetch(`/api/v1/American?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.American>(json, e => { return {...e, }})
}







  
  
export async function get_Meal_Categorie_Meals(source:Models.Meal, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Categorie>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Categorie>(json, e => { return {...e, }})
}

export async function get_Meal_Categorie_Meals_Categorie(source:Models.Meal, page_index:number, page_size:number, id:number) : Promise<Models.Categorie> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Categorie
}

export async function get_Meal_Categorie_Meals_Categorie_by_id(source:Models.Meal, id:number) : Promise<Models.Categorie> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Categorie
}


export async function get_unlinked_Meal_Categorie_Meals(source:Models.Meal, page_index:number, page_size:number) : Promise<RawPage<Models.Categorie>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Categorie>(json, e => { return {...e, }})
}
export async function get_unlinked_Meal_Categorie_Meals_American(source:Models.Meal, page_index:number, page_size:number) : Promise<RawPage<Models.American>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals/American?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.American>(json, e => { return {...e, }})
}

export async function get_unlinked_Meal_Categorie_Meals_Asian(source:Models.Meal, page_index:number, page_size:number) : Promise<RawPage<Models.Asian>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals/Asian?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Asian>(json, e => { return {...e, }})
}

export async function get_unlinked_Meal_Categorie_Meals_Mediterranean(source:Models.Meal, page_index:number, page_size:number) : Promise<RawPage<Models.Mediterranean>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/unlinked/Categorie_Meals/Mediterranean?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Mediterranean>(json, e => { return {...e, }})
}

    
export async function create_linked_Meal_Categorie_Meals_American(source:Models.Meal) : Promise<Models.American[]> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals_American`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.American[]
}

export async function create_linked_Meal_Categorie_Meals_Asian(source:Models.Meal) : Promise<Models.Asian[]> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals_Asian`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Asian[]
}

export async function create_linked_Meal_Categorie_Meals_Mediterranean(source:Models.Meal) : Promise<Models.Mediterranean[]> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals_Mediterranean`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Mediterranean[]
}

export async function link_Meal_Categorie_Meals(source:Models.Meal, target:Models.Categorie) : Promise<void> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Meal_Categorie_Meals(source:Models.Meal, target:Models.Categorie) : Promise<void> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Meal_Meal_Recipes(source:Models.Meal, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

export async function get_Meal_Meal_Recipes_Recipe(source:Models.Meal, page_index:number, page_size:number, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}

export async function get_Meal_Meal_Recipes_Recipe_by_id(source:Models.Meal, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}


export async function get_unlinked_Meal_Meal_Recipes(source:Models.Meal, page_index:number, page_size:number) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/unlinked/Meal_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

    
export async function create_linked_Meal_Meal_Recipes_Recipe(source:Models.Meal) : Promise<Models.Recipe[]> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes_Recipe`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Recipe[]
}

export async function link_Meal_Meal_Recipes(source:Models.Meal, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Meal_Meal_Recipes(source:Models.Meal, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Meal/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Meal() : Promise<Models.Meal> {
  let res = await fetch(`/api/v1/Meal/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Meal
}

export async function update_Meal(item:Models.Meal) : Promise<void> {
  let res = item.Kind == "Lunch" ? await update_Lunch(item as Models.Lunch) : item.Kind == "Dinner" ? await update_Dinner(item as Models.Dinner) : item.Kind == "Breakfast" ? await update_Breakfast(item as Models.Breakfast) : null
  
  return
}

export async function delete_Meal(source:Models.Meal) : Promise<void> {
  let res = await fetch(`/api/v1/Meal/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Meal(id:number) : Promise<ItemWithEditable<Models.Meal>> {
  let res = await fetch(`/api/v1/Meal/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Meal,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Meals(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Meal>> {
  let res = await fetch(`/api/v1/Meal?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Meal>(json, e => { return {...e, }})
}







  
  
export async function create_Asian() : Promise<Models.Asian> {
  let res = await fetch(`/api/v1/Asian/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Asian
}

export async function update_Asian(item:Models.Asian) : Promise<void> {
  let res = await fetch(`/api/v1/Asian/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Asian(source:Models.Asian) : Promise<void> {
  let res = await fetch(`/api/v1/Asian/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Asian(id:number) : Promise<ItemWithEditable<Models.Asian>> {
  let res = await fetch(`/api/v1/Asian/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Asian,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Asians(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Asian>> {
  let res = await fetch(`/api/v1/Asian?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Asian>(json, e => { return {...e, }})
}







  
  
export async function create_Lunch() : Promise<Models.Lunch> {
  let res = await fetch(`/api/v1/Lunch/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Lunch
}

export async function update_Lunch(item:Models.Lunch) : Promise<void> {
  let res = await fetch(`/api/v1/Lunch/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Lunch(source:Models.Lunch) : Promise<void> {
  let res = await fetch(`/api/v1/Lunch/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Lunch(id:number) : Promise<ItemWithEditable<Models.Lunch>> {
  let res = await fetch(`/api/v1/Lunch/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Lunch,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Lunches(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Lunch>> {
  let res = await fetch(`/api/v1/Lunch?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lunch>(json, e => { return {...e, }})
}







  
  
export async function get_User_User_Recipes(source:Models.User, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

export async function get_User_User_Recipes_Recipe(source:Models.User, page_index:number, page_size:number, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}

export async function get_User_User_Recipes_Recipe_by_id(source:Models.User, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}


export async function get_unlinked_User_User_Recipes(source:Models.User, page_index:number, page_size:number) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/User/${source.Id}/unlinked/User_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

    
export async function create_linked_User_User_Recipes_Recipe(source:Models.User) : Promise<Models.Recipe[]> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Recipes_Recipe`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Recipe[]
}

export async function link_User_User_Recipes(source:Models.User, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_User_User_Recipes(source:Models.User, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_User_User_Ratings(source:Models.User, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Rating>> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Ratings?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Rating>(json, e => { return {...e, }})
}

export async function get_User_User_Ratings_Rating(source:Models.User, page_index:number, page_size:number, id:number) : Promise<Models.Rating> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Rating
}

export async function get_User_User_Ratings_Rating_by_id(source:Models.User, id:number) : Promise<Models.Rating> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Rating
}


export async function get_unlinked_User_User_Ratings(source:Models.User, page_index:number, page_size:number) : Promise<RawPage<Models.Rating>> {
  let res = await fetch(`/api/v1/User/${source.Id}/unlinked/User_Ratings?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Rating>(json, e => { return {...e, }})
}

    
export async function create_linked_User_User_Ratings_Rating(source:Models.User) : Promise<Models.Rating[]> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Ratings_Rating`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Rating[]
}

export async function link_User_User_Ratings(source:Models.User, target:Models.Rating) : Promise<void> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Ratings/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_User_User_Ratings(source:Models.User, target:Models.Rating) : Promise<void> {
  let res = await fetch(`/api/v1/User/${source.Id}/User_Ratings/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_User() : Promise<Models.User> {
  let res = await fetch(`/api/v1/User/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.User
}

export async function update_User(item:Models.User) : Promise<void> {
  let res = await fetch(`/api/v1/User/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_User(source:Models.User) : Promise<void> {
  let res = await fetch(`/api/v1/User/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_User(id:number) : Promise<ItemWithEditable<Models.User>> {
  let res = await fetch(`/api/v1/User/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.User,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Users(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.User>> {
  let res = await fetch(`/api/v1/User?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.User>(json, e => { return {...e, }})
}







export async function delete_User_sessions() : Promise<void> {
  let res = await fetch(`/api/v1/User/DeleteSessions`,
    { method: 'post', credentials: 'include',
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  return
}

export async function active_User_sessions() : Promise<Array<{Item1: string, Item2: Date}>> {
  let res = await fetch(`/api/v1/User/ActiveSessions`,
    { method: 'post', credentials: 'include',
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) return []
  let json = await res.json()
  return json as Array<{Item1: string, Item2: Date}>
}

export async function validate_User(username:string, email:string, email_confirmation:string) : Promise<boolean> {
  let res = await fetch(`/api/v1/User/Validate`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, EmailConfirmation:email_confirmation}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) return false
  let json = await res.json()
  return !!json
}

export async function register_User(username:string, email:string, email_confirmation:string) : Promise<Models.User> {
  let res = await fetch(`/api/v1/User/Register`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, EmailConfirmation:email_confirmation}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.User
}

export async function login_User(username:string, email:string, password:string) : Promise<Models.User> {
  let res = await fetch(`/api/v1/User/Login`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, Password:password}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.User
}


export async function logout_User() : Promise<void> {
  let res = await fetch(`/api/v1/User/Logout`,
    { method: 'post', credentials: 'include',
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function change_User_password(username:string, email:string, password:string, new_password:string, new_password_confirmation:string) : Promise<void> {
  let res = await fetch(`/api/v1/User/ChangePassword`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, Password:password, NewPassword:new_password, NewPasswordConfirmation:new_password_confirmation}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function reset_User_password(username:string, email:string) : Promise<void> {
  let res = await fetch(`/api/v1/User/ResetPassword`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

    
  
  
export async function create_HomePage() : Promise<Models.HomePage> {
  let res = await fetch(`/api/v1/HomePage/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}

export async function update_HomePage(item:Models.HomePage) : Promise<void> {
  let res = await fetch(`/api/v1/HomePage/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_HomePage(source:Models.HomePage) : Promise<void> {
  let res = await fetch(`/api/v1/HomePage/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_HomePage(id:number) : Promise<ItemWithEditable<Models.HomePage>> {
  let res = await fetch(`/api/v1/HomePage/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.HomePage,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_HomePages(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.HomePage>> {
  let res = await fetch(`/api/v1/HomePage?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}







  
  
export async function get_Recipe_User_Recipes(source:Models.Recipe, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.User>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/User_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.User>(json, e => { return {...e, }})
}

export async function get_Recipe_User_Recipes_User(source:Models.Recipe, page_index:number, page_size:number, id:number) : Promise<Models.User> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.User
}

export async function get_Recipe_User_Recipes_User_by_id(source:Models.Recipe, id:number) : Promise<Models.User> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.User
}


export async function get_unlinked_Recipe_User_Recipes(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.User>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/User_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.User>(json, e => { return {...e, }})
}

    
export async function create_linked_Recipe_User_Recipes_User(source:Models.Recipe) : Promise<Models.User[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/User_Recipes_User`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.User[]
}

export async function link_Recipe_User_Recipes(source:Models.Recipe, target:Models.User) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Recipe_User_Recipes(source:Models.Recipe, target:Models.User) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/User_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Recipe_Recipe_Ratings(source:Models.Recipe, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Rating>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Rating>(json, e => { return {...e, }})
}

export async function get_Recipe_Recipe_Ratings_Rating(source:Models.Recipe, page_index:number, page_size:number, id:number) : Promise<Models.Rating> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Rating
}

export async function get_Recipe_Recipe_Ratings_Rating_by_id(source:Models.Recipe, id:number) : Promise<Models.Rating> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Rating
}


export async function get_unlinked_Recipe_Recipe_Ratings(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Rating>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Rating>(json, e => { return {...e, }})
}

    
export async function create_linked_Recipe_Recipe_Ratings_Rating(source:Models.Recipe) : Promise<Models.Rating[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings_Rating`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Rating[]
}

export async function link_Recipe_Recipe_Ratings(source:Models.Recipe, target:Models.Rating) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Recipe_Recipe_Ratings(source:Models.Recipe, target:Models.Rating) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Recipe_Meal_Recipes(source:Models.Recipe, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Meal>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Meal>(json, e => { return {...e, }})
}

export async function get_Recipe_Meal_Recipes_Meal(source:Models.Recipe, page_index:number, page_size:number, id:number) : Promise<Models.Meal> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Meal
}

export async function get_Recipe_Meal_Recipes_Meal_by_id(source:Models.Recipe, id:number) : Promise<Models.Meal> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Meal
}


export async function get_unlinked_Recipe_Meal_Recipes(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Meal>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Meal>(json, e => { return {...e, }})
}
export async function get_unlinked_Recipe_Meal_Recipes_Lunch(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Lunch>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes/Lunch?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lunch>(json, e => { return {...e, }})
}

export async function get_unlinked_Recipe_Meal_Recipes_Dinner(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Dinner>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes/Dinner?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Dinner>(json, e => { return {...e, }})
}

export async function get_unlinked_Recipe_Meal_Recipes_Breakfast(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Breakfast>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Meal_Recipes/Breakfast?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Breakfast>(json, e => { return {...e, }})
}

    
export async function create_linked_Recipe_Meal_Recipes_Lunch(source:Models.Recipe) : Promise<Models.Lunch[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes_Lunch`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Lunch[]
}

export async function create_linked_Recipe_Meal_Recipes_Dinner(source:Models.Recipe) : Promise<Models.Dinner[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes_Dinner`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Dinner[]
}

export async function create_linked_Recipe_Meal_Recipes_Breakfast(source:Models.Recipe) : Promise<Models.Breakfast[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes_Breakfast`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Breakfast[]
}

export async function link_Recipe_Meal_Recipes(source:Models.Recipe, target:Models.Meal) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Recipe_Meal_Recipes(source:Models.Recipe, target:Models.Meal) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Meal_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Recipe_Categorie_Recipes(source:Models.Recipe, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Categorie>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Categorie>(json, e => { return {...e, }})
}

export async function get_Recipe_Categorie_Recipes_Categorie(source:Models.Recipe, page_index:number, page_size:number, id:number) : Promise<Models.Categorie> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Categorie
}

export async function get_Recipe_Categorie_Recipes_Categorie_by_id(source:Models.Recipe, id:number) : Promise<Models.Categorie> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Categorie
}


export async function get_unlinked_Recipe_Categorie_Recipes(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Categorie>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Categorie_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Categorie>(json, e => { return {...e, }})
}
export async function get_unlinked_Recipe_Categorie_Recipes_American(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.American>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Categorie_Recipes/American?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.American>(json, e => { return {...e, }})
}

export async function get_unlinked_Recipe_Categorie_Recipes_Asian(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Asian>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Categorie_Recipes/Asian?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Asian>(json, e => { return {...e, }})
}

export async function get_unlinked_Recipe_Categorie_Recipes_Mediterranean(source:Models.Recipe, page_index:number, page_size:number) : Promise<RawPage<Models.Mediterranean>> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/unlinked/Categorie_Recipes/Mediterranean?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Mediterranean>(json, e => { return {...e, }})
}

    
export async function create_linked_Recipe_Categorie_Recipes_American(source:Models.Recipe) : Promise<Models.American[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes_American`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.American[]
}

export async function create_linked_Recipe_Categorie_Recipes_Asian(source:Models.Recipe) : Promise<Models.Asian[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes_Asian`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Asian[]
}

export async function create_linked_Recipe_Categorie_Recipes_Mediterranean(source:Models.Recipe) : Promise<Models.Mediterranean[]> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes_Mediterranean`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Mediterranean[]
}

export async function link_Recipe_Categorie_Recipes(source:Models.Recipe, target:Models.Categorie) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Recipe_Categorie_Recipes(source:Models.Recipe, target:Models.Categorie) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}/Categorie_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Recipe() : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Recipe/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}

export async function update_Recipe(item:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, Picture:""}), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Recipe(source:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Recipe(id:number) : Promise<ItemWithEditable<Models.Recipe>> {
  let res = await fetch(`/api/v1/Recipe/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Recipe,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Recipes(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Recipe?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}


export async function get_Recipe_Picture(item:Models.Recipe) : Promise<string> {
  let res = await fetch(`/api/v1/Recipe/${item.Id}/Picture`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.Content
}

export async function update_Recipe_Picture(item:Models.Recipe, new_src:string) : Promise<void> {
  let res = await fetch(`/api/v1/Recipe/${item.Id}/Picture`, { method: 'put', body: JSON.stringify({ Content: new_src }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}





  
  
export async function create_Admin() : Promise<Models.Admin> {
  let res = await fetch(`/api/v1/Admin/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Admin
}

export async function update_Admin(item:Models.Admin) : Promise<void> {
  let res = await fetch(`/api/v1/Admin/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Admin(source:Models.Admin) : Promise<void> {
  let res = await fetch(`/api/v1/Admin/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Admin(id:number) : Promise<ItemWithEditable<Models.Admin>> {
  let res = await fetch(`/api/v1/Admin/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Admin,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Admins(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Admin>> {
  let res = await fetch(`/api/v1/Admin?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Admin>(json, e => { return {...e, }})
}







export async function delete_Admin_sessions() : Promise<void> {
  let res = await fetch(`/api/v1/Admin/DeleteSessions`,
    { method: 'post', credentials: 'include',
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  return
}

export async function active_Admin_sessions() : Promise<Array<{Item1: string, Item2: Date}>> {
  let res = await fetch(`/api/v1/Admin/ActiveSessions`,
    { method: 'post', credentials: 'include',
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) return []
  let json = await res.json()
  return json as Array<{Item1: string, Item2: Date}>
}

export async function validate_Admin(username:string, email:string, email_confirmation:string) : Promise<boolean> {
  let res = await fetch(`/api/v1/Admin/Validate`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, EmailConfirmation:email_confirmation}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) return false
  let json = await res.json()
  return !!json
}

export async function register_Admin(username:string, email:string, email_confirmation:string) : Promise<Models.Admin> {
  let res = await fetch(`/api/v1/Admin/Register`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, EmailConfirmation:email_confirmation}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Admin
}

export async function login_Admin(username:string, email:string, password:string) : Promise<Models.Admin> {
  let res = await fetch(`/api/v1/Admin/Login`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, Password:password}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: new Date(json.CreatedDate),  } as Models.Admin
}


export async function logout_Admin() : Promise<void> {
  let res = await fetch(`/api/v1/Admin/Logout`,
    { method: 'post', credentials: 'include',
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function change_Admin_password(username:string, email:string, password:string, new_password:string, new_password_confirmation:string) : Promise<void> {
  let res = await fetch(`/api/v1/Admin/ChangePassword`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, Password:password, NewPassword:new_password, NewPasswordConfirmation:new_password_confirmation}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function reset_Admin_password(username:string, email:string) : Promise<void> {
  let res = await fetch(`/api/v1/Admin/ResetPassword`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email}),
      headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

    
  
  
export async function create_Dinner() : Promise<Models.Dinner> {
  let res = await fetch(`/api/v1/Dinner/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Dinner
}

export async function update_Dinner(item:Models.Dinner) : Promise<void> {
  let res = await fetch(`/api/v1/Dinner/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Dinner(source:Models.Dinner) : Promise<void> {
  let res = await fetch(`/api/v1/Dinner/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Dinner(id:number) : Promise<ItemWithEditable<Models.Dinner>> {
  let res = await fetch(`/api/v1/Dinner/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Dinner,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Dinners(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Dinner>> {
  let res = await fetch(`/api/v1/Dinner?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Dinner>(json, e => { return {...e, }})
}







  
  
export async function get_Categorie_Categorie_Meals(source:Models.Categorie, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Meal>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Meal>(json, e => { return {...e, }})
}

export async function get_Categorie_Categorie_Meals_Meal(source:Models.Categorie, page_index:number, page_size:number, id:number) : Promise<Models.Meal> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Meal
}

export async function get_Categorie_Categorie_Meals_Meal_by_id(source:Models.Categorie, id:number) : Promise<Models.Meal> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Meal
}


export async function get_unlinked_Categorie_Categorie_Meals(source:Models.Categorie, page_index:number, page_size:number) : Promise<RawPage<Models.Meal>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Meal>(json, e => { return {...e, }})
}
export async function get_unlinked_Categorie_Categorie_Meals_Lunch(source:Models.Categorie, page_index:number, page_size:number) : Promise<RawPage<Models.Lunch>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals/Lunch?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Lunch>(json, e => { return {...e, }})
}

export async function get_unlinked_Categorie_Categorie_Meals_Dinner(source:Models.Categorie, page_index:number, page_size:number) : Promise<RawPage<Models.Dinner>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals/Dinner?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Dinner>(json, e => { return {...e, }})
}

export async function get_unlinked_Categorie_Categorie_Meals_Breakfast(source:Models.Categorie, page_index:number, page_size:number) : Promise<RawPage<Models.Breakfast>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Meals/Breakfast?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Breakfast>(json, e => { return {...e, }})
}

    
export async function create_linked_Categorie_Categorie_Meals_Lunch(source:Models.Categorie) : Promise<Models.Lunch[]> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals_Lunch`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Lunch[]
}

export async function create_linked_Categorie_Categorie_Meals_Dinner(source:Models.Categorie) : Promise<Models.Dinner[]> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals_Dinner`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Dinner[]
}

export async function create_linked_Categorie_Categorie_Meals_Breakfast(source:Models.Categorie) : Promise<Models.Breakfast[]> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals_Breakfast`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Breakfast[]
}

export async function link_Categorie_Categorie_Meals(source:Models.Categorie, target:Models.Meal) : Promise<void> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Categorie_Categorie_Meals(source:Models.Categorie, target:Models.Meal) : Promise<void> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Meals/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Categorie_Categorie_Recipes(source:Models.Categorie, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Recipes?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

export async function get_Categorie_Categorie_Recipes_Recipe(source:Models.Categorie, page_index:number, page_size:number, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}

export async function get_Categorie_Categorie_Recipes_Recipe_by_id(source:Models.Categorie, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Recipes/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}


export async function get_unlinked_Categorie_Categorie_Recipes(source:Models.Categorie, page_index:number, page_size:number) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/unlinked/Categorie_Recipes?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

    
export async function create_linked_Categorie_Categorie_Recipes_Recipe(source:Models.Categorie) : Promise<Models.Recipe[]> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Recipes_Recipe`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Recipe[]
}

export async function link_Categorie_Categorie_Recipes(source:Models.Categorie, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Recipes/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Categorie_Categorie_Recipes(source:Models.Categorie, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}/Categorie_Recipes/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Categorie() : Promise<Models.Categorie> {
  let res = await fetch(`/api/v1/Categorie/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Categorie
}

export async function update_Categorie(item:Models.Categorie) : Promise<void> {
  let res = item.Kind == "American" ? await update_American(item as Models.American) : item.Kind == "Asian" ? await update_Asian(item as Models.Asian) : item.Kind == "Mediterranean" ? await update_Mediterranean(item as Models.Mediterranean) : null
  
  return
}

export async function delete_Categorie(source:Models.Categorie) : Promise<void> {
  let res = await fetch(`/api/v1/Categorie/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Categorie(id:number) : Promise<ItemWithEditable<Models.Categorie>> {
  let res = await fetch(`/api/v1/Categorie/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Categorie,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Categories(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Categorie>> {
  let res = await fetch(`/api/v1/Categorie?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Categorie>(json, e => { return {...e, }})
}







  
  
export async function create_Mediterranean() : Promise<Models.Mediterranean> {
  let res = await fetch(`/api/v1/Mediterranean/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Mediterranean
}

export async function update_Mediterranean(item:Models.Mediterranean) : Promise<void> {
  let res = await fetch(`/api/v1/Mediterranean/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Mediterranean(source:Models.Mediterranean) : Promise<void> {
  let res = await fetch(`/api/v1/Mediterranean/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Mediterranean(id:number) : Promise<ItemWithEditable<Models.Mediterranean>> {
  let res = await fetch(`/api/v1/Mediterranean/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Mediterranean,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Mediterraneans(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Mediterranean>> {
  let res = await fetch(`/api/v1/Mediterranean?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Mediterranean>(json, e => { return {...e, }})
}







  
  
export async function create_Breakfast() : Promise<Models.Breakfast> {
  let res = await fetch(`/api/v1/Breakfast/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Breakfast
}

export async function update_Breakfast(item:Models.Breakfast) : Promise<void> {
  let res = await fetch(`/api/v1/Breakfast/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Breakfast(source:Models.Breakfast) : Promise<void> {
  let res = await fetch(`/api/v1/Breakfast/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Breakfast(id:number) : Promise<ItemWithEditable<Models.Breakfast>> {
  let res = await fetch(`/api/v1/Breakfast/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Breakfast,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Breakfasts(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Breakfast>> {
  let res = await fetch(`/api/v1/Breakfast?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Breakfast>(json, e => { return {...e, }})
}







  
  
export async function create_CategoryList() : Promise<Models.CategoryList> {
  let res = await fetch(`/api/v1/CategoryList/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.CategoryList
}

export async function update_CategoryList(item:Models.CategoryList) : Promise<void> {
  let res = await fetch(`/api/v1/CategoryList/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_CategoryList(source:Models.CategoryList) : Promise<void> {
  let res = await fetch(`/api/v1/CategoryList/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_CategoryList(id:number) : Promise<ItemWithEditable<Models.CategoryList>> {
  let res = await fetch(`/api/v1/CategoryList/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.CategoryList,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_CategoryLists(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.CategoryList>> {
  let res = await fetch(`/api/v1/CategoryList?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.CategoryList>(json, e => { return {...e, }})
}







  
  
export async function get_Rating_User_Ratings(source:Models.Rating, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.User>> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/User_Ratings?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.User>(json, e => { return {...e, }})
}

export async function get_Rating_User_Ratings_User(source:Models.Rating, page_index:number, page_size:number, id:number) : Promise<Models.User> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/User_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.User
}

export async function get_Rating_User_Ratings_User_by_id(source:Models.Rating, id:number) : Promise<Models.User> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/User_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.User
}


export async function get_unlinked_Rating_User_Ratings(source:Models.Rating, page_index:number, page_size:number) : Promise<RawPage<Models.User>> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/unlinked/User_Ratings?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.User>(json, e => { return {...e, }})
}

    
export async function create_linked_Rating_User_Ratings_User(source:Models.Rating) : Promise<Models.User[]> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/User_Ratings_User`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.User[]
}

export async function link_Rating_User_Ratings(source:Models.Rating, target:Models.User) : Promise<void> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/User_Ratings/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Rating_User_Ratings(source:Models.Rating, target:Models.User) : Promise<void> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/User_Ratings/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function get_Rating_Recipe_Ratings(source:Models.Rating, page_index:number, page_size:number, query_string:string = null) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}${(query_string != null ? "&search_query=" + query_string : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

export async function get_Rating_Recipe_Ratings_Recipe(source:Models.Rating, page_index:number, page_size:number, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}

export async function get_Rating_Recipe_Ratings_Recipe_by_id(source:Models.Rating, id:number) : Promise<Models.Recipe> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Recipe
}


export async function get_unlinked_Rating_Recipe_Ratings(source:Models.Rating, page_index:number, page_size:number) : Promise<RawPage<Models.Recipe>> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/unlinked/Recipe_Ratings?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Recipe>(json, e => { return {...e, }})
}

    
export async function create_linked_Rating_Recipe_Ratings_Recipe(source:Models.Rating) : Promise<Models.Recipe[]> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings_Recipe`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return json.map(e => { return {...e, CreatedDate: Moment.utc(e.CreatedDate),  }}) as Models.Recipe[]
}

export async function link_Rating_Recipe_Ratings(source:Models.Rating, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'post', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function unlink_Rating_Recipe_Ratings(source:Models.Rating, target:Models.Recipe) : Promise<void> {
  let res = await fetch(`/api/v1/Rating/${source.Id}/Recipe_Ratings/${target.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  return
}


export async function create_Rating() : Promise<Models.Rating> {
  let res = await fetch(`/api/v1/Rating/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Rating
}

export async function update_Rating(item:Models.Rating) : Promise<void> {
  let res = await fetch(`/api/v1/Rating/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Rating(source:Models.Rating) : Promise<void> {
  let res = await fetch(`/api/v1/Rating/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Rating(id:number) : Promise<ItemWithEditable<Models.Rating>> {
  let res = await fetch(`/api/v1/Rating/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Rating,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Ratings(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Rating>> {
  let res = await fetch(`/api/v1/Rating?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Rating>(json, e => { return {...e, }})
}







  
  
export async function create_Bookmarks() : Promise<Models.Bookmarks> {
  let res = await fetch(`/api/v1/Bookmarks/`,
    { method: 'post', credentials: 'include', headers:{'content-type': 'application/json',
      'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Bookmarks
}

export async function update_Bookmarks(item:Models.Bookmarks) : Promise<void> {
  let res = await fetch(`/api/v1/Bookmarks/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value } })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Bookmarks(source:Models.Bookmarks) : Promise<void> {
  let res = await fetch(`/api/v1/Bookmarks/${source.Id}`, { method: 'delete', credentials: 'include', headers:{'content-type': 'application/json', 'X-XSRF-TOKEN': (document.getElementsByName("__RequestVerificationToken")[0] as any).value} })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Bookmarks(id:number) : Promise<ItemWithEditable<Models.Bookmarks>> {
  let res = await fetch(`/api/v1/Bookmarks/${id}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Bookmarks,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Bookmarkss(page_index:number, page_size:number, search_query:string = null) : Promise<RawPage<Models.Bookmarks>> {
  let res = await fetch(`/api/v1/Bookmarks?page_index=${page_index}&page_size=${page_size}${(search_query != null ? "&page_size=" + search_query : "")}`, { method: 'get', credentials: 'include', headers:{'content-type': 'application/json'} })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Bookmarks>(json, e => { return {...e, }})
}







  
  
  