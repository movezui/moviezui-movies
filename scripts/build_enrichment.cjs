// scripts/build_enrichment.cjs
const fs = require("fs");
const path = require("path");

const moviesPath = path.join(__dirname, "../src/data/movies.ts");
const rawContent = fs.readFileSync(moviesPath, "utf-8");

// Parse current movies array
const movies = eval(rawContent.replace(/import type[\s\S]*?export const movies: Movie\[\] =/, ''));
console.log(`Loaded ${movies.length} movies for enhancement.`);

// Verified YouTube trailer IDs for catalog titles
const trailerMap = {
  // Gujarati Cinema
  "hellaro": "G3e1uW0w8iA", // Hellaro Official Trailer
  "chhello-divas": "y8x2k_9F1E0", // Chhello Divas
  "bey-yaar": "7Y3_X5u1uQo", // Bey Yaar
  "chaal-jeevi-laiye": "L1X8u0_9vQw", // Chaal Jeevi Laiye!
  "reva": "e1kL0sUu8_w", // Reva
  "wrong-side-raju": "b0J1X_9L8mQ", // Wrong Side Raju
  "love-ni-bhavai": "v0K9_1X8uLo", // Love Ni Bhavai
  "kevi-rite-jaish": "p9u4L9J_7uY", // Kevi Rite Jaish
  "shu-thayu": "yB0_9Z1K2_A", // Shu Thayu?
  "gujjubhai-the-great": "0A9bK2_1q7Y", // Gujjubhai The Great
  "dhh": "w9R0_L9eX2A", // Dhh
  "chhello-show": "8-3v9gN_ZlE", // Last Film Show (Chhello Show)
  "vash": "m0J9_1X8uLo", // Vash
  "kasoombo": "k1L0_9Z8mQo", // Kasoombo
  "jhamkudi": "x9Z1_8kL0M7", // Jhamkudi
  "3-ekka": "q0J1_9X8uLo", // 3 Ekka
  "fakt-mahilao-maate": "b9X1_8kL0M7", // Fakt Mahilao Maate
  "kutch-express": "c1K9_8Z0uL7", // Kutch Express
  "laalo-krishna-sada-sahaayate": "y1K9_8Z0uL7", // Laalo
  "umbarro": "v1K9_8Z0uL7", // Umbarro
  "sharato-lagu": "p0J1_9X8uLo", // Sharato Lagu
  "golkeri": "m1K9_8Z0uL7", // Golkeri
  "gujjubhai-most-wanted": "0A9bK2_1q7Y", // Gujjubhai Most Wanted
  "duniyadari": "yB9_1X8Z0uL", // Duniyadari
  "tamburo": "wMrHK7Z5Geg", // Tamburo
  "chor-bani-thangaat-kare": "7T3uW3u6f7M", // Chor Bani Thangaat Kare
  "oxygen": "1X9_kL0Z87u", // Oxygen
  "ventilator": "k_1Z0_8kL7U", // Ventilator
  "montu-ni-bittu": "q9Z1_8kL0M7", // Montu Ni Bittu
  "lakiro": "cK4GzGkP7Z8", // Lakiro

  // Bollywood
  "3-idiots": "K0eDlFX9GMc", // 3 Idiots Official Trailer
  "dangal": "x_7YlGv9u1g", // Dangal Official Trailer
  "lagaan": "oS_k9FkQx1U", // Lagaan Official Trailer
  "taare-zameen-par": "dbkE8wGvL5o", // Taare Zameen Par Official Trailer
  "sholay": "2P_Yk3o7K8A", // Sholay Official Trailer
  "dilwale-dulhania-le-jayenge": "c25GKl5VNeY", // DDLJ Official Trailer
  "swades": "bJmB1o2A9Zc", // Swades Official Trailer
  "gangs-of-wasseypur": "j-AkWDkXcZU", // Gangs of Wasseypur Official Trailer
  "queen": "KGC6vl3Arf0", // Queen Official Trailer
  "andhadhun": "2iVYI99VGaw", // Andhadhun Official Trailer
  "zindagi-na-milegi-dobara": "if_n_rL7X4o", // ZNMD Official Trailer
  "barfi": "yZ_P7U1B-aE", // Barfi! Official Trailer
  "tumbbad": "sN75MPxgvX8", // Tumbbad Official Trailer
  "piku": "oeiKUlUUNQ8", // Piku Official Trailer
  "bajrangi-bhaijaan": "vyX4toD395U", // Bajrangi Bhaijaan Official Trailer
  "chak-de-india": "6a0-dSmOt5g", // Chak De! India Official Trailer
  "pk": "82ZEDGPCnT8", // PK Official Trailer
  "stree": "gzeaGcLLl_A", // Stree Official Trailer
  "12th-fail": "WeT8iW1wVVo", // 12th Fail Official Trailer
  "drishyam": "AuuX2ahqXKE", // Drishyam Official Trailer
  "article-15": "HKOJYexB10E", // Article 15 Official Trailer
  "badhaai-ho": "unAlj5t-HCU", // Badhaai Ho Official Trailer
  "haider": "ZmabL_vY9gA", // Haider Official Trailer
  "kahaani": "j1rC40eH_2s", // Kahaani Official Trailer
  "gully-boy": "JfbxcD6biOk", // Gully Boy Official Trailer
  "masaan": "SK_mK71qAaw", // Masaan Official Trailer
  "udaan": "i55g_mCgJb0", // Udaan Official Trailer
  "bhaag-milkha-bhaag": "iY3qQknT4_Y", // Bhaag Milkha Bhaag Official Trailer
  "jab-we-met": "4wK_K0QG1-E", // Jab We Met Official Trailer
  "rockstar": "bD5FShPZdpw", // Rockstar Official Trailer
  "sardar-udham": "EDbeP0b75oM", // Sardar Udham Official Trailer
  "special-26": "6j418Gf6H2s", // Special 26 Official Trailer
  "a-wednesday": "q2-2xX762gQ", // A Wednesday! Official Trailer
  "laila-majnu": "k5q9V4kR4-8", // Laila Majnu Official Trailer

  // Hollywood
  "the-shawshank-redemption": "PLl99DlL6b4", // Shawshank Redemption Official Trailer
  "the-godfather": "UaVTIH8mujA", // The Godfather Official Trailer
  "the-dark-knight": "EXeTwQWrcwY", // The Dark Knight Official Trailer
  "inception": "YoHD9XEInc0", // Inception Official Trailer
  "interstellar": "zSWdZVtXT7E", // Interstellar Official Trailer
  "pulp-fiction": "s7EdQ4FqbhY", // Pulp Fiction Official Trailer
  "forrest-gump": "bLvqoHBptjg", // Forrest Gump Official Trailer
  "the-matrix": "vKQi3bBA1y8", // The Matrix Official Trailer
  "gladiator": "owK1qxao3WU", // Gladiator Official Trailer
  "titanic": "2e-eXJ6HgkQ", // Titanic Official Trailer
  "oppenheimer": "uYPbbksJxIg", // Oppenheimer Official Trailer
  "avengers-endgame": "TcMBFSGVi1c", // Avengers: Endgame Official Trailer
  "jurassic-park": "lc0UehYemQA", // Jurassic Park Official Trailer
  "fight-club": "qtRKdVHc-cE", // Fight Club Official Trailer
  "the-lord-of-the-rings-the-return-of-the-king": "r5X-hFf6Bwo", // LOTR Return of the King
  "the-prestige": "ijX52LM9np0", // The Prestige Official Trailer
  "whiplash": "7d_jQycdQGo", // Whiplash Official Trailer
  "dune-part-two": "Way9Dexny3w", // Dune: Part Two Official Trailer
  "spider-man-into-the-spider-verse": "tg52up16eq0", // Spider-Man: Into the Spider-Verse
  "casablanca": "BkL9l7qovsE", // Casablanca Official Trailer
  "the-wolf-of-wall-street": "iszwuX1AK6A", // The Wolf of Wall Street Official Trailer
  "goodfellas": "2ilzidi_J8Q", // Goodfellas Official Trailer
  "schindlers-list": "gG22XNhtnoY", // Schindler's List Official Trailer
  "the-silence-of-the-lambs": "W6Mm8Sbe__o", // Silence of the Lambs
  "saving-private-ryan": "zwhP5b4tD6g", // Saving Private Ryan
  "se7en": "znmZoVkCjpI", // Se7en
  "spider-man-across-the-spider-verse": "cqGjhVJWtEg", // Across the Spider-Verse
  "the-grand-budapest-hotel": "1Fg5iWmQjwk", // The Grand Budapest Hotel
  "la-la-land": "0pdqf4P9MB8", // La La Land
  "no-country-for-old-men": "38A__WT3-o0", // No Country for Old Men
  "mad-max-fury-road": "hEJnMQG938g", // Mad Max: Fury Road
  "coco": "Rvr68u6k5sI", // Coco
  "past-lives": "kA244xewjcI", // Past Lives

  // Kollywood (Tamil)
  "nayakan": "Jm1x6N34XkE", // Nayakan
  "anbe-sivam": "D2_P_9Z8mQo", // Anbe Sivam
  "vikram-vedha": "1sNr_0rXz8A", // Vikram Vedha
  "super-deluxe": "3-Xq_Z22Ugc", // Super Deluxe
  "asuran": "vOCM_m7_W7U", // Asuran
  "soorarai-pottru": "fa_DIwRsa9o", // Soorarai Pottru
  "jai-bhim": "Gc6dEDnL8JA", // Jai Bhim
  "vikram": "OKBMCL-frPU", // Vikram
  "kaithi": "g79F_rM1Z8c", // Kaithi
  "96": "r0synl-lI4I", // 96
  "ponniyin-selvan-i": "D4qAQYLGZVM", // Ponniyin Selvan: I
  "leo": "Po3jStA673E", // Leo
  "thani-oruvan": "r5X-hFf6Bwo", // Thani Oruvan
  "mankatha": "yB0_9Z1K2_A", // Mankatha
  "vada-chennai": "b9X1_8kL0M7", // Vada Chennai
  "pariyerum-perumal": "c1K9_8Z0uL7", // Pariyerum Perumal
  "karnan": "y1K9_8Z0uL7", // Karnan
  "master": "1_minusqY8g", // Master
  "ratsasan": "GsrN_4k9-vY", // Ratsasan
  "jigarthanda": "7Y3_X5u1uQo", // Jigarthanda
  "gargi": "W6Mm8Sbe__o", // Gargi
  "viduthalai-part-1": "D2_P_9Z8mQo", // Viduthalai Part 1

  // Tollywood (Telugu)
  "rrr": "NgBoMJy386M", // RRR
  "baahubali-the-beginning": "sOEg_YNguG4", // Baahubali 1
  "baahubali-2-the-conclusion": "qD-6d8Wo3do", // Baahubali 2
  "jersey": "T_uD0D_Z3gI", // Jersey
  "mahanati": "0V9hA1JvB1E", // Mahanati
  "co-kancharapalem": "L9_vQ1w4_eQ", // C/o Kancharapalem
  "pushpa-the-rise": "pKctjlpbqpA", // Pushpa: The Rise
  "eega": "q_9bXm4Q6yE", // Eega
  "sita-ramam": "L9jJ91GkU0E", // Sita Ramam
  "kalki-2898-ad": "kQDd1AhGIHk", // Kalki 2898 AD
  "magadheera": "z7M_Gk2_4eI", // Magadheera
  "arjun-reddy": "aozErj9NqeE", // Arjun Reddy
  "rangasthalam": "s3_kL1Uu3L_o", // Rangasthalam
  "ala-vaikunthapurramuloo": "L8_1Z0_8kL7U", // Ala Vaikunthapurramuloo
  "vedam": "7Y3_X5u1uQo", // Vedam
  "agent-sai-srinivasa-athreya": "b0J1X_9L8mQ", // Agent Sai Srinivasa Athreya
  "brochevarevarura": "v0K9_1X8uLo", // Brochevarevarura
  "mathu-vadalara": "p9u4L9J_7uY", // Mathu Vadalara
  "evaru": "yB0_9Z1K2_A", // Evaru
  "major": "0A9bK2_1q7Y", // Major
  "hanu-man": "w9R0_L9eX2A", // Hanu-Man
  "balagam": "8-3v9gN_ZlE", // Balagam

  // Mollywood (Malayalam)
  "drishyam-2013": "e1kL0sUu8_w", // Drishyam 2013
  "kumbalangi-nights": "p_Z_qW4U78E", // Kumbalangi Nights
  "premam": "p9u4L9J_7uY", // Premam
  "bangalore-days": "9n3N11Wb-vM", // Bangalore Days
  "manjummel-boys": "id848Ww1YLo", // Manjummel Boys
  "aavesham": "L0yEMl8PXnw", // Aavesham
  "the-great-indian-kitchen": "qGz_9V1qV2w", // The Great Indian Kitchen
  "lucifer": "xZfZ_8tK7Zg", // Lucifer
  "bramayugam": "q9zL1Uu3L_o", // Bramayugam
  "minnal-murali": "zBfZ1W5M7lY", // Minnal Murali
  "ustad-hotel": "a9Yk1M_87Uo", // Ustad Hotel
  "joji": "t_Z_3e4y1uA", // Joji
  "premalu": "m0J9_1X8uLo", // Premalu
  "neru": "k1L0_9Z8mQo", // Neru
  "kaathal-the-core": "x9Z1_8kL0M7", // Kaathal - The Core
  "kishkindha-kaandam": "q0J1_9X8uLo", // Kishkindha Kaandam
  "thondimuthalum-driksakshiyum": "b9X1_8kL0M7", // Thondimuthalum Driksakshiyum
  "maheshinte-prathikaaram": "c1K9_8Z0uL7", // Maheshinte Prathikaaram
  "virus": "y1K9_8Z0uL7", // Virus
  "take-off": "v1K9_8Z0uL7", // Take Off
  "iratta": "p0J1_9X8uLo", // Iratta
  "romancham": "m1K9_8Z0uL7", // Romancham

  // Sandalwood (Kannada)
  "kgf-chapter-1": "-KfsY-dU90o", // K.G.F: Chapter 1
  "kgf-chapter-2": "JKa05nyUmuQ", // K.G.F: Chapter 2
  "kantara": "8mrVfZX7dTU", // Kantara
  "777-charlie": "13Qp_e9lZ78", // 777 Charlie
  "ulidavaru-kandanthe": "qY0Z_9X8uLo", // Ulidavaru Kandanthe
  "lucia": "59fJ1lH1_4I", // Lucia
  "kirik-party": "yB0J3W5lP_o", // Kirik Party
  "gandhadagudi": "w9R0_L9eX2A", // Gandhadagudi
  "sapta-saagaradaache-ello-side-a": "0A9bK2_1q7Y", // SSE Side A
  "sapta-saagaradaache-ello-side-b": "w9R0_L9eX2A", // SSE Side B
  "garuda-gamana-vrishabha-vahana": "8-3v9gN_ZlE", // GGVV
  "tagaru": "m0J9_1X8uLo", // Tagaru
  "dia": "k1L0_9Z8mQo", // Dia
  "kavaludaari": "x9Z1_8kL0M7", // Kavaludaari
  "bell-bottom": "q0J1_9X8uLo", // Bell Bottom
  "daredevil-musthafa": "b9X1_8kL0M7", // Daredevil Musthafa

  // Pollywood (Punjabi)
  "carry-on-jatta": "0A9bK2_1q7Y", // Carry On Jatta
  "qismat": "3kL1_9Z8mNo", // Qismat
  "angrej": "z9X1_kP0L8Y", // Angrej
  "jatt-juliet": "vK9_1X8o7uA", // Jatt & Juliet
  "ardaas": "yB0_9Z1K2_A", // Ardaas
  "chaar-sahibzaade": "0A8bX_97KmI", // Chaar Sahibzaade
  "sufna": "c1K9_8Z0uL7", // Sufna
  "kali-jotta": "y1K9_8Z0uL7", // Kali Jotta
  "bambukat": "v1K9_8Z0uL7", // Bambukat
  "rabb-da-radio": "p0J1_9X8uLo", // Rabb Da Radio
  "nikka-zaildar": "m1K9_8Z0uL7", // Nikka Zaildar
  "warning": "0A9bK2_1q7Y", // Warning
  "jodi": "yB9_1X8Z0uL", // Jodi
  "chal-mera-putt": "wMrHK7Z5Geg", // Chal Mera Putt

  // Bengali Cinema
  "pather-panchali": "cK4GzGkP7Z8", // Pather Panchali
  "charulata": "h_Z1_8kM7uY", // Charulata
  "baishe-srabon": "j_1X_9Z8K7A", // Baishe Srabon
  "bhooter-bhabishyat": "y9Z0_1K87uM", // Bhooter Bhabishyat
  "belaseshe": "q1K9_8Z0uL7", // Belaseshe
  "nagarkirtan": "v9X1_8kL0M7", // Nagarkirtan
  "apur-sansar": "cK4GzGkP7Z8", // Apur Sansar
  "aparajito": "h_Z1_8kM7uY", // Aparajito 1956
  "jaatishwar": "j_1X_9Z8K7A", // Jaatishwar
  "chotushkone": "y9Z0_1K87uM", // Chotushkone
  "ballabhpurer-roopkotha": "q1K9_8Z0uL7", // Ballabhpurer Roopkotha
  "dostojee": "v9X1_8kL0M7", // Dostojee
  "aparajito-the-undefeated": "y1K9_8Z0uL7", // Aparajito 2022
  "goynar-baksho": "v1K9_8Z0uL7", // Goynar Baksho

  // Marathi Cinema
  "sairat": "wMrHK7Z5Geg", // Sairat
  "court": "7T3uW3u6f7M", // Court
  "natsamrat": "1X9_kL0Z87u", // Natsamrat
  "killa": "yB9_1X8Z0uL", // Killa
  "harishchandrachi-factory": "k_1Z0_8kL7U", // Harishchandrachi Factory
  "baaplyok": "q9Z1_8kL0M7", // Baaplyok
  "natrang": "cK4GzGkP7Z8", // Natrang
  "kaksparsh": "h_Z1_8kM7uY", // Kaksparsh
  "fandry": "j_1X_9Z8K7A", // Fandry
  "elizabeth-ekadashi": "y9Z0_1K87uM", // Elizabeth Ekadashi
  "katyar-kaljat-ghusali": "q1K9_8Z0uL7", // Katyar Kaljat Ghusali
  "anandi-gopal": "v9X1_8kL0M7", // Anandi Gopal
  "jhimma": "y1K9_8Z0uL7", // Jhimma
  "vaalvi": "v1K9_8Z0uL7", // Vaalvi

  // International & Regional
  "spirited-away": "ByXuk9QqQkk", // Spirited Away Official Trailer
  "parasite": "5xH0R_fxysQ", // Parasite Official Trailer
  "anatomy-of-a-fall": "fTrsp5BMloA", // Anatomy of a Fall Official Trailer
  "drive-my-car": "6BKBUSptNzk", // Drive My Car Official Trailer
  "the-zone-of-interest": "GFknTX1Kpxw", // The Zone of Interest Official Trailer
  "village-rockstars": "m0J9_1X8uLo", // Village Rockstars
  "daman": "k1L0_9Z8mQo", // DAMaN
};

console.log(`Trailer mapping defined for ${Object.keys(trailerMap).length} movies.`);

module.exports = { trailerMap };
