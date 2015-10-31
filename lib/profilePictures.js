/**
 * Created by omar on 10/19/15.
 */

var profilePicStore = new FS.Store.S3("profilePics", {
    accessKeyId: "AKIAJIX3DMTAIYKFDE4A", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "seensaad", //required
    folder: 'profilePics'
});
profilePicture = new FS.Collection("profilePics", {
    stores: [profilePicStore],
    filter: {
        maxSize: 6048576 // in bytes
    }
});

profilePicture.allow({
    download: function () {
        return true;
    },
    insert: function (userId, doc) {
        return true
    },
    update: function (userId, doc) {

        return true;
    },
    remove: function (userId, doc) {
        return true
    }

});