/**
 * Created by omar on 9/27/15.
 */
Stream = new Mongo.Collection('stream');
Stream.allow({
    insert: function (userId, doc) {
        if (userId) {
            if (doc.userId == userId)
                return (!Stream.findOne(this.userId))
        }
    },
    update: function (userId, doc) {
        return doc.userId == userId
    }
});
Stream.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        optional: false,
        index: true,
        unique: true
    },
    readingArticles: {
        optional: true,
        type: Array,
        autoValue: function () {
            if (this.isInsert) {
                return [];
            }
        }

    },
    'readingArticles.$': {type: Object, optional: true},
    'readingArticles.$.id': {
        type: String
    },
    'readingArticles.$.seen': {
        type: Boolean
    },
    contributingArticles: {
        optional: true,
        type: Array,
        autoValue: function () {
            if (this.isInsert) {
                return [];
            }
        }

    },
    'contributingArticles.$': {type: Object, optional: true},
    'contributingArticles.$.id': {
        type: String
    },
    'contributingArticles.$.seen': {
        type: Boolean
    }
}));
