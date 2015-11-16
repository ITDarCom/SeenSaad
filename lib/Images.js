//noinspection SpellCheckingInspection
/**
 * Created by omar on 10/31/15.
 */
var imageStore = new FS.Store.S3("images", {
    accessKeyId: "AKIAJIX3DMTAIYKFDE4A", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "seensaad", //required
    maxTries: 1, //optional, default 5
    folder: 'images'
});


Images = new FS.Collection("images", {
    stores: [imageStore]
});
Images.allow({
    insert: function (userId) {
        return (userId)
    },
    update: function (userId, doc) {
        if (doc.user)
            return ( doc.user == userId);
        else
            return true
    },
    download: function () {
        return true;
    },
    remove: function (userId) {
        return (userId)
    }
});

