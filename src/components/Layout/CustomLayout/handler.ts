import { MODULE_COLLECTION_SERVICE_PATH, MODULE_DISBURSEMENT_PATH } from "./config"

// filter disbursement and collection unregister menu
export const filterUnregisterMenu = (menuData: any, currentMerchant: ObjectType) => {
    let menuDataFiltered = menuData.filter((item: any) => {
        return item.path !== MODULE_DISBURSEMENT_PATH || currentMerchant?.isRegisteredDisbursement
    })
    menuDataFiltered = menuDataFiltered.filter((item: any) => {
        return item.path !== MODULE_COLLECTION_SERVICE_PATH || currentMerchant?.isRegisteredCollection
    })

    return menuDataFiltered || [];
}