/**
 * Created by omar on 12/11/15.
 */
usernameRegex = /^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
arabicMessages = {
    navbarSlogan: 'س ص',
    betaVersion: '<small class="smallEnough">  (النسخة التجريبية)</small>',
    year: 'سنة',
    saveButton: 'حفظ',
    cannotSendToMe: 'عفواً.. لا يمكنك مراسلة نفسك!',
    addTofavorites: 'مفضلة',
    informationShow: 'ظاهر ',
    informationHide: 'مخفي',
    maleLabel: 'ذكر',
    femaleLabel: 'أنثى',
    userNameLabel: 'اسم المستخدم',
    userNameNonValid: ' عفواً.. يجب أن لا يخرج اسم المستخدم عن الأحرف الإنجليزية والأرقام وعلا' +
    'مة "-". ويجب أن يبدأ بحرف، وأن لا يحتوي على تكرار متتالي لعلامة "-" وأن لا تكون هذه العلامة في النهاي' +
    'ة. وأن لا يقل طوله عن 4 خانات.',
    //control Panel page:
    logMeWith: 'إدارة',
    articles: 'المواضيع',
    comments: 'التعليقات',
    tabular: {
        "sProcessing": "جاري التحميل...",
        "sLengthMenu": "أظهر مُدخلات _MENU_",
        "sZeroRecords": "لم يُعثر على أية سجلات",
        "sInfo": "إظهار _START_ إلى _END_ من أصل _TOTAL_ مُدخل",
        "sInfoEmpty": "يعرض 0 إلى 0 من أصل 0 سجلّ",
        "sInfoFiltered": "(منتقاة من مجموع _MAX_ مُدخل)",
        "sInfoPostFix": "",
        "sSearch": "ابحث:",
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
    addSuccessfully: 'تم إضافة الموضوع بنجـاح ',
    extentionAddedSuccessfully: 'تم إضافة ملحق للموضوع بنجاح',
    editSuccessfully: 'تم تعديل الموضوع بنجـاح',
    deleteSuccessfully: 'تم حذف الموضوع بنجاح',
    notInUpdateTime: 'الموضوع مقفل لا يمكن التحديث',
    deleteTryAgain: 'عذراً لم يتم الحذف بنجاح يرجى إعادة العملية بعد تحديث الصفحة',
    //article page
    deleteButtonTitle: 'حذف',
    editButtonTitle: 'تعديل',
    addToFavorites: 'editButtonTitle',
    sorryMsg: 'عفواً',
    // articles page
    noArticlesFound: 'لا يوجد مواضيع حالياً!',
    deleteConfirm: 'هل أنت متأكد من حذف الموضوع؟ ',
    commentDeleteConfirm: 'هل أنت متأكد من حذف التعليق؟',
    commentDeleteFailed: 'حدثت مشكلة يرجى إعادة تحميل الصفحة ومعاودة التجربة',
    loadMore: 'تحميل المزيد',
//layout page
    nonCompletedProfile: 'ملفك الشخصي غير مكتمل .. اضغط لإكماله',
    logout: 'خروج',
    signIn: 'دخول',
    signUp: 'تسجيل',
    loading: 'يتم التحميل الآن',
    signInUpLabel: 'دخول / تسجيل',
    //profile page :
    privateMessage: 'رسالة خاصة',
    image: 'الصورة ',
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
    headerDescription: {
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
        adminPage: 'لإدارة الأعضاء '
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
    favoritesLabel: 'المفضلة',
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