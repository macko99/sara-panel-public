export const DBConfig = {
    name: 'ResourcesDB',
    version: 1,
    objectStoresMeta: [
        {
            store: 'resources',
            storeConfig: { keyPath: 'uuid', autoIncrement: true },
            storeSchema: [
                { name: 'photo', keypath: 'photo', options: { unique: false } },
                { name: 'uuid', keypath: 'uuid', options: { unique: false } }
            ]
        },
        {
            store: 'actionLocations',
            storeConfig: { keyPath: 'actionID', autoIncrement: true },
            storeSchema: [
                { name: 'actionID', keypath: 'actionID', options: { unique: false } },
                { name: 'locations', keypath: 'locations', options: { unique: false } }
            ]
        }
    ]
};