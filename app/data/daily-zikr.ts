export interface DailyZikr {
  readonly day: number
  readonly arabic: string
  readonly transliteration: string
  readonly transliterationUz: string
  readonly meaningUz: string
  readonly meaningRu: string
  readonly meaningEn: string
  readonly source: string
}

export const DAILY_ZIKR: readonly DailyZikr[] = [
  {
    day: 1,
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil Azim',
    transliterationUz: 'Subhanallohi va bihamdihi, Subhanallohil Aziym',
    meaningUz:
      'Alloh pok va muqaddas, Unga hamd bo\'lsin. Buyuk Alloh pok va muqaddas.',
    meaningRu:
      'Пречист Аллах и хвала Ему. Пречист Аллах Великий.',
    meaningEn:
      'Glory be to Allah and praise Him. Glory be to Allah the Almighty.',
    source:
      'Sahih al-Bukhari 6406, Sahih Muslim 2694',
  },
  {
    day: 2,
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli shay\'in qadir',
    transliterationUz:
      'Laa ilaha illallohu vahdahu laa sharika lah, lahul-mulku va lahul-hamdu va huva a\'laa kulli shay-in qodiyr',
    meaningUz:
      'Allohdan boshqa iloh yo\'q, U yagonadir, Uning sherigi yo\'q. Mulk Unikidir, hamd Ungadir va U har narsaga qodirdir.',
    meaningRu:
      'Нет божества, достойного поклонения, кроме Аллаха, Единого, у Которого нет сотоварища. Ему принадлежит власть и хвала, и Он над всякой вещью мощен.',
    meaningEn:
      'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is able to do all things.',
    source: 'Sahih al-Bukhari 6403, Sahih Muslim 2693',
  },
  {
    day: 3,
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration:
      'Astaghfirullaha al-Azim alladhi la ilaha illa huwal-Hayyul-Qayyumu wa atubu ilayh',
    transliterationUz:
      'Astag\'firullohil Aziym allaziy laa ilaha illa huval-Hayyul-Qayyumu va atuubu ilayh',
    meaningUz:
      'Buyuk Allohdan mag\'firat so\'rayman. Undan boshqa iloh yo\'q. U Hayy va Qayyumdir. Men Unga tavba qilaman.',
    meaningRu:
      'Прошу прощения у Аллаха Великого, кроме Которого нет божества, Живого, Вседержителя, и приношу Ему покаяние.',
    meaningEn:
      'I seek forgiveness from Allah the Almighty, there is no god but He, the Living, the Self-Sustaining, and I repent to Him.',
    source: 'Sunan Abu Dawud 1517, Sunan at-Tirmidhi 3577',
  },
  {
    day: 4,
    arabic: 'سُبْحَانَ اللَّهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللَّهُ أَكْبَرُ (٣٤)',
    transliteration:
      'SubhanAllah (x33), Alhamdulillah (x33), Allahu Akbar (x34)',
    transliterationUz:
      'Subhanalloh (33 marta), Alhamdulillah (33 marta), Allohu Akbar (34 marta)',
    meaningUz:
      'Alloh pok-muqaddas (33 marta), Allohga hamd (33 marta), Alloh buyuk (34 marta).',
    meaningRu:
      'Пречист Аллах (33 раза), Хвала Аллаху (33 раза), Аллах Велик (34 раза).',
    meaningEn:
      'Glory be to Allah (x33), Praise be to Allah (x33), Allah is the Greatest (x34).',
    source: 'Sahih Muslim 597',
  },
  {
    day: 5,
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    transliterationUz: 'Laa havla va laa quvvata illaa billah',
    meaningUz:
      'Kuch va qudrat faqat Alloh bilandir.',
    meaningRu:
      'Нет силы и мощи ни у кого, кроме как от Аллаха.',
    meaningEn:
      'There is no power and no strength except with Allah.',
    source: 'Sahih al-Bukhari 4205, Sahih Muslim 2704',
  },
  {
    day: 6,
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakil',
    transliterationUz: 'Hasbunallohu va ni\'mal vakiyl',
    meaningUz:
      'Alloh bizga yetarli va U eng yaxshi vakildir.',
    meaningRu:
      'Достаточно нам Аллаха, и Он лучший Покровитель.',
    meaningEn:
      'Allah is sufficient for us, and He is the best Disposer of affairs.',
    source: 'Sahih al-Bukhari 4563; Quran 3:173',
  },
  {
    day: 7,
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina \'adhaban-nar',
    transliterationUz:
      'Robbanaa aatinaa fid-dun-yaa hasanatan va fil-aaxiroti hasanatan va qinaa azaaban-naar',
    meaningUz:
      'Robbimiz, bizga dunyoda yaxshilik, oxiratda yaxshilik ber va bizni do\'zax azobidan saqla.',
    meaningRu:
      'Господь наш, даруй нам в этом мире добро и в мире вечном добро и защити нас от мучений Огня.',
    meaningEn:
      'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    source: 'Quran 2:201; Sahih al-Bukhari 4522',
  },
  {
    day: 8,
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration:
      'Allahumma innaka \'afuwwun tuhibbul \'afwa fa\'fu \'anni',
    transliterationUz:
      'Allohumma innaka afuvvun tuhibbul afva fa\'fu anniy',
    meaningUz:
      'Allohim, Sen avf etuvchisan, avf etishni yaxshi ko\'rasan, meni avf et.',
    meaningRu:
      'О Аллах, поистине, Ты Прощающий, любишь прощение, так прости же меня.',
    meaningEn:
      'O Allah, You are the Pardoner, You love to pardon, so pardon me.',
    source: 'Sunan at-Tirmidhi 3513, Sunan Ibn Majah 3850',
  },
  {
    day: 9,
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastata\'tu, a\'udhu bika min sharri ma sana\'tu, abu\'u laka bi ni\'matika \'alayya wa abu\'u bi dhanbi, faghfir li fa innahu la yaghfirudh-dhunuba illa anta',
    transliterationUz:
      'Allohumma anta Robbiy laa ilaha illa anta, xolaqtaniy va ana abduka, va ana alaa ahdika va va\'dika mastata\'tu, auuzu bika min sharri maa sona\'tu, abuu-u laka bini\'matika alayya va abuu-u bizanbiy, fag\'fir liy fa innahu laa yag\'firuz-zunuuba illa anta',
    meaningUz:
      'Allohim, Sen mening Robbimsan. Sendan boshqa iloh yo\'q. Meni Sen yaratding va men Sening qulungman. Men imkonim boricha ahdingga va va\'dangga sodiqman. Qilgan yomonliklarimdan Senga sig\'inaman. Menga bergan ne\'matlaringni tan olaman va gunohlarimni e\'tirof etaman. Meni kechir, chunki gunohlarni faqat Sen kechirassan.',
    meaningRu:
      'О Аллах, Ты мой Господь. Нет божества, кроме Тебя. Ты создал меня, и я Твой раб. Я соблюдаю завет с Тобой и обещание, данное Тебе, по мере сил. Прибегаю к Тебе от зла того, что я совершил. Признаю милости Твои ко мне и признаю грех свой. Прости меня, ибо никто не прощает грехов, кроме Тебя.',
    meaningEn:
      'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant. I uphold Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings upon me and I confess my sins. Forgive me, for none forgives sins but You.',
    source: 'Sahih al-Bukhari 6306 (Sayyid ul-Istighfar)',
  },
  {
    day: 10,
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration:
      'Allahumma inni as\'alukal-huda wat-tuqa wal-\'afafa wal-ghina',
    transliterationUz:
      'Allohumma inniy as-alukal-hudaa vat-tuqoo val-afaafa val-g\'inaa',
    meaningUz:
      'Allohim, Sendan hidoyat, taqvo, poklik va boylikni so\'rayman.',
    meaningRu:
      'О Аллах, я прошу у Тебя наставления, богобоязненности, целомудрия и достатка.',
    meaningEn:
      'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
    source: 'Sahih Muslim 2721',
  },
  {
    day: 11,
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    transliteration:
      'Rabbighfir li wa tub \'alayya innaka antat-Tawwabur-Rahim',
    transliterationUz:
      'Robbig\'fir liy va tub alayya innaka antat-Tavvaabur-Rohiym',
    meaningUz:
      'Robbim, meni kechir va tavbamni qabul qil. Albatta, Sen tavbalarni qabul etuvchi va rahmlisan.',
    meaningRu:
      'Господь мой, прости меня и прими моё покаяние. Воистину, Ты Принимающий покаяние, Милосердный.',
    meaningEn:
      'My Lord, forgive me and accept my repentance. Indeed, You are the Acceptor of Repentance, the Most Merciful.',
    source: 'Sunan Abu Dawud 1516, Sunan at-Tirmidhi 3434',
  },
  {
    day: 12,
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration:
      'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wa a\'udhu bika minal-\'ajzi wal-kasal, wa a\'udhu bika minal-jubni wal-bukhl, wa a\'udhu bika min ghalabatid-dayni wa qahrir-rijal',
    transliterationUz:
      'Allohumma inniy auuzu bika minal-hammi val-hazan, va auuzu bika minal-ajzi val-kasal, va auuzu bika minal-jubni val-buxl, va auuzu bika min g\'olabatid-dayni va qohrir-rijaal',
    meaningUz:
      'Allohim, g\'am va qayg\'udan Senga sig\'inaman, ojizlik va dangasalikdan Senga sig\'inaman, qo\'rqoqlik va xasislikdan Senga sig\'inaman, qarz bosimidan va odamlar zulmidan Senga sig\'inaman.',
    meaningRu:
      'О Аллах, я прибегаю к Тебе от беспокойства и печали, от немощи и лени, от трусости и скупости, от бремени долгов и притеснения людей.',
    meaningEn:
      'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from cowardice and miserliness, from the burden of debt and the overpowering of people.',
    source: 'Sahih al-Bukhari 6369',
  },
  {
    day: 13,
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
    transliteration: 'Ya Hayyu ya Qayyumu bi rahmatika astaghith',
    transliterationUz: 'Yaa Hayyu yaa Qayyuumu birohmatika astag\'iys',
    meaningUz:
      'Ey tirik va barhayot bo\'lgan Zot, rahmatinging bilan yordam so\'rayman.',
    meaningRu:
      'О Живой, о Вседержитель, к Твоей милости я взываю о помощи.',
    meaningEn:
      'O Ever-Living, O Sustainer, in Your mercy I seek relief.',
    source: 'Sunan at-Tirmidhi 3524; Mustadrak al-Hakim 1/509',
  },
  {
    day: 14,
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration:
      'Allahumma a\'inni \'ala dhikrika wa shukrika wa husni \'ibadatik',
    transliterationUz:
      'Allohumma a\'inniy alaa zikrika va shukrika va husni ibaadatik',
    meaningUz:
      'Allohim, Seni zikr qilishda, Senga shukr qilishda va Senga go\'zal ibodat qilishda menga yordam ber.',
    meaningRu:
      'О Аллах, помоги мне поминать Тебя, благодарить Тебя и наилучшим образом поклоняться Тебе.',
    meaningEn:
      'O Allah, help me to remember You, thank You, and worship You in the best way.',
    source: 'Sunan Abu Dawud 1522, Sunan an-Nasa\'i 1303',
  },
  {
    day: 15,
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration:
      'Allahummaghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa \'alaniyyatahu wa sirrahu',
    transliterationUz:
      'Allohummag\'fir liy zanbiy kullahu, diqqohu va jillahu, va avvalahu va aaxirohu, va alooniiyatahu va sirrahu',
    meaningUz:
      'Allohim, mening barcha gunohlarimni kechir: kichigini va kattasini, avvalgisini va keyingisini, oshkorasini va yashirinini.',
    meaningRu:
      'О Аллах, прости мне все мои грехи: малые и великие, первые и последние, явные и тайные.',
    meaningEn:
      'O Allah, forgive me all my sins: minor and major, first and last, open and secret.',
    source: 'Sahih Muslim 483',
  },
  {
    day: 16,
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
    transliteration:
      'Allahumma inni as\'alukal-jannata wa a\'udhu bika minan-nar',
    transliterationUz:
      'Allohumma inniy as-alukal-jannata va auuzu bika minan-naar',
    meaningUz:
      'Allohim, Sendan jannatni so\'rayman va do\'zaxdan Senga sig\'inaman.',
    meaningRu:
      'О Аллах, я прошу у Тебя Рай и прибегаю к Тебе от Огня.',
    meaningEn:
      'O Allah, I ask You for Paradise and seek refuge in You from the Fire.',
    source: 'Sunan Abu Dawud 792, Sunan an-Nasa\'i 5519',
  },
  {
    day: 17,
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ',
    transliteration:
      'Rabbana la tuzigh qulubana ba\'da idh hadaytana wa hab lana min ladunka rahmatan innaka antal-Wahhab',
    transliterationUz:
      'Robbanaa laa tuzig\' quluubanaa ba\'da iz hadaytanaa va hab lanaa min ladunka rohmatan innaka antal-Vahhaab',
    meaningUz:
      'Robbimiz, bizni hidoyat qilgandan so\'ng qalblarimizni og\'dirma va O\'z huzuringdan bizga rahmat ato qil. Albatta, Sen ko\'p ato etuvchisan.',
    meaningRu:
      'Господь наш, не уклоняй сердца наши после того, как Ты направил нас, и даруй нам от Себя милость. Воистину, Ты Дарующий.',
    meaningEn:
      'Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.',
    source: 'Quran 3:8',
  },
  {
    day: 18,
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammadin kama sallayta \'ala Ibrahima wa \'ala ali Ibrahima innaka Hamidum Majid',
    transliterationUz:
      'Allohumma solli alaa Muhammadin va alaa aali Muhammadin kamaa sollayta alaa Ibrohiyma va alaa aali Ibrohiyma innaka Hamiidum Majiyd',
    meaningUz:
      'Allohim, Muhammadga va Muhammadning oilasiga rahmat yubor, Ibrohimga va Ibrohimning oilasiga rahmat yuborganingdek. Albatta, Sen maqtovga loyiq va ulug\'vorsan.',
    meaningRu:
      'О Аллах, благослови Мухаммада и семейство Мухаммада, как Ты благословил Ибрахима и семейство Ибрахима. Воистину, Ты Достохвальный, Славный.',
    meaningEn:
      'O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious.',
    source: 'Sahih al-Bukhari 3370, Sahih Muslim 406',
  },
  {
    day: 19,
    arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    transliteration:
      'Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunnanna minal-khasirin',
    transliterationUz:
      'Robbanaa zalamnaa anfusanaa va in lam tag\'fir lanaa va tarhamnaa lanakuunanna minal-xoosiriyn',
    meaningUz:
      'Robbimiz, biz o\'zimizga zulm qildik. Agar bizni kechirmang va rahm qilmang, albatta ziyon ko\'ruvchilardan bo\'lib qolamiz.',
    meaningRu:
      'Господь наш, мы поступили несправедливо к себе, и если Ты не простишь нас и не помилуешь, мы непременно окажемся среди потерпевших убыток.',
    meaningEn:
      'Our Lord, we have wronged ourselves. If You do not forgive us and have mercy upon us, we will surely be among the losers.',
    source: 'Quran 7:23',
  },
  {
    day: 20,
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration:
      'Dhahaba az-zama\'u wabtallatil-\'uruqu wa thabatal-ajru in sha\'Allah',
    transliterationUz:
      'Zahaba-z-zoma-u vabtollatil-uruuqu va sabatal-ajru in shaa-Alloh',
    meaningUz:
      'Chanqoqlik ketdi, tomorlar namlandi va agar Alloh xohlasa, savob mustahkamlandi.',
    meaningRu:
      'Ушла жажда, напитались жилы и утвердилась награда, если пожелает Аллах.',
    meaningEn:
      'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    source: 'Sunan Abu Dawud 2357 (Dua for breaking fast)',
  },
  {
    day: 21,
    arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    transliteration:
      'Allahumma inni laka sumtu wa bika amantu wa \'ala rizqika aftartu',
    transliterationUz:
      'Allohumma inniy laka sumtu va bika aamantu va alaa rizqika aftortu',
    meaningUz:
      'Allohim, men Sen uchun ro\'za tuttim, Senga iymon keltirdim va Sening rizqing bilan iftor qildim.',
    meaningRu:
      'О Аллах, ради Тебя я постился, в Тебя уверовал и Твоей пищей разговелся.',
    meaningEn:
      'O Allah, for You I have fasted, in You I have believed, and with Your provision I have broken my fast.',
    source: 'Sunan Abu Dawud 2358',
  },
  {
    day: 22,
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    transliteration:
      'Rabbi awzi\'ni an ashkura ni\'mataka allati an\'amta \'alayya wa \'ala walidayya wa an a\'mala salihan tardahu wa adkhilni bi rahmatika fi \'ibadika as-salihin',
    transliterationUz:
      'Robbi avzi\'niy an ashkura ni\'matakal-latiy an\'amta alayya va alaa vaalidayya va an a\'mala soolihan tarzoohu va adxilniy birohmatika fiy ibaadika-s-solihiyn',
    meaningUz:
      'Robbim, menga va ota-onamga bergan ne\'matingga shukr qilishga va O\'zing rozi bo\'ladigan yaxshi amal qilishga ilhom ber. Rahmatinging bilan meni solih bandalaringga qo\'sh.',
    meaningRu:
      'Господь мой, внуши мне быть благодарным за милость Твою, которую Ты оказал мне и моим родителям, и совершать праведные дела, которыми Ты будешь доволен, и введи меня по Твоей милости в число Твоих праведных рабов.',
    meaningEn:
      'My Lord, inspire me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to do righteousness of which You approve, and admit me by Your mercy among Your righteous servants.',
    source: 'Quran 27:19',
  },
  {
    day: 23,
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    transliteration:
      'Rabbij\'alni muqimas-salati wa min dhurriyyati Rabbana wa taqabbal du\'a',
    transliterationUz:
      'Robbij-alniy muqiymas-solaati va min zurriyyatiy Robbanaa va taqobbal du\'aa-iy',
    meaningUz:
      'Robbim, meni va zurriyotimdan namozni to\'kis ado etuvchilar qilgin. Robbimiz, duoyimni qabul qilgin.',
    meaningRu:
      'Господь мой, сделай меня совершающим молитву и из моего потомства тоже. Господь наш, прими мою мольбу.',
    meaningEn:
      'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.',
    source: 'Quran 14:40',
  },
  {
    day: 24,
    arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration:
      'Rabbanighfir li wa li walidayya wa lil-mu\'minina yawma yaqumul-hisab',
    transliterationUz:
      'Robbanag\'fir liy va livaalidayya va lil-mu\'miniyna yavma yaquumul-hisaab',
    meaningUz:
      'Robbimiz, hisob turiladigan kunda meni, ota-onamni va barcha mo\'minlarni kechir.',
    meaningRu:
      'Господь наш, прости меня, моих родителей и верующих в тот День, когда настанет расчёт.',
    meaningEn:
      'Our Lord, forgive me and my parents and the believers on the Day the account is established.',
    source: 'Quran 14:41',
  },
  {
    day: 25,
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ',
    transliteration:
      'Allahumma ba\'id bayni wa bayna khatayaya kama ba\'adta baynal-mashriqi wal-maghrib. Allahumma naqqini min khatayaya kama yunaqqa ath-thawbul-abyadu minad-danas. Allahummaghsilni min khatayaya bith-thalji wal-ma\'i wal-barad',
    transliterationUz:
      'Allohumma baa\'id bayniy va bayna xotooyaaya kamaa baa\'adta baynal-mashriqi val-mag\'rib. Allohumma naqqiniy min xotooyaaya kamaa yunaqqos-savbul-abyazu minad-danas. Allohummag\'silniy min xotooyaaya bis-salji val-maa-i val-barad',
    meaningUz:
      'Allohim, meni gunohlarimdan sharq va g\'arbni uzoqlashtirganingdek uzoqlashtir. Allohim, meni gunohlarimdan oq kiyim kirdan tozalanganidek tozala. Allohim, meni gunohlarimdan qor, suv va do\'l bilan yuvgin.',
    meaningRu:
      'О Аллах, удали меня от моих грехов, как Ты удалил восток от запада. О Аллах, очисти меня от грехов, как очищается белая одежда от грязи. О Аллах, омой меня от грехов снегом, водой и градом.',
    meaningEn:
      'O Allah, distance me from my sins as You have distanced the East from the West. O Allah, purify me of my sins as a white garment is purified of filth. O Allah, wash me of my sins with snow, water, and hail.',
    source: 'Sahih al-Bukhari 744, Sahih Muslim 598',
  },
  {
    day: 26,
    arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
    transliteration:
      'Allahumma aslih li dini alladhi huwa \'ismatu amri, wa aslih li dunyaya allati fiha ma\'ashi, wa aslih li akhirati allati fiha ma\'adi, waj\'alil-hayata ziyadatan li fi kulli khayr, waj\'alil-mawta rahatan li min kulli sharr',
    transliterationUz:
      'Allohumma aslih liy diyniy allaziy huva ismatu amriy, va aslih liy dun-yaaya allatiy fiyhaa ma\'aashiy, va aslih liy aaxirotiy allatiy fiyhaa ma\'aadiy, vaj\'alil-hayaata ziyaadatan liy fiy kulli xoyr, vaj\'alil-mavta roohatan liy min kulli sharr',
    meaningUz:
      'Allohim, ishlarimning himoyasi bo\'lgan dinimni isloh qil. Tirikchiligim bo\'lgan dunyoimni isloh qil. Qaytadigan joyim bo\'lgan oxiratimni isloh qil. Hayotni men uchun har bir yaxshilikda ziyoda qil va o\'limni men uchun har bir yomonlikdan qutulish qil.',
    meaningRu:
      'О Аллах, исправь мне мою религию, которая является защитой моих дел. Исправь мне мой мир, в котором моя жизнь. Исправь мне мою будущую жизнь, в которую я вернусь. Сделай жизнь прибавлением для меня во всяком благе и сделай смерть избавлением от всякого зла.',
    meaningEn:
      'O Allah, set right my religion which is the safeguard of my affairs. Set right my worldly life in which is my livelihood. Set right my Hereafter to which is my return. Make my life an increase for me in every good, and make death a relief for me from every evil.',
    source: 'Sahih Muslim 2720',
  },
  {
    day: 27,
    arabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ — اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration:
      'Inna anzalnahu fi Laylatil-Qadr — Allahumma innaka \'Afuwwun Karimun tuhibbul-\'afwa fa\'fu \'anni',
    transliterationUz:
      'Innaa anzalnaahu fiy Laylatil-Qadr — Allohumma innaka \'Afuvvun Kariymun tuhibbul-\'afva fa\'fu \'anniy',
    meaningUz:
      'Biz uni (Qur\'onni) Qadr kechasida nozil qildik — Allohim, Sen avf etuvchi va karimsan, avf etishni yaxshi ko\'rasan, meni avf et.',
    meaningRu:
      'Мы ниспослали его (Коран) в Ночь Предопределения — О Аллах, Ты Прощающий, Щедрый, любишь прощение, так прости же меня.',
    meaningEn:
      'Indeed, We sent it (the Quran) down during the Night of Decree — O Allah, You are the Pardoner, the Generous, You love to pardon, so pardon me.',
    source: 'Quran 97:1; Sunan at-Tirmidhi 3513 (Dua for Laylatul Qadr)',
  },
  {
    day: 28,
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration:
      'Allahumma inni as\'aluka \'ilman nafi\'an, wa rizqan tayyiban, wa \'amalan mutaqabbalan',
    transliterationUz:
      'Allohumma inniy as-aluka ilman naafiyan, va rizqon toyyiban, va amalan mutaqobbalan',
    meaningUz:
      'Allohim, Sendan foydali ilm, halol rizq va qabul qilinadigan amal so\'rayman.',
    meaningRu:
      'О Аллах, я прошу у Тебя полезное знание, благой удел и принятое деяние.',
    meaningEn:
      'O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.',
    source: 'Sunan Ibn Majah 925',
  },
  {
    day: 29,
    arabic: 'اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    transliteration:
      'Allahumma taqabbal minna innaka antas-Sami\'ul-\'Alim wa tub \'alayna innaka antat-Tawwabur-Rahim',
    transliterationUz:
      'Allohumma taqobbal minnaa innaka antas-Samiy\'ul-Aliym va tub alaynaa innaka antat-Tavvaabur-Rohiym',
    meaningUz:
      'Allohim, bizdan qabul qil. Albatta, Sen eshituvchi va biluvchisan. Tavbamizni qabul qil. Albatta, Sen tavbalarni qabul etuvchi va rahmlisan.',
    meaningRu:
      'О Аллах, прими от нас. Воистину, Ты Слышащий, Знающий. Прими наше покаяние. Воистину, Ты Принимающий покаяние, Милосердный.',
    meaningEn:
      'O Allah, accept from us. Indeed, You are the All-Hearing, the All-Knowing. Accept our repentance. Indeed, You are the Acceptor of Repentance, the Most Merciful.',
    source: 'Quran 2:127-128',
  },
  {
    day: 30,
    arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ، رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِنْ ذُرِّيَّتِنَا أُمَّةً مُسْلِمَةً لَكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    transliteration:
      'Rabbana taqabbal minna innaka antas-Sami\'ul-\'Alim. Rabbana waj\'alna muslimayni laka wa min dhurriyyatina ummatan muslimatan laka wa arina manasikana wa tub \'alayna innaka antat-Tawwabur-Rahim',
    transliterationUz:
      'Robbanaa taqobbal minnaa innaka antas-Samiy\'ul-Aliym. Robbanaa vaj\'alnaa muslimayny laka va min zurriyyatinaa ummatan muslimatol-laka va arinaa manaasikanaa va tub alaynaa innaka antat-Tavvaabur-Rohiym',
    meaningUz:
      'Robbimiz, bizdan qabul qil. Albatta, Sen eshituvchi va biluvchisan. Robbimiz, ikkalamizni Senga bo\'ysunuvchi qil va zurriyotimizdan Senga bo\'ysunuvchi ummat chiqar. Bizga ibodat qilish usullarini ko\'rsat va tavbamizni qabul qil. Albatta, Sen tavbalarni qabul etuvchi va rahmlisan.',
    meaningRu:
      'Господь наш, прими от нас. Воистину, Ты Слышащий, Знающий. Господь наш, сделай нас обоих покорными Тебе, а из нашего потомства общину, покорную Тебе, покажи нам обряды поклонения и прими наше покаяние. Воистину, Ты Принимающий покаяние, Милосердный.',
    meaningEn:
      'Our Lord, accept from us. Indeed, You are the All-Hearing, the All-Knowing. Our Lord, make us both submissive to You, and from our offspring a nation submissive to You, and show us our rites of worship, and accept our repentance. Indeed, You are the Acceptor of Repentance, the Most Merciful.',
    source: 'Quran 2:127-128',
  },
] as const
