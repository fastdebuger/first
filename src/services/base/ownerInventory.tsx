import request from "@/utils/request";

export async function getOwnerInventory(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/ownerInventory/getOwnerInventory", {
    method: "GET",
    params,
  });
}

export async function addOwnerInventory(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/ownerInventory/addOwnerInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function updateOwnerInventory(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/ownerInventory/updateOwnerInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function deleteOwnerInventory(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/ownerInventory/deleteOwnerInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function batchDeleteOwnerInventory(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/ownerInventory/batchDeleteOwnerInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function importOwnerInventory(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/ownerInventory/importOwnerInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
