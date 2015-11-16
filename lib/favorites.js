/**
 * Created by omar on 9/15/15.
 */
Favorites = new Meteor.Collection("favorites");


Favorites.allow({
    insert: function (userId, doc) {
        return ((userId) && (doc.userId == userId))
    },
    update: function (userId, doc) {
        return ((userId) && (doc.userId == userId))
    }
});
Favorites.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        optional: false,
        index: true,
        unique: true
    },
    favorites: {
        optional: true,
        type: [String],
        autoValue: function () {
            if (this.isInsert) {
                return [];
            }
        }

    }
}));