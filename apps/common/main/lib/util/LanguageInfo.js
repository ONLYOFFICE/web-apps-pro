/**
 *    LanguageInfo.js
 *
 *    Created by Maxim Kadushkin on 31 January 2014
 *    Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

if (Common === undefined) {
    var Common = {};
}

Common.util = Common.util||{};

Common.util.LanguageInfo = new(function() {
    var localLanguageName = {
        0x0036 : ["af", "Afrikaans"],
        0x0436 : ["af-ZA", "Afrikaans (Suid Afrika)"],
        0x001C : ["sq", "Shqipe"],
        0x041C : ["sq-AL", "Shqipe (Shqipëria)"],
        0x0084 : ["gsw", "Elsässisch"],
        0x0484 : ["gsw-FR", "Elsässisch (Frànkrisch)"],
        0x005E : ["am", "አማርኛ"],
        0x045E : ["am-ET", "አማርኛ (ኢትዮጵያ)"],
        0x0001 : ["ar", "العربية‏"],
        0x1401 : ["ar-DZ", "العربية (الجزائر)‏"],
        0x3C01 : ["ar-BH", "العربية (البحرين)‏"],
        0x0C01 : ["ar-EG", "العربية (مصر)‏"],
        0x0801 : ["ar-IQ", "العربية (العراق)‏"],
        0x2C01 : ["ar-JO", "العربية (الأردن)‏"],
        0x3401 : ["ar-KW", "العربية (الكويت)‏"],
        0x3001 : ["ar-LB", "العربية (لبنان)‏"],
        0x1001 : ["ar-LY", "العربية (ليبيا)‏"],
        0x1801 : ["ar-MA", "العربية (المملكة المغربية)‏"],
        0x2001 : ["ar-OM", "العربية (عمان)‏"],
        0x4001 : ["ar-QA", "العربية (قطر)‏"],
        0x0401 : ["ar-SA", "العربية (المملكة العربية السعودية)‏"],
        0x2801 : ["ar-SY", "العربية (سوريا)‏"],
        0x1C01 : ["ar-TN", "العربية (تونس)‏"],
        0x3801 : ["ar-AE", "العربية (الإمارات العربية المتحدة)‏"],
        0x2401 : ["ar-YE", "العربية (اليمن)‏"],
        0x002B : ["hy", "Հայերեն"],
        0x042B : ["hy-AM", "Հայերեն (Հայաստան)"],
        0x004D : ["as", "অসমীয়া"],
        0x044D : ["as-IN", "অসমীয়া (ভাৰত)"],
        0x002C : ["az", "Azərbaycan­ılı"],
        0x742C : ["az-Cyrl", "Азәрбајҹан дили"],
        0x082C : ["az-Cyrl-AZ", "Азәрбајҹан (Азәрбајҹан)"],
        0x782C : ["az-Latn", "Azərbaycan­ılı"],
        0x042C : ["az-Latn-AZ", "Azərbaycan­ılı (Azərbaycan)"],
        0x006D : ["ba", "Башҡорт"],
        0x046D : ["ba-RU", "Башҡорт (Россия)"],
        0x002D : ["eu", "Euskara"],
        0x042D : ["eu-ES", "Euskara (Euskara)"],
        0x0023 : ["be", "Беларускі"],
        0x0423 : ["be-BY", "Беларускі (Беларусь)"],
        0x0045 : ["bn", "বাংলা"],
        0x0845 : ["bn-BD", "বাংলা (বাংলাদেশ)"],
        0x0445 : ["bn-IN", "বাংলা (ভারত)"],
        0x781A : ["bs", "bosanski"],
        0x641A : ["bs-Cyrl", "Босански (Ћирилица)"],
        0x201A : ["bs-Cyrl-BA", "Босански (Босна и Херцеговина)"],
        0x681A : ["bs-Latn", "Bosanski (Latinica)"],
        0x141A : ["bs-Latn-BA", "Bosanski (Bosna i Hercegovina)"],
        0x007E : ["br", "Brezhoneg"],
        0x047E : ["br-FR", "Brezhoneg (Frañs)"],
        0x0002 : ["bg", "Български"],
        0x0402 : ["bg-BG", "Български (България)"],
        0x0003 : ["ca", "Català"],
        0x0403 : ["ca-ES", "Català (Català)"],
        0x7804 : ["zh", "中文"],
        0x0004 : ["zh-Hans", "中文(简体)"],
        0x0804 : ["zh-CN", "中文(中华人民共和国)"],
        0x1004 : ["zh-SG", "中文(新加坡)"],
        0x7C04 : ["zh-Hant", "中文(繁體)"],
        0x0C04 : ["zh-HK", "中文(香港特別行政區)"],
        0x1404 : ["zh-MO", "中文(澳門特別行政區)"],
        0x0404 : ["zh-TW", "中文(台灣)"],
        0x0083 : ["co", "Corsu"],
        0x0483 : ["co-FR", "Corsu (France)"],
        0x001A : ["hr", "Hrvatski"],
        0x041A : ["hr-HR", "Hrvatski (Hrvatska)"],
        0x101A : ["hr-BA", "Hrvatski (Bosna i Hercegovina)"],
        0x0005 : ["cs", "Čeština"],
        0x0405 : ["cs-CZ", "Čeština (Česká republika)"],
        0x0006 : ["da", "Dansk"],
        0x0406 : ["da-DK", "Dansk (Danmark)"],
        0x008C : ["prs", "درى‏"],
        0x048C : ["prs-AF", "درى (افغانستان)‏"],
        0x0065 : ["dv", "ދިވެހިބަސް‏"],
        0x0465 : ["dv-MV", "ދިވެހިބަސް (ދިވެހި ރާއްޖެ)‏"],
        0x0013 : ["nl", "Nederlands"],
        0x0813 : ["nl-BE", "Nederlands (België)"],
        0x0413 : ["nl-NL", "Nederlands (Nederland)"],
        0x0009 : ["en", "English"],
        0x0C09 : ["en-AU", "English (Australia)"],
        0x2809 : ["en-BZ", "English (Belize)"],
        0x1009 : ["en-CA", "English (Canada)"],
        0x2409 : ["en-029", "English (Caribbean)"],
        0x4009 : ["en-IN", "English (India)"],
        0x1809 : ["en-IE", "English (Ireland)"],
        0x2009 : ["en-JM", "English (Jamaica)"],
        0x4409 : ["en-MY", "English (Malaysia)"],
        0x1409 : ["en-NZ", "English (New Zealand)"],
        0x3409 : ["en-PH", "English (Philippines)"],
        0x4809 : ["en-SG", "English (Singapore)"],
        0x1C09 : ["en-ZA", "English (South Africa)"],
        0x2C09 : ["en-TT", "English (Trinidad y Tobago)"],
        0x0809 : ["en-GB", "English (United Kingdom)"],
        0x0409 : ["en-US", "English (United States)"],
        0x3009 : ["en-ZW", "English (Zimbabwe)"],
        0x0025 : ["et", "Eesti"],
        0x0425 : ["et-EE", "Eesti (Eesti)"],
        0x0038 : ["fo", "Føroyskt"],
        0x0438 : ["fo-FO", "Føroyskt (Føroyar)"],
        0x0064 : ["fil", "Filipino"],
        0x0464 : ["fil-PH", "Filipino (Pilipinas)"],
        0x000B : ["fi", "Suomi"],
        0x040B : ["fi-FI", "Suomi (Suomi)"],
        0x000C : ["fr", "Français"],
        0x080C : ["fr-BE", "Français (Belgique)"],
        0x0C0C : ["fr-CA", "Français (Canada)"],
        0x040C : ["fr-FR", "Français (France)"],
        0x140C : ["fr-LU", "Français (Luxembourg)"],
        0x180C : ["fr-MC", "Français (Principauté de Monaco)"],
        0x100C : ["fr-CH", "Français (Suisse)"],
        0x0062 : ["fy", "Frysk"],
        0x0462 : ["fy-NL", "Frysk (Nederlân)"],
        0x0056 : ["gl", "Galego"],
        0x0456 : ["gl-ES", "Galego (Galego)"],
        0x0037 : ["ka", "ქართული"],
        0x0437 : ["ka-GE", "ქართული (საქართველო)"],
        0x0007 : ["de", "Deutsch"],
        0x0C07 : ["de-AT", "Deutsch (Österreich)"],
        0x0407 : ["de-DE", "Deutsch (Deutschland)"],
        0x1407 : ["de-LI", "Deutsch (Liechtenstein)"],
        0x1007 : ["de-LU", "Deutsch (Luxemburg)"],
        0x0807 : ["de-CH", "Deutsch (Schweiz)"],
        0x0008 : ["el", "Ελληνικά"],
        0x0408 : ["el-GR", "Ελληνικά (Ελλάδα)"],
        0x006F : ["kl", "Kalaallisut"],
        0x046F : ["kl-GL", "Kalaallisut (Kalaallit Nunaat)"],
        0x0047 : ["gu", "ગુજરાતી"],
        0x0447 : ["gu-IN", "ગુજરાતી (ભારત)"],
        0x0068 : ["ha", "Hausa"],
        0x7C68 : ["ha-Latn", "Hausa (Latin)"],
        0x0468 : ["ha-Latn-NG", "Hausa (Nigeria)"],
        0x000D : ["he", "עברית‏"],
        0x040D : ["he-IL", "עברית (ישראל)‏"],
        0x0039 : ["hi", "हिंदी"],
        0x0439 : ["hi-IN", "हिंदी (भारत)"],
        0x000E : ["hu", "Magyar"],
        0x040E : ["hu-HU", "Magyar (Magyarország)"],
        0x000F : ["is", "Íslenska"],
        0x040F : ["is-IS", "Íslenska (Ísland)"],
        0x0070 : ["ig", "Igbo"],
        0x0470 : ["ig-NG", "Igbo (Nigeria)"],
        0x0021 : ["id", "Bahasa Indonesia"],
        0x0421 : ["id-ID", "Bahasa Indonesia (Indonesia)"],
        0x005D : ["iu", "Inuktitut"],
        0x7C5D : ["iu-Latn", "Inuktitut (Qaliujaaqpait)"],
        0x085D : ["iu-Latn-CA", "Inuktitut"],
        0x785D : ["iu-Cans", "ᐃᓄᒃᑎᑐᑦ (ᖃᓂᐅᔮᖅᐸᐃᑦ)"],
        0x045D : ["iu-Cans-CA", "ᐃᓄᒃᑎᑐᑦ (ᑲᓇᑕᒥ)"],
        0x003C : ["ga", "Gaeilge"],
        0x083C : ["ga-IE", "Gaeilge (Éire)"],
        0x0034 : ["xh", "isiXhosa"],
        0x0434 : ["xh-ZA", "isiXhosa (uMzantsi Afrika)"],
        0x0035 : ["zu", "isiZulu"],
        0x0435 : ["zu-ZA", "isiZulu (iNingizimu Afrika)"],
        0x0010 : ["it", "Italiano"],
        0x0410 : ["it-IT", "Italiano (Italia)"],
        0x0810 : ["it-CH", "Italiano (Svizzera)"],
        0x0011 : ["ja", "日本語"],
        0x0411 : ["ja-JP", "日本語 (日本)"],
        0x004B : ["kn", "ಕನ್ನಡ"],
        0x044B : ["kn-IN", "ಕನ್ನಡ (ಭಾರತ)"],
        0x003F : ["kk", "Қазақ"],
        0x043F : ["kk-KZ", "Қазақ (Қазақстан)"],
        0x0053 : ["km", "ខ្មែរ"],
        0x0453 : ["km-KH", "ខ្មែរ (កម្ពុជា)"],
        0x0086 : ["qut", "K'iche"],
        0x0486 : ["qut-GT", "K'iche (Guatemala)"],
        0x0087 : ["rw", "Kinyarwanda"],
        0x0487 : ["rw-RW", "Kinyarwanda (Rwanda)"],
        0x0041 : ["sw", "Kiswahili"],
        0x0441 : ["sw-KE", "Kiswahili (Kenya)"],
        0x0057 : ["kok", "कोंकणी"],
        0x0457 : ["kok-IN", "कोंकणी (भारत)"],
        0x0012 : ["ko", "한국어"],
        0x0412 : ["ko-KR", "한국어 (대한민국)"],
        0x0040 : ["ky", "Кыргыз"],
        0x0440 : ["ky-KG", "Кыргыз (Кыргызстан)"],
        0x0054 : ["lo", "ລາວ"],
        0x0454 : ["lo-LA", "ລາວ (ສ.ປ.ປ. ລາວ)"],
        0x0026 : ["lv", "Latviešu"],
        0x0426 : ["lv-LV", "Latviešu (Latvija)"],
        0x0027 : ["lt", "Lietuvių"],
        0x0427 : ["lt-LT", "Lietuvių (Lietuva)"],
        0x7C2E : ["dsb", "Dolnoserbšćina"],
        0x082E : ["dsb-DE", "Dolnoserbšćina (Nimska)"],
        0x006E : ["lb", "Lëtzebuergesch"],
        0x046E : ["lb-LU", "Lëtzebuergesch (Luxembourg)"],
        0x042F : ["mk-MK", "Македонски јазик (Македонија)"],
        0x002F : ["mk", "Македонски јазик"],
        0x003E : ["ms", "Bahasa Melayu"],
        0x083E : ["ms-BN", "Bahasa Melayu (Brunei Darussalam)"],
        0x043E : ["ms-MY", "Bahasa Melayu (Malaysia)"],
        0x004C : ["ml", "മലയാളം"],
        0x044C : ["ml-IN", "മലയാളം (ഭാരതം)"],
        0x003A : ["mt", "Malti"],
        0x043A : ["mt-MT", "Malti (Malta)"],
        0x0081 : ["mi", "Reo Māori"],
        0x0481 : ["mi-NZ", "Reo Māori (Aotearoa)"],
        0x007A : ["arn", "Mapudungun"],
        0x047A : ["arn-CL", "Mapudungun (Chile)"],
        0x004E : ["mr", "मराठी"],
        0x044E : ["mr-IN", "मराठी (भारत)"],
        0x007C : ["moh", "Kanien'kéha"],
        0x047C : ["moh-CA", "Kanien'kéha"],
        0x0050 : ["mn", "Монгол хэл"],
        0x7850 : ["mn-Cyrl", "Монгол хэл"],
        0x0450 : ["mn-MN", "Монгол хэл (Монгол улс)"],
        0x7C50 : ["mn-Mong", "ᠮᠤᠨᠭᠭᠤᠯ ᠬᠡᠯᠡ"],
        0x0850 : ["mn-Mong-CN", "ᠮᠤᠨᠭᠭᠤᠯ ᠬᠡᠯᠡ (ᠪᠦᠭᠦᠳᠡ ᠨᠠᠢᠷᠠᠮᠳᠠᠬᠤ ᠳᠤᠮᠳᠠᠳᠤ ᠠᠷᠠᠳ ᠣᠯᠣᠰ)"],
        0x0061 : ["ne", "नेपाली"],
        0x0461 : ["ne-NP", "नेपाली (नेपाल)"],
        0x0014 : ["no", "Norsk"],
        0x7C14 : ["nb", "Norsk (bokmål)"],
        0x7814 : ["nn", "Norsk (Nynorsk)"],
        0x0414 : ["nb-NO", "Norsk, bokmål (Norge)"],
        0x0814 : ["nn-NO", "Norsk, nynorsk (Noreg)"],
        0x0082 : ["oc", "Occitan"],
        0x0482 : ["oc-FR", "Occitan (França)"],
        0x0048 : ["or", "ଓଡ଼ିଆ"],
        0x0448 : ["or-IN", "ଓଡ଼ିଆ (ଭାରତ)"],
        0x0063 : ["ps", "پښتو‏"],
        0x0463 : ["ps-AF", "پښتو (افغانستان)‏"],
        0x0029 : ["fa", "فارسى‏"],
        0x0429 : ["fa-IR", "فارسى (ایران)‏"],
        0x0015 : ["pl", "Polski"],
        0x0415 : ["pl-PL", "Polski (Polska)"],
        0x0016 : ["pt", "Português"],
        0x0416 : ["pt-BR", "Português (Brasil)"],
        0x0816 : ["pt-PT", "Português (Portugal)"],
        0x0046 : ["pa", "ਪੰਜਾਬੀ"],
        0x0446 : ["pa-IN", "ਪੰਜਾਬੀ (ਭਾਰਤ)"],
        0x006B : ["quz", "Runasimi"],
        0x046B : ["quz-BO", "Runasimi (Qullasuyu)"],
        0x086B : ["quz-EC", "Runasimi (Ecuador)"],
        0x0C6B : ["quz-PE", "Runasimi (Piruw)"],
        0x0018 : ["ro", "Română"],
        0x0418 : ["ro-RO", "Română (România)"],
        0x0017 : ["rm", "Rumantsch"],
        0x0417 : ["rm-CH", "Rumantsch (Svizra)"],
        0x0019 : ["ru", "Русский"],
        0x0419 : ["ru-RU", "Русский (Россия)"],
        0x703B : ["smn", "Sämikielâ"],
        0x7C3B : ["smj", "Julevusámegiella"],
        0x003B : ["se", "Davvisámegiella"],
        0x743B : ["sms", "Sääm´ǩiõll"],
        0x783B : ["sma", "åarjelsaemiengiele"],
        0x243B : ["smn-FI", "Sämikielâ (Suomâ)"],
        0x103B : ["smj-NO", "Julevusámegiella (Vuodna)"],
        0x143B : ["smj-SE", "Julevusámegiella (Svierik)"],
        0x0C3B : ["se-FI", "Davvisámegiella (Suopma)"],
        0x043B : ["se-NO", "Davvisámegiella (Norga)"],
        0x083B : ["se-SE", "Davvisámegiella (Ruoŧŧa)"],
        0x203B : ["sms-FI", "Sääm´ǩiõll (Lää´ddjânnam)"],
        0x183B : ["sma-NO", "åarjelsaemiengiele (Nöörje)"],
        0x1C3B : ["sma-SE", "åarjelsaemiengiele (Sveerje)"],
        0x004F : ["sa", "संस्कृत"],
        0x044F : ["sa-IN", "संस्कृत (भारतम्)"],
        0x0091 : ["gd", "Gàidhlig"],
        0x0491 : ["gd-GB", "Gàidhlig (An Rìoghachd Aonaichte)"],
        0x7C1A : ["sr", "Srpski"],
        0x6C1A : ["sr-Cyrl", "Српски (Ћирилица)"],
        0x1C1A : ["sr-Cyrl-BA", "Српски (Босна и Херцеговина)"],
        0x301A : ["sr-Cyrl-ME", "Српски (Црна Гора)"],
        0x0C1A : ["sr-Cyrl-CS", "Српски (Србија и Црна Гора (Претходно))"],
        0x281A : ["sr-Cyrl-RS", "Српски (Србија)"],
        0x701A : ["sr-Latn", "Srpski (Latinica)"],
        0x181A : ["sr-Latn-BA", "Srpski (Bosna i Hercegovina)"],
        0x2C1A : ["sr-Latn-ME", "Srpski (Crna Gora)"],
        0x081A : ["sr-Latn-CS", "Srpski (Srbija i Crna Gora (Prethodno))"],
        0x241A : ["sr-Latn-RS", "Srpski (Srbija)"],
        0x006C : ["nso", "Sesotho sa Leboa"],
        0x046C : ["nso-ZA", "Sesotho sa Leboa (Afrika Borwa)"],
        0x0032 : ["tn", "Setswana"],
        0x0432 : ["tn-ZA", "Setswana (Aforika Borwa)"],
        0x005B : ["si", "සිංහ"],
        0x045B : ["si-LK", "සිංහ (ශ්‍රී ලංකා)"],
        0x001B : ["sk", "Slovenčina"],
        0x041B : ["sk-SK", "Slovenčina (Slovenská republika)"],
        0x0024 : ["sl", "Slovenski"],
        0x0424 : ["sl-SI", "Slovenski (Slovenija)"],
        0x000A : ["es", "Español"],
        0x2C0A : ["es-AR", "Español (Argentina)"],
        0x400A : ["es-BO", "Español (Bolivia)"],
        0x340A : ["es-CL", "Español (Chile)"],
        0x240A : ["es-CO", "Español (Colombia)"],
        0x140A : ["es-CR", "Español (Costa Rica)"],
        0x1C0A : ["es-DO", "Español (República Dominicana)"],
        0x300A : ["es-EC", "Español (Ecuador)"],
        0x440A : ["es-SV", "Español (El Salvador)"],
        0x100A : ["es-GT", "Español (Guatemala)"],
        0x480A : ["es-HN", "Español (Honduras)"],
        0x080A : ["es-MX", "Español (México)"],
        0x4C0A : ["es-NI", "Español (Nicaragua)"],
        0x180A : ["es-PA", "Español (Panamá)"],
        0x3C0A : ["es-PY", "Español (Paraguay)"],
        0x280A : ["es-PE", "Español (Perú)"],
        0x500A : ["es-PR", "Español (Puerto Rico)"],
        0x0C0A : ["es-ES", "Español (España, alfabetización internacional)"],
        0x540A : ["es-US", "Español (Estados Unidos)"],
        0x380A : ["es-UY", "Español (Uruguay)"],
        0x200A : ["es-VE", "Español (Republica Bolivariana de Venezuela)"],
        0x001D : ["sv", "Svenska"],
        0x081D : ["sv-FI", "Svenska (Finland)"],
        0x041D : ["sv-SE", "Svenska (Sverige)"],
        0x005A : ["syr", "ܣܘܪܝܝܐ‏"],
        0x045A : ["syr-SY", "ܣܘܪܝܝܐ (سوريا)‏"],
        0x0028 : ["tg", "Тоҷикӣ"],
        0x7C28 : ["tg-Cyrl", "Тоҷикӣ"],
        0x0428 : ["tg-Cyrl-TJ", "Тоҷикӣ (Тоҷикистон)"],
        0x005F : ["tzm", "Tamazight"],
        0x7C5F : ["tzm-Latn", "Tamazight (Latin)"],
        0x085F : ["tzm-Latn-DZ", "Tamazight (Djazaïr)"],
        0x0049 : ["ta", "தமிழ்"],
        0x0449 : ["ta-IN", "தமிழ் (இந்தியா)"],
        0x0044 : ["tt", "Татар"],
        0x0444 : ["tt-RU", "Татар (Россия)"],
        0x004A : ["te", "తెలుగు"],
        0x044A : ["te-IN", "తెలుగు (భారత దేశం)"],
        0x001E : ["th", "ไทย"],
        0x041E : ["th-TH", "ไทย (ไทย)"],
        0x0051 : ["bo", "བོད་ཡིག"],
        0x0451 : ["bo-CN", "བོད་ཡིག (ཀྲུང་ཧྭ་མི་དམངས་སྤྱི་མཐུན་རྒྱལ་ཁབ།)"],
        0x001F : ["tr", "Türkçe"],
        0x041F : ["tr-TR", "Türkçe (Türkiye)"],
        0x0042 : ["tk", "Türkmençe"],
        0x0442 : ["tk-TM", "Türkmençe (Türkmenistan)"],
        0x0022 : ["uk", "Українська"],
        0x0422 : ["uk-UA", "Українська (Україна)"],
        0x002E : ["hsb", "Hornjoserbšćina"],
        0x042E : ["hsb-DE", "Hornjoserbšćina (Němska)"],
        0x0020 : ["ur", "اُردو‏"],
        0x0420 : ["ur-PK", "اُردو (پاکستان)‏"],
        0x0080 : ["ug", "ئۇيغۇر يېزىقى‏"],
        0x0480 : ["ug-CN", "(ئۇيغۇر يېزىقى (جۇڭخۇا خەلق جۇمھۇرىيىتى‏"],
        0x7843 : ["uz-Cyrl", "Ўзбек"],
        0x0843 : ["uz-Cyrl-UZ", "Ўзбек (Ўзбекистон)"],
        0x0043 : ["uz", "U'zbek"],
        0x7C43 : ["uz-Latn", "U'zbek"],
        0x0443 : ["uz-Latn-UZ", "U'zbek (U'zbekiston Respublikasi)"],
        0x002A : ["vi", "Tiếng Việt"],
        0x042A : ["vi-VN", "Tiếng Việt (Việt Nam)"],
        0x0052 : ["cy", "Cymraeg"],
        0x0452 : ["cy-GB", "Cymraeg (y Deyrnas Unedig)"],
        0x0088 : ["wo", "Wolof"],
        0x0488 : ["wo-SN", "Wolof (Sénégal)"],
        0x0085 : ["sah", "Саха"],
        0x0485 : ["sah-RU", "Саха (Россия)"],
        0x0078 : ["ii", "ꆈꌠꁱꂷ"],
        0x0478 : ["ii-CN", "ꆈꌠꁱꂷ (ꍏꉸꏓꂱꇭꉼꇩ)"],
        0x006A : ["yo", "Yoruba"],
        0x046A : ["yo-NG", "Yoruba (Nigeria)"],
        0x0851 : ["bo-BT", "Tibetan, Bhutan"],
        0x0466 : ["bin-NG", "Bini, Nigeria"],
        0x045c : ["chr-US", "Cherokee, United States"],
        0x3c09 : ["en-HK", "English, Hong Kong"],
        0x3809 : ["en-ID", "English, Indonesia"],
        0x040a : ["es-ES_tradnl", "Spanish"],
        0x3c0c : ["fr-HT", "French, Haiti"],
        0x240c : ["fr-CG", "French, Congo"],
        0x300c : ["fr-CI", "French, Cote d'Ivoire"],
        0x2c0c : ["fr-CM", "French, Cameroon"],
        0x380c : ["fr-MA", "French, Morocco"],
        0x340c : ["fr-ML", "French, Mali"],
        0x200c : ["fr-RE", "French, Reunion"],
        0x280c : ["fr-SN", "French, Senegal"],
        0x1c0c : ["fr-West", "French"],
        0x0467 : ["fuv-NG", "Nigerian Fulfulde, Nigeria"],
        0x0472 : ["gaz-ET", "West Central Oromo, Ethiopia"],
        0x0474 : ["gn-PY", "Guarani, Paraguay"],
        0x0475 : ["haw-US", "Hawaiian, UnitedStates"],
        0x0469 : ["ibb-NG", "Ibibio, Nigeria"],
        0x0471 : ["kr-NG", "Kanuri, Nigeria"],
        0x0458 : ["mni", "Manipuri"],
        0x0455 : ["my-MM", "Burmese, Myanmar"],
        0x0861 : ["ne-IN", "Nepali, India"],
        0x0479 : ["pap-AN", "Papiamento, Netherlands Antilles"],
        0x0846 : ["pa-PK", "Panjabi, Pakistan"],
        0x048d : ["plt-MG", "Plateau Malagasy, Madagascar"],
        0x0818 : ["ro-MO", "Romanian, Macao"],
        0x0819 : ["ru-MO", "Russian, Macao"],
        0x0459 : ["sd-IN", "Sindhi, India"],
        0x0859 : ["sd-PK", "Sindhi, Pakistan"],
        0x0477 : ["so-SO", "Somali, Somalia"],
        0x0430 : ["st-ZA", "Southern Sotho, South Africa"],
        0x0473 : ["ti-ER", "Tigrinya, Eritrea"],
        0x0873 : ["ti-ET", "Tigrinya, Ethiopia"],
        0x045f : ["tmz", "Tamanaku"],
        0x0c5f : ["tmz-MA", "Tamanaku, Morocco"],
        0x0431 : ["ts-ZA", "Tsonga, South Africa"],
        0x0820 : ["ur-IN", "Urdu, India"],
        0x0433 : ["ven-ZA", "South Africa"]
    };

    return {
        getLocalLanguageName: function(code) {
            return localLanguageName[code] || ['', code];
        },

        getLocalLanguageCode: function(name) {
            for (var code in localLanguageName) {
                if (localLanguageName[code][0].toLowerCase()===name.toLowerCase())
                    return code;
            }
            return null;
        }
    }
})();