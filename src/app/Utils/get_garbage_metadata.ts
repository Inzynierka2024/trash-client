import { UserTrashMetadata } from "../Models/UserTrashMetadata";

export default async function (garbage: any): Promise<UserTrashMetadata> {
    return {
        CollectionTimestamp: garbage.collection_timestamp
            ? new Date(garbage["collection_timestamp"])
            : null,
        CollectionUsername: garbage.collection_username,
        CreationTimestamp: garbage["creation_timestamp"]
            ? new Date(garbage["creation_timestamp"])
            : null,
        CreationUsername: garbage["creation_username"],
        Id: parseInt(garbage["garbage_id"]),
        Latitude: parseFloat(garbage["latitude"]),
        Longitude: parseFloat(garbage["longitude"]),
        Picture: garbage["picture"],
        Size: garbage["size"],
        Type: garbage["type"],
    };
}
