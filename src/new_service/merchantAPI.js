import request from './request';

export const accountAPI = {
  getMerchantUsers: (params) => {
    return request.get('/merchant/merchant-user', { params });
  },
  getMerchantConfigAPI:(params) => {
    return request.get('/merchant/merchant-configs', { params });
  },
  toggleDisbursementActiveAPI:(data) => {
    return request.put('/merchant/disbursements/active', data);
  },
  updateMerchantInfoAPI:(data) => {
    return request.put('/merchant/updateCurrentMerchant', data);
  },
  getMerchantUserRolesAPI: (params) => {
    return request.get('/merchant/merchant-user/roles',{params})
  },
  getRoleTableAPI: (params) => {
    return request.get('/merchant/merchant-user/role-table',{params})
  },
  addMemberAPI: (data) => {
    return request.post('/merchant/merchant-user',data)
  },
  editMemberAPI: (data) => {
    const {_id, ...rest } = data;
    return request.put(`/merchant/merchant-user/${_id}`,rest)
  },
  setActiveMerchantUserAPI: (data) => {
    const {_id, ...rest } = data;
    return request.put(`/merchant/merchant-user/set-active/${_id}`)
  },
  deleteMerchantUserAPI: (data) => {
    console.log(data)
    const {_id, ...rest } = data;
    return request.delete(`/merchant/merchant-user/${_id}`)
  }

};
export const publicAPI = {
  getBusinessLineAPI: (params) => {
    return request.get('/merchant/businessLine', { params });
  },
}

// export function loginOTP(data) {
//   return request.post('/api/v2/authenticator/login_phone', data)
// }

// export function validateOTP(data) {
//   return request.post('/api/v2/authenticator/validate_otp', data)
// }

// // =============== USERS =====================

// export function getUsers(params) {
//   return request.get('/api/v2/staff/users/search', { params })
// }

// export function changeStaffAssignAllow(data = {}) {
//   const { userId, status } = data
//   return request.post(`/api/v2/staff/users/${userId}/staff_assign_allow/change`, { status })
// }

// export function changeRole(data = {}) {
//   const { userId, role } = data;
//   return request.post(`/api/v2/staff/users/${userId}/role/change`, {
//     role
//   })
// }

// //============ Deliveries =====================
// export function getDeliveries(params) {
//   return request.get(`/api/v2/staff/deliveries/search`, { params })
// }
// export function changeDeliveryStatus(data = {}) {
//   const { deliveryId, status,time_slot_begin,time_slot_end ,shipper_collected_amount} = data
//   return request.post(`/api/v2/staff/deliveries/${deliveryId}/temp/update`, { status,time_slot_begin, time_slot_end,shipper_collected_amount})
// }
// export function changeDeliveryTimeSlot(data = {}) {
//   const { deliveryId,time_slot_begin,time_slot_end } = data
//   return request.post(`/api/v2/staff/deliveries/${deliveryId}/time_slot/update`, { time_slot_begin, time_slot_end})
// }
// export function changeShipperCostAmount(data = {}) {
//   const { stopId, newShipperCostAmount } = data
//   return request.post(`/api/v2/staff/stops/${stopId}/update`, { shipper_cost_amount: newShipperCostAmount })
// }
// export function changeShipperCollectedAmount(data = {}) {
//   const { deliveryID, shipperCollectedAmount } = data
//   return request.post(`/api/v2/staff/deliveries/${deliveryID}/temp/update`, { shipper_collected_amount: shipperCollectedAmount })
// }
// // ========== Routes =========================

// export function getRoutes(params) {
//   return request.get(`/api/v2/staff/routes/search`, { params })
// }
// export function createRoute(data) {
//   const { deliveries, shipperId } = data;

//   return request.post(`/api/v2/staff/routes/create`, {
//     deliveries,
//     shipper_id: shipperId
//   })
// }
// export function completeRoute(data) {
//   const { routeId } = data;
//   return request.get(`/api/v2/staff/routes/${routeId}/complete`)
// }

// //Operations

// export function getOperations(params) {
//   return request.get(`/api/v2/staff/operation/search`, { params })
// }

// //Clothes

// export function getClothes(params) {
//   return request.get(`/api/v2/staff/items/search`, { params })
// }

// export function changeInspectionStatus(data = {}) {
//   const { itemId, status } = data;
//   return request.post(`/api/v2/staff/items/${itemId}/inspection/update`, {
//     inspection_status: status,
//   }, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }
// export function changeStaffStatus(data = {}) {
//   const { itemId, status } = data;
//   return request.post(`/api/v2/staff/items/${itemId}/update`, {
//     item_status_staff_assigned: status,
//   }, {
//     headers: {
//       // 'Content-Type': 'multipart/form-data'
//     }
//   })
// }
// export function updateCloth(data = {}) {
//   const { itemId, ...rest } = data;
//   return request.post(`/api/v2/staff/items/${itemId}/update`, {
//    ...rest
//   }, {
//     headers: {
//       // 'Content-Type': 'multipart/form-data'
//     }
//   })
// }
// export function updateImageCloth(data) {
//   return request.post(`/api/v2/staff/image/update`,data, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }

// //Dashboard

// export function getStatisticGrandTotal(params) {
//   return request.get(`/api/v2/staff/statistic/grand_total`, { params })
// }
// export function getStatisticDailyNewUsers(params) {
//   return request.get(`/api/v2/staff/statistic/weekly_trend/daily_new_users`, { params })
// }
// export function getStatisticDailyNonNewActiveUsers(params) {
//   return request.get(`/api/v2/staff/statistic/weekly_trend/daily_non_new_active_users`, { params })
// }
// export function getStatisticSwopAccepted(params) {
//   return request.get(`/api/v2/staff/statistic/weekly_trend/daily_accepted_swop`, { params })
// }
// export function getStatisticSwopBreakdown(params) {
//   return request.get(`/api/v2/staff/statistic/swop_breakdown`, { params })
// }
// export function getStatisticDeliveryTypePickLiveStatus(params) {
//   return request.get(`/api/v2/staff/statistic/pick_deliveries_live_swop`, { params })
// }
// export function getStatisticDeliveryTypeDropLiveStatus(params) {
//   return request.get(`/api/v2/staff/statistic/drop_deliveries_live_swop`, { params })
// }

// //HUB LIST

// export function getHubList(params) {
//   return request.get('/api/v2/staff/hubs/search', { params })
// }
// export function getCurrencyList(params) {
//   return request.get('/api/v2/staff/currencies/search', { params })
// }

// export function updateHub(data = {}) {
//   const { hubId, ...rest } = data;
//   return request.post(`/api/v2/staff/hubs/${hubId}/update`, {
//    ...rest
//   }, {
//     headers: {
//       // 'Content-Type': 'multipart/form-data'
//     }
//   })
// }

// //ACCOUNTS
// export function getAccountingListAPI(params) {
//   return request.get('/api/v2/staff/statistic/accounting', { params })
// }

// // Orders
// export function getOrders(params) {
//   return request.get(`/api/v2/staff/orders/search_v2`, { params })
// }
