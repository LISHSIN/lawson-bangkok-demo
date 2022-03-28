import { UserStatusValue } from "./constants";

export interface StoreLocatorUserInfo {
    crcef_storelocatorusersid: string,
    crcef_userstatus: number,
    _crcef_user_value: string,
}

export const InitialStoreLocatorUserInfo: StoreLocatorUserInfo = {
    crcef_storelocatorusersid: '',
    crcef_userstatus: UserStatusValue.DISABLED,
    _crcef_user_value: '',
}
