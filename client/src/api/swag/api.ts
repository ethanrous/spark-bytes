/* tslint:disable */
/* eslint-disable */
/**
 * SparkBytes API
 * Access to the SparkBytes server
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface EventInfo
 */
export interface EventInfo {
    /**
     * 
     * @type {number}
     * @memberof EventInfo
     */
    'attendees'?: number;
    /**
     * 
     * @type {string}
     * @memberof EventInfo
     */
    'description'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventInfo
     */
    'dietaryInfo'?: string;
    /**
     * 
     * @type {number}
     * @memberof EventInfo
     */
    'endTime'?: number;
    /**
     * 
     * @type {number}
     * @memberof EventInfo
     */
    'eventId'?: number;
    /**
     * 
     * @type {string}
     * @memberof EventInfo
     */
    'location'?: string;
    /**
     * 
     * @type {string}
     * @memberof EventInfo
     */
    'name'?: string;
    /**
     * 
     * @type {OwnerInfo}
     * @memberof EventInfo
     */
    'owner'?: OwnerInfo;
    /**
     * 
     * @type {number}
     * @memberof EventInfo
     */
    'startTime'?: number;
}
/**
 * 
 * @export
 * @interface LoginParams
 */
export interface LoginParams {
    /**
     * 
     * @type {string}
     * @memberof LoginParams
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof LoginParams
     */
    'password': string;
}
/**
 * 
 * @export
 * @interface NewEventParams
 */
export interface NewEventParams {
    /**
     * 
     * @type {number}
     * @memberof NewEventParams
     */
    'attendees'?: number;
    /**
     * 
     * @type {string}
     * @memberof NewEventParams
     */
    'description'?: string;
    /**
     * 
     * @type {string}
     * @memberof NewEventParams
     */
    'dietary_info'?: string;
    /**
     * 
     * @type {number}
     * @memberof NewEventParams
     */
    'end_time'?: number;
    /**
     * 
     * @type {string}
     * @memberof NewEventParams
     */
    'location'?: string;
    /**
     * 
     * @type {string}
     * @memberof NewEventParams
     */
    'name'?: string;
    /**
     * 
     * @type {number}
     * @memberof NewEventParams
     */
    'owner_id'?: number;
    /**
     * 
     * @type {number}
     * @memberof NewEventParams
     */
    'start_time'?: number;
}
/**
 * 
 * @export
 * @interface NewUserParams
 */
export interface NewUserParams {
    /**
     * 
     * @type {string}
     * @memberof NewUserParams
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof NewUserParams
     */
    'first_name'?: string;
    /**
     * 
     * @type {string}
     * @memberof NewUserParams
     */
    'last_name'?: string;
    /**
     * 
     * @type {string}
     * @memberof NewUserParams
     */
    'password'?: string;
}
/**
 * 
 * @export
 * @interface OwnerInfo
 */
export interface OwnerInfo {
    /**
     * 
     * @type {string}
     * @memberof OwnerInfo
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof OwnerInfo
     */
    'firstName'?: string;
    /**
     * 
     * @type {string}
     * @memberof OwnerInfo
     */
    'joinedAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof OwnerInfo
     */
    'lastName'?: string;
}
/**
 * 
 * @export
 * @interface UserInfo
 */
export interface UserInfo {
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    'firstName'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    'joinedAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    'lastName'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof UserInfo
     */
    'verified'?: boolean;
}

/**
 * EventsApi - axios parameter creator
 * @export
 */
