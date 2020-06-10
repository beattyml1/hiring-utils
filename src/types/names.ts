import {ActionHandler, Store} from "vuex";

export type Names<T> = { [k in keyof T]: k};
export function names<T>(x: T): Names<T> {
    return Object.keys(x).reduce((result, key) => ({
        ...result,
        [key]: key
    }), {}) as Names<T>;
}

export function mapProperties<T extends {[k in keyof  T]: U}, R = any, U = any>(
        x: T,
        map: (key: string, value: U) => R
) {
    return Object.keys(x).reduce((result, key) => ({
        ...result,
        [key]: map(key, x[key])
    }), {}) as { [k in keyof T]: R };
}


export type FirstParam<T> = T extends (x: infer U, ...args: any[]) => void ? U : never;
export type SecondParam<T> = T extends (x, y: infer U, ...args: any[]) => void ? U : never;
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

export type Action = (s, p) => any;

export type PayloadFromActionFunc<T extends Action> = SecondParam<T>;

export type ActionDispatchers<T extends { [k in keyof T]: Action }> =  {
    [k in keyof T]: (payload: PayloadFromActionFunc<T[k]>) => ReturnType<T[k]>;
}

export type ActionParams<T extends { [k in keyof T]: Action }> =  {
    [k in keyof T]: [k, (payload: PayloadFromActionFunc<T[k]>) => ReturnType<T[k]>];
}

export function actionDispatchParamsForAction<A extends Action>(a: A) {
    return (p: PayloadFromActionFunc<A>) => [a.name, p]
}

export function actionsForStore<T extends { [k in keyof T]: Action }, S=any>(store: Store<S>, actions: T) {
    return mapProperties(actions, key => (payload) => store.dispatch(key, payload)) as ActionDispatchers<T>;
}

export function gettersForStore<T extends { [k in keyof T]: (...args) => any }, S=any>(store: Store<S>, getters: T) {
    return mapProperties(getters, key => store.getters[key]) as { [k in keyof T]: ReturnType<T[k]> }
}

// let a = actionDispatcherForAction((s, x: { a, b }) => 1)