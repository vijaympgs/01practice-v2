/**
 * Security Service - Mock implementation
 * Provides CRUD operations for Security Module
 */

// Mock data storage
let mockRoles = [
  { id: 1, roleCode: 'POS001', roleName: 'POS User' },
  { id: 2, roleCode: 'POS002', roleName: 'POS Manager' },
  { id: 3, roleCode: 'POS003', roleName: 'Cashier' },
];

let mockRoleProgramMappings = [
  { id: 1, roleCode: 'POS001', roleName: 'POS User', moduleName: 'POS', programs: ['Point of Sale', 'Customer Master', 'Cashier Settlement'] },
  { id: 2, roleCode: 'POS002', roleName: 'POS Manager', moduleName: 'POS', programs: ['Point of Sale', 'Customer Master', 'Cashier Settlement', 'Day End', 'Customer Receivables', 'Home Delivery'] },
];

let mockGroups = [
  { id: 1, groupCode: 'BILL001', groupName: 'Billing Group', roles: [1, 2] },
];

let mockUsers = [
  {
    id: 1,
    userCode: 'USR001',
    userName: 'John Doe',
    loginName: 'johndoe',
    expiryDays: 30,
    userLevel: '2',
    userGroup: 'billing',
    designation: 'manager',
    phoneNumber: '1234567890',
    email: 'john@example.com',
    locations: ['loc1', 'loc2'],
    formAccess: { security: false, posSetup: true, pos: true },
    activities: { priceChange: true, refund: false, reprint: true },
  },
];

let nextRoleId = 4;
let nextMappingId = 3;
let nextGroupId = 2;
let nextUserId = 2;

export const securityService = {
  // ========== ROLE OPERATIONS ==========
  async getAllRoles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockRoles]);
      }, 500);
    });
  },

  async getRoleById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const role = mockRoles.find(r => r.id === id);
        if (role) {
          resolve(role);
        } else {
          reject(new Error('Role not found'));
        }
      }, 500);
    });
  },

  async createRole(roleData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingRole = mockRoles.find(r => r.roleCode === roleData.roleCode);
        if (existingRole) {
          reject(new Error('Role code already exists'));
          return;
        }

        const newRole = {
          id: nextRoleId++,
          roleCode: roleData.roleCode,
          roleName: roleData.roleName,
        };
        mockRoles.push(newRole);
        resolve(newRole);
      }, 500);
    });
  },

  async updateRole(id, roleData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Role not found'));
          return;
        }

        const existingRole = mockRoles.find(r => r.roleCode === roleData.roleCode && r.id !== id);
        if (existingRole) {
          reject(new Error('Role code already exists'));
          return;
        }

        mockRoles[index] = {
          ...mockRoles[index],
          roleCode: roleData.roleCode,
          roleName: roleData.roleName,
        };
        resolve(mockRoles[index]);
      }, 500);
    });
  },

  async deleteRole(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Role not found'));
          return;
        }
        mockRoles.splice(index, 1);
        resolve();
      }, 500);
    });
  },

  // ========== ROLE PROGRAM MAPPING OPERATIONS ==========
  async getAllRoleProgramMappings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockRoleProgramMappings]);
      }, 500);
    });
  },

  async createRoleProgramMapping(mappingData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const role = mockRoles.find(r => r.roleCode === mappingData.roleCode);
        if (!role) {
          reject(new Error('Role not found'));
          return;
        }

        const newMapping = {
          id: nextMappingId++,
          roleCode: mappingData.roleCode,
          roleName: role.roleName,
          moduleName: mappingData.moduleName,
          programs: mappingData.programs,
        };
        mockRoleProgramMappings.push(newMapping);
        resolve(newMapping);
      }, 500);
    });
  },

  async updateRoleProgramMapping(id, mappingData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoleProgramMappings.findIndex(m => m.id === id);
        if (index === -1) {
          reject(new Error('Mapping not found'));
          return;
        }

        mockRoleProgramMappings[index] = {
          ...mockRoleProgramMappings[index],
          programs: mappingData.programs,
        };
        resolve(mockRoleProgramMappings[index]);
      }, 500);
    });
  },

  async deleteRoleProgramMapping(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoleProgramMappings.findIndex(m => m.id === id);
        if (index === -1) {
          reject(new Error('Mapping not found'));
          return;
        }
        mockRoleProgramMappings.splice(index, 1);
        resolve();
      }, 500);
    });
  },

  // ========== GROUP OPERATIONS ==========
  async getAllGroups() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockGroups]);
      }, 500);
    });
  },

  async createGroup(groupData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingGroup = mockGroups.find(g => g.groupCode === groupData.groupCode);
        if (existingGroup) {
          reject(new Error('Group code already exists'));
          return;
        }

        const newGroup = {
          id: nextGroupId++,
          groupCode: groupData.groupCode,
          groupName: groupData.groupName,
          roles: groupData.roles || [],
        };
        mockGroups.push(newGroup);
        resolve(newGroup);
      }, 500);
    });
  },

  async updateGroup(id, groupData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockGroups.findIndex(g => g.id === id);
        if (index === -1) {
          reject(new Error('Group not found'));
          return;
        }

        mockGroups[index] = {
          ...mockGroups[index],
          groupCode: groupData.groupCode,
          groupName: groupData.groupName,
          roles: groupData.roles || [],
        };
        resolve(mockGroups[index]);
      }, 500);
    });
  },

  async deleteGroup(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockGroups.findIndex(g => g.id === id);
        if (index === -1) {
          reject(new Error('Group not found'));
          return;
        }
        mockGroups.splice(index, 1);
        resolve();
      }, 500);
    });
  },

  // ========== USER OPERATIONS ==========
  async getAllUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockUsers]);
      }, 500);
    });
  },

  async createUser(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if login name already exists
        const existingUser = mockUsers.find(u => u.loginName === userData.loginName);
        if (existingUser) {
          reject(new Error('Login name already exists'));
          return;
        }

        const newUser = {
          id: nextUserId++,
          userCode: `USR${String(nextUserId - 1).padStart(3, '0')}`,
          userName: userData.userName,
          loginName: userData.loginName,
          expiryDays: userData.expiryDays || 30,
          userLevel: userData.userLevel,
          userGroup: userData.userGroup,
          designation: userData.designation,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          locations: userData.locations || [],
          formAccess: userData.formAccess || {},
          activities: userData.activities || {},
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },

  async updateUser(id, userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }

        mockUsers[index] = {
          ...mockUsers[index],
          ...userData,
        };
        resolve(mockUsers[index]);
      }, 500);
    });
  },

  async deleteUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        mockUsers.splice(index, 1);
        resolve();
      }, 500);
    });
  },

};

