export const RoleTitles = {
    admin: "Admin",
    member: "Member",
    system: "System"
};

export const RoleGroups = {
    guest: [undefined],
    member: [RoleTitles.member, RoleTitles.admin],
    admin: [RoleTitles.admin]
};