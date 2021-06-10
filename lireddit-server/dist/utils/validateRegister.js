"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (!options.email.includes('@')) {
        return [{ field: 'email', message: 'invalid email' }];
    }
    if (options.username.length <= 2) {
        return [{ field: 'username', message: 'username length must greater than 2' }];
    }
    if (options.username.includes('@')) {
        return [{ field: 'username', message: 'username cannot include an @' }];
    }
    if (options.password.length <= 3) {
        return [{ field: 'password', message: 'password length must greater than 3' }];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map