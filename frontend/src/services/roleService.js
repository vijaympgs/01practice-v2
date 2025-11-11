/**
 * Role Service - Mock implementation
 * Provides CRUD operations for Roles
 */

// Mock data storage (in real app, this would be API calls)
let mockRoles = [
  { id: 1, roleCode: 'POS001', roleName: 'POS User' },
  { id: 2, roleCode: 'POS002', roleName: 'POS Manager' },
  { id: 3, roleCode: 'POS003', roleName: 'Cashier' },
];

let nextId = 4;

export const roleService = {
  // Get all roles
  async getAllRoles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockRoles]);
      }, 500);
    });
  },

  // Get role by ID
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

  // Create new role
  async createRole(roleData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if role code already exists
        const existingRole = mockRoles.find(r => r.roleCode === roleData.roleCode);
        if (existingRole) {
          reject(new Error('Role code already exists'));
          return;
        }

        const newRole = {
          id: nextId++,
          roleCode: roleData.roleCode,
          roleName: roleData.roleName,
        };
        mockRoles.push(newRole);
        resolve(newRole);
      }, 500);
    });
  },

  // Update role
  async updateRole(id, roleData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Role not found'));
          return;
        }

        // Check if role code already exists (excluding current role)
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

  // Delete role
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
};

