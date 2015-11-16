/**
 * Created by omar on 12/11/15.
 */
usernameRegex = /^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
arabicMessages = {
    resetPasswdBtn: 'حفظ',
    cannotSendToMe: 'لا يمكنك إرسالة لنفسك',
    addTofavorites: 'إضافة إلى المفضلة',
    informationShow: 'ظاهر ',
    informationHide: 'مخفي',
    maleLabel: 'ذكر',
    femaleLabel: 'أنثى',
    userNameLabel: 'اسم المستخدم',
    userNameNonValid: 'اسم المستخدم يجب أن لا يحتوي سوى أحرف انجليزية واشارة - بشرط أن لا تتكرر اثنتان متتاليتان',
    headers: {
        add: 'إضافة موضوع',
        edit: 'تعديل الموضوع',
        read: 'مشاهدة',
        participation: 'مشاركة',
        articles: 'س ص',
        home: 'س ص',
        favorite: 'مفضلة',
        mine: 'مواضيعك',
        search: 'بحث',
        about: 'حول الموقع',
        messages: 'الرسائل',
        messageStream: '<a href="/messages"}}"><span class="glyphicon glyphicon-share-alt" aria-hidden="true">' +
        '</span>&nbsp;الرسائل</a>',
        me: 'ملفك الشخصي',
        resetPasswd: 'ملفك الشخصي',
        editPersonalInfo: 'ملفك الشخصي',
        editProfileImg: 'ملفك الشخصي'

    },
    headerDescription: {
        edit: 'تعديل الموضوع',
        add: 'أضف موضوع جديد',
        articles: 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها',
        home: 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها',
        search: 'بحث في المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها',
        read: 'المواضيع التي لك صلاحية مشاهدتها',
        participation: 'المواضيع التي لك صلاحية المشاركة فيها',
        favorite: 'المواضيع التي وضعتها في المفضلة',
        mine: 'مواضيعك التي أضفتها',
        messages: ' الرسائل الخاصة مع الأعضاء',
        messageStream: ' الرسائل الخاصة مع:',
        about: 'ما هو س ص؟',
        me: 'الصورة والمعلومات الشخصية',
        resetPasswd: 'الصورة والمعلومات الشخصية',
        editPersonalInfo: 'الصورة والمعلومات الشخصية',
        editProfileImg: 'الصورة والمعلومات الشخصية'
    },
    userArticles: 'مواضيع العضو ',
    profileEditSuccess: 'تم تعديل إعدادات حسابك بنجاح',
    fullNameLabel: 'الاسم الكامل: ',
    emailLabel: 'البريد الالكتروني: ',
    mobileLabel: 'رقم الجوال: ',
    birthdayLabel: 'تاريخ الميلاد',
    genderLabel: 'الجنس: ',
    titleLabel: 'العنوان',
    bodyLabel: 'الموضوع',
    readLabel: 'المشاهدة',
    contributingLabel: 'المشاركة',
    publicLabel: 'عام',
    privateLabel: 'خاص',
    addComment: 'التعليق',
    messageLabel: 'الرسالة',
    messageToLabel: 'إلـى',
    newLabel: 'جديد',
    readingIdsPlaceHolder: 'جميع المشاركين يستطيعون مشاهدة الموضوع',
    confirmDelete: 'هل أنت متأكد من حذف الموضوع؟ ',
    contributingIdsLabel: ' المشاركة بالردود على الموضوع',
    editButtonLabel: "تحديث",
    addButtonLabel: "إضافة"


};
SimpleSchema.messages({
    minString: "[label] يجب ألا يكون أقل من [min] حرفاً",
    maxString: "[label] يجب ألا يتجاوز [max] حرفاً",
    required: "هذا الحقل مطلوب ولا بدّ من إدخاله",
    "usedUserName": "اسم المستخدم مستخدم من قبل .. يرجى استخدام غيره",
    "emailUsed": 'الايميل الذي أدخلته مستخدم مسبقاً',
    regEx: [
        {msg: "[label] failed regular expression validation"},
        {
            exp: usernameRegex,
            msg: "اسم المستخدم يجب أن لا يحتوي سوى أحرف انجليزية واشارة - بشرط أن لا تتكرر اثنتان متتاليتان"
        },
        {exp: SimpleSchema.RegEx.Email, msg: "بريد الكتروني خاطئ"}
    ],
    "wrongUserName": 'لا يجب أن يحتوي اسم المستخدم على اشارتي - متتاليتين'
});