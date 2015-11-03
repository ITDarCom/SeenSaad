/**
 * Created by omar on 9/27/15.
 */
Stream = new Mongo.Collection('stream');
Stream.allow({
    insert: function (userId, doc) {
        return true
        if (userId) {
            return doc.userId == userId
        }
    },
    update: function (userId, doc) {
        return true
        // return doc.userId == userId
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
            if (this.isInsert)
                return new Array();
        }

    },
    'readingArticles.$': {type: Object},
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
            if (this.isInsert)
                return new Array();
        }

    },
    'contributingArticles.$': {type: Object},
    'contributingArticles.$.id': {
        type: String
    },
    'contributingArticles.$.seen': {
        type: Boolean
    }
}));
