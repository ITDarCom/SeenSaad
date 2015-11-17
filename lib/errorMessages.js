/**
 * Created by omar on 12/11/15.
 */
usernameRegex = /^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
arabicMessages = {
    resetPasswdBtn: 'حفظ',
    cannotSendToMe: 'عفواً.. لا يمكنك مراسلة نفسك!',
    addTofavorites: 'مفضلة',
    informationShow: 'ظاهر ',
    informationHide: 'مخفي',
    maleLabel: 'ذكر',
    femaleLabel: 'أنثى',
    userNameLabel: 'اسم المستخدم',
    userNameNonValid: ' عفواً.. يجب أن لا يخرج اسم المستخدم عن الأحرف الإنجليزية والأرقام وعلامة "-". ويجب أن يبدأ بحرف، وأن لا يحتوي على تكرار متتالي لعلامة "-" وأن لا تكون هذه العلامة في النهاية. وأن لا يقل طوله عن 4 خانات.',
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
        articles: 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها.',
        home: 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها.',
        search: 'بحث في المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها.',
        read: 'المواضيع التي لك صلاحية مشاهدتها.',
        participation: 'المواضيع التي لك صلاحية المشاركة فيها.',
        favorite: 'المواضيع التي وضعتها في المفضلة.',
        mine: 'مواضيعك التي أضفتها.',
        messages: 'الرسائل الخاصة مع الأعضاء.',
        messageStream: 'الرسائل الخاصة مع:',
        about: 'ما هو س ص؟',
        me: 'الصورة والمعلومات الشخصية.',
        resetPasswd: 'الصورة والمعلومات الشخصية.',
        editPersonalInfo: 'الصورة والمعلومات الشخصية.',
        editProfileImg: 'الصورة والمعلومات الشخصية.'
    },
    userArticles: 'مواضيع العضو ',
    profileEditSuccess: 'تم الحفظ بنجاح.',
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
    messageToLabel: 'إلى',
    newLabel: 'جديد',
    readingIdsPlaceHolder: 'جميع المشاركين يمكنهم مشاهدة الموضوع',
    confirmDelete: 'هل أنت متأكد من حذف الموضوع؟ ',
    contributingIdsLabel: 'المشاركة بالردود على الموضوع',
    editButtonLabel: 'تحديث',
    addButtonLabel: 'إضافة'


};
SimpleSchema.messages({
    minString: 'عفواً.. [label] يجب أن لا يقل عن [min] حرفاً!',
    maxString: 'عفواً.. [label] يجب أن لا يزيد عن [max] حرفاً!',
    required: 'عفواً.. هذه الخانة إلزامية!',
    usedUserName: 'عفواً.. هذا الاسم غير متوفر!',
    emailUsed: 'عفواً.. هذا البريد مسجل لدينا! إذا كان لديك عضوية قديمة فنرجو مراسلتنا للحصول عليها.',
    regEx: [
        {msg: '[label] failed regular expression validation'},
        {
            exp: usernameRegex,
            msg: ' عفواً.. يجب أن لا يخرج اسم المستخدم عن الأحرف الإنجليزية والأرقام وعلامة "-". ويجب أن يبدأ بحرف، وأن لا يحتوي على تكرار متتالي لعلامة "-" وأن لا تكون هذه العلامة في النهاية. وأن لا يقل طوله عن 4 خانات.'
        },
        {exp: SimpleSchema.RegEx.Email, msg: 'عفواً.. يرجى إضافة بريد إلكتروني صحيح!'}
    ],
    wrongUserName: ' عفواً.. يجب أن لا يخرج اسم المستخدم عن الأحرف الإنجليزية والأرقام وعلامة "-". ويجب أن يبدأ بحرف، وأن لا يحتوي على تكرار متتالي لعلامة "-" وأن لا تكون هذه العلامة في النهاية. وأن لا يقل طوله عن 4 خانات.'
});