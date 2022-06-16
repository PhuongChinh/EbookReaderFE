import { Role } from "./role.model";
export interface UserProfile {
    id?: string;
    gender?: true;
    username?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    password?: string;
    email?: string;
    emailVerified?: true;
    emailVerifiedToken?: string;
    status?: string;
    birthDay?: string;
    position?: string;
    avatarURL?: string;
    updated?: string;
    created?: string;
    roles?: Role[];
    role?: string;
    orgId?: string;
    phone?: string;
    createdTime?: string;
    updatedTime?: string;
    lastLogin?: string;
    plant?:string;

}
