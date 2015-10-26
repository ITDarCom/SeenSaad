/**
 * Created by omar on 10/19/15.
 */
var imageStore = new FS.Store.GridFS("profilePics", {});
profilePicture = new FS.Collection("profilePics", {
    stores: [imageStore],
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