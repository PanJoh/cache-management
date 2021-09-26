import { Observable} from "rxjs";
import { map, tap } from 'rxjs/operators';
import { addCacheContainer as addCacheTagContainer, CacheTagContainer, CacheTagStore, createCacheTagStore, getCacheTag, removeCacheTag, removeCachTagContainer, updateCacheTag } from "./cach-tag.models";

export interface CreateOperationResult<T> {
    item: T;
    id: string | number;
}

export class CacheTagManager {
    private cacheTagStore: CacheTagStore = createCacheTagStore();
    
    get<T>(containerId: string, id: string | number, fetcher: (stale: boolean) => Observable<T>): Observable<T> {
        const cacheTag = getCacheTag(containerId, id, this.cacheTagStore);
        if (!cacheTag || cacheTag.fetched + cacheTag.ttl < Date.now()) {
            return fetcher(true).pipe(
                tap(() => updateCacheTag(containerId, id, Date.now(), this.cacheTagStore)),
            );
        }

        return fetcher(false);
    }

    create<T>(containerId: string, creator: () => Observable<CreateOperationResult<T>>): Observable<T> {
        return creator().pipe(
            tap(result => updateCacheTag(containerId, result.id, Date.now(), this.cacheTagStore)),
            map(result => result.item),
        );
    }

    update<T>(containerId: string, id: string, fetcher: () => Observable<T>): Observable<T> {
        return fetcher().pipe(
            tap(() => updateCacheTag(containerId, id, Date.now(), this.cacheTagStore)),
        )
    }

    invalidate(containerId: string, id: string): void {
        removeCacheTag(containerId, id, this.cacheTagStore);
    }

    addTagContainer(containerId: string, ttl: number): void {
        addCacheTagContainer(containerId, ttl, this.cacheTagStore);
    }

    removeContainer(containerId: string): void {
        removeCachTagContainer(containerId, this.cacheTagStore);
    }
}