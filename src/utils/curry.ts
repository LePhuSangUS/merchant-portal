type ObjectType = {
    [key: string]: any
}

// compose :: ((y -> z), (x -> y),  ..., (a -> b)) -> a -> z
export const compose = (...fns: any[]) => (...args: any[]) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
export function curry(fn: any) {
    return function $curry(...args: any[]): any {
        return args.length < fn.length ? $curry.bind(null, ...args) : fn.call(null, ...args)
    }
}

export const getProperty = curry((property: string, object: ObjectType) => object?.[property])
export const hasProperty = curry((property: string, object: ObjectType) => !!object?.[property])
export const propertyEqual = curry((property: string, compare: any, object: ObjectType) => object?.[property] === compare)
export const propertyNotEqual = curry((property: string, compare: any, object: ObjectType) => object?.[property] !== compare)
// forEach :: (a -> ()) -> [a] -> ()
export const forEach = curry((fn: any, xs: any[]) => xs?.forEach(fn))
export const trim = (str: string) => typeof str === 'string' ? str.trim() : str
export const includes = curry((arr: any[], property: string, object: ObjectType) => arr?.includes(object?.[property]))
export const indexOf = curry((currentPath: string | any[], checkPath: any) => currentPath?.indexOf(checkPath) > -1);
export const isExists = (value: any) => !!value;