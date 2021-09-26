import { Observable, of, timer } from "rxjs";
import { CacheTagManager } from "../../dist/cache-tag-manager";
import { map } from 'rxjs/operators';

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

export type UserFetchResult = UserFetchedResult | UserNotFetchedResult;

export class UserService {
    private cacheTagManager: CacheTagManager = new CacheTagManager();

    constructor() {
        this.cacheTagManager.addTagContainer('user', 2000);
    }

    fetchUser(id: string, invalidate?: boolean): Observable<UserFetchResult> {
        if (invalidate) {
            this.cacheTagManager.invalidate('user', id);
        }

        return this.cacheTagManager.get('user', id, (stale): Observable<UserFetchResult> => {
            if (stale) {
                return timer(2000).pipe(
                    map(() => ({
                        type: 'fetched',
                        userDTO: {
                            id,
                            first_name: 'John',
                            last_name: 'Doe',
                        },
                    }))
                );
            }

            return of({type: 'not-fetched'});
        });
    }

    patchUser(id: string, userDTOPartial: Partial<UserDTO>): Observable<UserDTO> {
        return this.cacheTagManager.update('user', id, () => 
            timer(1000).pipe(
                map(() => ({
                    id,
                    first_name: userDTOPartial.first_name ?? 'Carl',
                    last_name: userDTOPartial.last_name ?? 'Kox',
                })),
            ),
        );
    }


    updateUser(userDTO: UserDTO): Observable<UserDTO> {
        return this.cacheTagManager.update('user', userDTO.id, () => {
            return timer(1000).pipe(
                map(() => ({
                    ...userDTO,
                })),
            );
        });
    }

    deleteUser(id: string): Observable<void> {
        this.cacheTagManager.invalidate('user', id);
        return timer(1000).pipe(
            map(() =>{}),
        );
    }

    createUser(userDTO: UserDTO): Observable<UserDTO> {
        return this.cacheTagManager.create('user', () => {
            return timer(5000).pipe(
                map(() => ({
                    id: '10',
                    item: {
                        id: '10',
                        first_name: 'Bob',
                        last_name: 'Smith',
                    },
                })),
            );
        });
    }
}