export const EventsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create Event
         * @param {NewEventParams} newEventParams New event params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEvent: async (newEventParams: NewEventParams, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'newEventParams' is not null or undefined
            assertParamExists('createEvent', 'newEventParams', newEventParams)
            const localVarPath = `/events`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(newEventParams, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get All Events
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEvents: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/events`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * EventsApi - functional programming interface
 * @export
 */
export const EventsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = EventsApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Create Event
         * @param {NewEventParams} newEventParams New event params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createEvent(newEventParams: NewEventParams, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createEvent(newEventParams, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EventsApi.createEvent']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get All Events
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEvents(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<EventInfo>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getEvents(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['EventsApi.getEvents']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * EventsApi - factory interface
 * @export
 */
export const EventsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = EventsApiFp(configuration)
    return {
        /**
         * 
         * @summary Create Event
         * @param {NewEventParams} newEventParams New event params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEvent(newEventParams: NewEventParams, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.createEvent(newEventParams, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get All Events
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEvents(options?: RawAxiosRequestConfig): AxiosPromise<Array<EventInfo>> {
            return localVarFp.getEvents(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * EventsApi - object-oriented interface
 * @export
 * @class EventsApi
 * @extends {BaseAPI}
 */
export class EventsApi extends BaseAPI {
    /**
     * 
     * @summary Create Event
     * @param {NewEventParams} newEventParams New event params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EventsApi
     */
    public createEvent(newEventParams: NewEventParams, options?: RawAxiosRequestConfig) {
        return EventsApiFp(this.configuration).createEvent(newEventParams, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get All Events
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EventsApi
     */
    public getEvents(options?: RawAxiosRequestConfig) {
        return EventsApiFp(this.configuration).getEvents(options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * UsersApi - axios parameter creator
 * @export
 */
export const UsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create User
         * @param {NewUserParams} newUserParams New user params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createUser: async (newUserParams: NewUserParams, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'newUserParams' is not null or undefined
            assertParamExists('createUser', 'newUserParams', newUserParams)
            const localVarPath = `/users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(newUserParams, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get Logged in user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLoggedInUser: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/users/me`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get User
         * @param {string} email User email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUser: async (email: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'email' is not null or undefined
            assertParamExists('getUser', 'email', email)
            const localVarPath = `/users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (email !== undefined) {
                localVarQueryParameter['email'] = email;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Login User
         * @param {LoginParams} loginParams Login params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        loginUser: async (loginParams: LoginParams, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'loginParams' is not null or undefined
            assertParamExists('loginUser', 'loginParams', loginParams)
            const localVarPath = `/users/login`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(loginParams, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Logout User
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logoutUser: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/users/logout`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Verify a user
         * @param {string} userId UserId to verify
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        verifyUser: async (userId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('verifyUser', 'userId', userId)
            const localVarPath = `/users/{userId}/verify`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UsersApi - functional programming interface
 * @export
 */
export const UsersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UsersApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Create User
         * @param {NewUserParams} newUserParams New user params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createUser(newUserParams: NewUserParams, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createUser(newUserParams, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.createUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get Logged in user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLoggedInUser(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInfo>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getLoggedInUser(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.getLoggedInUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get User
         * @param {string} email User email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUser(email: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInfo>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUser(email, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.getUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Login User
         * @param {LoginParams} loginParams Login params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async loginUser(loginParams: LoginParams, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserInfo>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.loginUser(loginParams, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.loginUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Logout User
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async logoutUser(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.logoutUser(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.logoutUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Verify a user
         * @param {string} userId UserId to verify
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async verifyUser(userId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.verifyUser(userId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.verifyUser']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UsersApi - factory interface
 * @export
 */
export const UsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UsersApiFp(configuration)
    return {
        /**
         * 
         * @summary Create User
         * @param {NewUserParams} newUserParams New user params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createUser(newUserParams: NewUserParams, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.createUser(newUserParams, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get Logged in user
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLoggedInUser(options?: RawAxiosRequestConfig): AxiosPromise<UserInfo> {
            return localVarFp.getLoggedInUser(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get User
         * @param {string} email User email
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUser(email: string, options?: RawAxiosRequestConfig): AxiosPromise<UserInfo> {
            return localVarFp.getUser(email, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Login User
         * @param {LoginParams} loginParams Login params
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        loginUser(loginParams: LoginParams, options?: RawAxiosRequestConfig): AxiosPromise<UserInfo> {
            return localVarFp.loginUser(loginParams, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Logout User
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        logoutUser(options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.logoutUser(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Verify a user
         * @param {string} userId UserId to verify
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        verifyUser(userId: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.verifyUser(userId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UsersApi - object-oriented interface
 * @export
 * @class UsersApi
 * @extends {BaseAPI}
 */
export class UsersApi extends BaseAPI {
    /**
     * 
     * @summary Create User
     * @param {NewUserParams} newUserParams New user params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public createUser(newUserParams: NewUserParams, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).createUser(newUserParams, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get Logged in user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getLoggedInUser(options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).getLoggedInUser(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get User
     * @param {string} email User email
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getUser(email: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).getUser(email, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Login User
     * @param {LoginParams} loginParams Login params
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public loginUser(loginParams: LoginParams, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).loginUser(loginParams, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Logout User
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public logoutUser(options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).logoutUser(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Verify a user
     * @param {string} userId UserId to verify
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public verifyUser(userId: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).verifyUser(userId, options).then((request) => request(this.axios, this.basePath));
    }
}



