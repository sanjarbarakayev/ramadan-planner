export interface SahurIftarDua {
  readonly id: string
  readonly type: 'sahur' | 'iftar'
  readonly arabic: string
  readonly transliteration: string
  readonly transliterationUz: string
  readonly meaningUz: string
  readonly meaningRu: string
  readonly meaningEn: string
  readonly source: string
}

export const SAHUR_IFTAR_DUAS: readonly SahurIftarDua[] = [
  // --- Sahur (Saharlik) niyat duosi ---
  {
    id: 'sahur-niyyat',
    type: 'sahur',
    arabic:
      'نَوَيْتُ أَنْ أَصُومَ صَوْمَ شَهْرِ رَمَضَانَ مِنَ الْفَجْرِ إِلَى الْمَغْرِبِ خَالِصًا لِلَّهِ تَعَالَى اللَّهُ أَكْبَرُ',
    transliteration:
      'Nawaytu an asuma sawma shahri Ramadan minal-fajri ilal-maghribi khalisan lillahi ta\'ala Allahu Akbar',
    transliterationUz:
      'Navaytu an asuuma sovma shahri Ramazoon(a) minal fajri ilal mag\'rib(i) xoolisan lillahi ta\'aala Allohu Akbar',
    meaningUz:
      'Ramazon oyining ro\'zasini subhdan shomgacha faqat Alloh taolo uchun tutishga niyat qildim. Alloh buyukdir.',
    meaningRu:
      'Я намерен соблюдать пост месяца Рамадан от рассвета до заката искренне ради Аллаха Всевышнего. Аллах Велик.',
    meaningEn:
      'I intend to fast the month of Ramadan from dawn to sunset, sincerely for the sake of Allah the Most High. Allah is the Greatest.',
    source: 'Hanafiy fiqh',
  },

  // --- Iftar (Iftorlik) duosi ---
  {
    id: 'iftar-main',
    type: 'iftar',
    arabic:
      'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ فَاغْفِرْ لِي يَا غَفَّارُ مَا قَدَّمْتُ وَمَا أَخَّرْتُ',
    transliteration:
      'Allahumma laka sumtu wa bika amantu wa \'alayka tawakkaltu wa \'ala rizqika aftartu faghfir li ya ghaffar(u) ma qaddamtu wa ma akhkhartu',
    transliterationUz:
      'Allohumma laka sumtu va bika aamantu va a\'layka tavakkaltu va a\'laa rizqika aftortu fag\'fir-liy yaa g\'offaar(u) maa qoddamtu va maa axxortu',
    meaningUz:
      'Allohim, Sen uchun ro\'za tutdim, Senga iymon keltirdim, Senga tavakkul qildim va Sening rizqing bilan og\'iz ochdim. Ey Mag\'firatli, oldingi va keyingi gunohlarimni kechir.',
    meaningRu:
      'О Аллах, ради Тебя я постился, в Тебя уверовал, на Тебя уповал и Твоей пищей разговляюсь. Прости меня, о Прощающий, за прежние и последующие грехи.',
    meaningEn:
      'O Allah, I fasted for You, believed in You, placed my trust in You, and I break my fast with Your provision. Forgive me, O Most Forgiving, for what I have done before and after.',
    source: 'Abu Dawud 2358, Tirmiziy',
  },

  // --- Qo'shimcha iftorlik duosi ---
  {
    id: 'iftar-thirst',
    type: 'iftar',
    arabic:
      'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration:
      'Dhahaba adh-dhama\'u wabtallat al-\'uruqu wa thabata al-ajru in sha Allah',
    transliterationUz:
      'Zahaba az-zama-u vabtallatil-u\'ruuqu va sabatal-ajru in shaa Alloh',
    meaningUz:
      'Tashnalik ketdi, tomarlar namlandi va agar Alloh xohlasa, savob sobit bo\'ldi.',
    meaningRu:
      'Ушла жажда, увлажнились жилы и утвердилась награда, если пожелает Аллах.',
    meaningEn:
      'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    source: 'Abu Dawud 2357',
  },
]

export const SAHUR_DUAS: readonly SahurIftarDua[] =
  SAHUR_IFTAR_DUAS.filter((d) => d.type === 'sahur')

export const IFTAR_DUAS: readonly SahurIftarDua[] =
  SAHUR_IFTAR_DUAS.filter((d) => d.type === 'iftar')
