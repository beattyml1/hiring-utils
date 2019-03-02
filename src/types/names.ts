import {ActionHandler} from "vuex";

export type Names<T> = { [k in keyof T]: k};
export function names<T>(x: T): Names<T> {
    return Object.keys(x).reduce((_, key) => ({..._, [key]: key }), {}) as Names<T>;
}
//
// export type ActionPayloadForFunc<F extends (s, p) => any> = F extends (s:any, infer p: P) => any ? P : any;
//
//
//
// export function actionDispatcherForAction<F extends (s, p: P) => any, P>(a: F) {
//     return (p: ActionPayloadForFunc<F, P>) => [a.name, p]
// }
//
// let a = actionDispatcherForAction((s, x: { a, b }) => 1)