"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const rxjs_1 = require("rxjs");
const cache_tag_manager_1 = require("../../dist/cache-tag-manager");
class UserService {
    constructor() {
        this.cacheTagManager = new cache_tag_manager_1.CacheTagManager();
        this.cacheTagManager.addTagContainer('user', 2000);
    }
    fetchUser(id, invalidate) {
        if (invalidate) {
            this.cacheTagManager.invalidate('user', id);
        }
        return this.cacheTagManager.get('user', id, (stale) => {
            if (stale) {
                return (0, rxjs_1.timer)(2000).pipe((0, rxjs_1.map)(() => ({
                    type: 'fetched',
                    userDTO: {
                        id,
                        first_name: 'John',
                        last_name: 'Doe',
                    },
                })));
            }
            return (0, rxjs_1.of)({ type: 'not-fetched' });
        });
    }
    patchUser(id, userDTOPartial) {
        return this.cacheTagManager.update('user', id, () => (0, rxjs_1.timer)(1000).pipe((0, rxjs_1.map)(() => {
            var _a, _b;
            return ({
                id,
                first_name: (_a = userDTOPartial.first_name) !== null && _a !== void 0 ? _a : 'Carl',
                last_name: (_b = userDTOPartial.last_name) !== null && _b !== void 0 ? _b : 'Kox',
            });
        })));
    }
    updateUser(userDTO) {
        return this.cacheTagManager.update('user', userDTO.id, () => {
            return (0, rxjs_1.timer)(1000).pipe((0, rxjs_1.map)(() => (Object.assign({}, userDTO))));
        });
    }
    deleteUser(id) {
        this.cacheTagManager.invalidate('user', id);
        return (0, rxjs_1.timer)(1000).pipe((0, rxjs_1.map)(() => { }));
    }
    createUser(userDTO) {
        return this.cacheTagManager.create('user', () => {
            return (0, rxjs_1.timer)(5000).pipe((0, rxjs_1.map)(() => ({
                id: '10',
                item: {
                    id: '10',
                    first_name: 'Bob',
                    last_name: 'Smith',
                },
            })));
        });
    }
}
exports.UserService = UserService;
