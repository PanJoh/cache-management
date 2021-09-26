import { Observable } from "rxjs";
export interface UserDTO {
    id: string;
    first_name: string;
    last_name: string;
}
export interface UserFetchedResult {
    type: 'fetched';
    userDTO: UserDTO;
}
export interface UserNotFetchedResult {
    type: 'not-fetched';
}
export declare type UserFetchResult = UserFetchedResult | UserNotFetchedResult;
export declare class UserService {
    private cacheTagManager;
    constructor();
    fetchUser(id: string, invalidate?: boolean): Observable<UserFetchResult>;
    patchUser(id: string, userDTOPartial: Partial<UserDTO>): Observable<UserDTO>;
    updateUser(userDTO: UserDTO): Observable<UserDTO>;
    deleteUser(id: string): Observable<void>;
    createUser(userDTO: UserDTO): Observable<UserDTO>;
}
