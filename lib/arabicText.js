/**
 * Created by omar on 12/11/15.
 */

arabicMessages = {
    navbarSlogan: 'س ص',
    betaVersion: '<small class="smallEnough">  (النسخة التجريبية)</small>',
    year: 'سنة',
    saveButton: 'حفظ',
    cannotSendToMe: 'عفواً.. لا يمكنك مراسلة نفسك!', // in my profile page when click my name in article/s page
    addTofavorites: 'مفضلة',
    informationShow: 'ظاهر',//profile page permissions
    informationHide: 'مخفي',//profile page permissions
    maleLabel: 'ذكر',
    femaleLabel: 'أنثى',
    userNameLabel: 'اسم المستخدم',
    userNameNonValid: ' عفواً.. يجب أن لا يخرج اسم المستخدم عن الأحرف الإنجليزية والأرقام وعلا' +
    'مة "-". ويجب أن يبدأ بحرف، وأن لا يحتوي على تكرار متتالي لعلامة "-" وأن لا تكون هذه العلامة في النهاي' +
    'ة. وأن لا يقل طوله عن 4 خانات.', //signup error messages
    //control Panel page:
    logMeWith: 'إدارة',
    articles: 'المواضيع',
    comments: 'التعليقات',
    undefined: "غير محدد",// for undefined cells in cpanel ( like last signin time)
    tabular: { //Control panel arabic translations
        "sProcessing": "جاري التحميل..",
        "sZeroRecords": "لم يُعثر على أية سجلات",
        "sInfoEmpty": "يعرض 0 إلى 0 من أصل 0 سجلّ",
        "sInfoPostFix": "",
        "sSearch": " ",
        "sUrl": "",
        "oPaginate": {
            "sFirst": "الأول",
            "sPrevious": "<i class='fa fa-arrow-right'></i>",
            "sNext": "<i class='fa fa-arrow-left'></i>",
            "sLast": "الأخير"
        }
    },
// messages pages
    msgBoxPlaceholder: 'اكتب رسالة',
    sendMessageButton: 'أرسل',
    panelTitleSendMessage: 'أرسل رسالة',

    // add,edit pages ,
    articleAccessDenied: 'ليس لديك الصلاحية لولوج هذه الصفحة',
    addSuccessfully: 'تم إضافة الموضوع بنجـاح.',
    editSuccessfully: 'تم تعديل الموضوع بنجـاح.',
    deleteSuccessfully: 'تم الحذف بنجاح.',
    notInUpdateTime: 'الموضوع مقفل لا يمكن التحديث', // alert for trying update article form console
    lastSignIn: "آخر دخول",
    registeredAt: "سجل بتاريخ",
    deleteTryAgain: 'عفواً.. لم يتم الحذف بنجاح، يرجى تحديث الصفحة أولاً.',

    //article page
    deleteButtonTitle: 'حذف',
    editButtonTitle: 'تعديل',
    addToFavorites: 'editButtonTitle',
    sorryMsg: 'عفواً..',
    confirmDelete: 'هل أنت متأكد من حذف الموضوع؟ ',
    additionDeleteConfirm: 'هل أنت متأكد من حذف الإضافة؟',
    contributingIdsLabel: 'المشاركة بالردود على الموضوع',
    editButtonLabel: 'تحديث',
    addButtonLabel: 'إضافة',
    commentMinString:'يحب ألا يقل طول التعليق عن  حروف',
    commentEditedSuccessfully: 'تم تعديل التعليق بنجاح',
    readingIdsPlaceHolder: 'جميع المشاركين يمكنهم مشاهدة الموضوع',


    // articles page
    noArticlesFound: 'لا يوجد مواضيع حالياً!',
    deleteConfirm: 'هل أنت متأكد من حذف الموضوع؟',
    commentDeleteConfirm: 'هل أنت متأكد من حذف التعليق ؟',
    loadMore: 'تحميل المزيد',
    'deleted':"المواضيع المحذوفة",

//layout page
    nonCompletedProfile: 'ملفك الشخصي غير مكتمل!',
    logout: 'خروج',
    signIn: 'دخول',
    signUp: 'تسجيل',
    loading: 'يتم التحميل الآن..',
    signInUpLabel: 'دخول / تسجيل',



    //profile page :
    privateMessage: 'رسالة خاصة',
    image: 'الصورة',
    personalInformation: 'معلوماتك الشخصية',
    password: 'كلمة السر',
    browse: 'استعراض',
    usernamePlaceholder: 'اسم المستخدم خاصتك',
    fullNamePlaceholder: 'اسمك الكامل',
    birthdayPlaceholder: 'تاريخ الولادة',
    emailPlaceholder: 'بريدك اﻹلكتروني',
    mobilePlaceholder :'رقم الجوال',
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
        messageStream: '<a href="/messages"}}"><span class="glyphicon glyphicon-share-alt" ' +
        'aria-hidden="true">' +
        '</span>&nbsp;الرسائل</a>',
        me: ( me = 'ملفك الشخصي'),
        resetPasswd: me,
        editPersonalInfo: me,
        editProfileImg: me,
        adminPage: 'صفحة الإدارة'

    },
    headerDescription: { // in layout >> description under H1
        edit: 'تعديل الموضوع',
        add: 'أضف موضوع جديد',
        home: 'المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها.',
        search: 'بحث في المواضيع العامة والمواضيع التي لك صلاحية مشاهدتها أو المشاركة فيها.',
        read: 'المواضيع التي لك صلاحية مشاهدتها.',
        participation: 'المواضيع التي لك صلاحية المشاركة فيها.',
        favorite: 'المواضيع التي وضعتها في المفضلة.',
        mine: 'مواضيعك التي أضفتها.',
        messages: 'الرسائل الخاصة مع الأعضاء.',
        messageStream: 'الرسائل الخاصة مع:',
        about: 'ما هو س ص؟',
        me: (me = 'الصورة والمعلومات الشخصية.'),
        resetPasswd: me,
        editPersonalInfo: me,
        editProfileImg: me,
        adminPage: 'لإدارة الأعضاء ',
        deleted:"المواضيع التي قمت بحذفها.. تظهر لك فقط "
    },

    userArticles: 'مواضيع العضو ',


    // My profile page (me)
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
    favoritesLabel: 'المفضلة',
    publicLabel: 'عام',
    privateLabel: 'خاص',
    addComment: 'التعليق',


    messageLabel: 'الرسالة',
    messageToLabel: 'إلى',
    newLabel: 'جديد',


    blockedMsg: "للأسف تم حجب عضويتك، يرجى التواصل مع إدارة الموقع"
};
SimpleSchema.messages({
    minString: 'عفواً.. [label] يجب أن لا يقل عن [min] حرفاً!',
    maxString: 'عفواً.. [label] يجب أن لا يزيد عن [max] حرفاً!',
    required: 'عفواً.. هذه الخانة إلزامية!',
    maxText: 'عفواً .. يجب ألا يزيد طول النص عن 1000 حرفاً',
    usedUserName: 'عفواً.. هذا الاسم غير متوفر!',
    emailUsed: 'عفواً.. هذا البريد مسجل لدينا! إذا كان لديك عضوية قديمة فنرجو مراسلتنا للحصول عليها.',
    regEx: [
        {msg: '[label] خالف نموذج الإدخال الخاص به'},
        {
            exp: usernameRegex,
            msg: arabicMessages.userNameNonValid
        },
        {exp: SimpleSchema.RegEx.Email, msg: 'عفواً.. يرجى إضافة بريد إلكتروني صحيح!'},
        {exp:/^[0-9]{7,30}$/,msg:'عفواً .. يرجى إدخال رقم جوال صحيح'}
    ],
    wrongUserName: arabicMessages.userNameNonValid
});
AccountsTemplates.configure({ //signIn and signUp Errors
    texts: {
        errors: {
            loginForbidden: "عفواً.. تعذر تسجيل الدخول .. ربما  يوجد خطأ في كلمة السر أو اسم المستخدم ",
        },
        requiredField: "هذا الحقل مطلوب ولا بد من إدخاله",
        maxAllowedLength: "يجب الا يتجاوز طول كلمة السر ",
        minRequiredLength: "يجب ألا يقل طول كلمة السر عن  ",
    }
});

// 3480
