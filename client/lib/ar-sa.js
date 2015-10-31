/**
 * Created by omar on 9/8/15.
 */
//! moment.js locale configuration
//! locale : Arabic Saudi Arabia (ar-sa)
//! author : Suhail Alkowaileet : https://github.com/xsoh
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../moment')) :
        typeof define === 'function' && define.amd ? define(['moment'], factory) :
            factory(global.moment)
}(this, function (moment) {
    'use strict';
    var symbolMap = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '0': '0'
    }, numberMap = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '0': '0'
    };
    var ar_sa = moment.defineLocale('ar-sa', {
        months: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        monthsShort: 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM YYYY',
            LLL: 'D MMMM YYYY HH:mm',
            LLLL: 'dddd D MMMM YYYY HH:mm'
        },
        meridiemParse: /ص|م/,
        isPM: function (input) {
            return 'م' === input;
        },
        meridiem: function (hour, minute, isLower) {
            if (hour < 12) {
                return 'ص';
            } else {
                return 'م';
            }
        },
        calendar: {
            sameDay: '[اليوم على الساعة] LT',
            nextDay: '[غدا على الساعة] LT',
            nextWeek: 'dddd [على الساعة] LT',
            lastDay: '[أمس على الساعة] LT',
            lastWeek: 'dddd [على الساعة] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: 'في %s',
            past: 'منذ %s',
            s: 'ثوان',
            m: 'دقيقة',
            mm: '%d دقائق',
            h: 'ساعة',
            hh: '%d ساعات',
            d: 'يوم',
            dd: '%d أيام',
            M: 'شهر',
            MM: '%d أشهر',
            y: 'سنة',
            yy: '%d سنوات'
        },
        preparse: function (string) {
            return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        week: {
            dow: 7, // Sunday is the first day of the week.
            doy: 12  // The week that contains Jan 1st is the first week of the year.
        }
    });
    return ar_sa;
}));
(function ($) {
    $.extend($.summernote.lang, {
        'ar-AR': {
            font: {
                bold: 'عريض',
                italic: 'مائل',
                underline: 'تحته خط',
                clear: 'مسح التنسيق',
                height: 'إرتفاع السطر',
                name: 'الخط',
                strikethrough: 'فى وسطه خط',
                size: 'الحجم'
            },
            image: {
                image: 'صورة',
                insert: 'إضافة صورة',
                resizeFull: 'الحجم بالكامل',
                resizeHalf: 'تصغير للنصف',
                resizeQuarter: 'تصغير للربع',
                floatLeft: 'تطيير لليسار',
                floatRight: 'تطيير لليمين',
                floatNone: 'ثابته',
                dragImageHere: 'إدرج الصورة هنا',
                selectFromFiles: 'حدد ملف',
                url: 'رابط الصورة',
                remove: 'حذف الصورة'
            },
            link: {
                link: 'رابط رابط',
                insert: 'إدراج',
                unlink: 'حذف الرابط',
                edit: 'تعديل',
                textToDisplay: 'النص',
                url: 'مسار الرابط',
                openInNewWindow: 'فتح في نافذة جديدة'
            },
            table: {
                table: 'جدول'
            },
            hr: {
                insert: 'إدراج خط أفقي'
            },
            style: {
                style: 'تنسيق',
                normal: 'عادي',
                blockquote: 'إقتباس',
                pre: 'شفيرة',
                h1: 'عنوان رئيسي 1',
                h2: 'عنوان رئيسي 2',
                h3: 'عنوان رئيسي 3',
                h4: 'عنوان رئيسي 4',
                h5: 'عنوان رئيسي 5',
                h6: 'عنوان رئيسي 6'
            },
            lists: {
                unordered: 'قائمة مُنقطة',
                ordered: 'قائمة مُرقمة'
            },
            options: {
                help: 'مساعدة',
                fullscreen: 'حجم الشاشة بالكامل',
                codeview: 'شفيرة المصدر'
            },
            paragraph: {
                paragraph: 'فقرة',
                outdent: 'محاذاة للخارج',
                indent: 'محاذاة للداخل',
                left: 'محاذاة لليسار',
                center: 'توسيط',
                right: 'محاذاة لليمين',
                justify: 'ملئ السطر'
            },
            color: {
                recent: 'تم إستخدامه',
                more: 'المزيد',
                background: 'لون الخلفية',
                foreground: 'لون النص',
                transparent: 'شفاف',
                setTransparent: 'بدون خلفية',
                reset: 'إعادة الضبط',
                resetToDefault: 'إعادة الضبط'
            },
            shortcut: {
                shortcuts: 'إختصارات',
                close: 'غلق',
                textFormatting: 'تنسيق النص',
                action: 'Action',
                paragraphFormatting: 'تنسيق الفقرة',
                documentStyle: 'تنسيق المستند'
            },
            history: {
                undo: 'تراجع',
                redo: 'إعادة'
            }
        }
    });
})(jQuery);
