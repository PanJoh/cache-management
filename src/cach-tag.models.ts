export interface CacheTag {
    id: string | number;
    fetched: number;
    ttl: number;
}

export interface CacheTagContainer {
    containerId: string;
    ttl: number;
    tagIds: (string | number)[];
    tags: {[tagId: string | number]: CacheTag};
}

export interface CacheTagStore {
    containerIds: string[];
    containers: {[containerId: string]: CacheTagContainer};
}

function getCacheTagInContainer(id: (string | number), container: CacheTagContainer) {
    return container.tags[id];
}

export function getCacheTag(containerId: string, id: (string | number), tagStore: CacheTagStore) {
    return tagStore.containers[containerId]?.tags[id];
}

function createCacheTag(id: string | number, ttl: number, fetched: number): CacheTag {
    return {
        id,
        ttl,
        fetched,
    };
}

function updateCacheTagInContainer(id: (string | number), fetched: number, ttl: number, container?: CacheTagContainer) {
    if (!container) {
        return;
    }

    let tag = container.tags[id];
    if (!tag) {
        tag = createCacheTag(id, ttl, fetched);
        container.tags[id] = tag;
    } else {
        tag.fetched = fetched;
        tag.ttl = ttl;
    }
}

export function updateCacheTag(containerId: string, id: string | number, fetched: number, tagStore: CacheTagStore) {
    const tagContainer = tagStore.containers[containerId];
    if(!tagContainer) {
        return;
    }

    updateCacheTagInContainer(id, fetched, tagContainer.ttl, tagContainer);
}


function removeCachTagInContainer(id: string | number, tagContainer?: CacheTagContainer) {
    if (!tagContainer) {
        return;
    }

    const {[id]: tag, ...newTags} = tagContainer.tags;
    tagContainer.tags = newTags;
}

export function removeCacheTag(containerId: string, id: string | number, tagStore: CacheTagStore) {
    return removeCachTagInContainer(id, tagStore.containers[containerId]);
}

function createCacheTagContainer(containerId: string, ttl: number): CacheTagContainer {
    return {
        containerId,
        ttl,
        tagIds: [],
        tags: {},
    };
} 

export function addCacheContainer(containerId: string, ttl: number, tagStore: CacheTagStore) {
    const tagContainer = tagStore.containers[containerId];
    if (tagContainer) {
        return;
    }

    tagStore.containerIds.push(containerId);
    tagStore.containers[containerId] = createCacheTagContainer(containerId, ttl);
}

export function createCacheTagStore(): CacheTagStore {
    return {
        containerIds: [],
        containers: {},
    };
}

export function removeCachTagContainer(containerId: string, tagStore: CacheTagStore) {
    const {[containerId]: rem, ...newContainers} = tagStore.containers;
    tagStore.containers = newContainers;
}
