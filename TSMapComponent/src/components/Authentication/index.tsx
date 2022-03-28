import React, { useState, useEffect } from 'react';
import './index.css';

import SpinnerFC from 'components/Spinner';

import LicenseErrorFC from './licenseError';
import { UserStatusValue } from './constants';
import { StoreLocatorUserInfo, InitialStoreLocatorUserInfo } from './module';

export interface AuthenticationProps {
}

export const AuthenticationFC: React.FC<AuthenticationProps> = (props => {
    // State Variables
    const [isLicensedUser, setIsLicensedUser] = useState<boolean | undefined>(undefined);
    const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(true);
    const [storeLocatorUserData, setStoreLocatorUserData] = useState<StoreLocatorUserInfo>(InitialStoreLocatorUserInfo);

    useEffect(() => {
        if (isLicensedUser !== undefined) {
            setIsCheckingAuthentication(false);
        }
    }, [isLicensedUser]);

    useEffect(() => {
        if (storeLocatorUserData._crcef_user_value !== '') {
            if (storeLocatorUserData.crcef_userstatus === UserStatusValue.ENABLED) {
                setIsLicensedUser(true);
            } else {
                setIsLicensedUser(false);
            }
        }
    }, [storeLocatorUserData]);

    useEffect(() => {
        retriveStoreLocatorUserDataFromD365();
    }, []);

    /**
     * This function is used to get
     * the current login user id
     * @return user id
     */
    function getUserIdValue() {
        return Xrm.Page.context.getUserId().replace("{", "").replace("}", "");
    }

    /**
     * This function is used to construct
     * the current store locator user
     * @param data store locator user response
     * @return StoreLocatorUserInfo store locator user detail
     */
    function constructStoreLocatorUser(data: any): StoreLocatorUserInfo {
        return {
            crcef_storelocatorusersid: data.crcef_storelocatorusersid,
            crcef_userstatus: data.crcef_userstatus,
            _crcef_user_value: data._crcef_user_value,
        };
    }

    /**
     * This function is used to retrive the "crcef_storelocatorusers" Entity values
     * to get the current store locator user.
     */
    function retriveStoreLocatorUserDataFromD365() {
        Xrm.WebApi
            .retrieveMultipleRecords("crcef_storelocatorusers").then((result) => {
                let entities = result.entities;
                let currentUserIdValue = getUserIdValue();

                let currentStoreLocatorUser = entities.find(entity => entity._crcef_user_value.toUpperCase() === currentUserIdValue.toUpperCase());
                if (currentStoreLocatorUser !== undefined) {
                    let storeLocatorUser = constructStoreLocatorUser(currentStoreLocatorUser);
                    setStoreLocatorUserData(storeLocatorUser);
                } else {
                    setIsLicensedUser(false);
                }
            });
    }

    /**
     * This function is used to render the license error
     * component for the current login user is not valid.
     */
    function renderLicenseErrorComponent() {
        return <LicenseErrorFC></LicenseErrorFC>;
    }

    /**
     * This function is used to render the map
     * component for the current login user is valid.
     */
    function renderMapComponent() {
        return (
            <>{props.children}</>
        );
    }

    /**
     * This function is used to render the 
     * component for the current login user.
     */
    function renderComponent() {
        if (isCheckingAuthentication === true) {
            return <SpinnerFC></SpinnerFC>;
        }

        if (isLicensedUser === true) {
            return renderMapComponent();
        } else {
            return renderLicenseErrorComponent();
        }
    }

    return renderComponent();
});

export default AuthenticationFC;
