import _ from "lodash"
import { stringify } from 'querystring'

import { curry } from "@/utils/curry"
import { getLocalStorage, setLocalStorage } from "@/utils/storage"
import { STORAGE_KEY } from "@/constants"

const CACHE_URL_QUERY_NAME = 'cache-url-query'

// storage filter query
export const parseStrObj = (data: string) => {
    try {
        return JSON.parse(data) || {}
    } catch (error) {
        return {}
    }
}


export const getObjectStorage = (key: string) => parseStrObj(getLocalStorage(key))
export const getFilterQuery = (key: string) => getObjectStorage(STORAGE_KEY)?.[CACHE_URL_QUERY_NAME]?.[key]

export const setFilterQuery = curry((key: string, value: ObjectType) => {
    const portalStorage = getObjectStorage(STORAGE_KEY)
    if(!portalStorage[CACHE_URL_QUERY_NAME])
        portalStorage[CACHE_URL_QUERY_NAME] = {}
    portalStorage[CACHE_URL_QUERY_NAME][key] = value
    setLocalStorage(STORAGE_KEY, portalStorage)
})

export const removeFilterQuery = (key: string) => {
    const portalStorage = getObjectStorage(STORAGE_KEY)
    delete portalStorage[CACHE_URL_QUERY_NAME][key]
    setLocalStorage(STORAGE_KEY, portalStorage)
}

// other

export const pushQueryToUrl = curry((history: any, pathname: string, query: ObjectType) => {
    const search = stringify(query)
    history.replace({ pathname: pathname || history?.location?.pathname, search })
})

export const renderActsWidth = (editAct: any, removeAct: any, btnLength: number) => {
    const w1 = editAct ? 50 : 0
    const w2 = removeAct ? 50 : 0
    const w3 = btnLength ? 50 * btnLength : 0
    return w1 + w2 + w3
}
