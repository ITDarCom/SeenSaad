/**
 * Created by omar on 9/27/15.
 */
Stream = new Mongo.Collection('stream');
Stream.allow({
    insert: function (userId, doc) {
        if (userId) {
            return doc.userId == userId
        }
        return false
    },
    update: function (doc, userId) {
        return doc.userId == userId
    }
});
Stream.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        optional: false
    },
    readingArticles: {
        optional: true,
        type: [String]
    },
    contributingArticles: {
        optional: true,
        type: [String]
    }
}));