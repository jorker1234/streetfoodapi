const _ = require('lodash');

module.exports = {
    serializeUsers(users = []) {
        const userSerialized = users.map(user => {
            return {
                id: user._id && user._id.toString(),
                shopId: user.shopId && user.shopId.toString(),
                ..._.pick(user, ['username', 'name', 'role', 'token']),
            }
        })
        return userSerialized
    },

    serialize(users = []) {
        const userSerialized = this.serializeUsers(users);
        return {
            users: userSerialized,
        }
    }
}