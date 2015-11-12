/**
 * Created by omar on 12/11/15.
 */

SimpleSchema.messages({
    minString: "[label] يجب ألا يكون أقل من [min] حرفاً",
    maxString: "[label] يجب ألا يتجاوز [max] حرفاً",
    required: "هذا الحقل مطلوب ولا بدّ من إدخاله",
    "usedUserName": "اسم المستخدم مستخدم من قبل .. يرجى استخدام غيره",
    "emailUsed": 'الايميل الذي أدخلته مستخدم مسبقاً',
    regEx: [
        {msg: "[label] failed regular expression validation"},
        {
            exp: /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/,
            msg: "اسم المستخدم يجب أن لا يحتوي سوى أحرف انجليزية واشارة - بشرط أن لا تتكرر اثنتان متتاليتان"
        },
        {exp: SimpleSchema.RegEx.Email, msg: "بريد الكتروني خاطئ"}
    ],
});