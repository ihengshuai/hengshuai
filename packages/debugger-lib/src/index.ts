import { StorageManager } from '@hengshuai/helper';

console.log(StorageManager.local.kind.local.field('uuid'));
const uuidStorage = StorageManager.local.kind.local.field('uuid');

uuidStorage.set(1, 2);
uuidStorage.set(2, 3);
const userStorage = uuidStorage.end.field('__user');
userStorage.set(1, 2);
uuidStorage.set(3, 4);
