/**
 * Created by omar on 9/27/15.
 */
Stream = new Mongo.Collection('stream');
Stream.allow({
    insert: function (userId, doc) {
        if (userId) {
            return doc.userId == userId
        }
    },
    update: function (doc, userId) {
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
        type: [String],
        autoValue: function () {
            if (this.isInsert)
                return new Array();
        }

    },
    contributingArticles: {
        optional: true,
        type: [String],
        autoValue: function () {
            if (this.isInsert)
                return new Array();
        }

    }
}));
