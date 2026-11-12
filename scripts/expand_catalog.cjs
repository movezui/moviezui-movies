// scripts/expand_catalog.cjs
const fs = require('fs');
const path = require('path');
const newMovies = require('./movies_data.cjs');

const delay = ms => new Promise(res => setTimeout(res, ms));

const existingGujarati = [
  {
    id: "1",
    slug: "hellaro",
    title: "Hellaro",
    releaseYear: 2019,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Drama", "Historical"],
    director: "Abhishek Shah",
    cast: ["Jayesh More", "Shraddha Dangar", "Kaushambi Bhatt", "Brinda Trivedi", "Niilam Paanchal", "Maulik Nayak"],
    description: "In 1975 rural Kutch, a group of women suppressed by patriarchal traditions find liberation and self-expression through Garba when an outcast dhol player enters their lives. Winner of the National Film Award for Best Feature Film.",
    poster: "/images/movies/hellaro.jpg",
    imdbRating: 8.5,
    runtime: 121,
    featured: true,
    addedAt: "2026-11-02T10:00:00Z",
    sources: ["https://en.wikipedia.org/wiki/Hellaro"]
  },
  {
    id: "2",
    slug: "chhello-divas",
    title: "Chhello Divas: A New Beginning",
    releaseYear: 2015,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama"],
    director: "Krishnadev Yagnik",
    cast: ["Malhar Thakar", "Yash Soni", "Mitra Gadhvi", "Aarohi Patel", "Kinjal Rajpriya", "Janki Bodiwala"],
    description: "A laugh-out-loud cult comedy following eight college friends as they navigate love, friendship, campus antics, and the bittersweet final days of their student life.",
    poster: "/images/movies/chhello-divas.jpg",
    imdbRating: 8.1,
    runtime: 138,
    featured: true,
    addedAt: "2026-11-02T10:05:00Z",
    sources: ["https://en.wikipedia.org/wiki/Chhello_Divas"]
  },
  {
    id: "3",
    slug: "bey-yaar",
    title: "Bey Yaar",
    releaseYear: 2014,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama"],
    director: "Abhishek Jain",
    cast: ["Manoj Joshi", "Darshan Jariwala", "Divyang Thakkar", "Pratik Gandhi", "Samvedna Suwalka"],
    description: "Two childhood best friends commit a foolish mistake that costs one friend's father his pride and cherished artwork. Determined to right their wrong, they plan an ingenious con to retrieve the painting.",
    poster: "/images/movies/bey-yaar.jpg",
    imdbRating: 8.2,
    runtime: 150,
    featured: true,
    addedAt: "2026-11-02T10:10:00Z",
    sources: ["https://en.wikipedia.org/wiki/Bey_Yaar"]
  },
  {
    id: "4",
    slug: "chaal-jeevi-laiye",
    title: "Chaal Jeevi Laiye!",
    releaseYear: 2019,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama", "Adventure"],
    director: "Vipul Mehta",
    cast: ["Siddharth Randeria", "Yash Soni", "Aarohi Patel", "Janki Bodiwala"],
    description: "A workaholic son takes his terminally ill, fun-loving father on a bucket-list road trip across Uttarakhand, where an unexpected traveler joins them and changes their perspectives forever.",
    poster: "/images/movies/chaal-jeevi-laiye.jpg",
    imdbRating: 8.1,
    runtime: 137,
    featured: true,
    addedAt: "2026-11-02T10:15:00Z",
    sources: ["https://en.wikipedia.org/wiki/Chaal_Jeevi_Laiye!"]
  },
  {
    id: "5",
    slug: "reva",
    title: "Reva",
    releaseYear: 2018,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Drama", "Adventure"],
    director: "Rahul Bhole, Vinit Kanojia",
    cast: ["Chetan Dhanani", "Monal Gajjar", "Yatin Karyekar", "Daya Shankar Pandey", "Abhinay Banker"],
    description: "Based on Dhruv Bhatt's acclaimed novel 'Tatvamasi', an ambitious NRI travels to the sacred banks of the river Narmada to claim his grandfather's will, triggering an unexpected spiritual awakening.",
    poster: "/images/movies/reva.jpg",
    imdbRating: 8.0,
    runtime: 135,
    featured: false,
    addedAt: "2026-11-02T10:20:00Z",
    sources: ["https://en.wikipedia.org/wiki/Reva_(film)"]
  },
  {
    id: "6",
    slug: "wrong-side-raju",
    title: "Wrong Side Raju",
    releaseYear: 2016,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Thriller", "Drama"],
    director: "Mikhil Musale",
    cast: ["Pratik Gandhi", "Kimberley Louisa McBeath", "Asif Basra", "Kavi Shastri", "Hetesh Patel"],
    description: "Raju, an ordinary driver who moonlights as a bootlegger, finds himself entangled in a conspiracy when he is framed for a high-profile hit-and-run accident committed by his wealthy boss's son.",
    poster: "/images/movies/wrong-side-raju.jpg",
    imdbRating: 7.1,
    runtime: 135,
    featured: false,
    addedAt: "2026-11-02T10:25:00Z",
    sources: ["https://en.wikipedia.org/wiki/Wrong_Side_Raju"]
  },
  {
    id: "7",
    slug: "love-ni-bhavai",
    title: "Love Ni Bhavai",
    releaseYear: 2017,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Romance", "Drama"],
    director: "Sandeep Patel",
    cast: ["Malhar Thakar", "Pratik Gandhi", "Aarohi Patel"],
    description: "RJ Antara, an independent radio personality who is skeptical about romantic commitment, finds herself courted by two starkly different suitors: a happy-go-lucky charmer and a successful business tycoon.",
    poster: "/images/movies/love-ni-bhavai.jpg",
    imdbRating: 7.5,
    runtime: 147,
    featured: false,
    addedAt: "2026-11-02T10:30:00Z",
    sources: ["https://en.wikipedia.org/wiki/Love_Ni_Bhavai"]
  },
  {
    id: "8",
    slug: "kevi-rite-jaish",
    title: "Kevi Rite Jaish",
    releaseYear: 2012,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama"],
    director: "Abhishek Jain",
    cast: ["Divyang Thakkar", "Veronica Gautam", "Tom Alter", "Anang Desai", "Kenneth Desai"],
    description: "A satirical social comedy exploring the Gujarati Patel community's generational obsession with migrating to the United States and the bizarre measures taken to secure a visa.",
    poster: "/images/movies/kevi-rite-jaish.jpg",
    imdbRating: 7.6,
    runtime: 126,
    featured: false,
    addedAt: "2026-11-02T10:35:00Z",
    sources: ["https://en.wikipedia.org/wiki/Kevi_Rite_Jaish"]
  },
  {
    id: "9",
    slug: "shu-thayu",
    title: "Shu Thayu?",
    releaseYear: 2018,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy"],
    director: "Krishnadev Yagnik",
    cast: ["Malhar Thakar", "Yash Soni", "Mitra Gadhvi", "Aarohi Patel", "Kinjal Rajpriya", "Mayur Chauhan"],
    description: "Days before his arranged wedding, Manan suffers retrograde amnesia following a minor gully cricket accident, causing his three mischievous friends to desperately hide the mishap from the bride's strict family.",
    poster: "/images/movies/shu-thayu.jpg",
    imdbRating: 6.8,
    runtime: 144,
    featured: false,
    addedAt: "2026-11-02T10:40:00Z",
    sources: ["https://en.wikipedia.org/wiki/Shu_Thayu%3F"]
  },
  {
    id: "10",
    slug: "gujjubhai-the-great",
    title: "Gujjubhai The Great",
    releaseYear: 2015,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy"],
    director: "Ishaan Randeria",
    cast: ["Siddharth Randeria", "Jimit Trivedi", "Swati Shah", "Dipna Patel", "Dharmendra Gohil"],
    description: "Hasmukh Gandhi encounters endless slapstick troubles while trying to help his daughter marry her love interest, navigating through an army of quirky characters and comic misunderstandings.",
    poster: "/images/movies/gujjubhai-the-great.jpg",
    imdbRating: 7.3,
    runtime: 145,
    featured: false,
    addedAt: "2026-11-02T10:45:00Z",
    sources: ["https://en.wikipedia.org/wiki/Gujjubhai_the_Great"]
  },
  {
    id: "11",
    slug: "dhh",
    title: "Dhh",
    releaseYear: 2017,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Drama", "Family"],
    director: "Manish Saini",
    cast: ["Naseeruddin Shah", "Jas Bhesania", "Kahaan", "Karan Patel", "Bhamini Oza Gandhi"],
    description: "Three mischievous schoolboys constantly failing their exams write to a traveling magician believing his magical tricks can miraculously help them pass, teaching them invaluable life lessons. Winner of the National Award for Best Gujarati Film.",
    poster: "/images/movies/dhh.jpg",
    imdbRating: 7.8,
    runtime: 128,
    featured: false,
    addedAt: "2026-11-02T10:50:00Z",
    sources: ["https://en.wikipedia.org/wiki/Dhh_(film)"]
  },
  {
    id: "12",
    slug: "chhello-show",
    title: "Chhello Show (Last Film Show)",
    releaseYear: 2021,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Drama"],
    director: "Pan Nalin",
    cast: ["Bhavin Rabari", "Bhavesh Shrimali", "Richa Meena", "Dipen Raval", "Paresh Mehta"],
    description: "A nine-year-old boy in rural Saurashtra is entranced by the magic of cinema, befriending a movie theater projectionist by trading his mother's tiffin for hours of projection booth wonder. India's official entry to the 95th Academy Awards.",
    poster: "/images/movies/chhello-show.jpg",
    imdbRating: 7.4,
    runtime: 110,
    featured: true,
    addedAt: "2026-11-02T10:55:00Z",
    sources: ["https://en.wikipedia.org/wiki/Chhello_Show"]
  },
  {
    id: "13",
    slug: "vash",
    title: "Vash",
    releaseYear: 2023,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Thriller", "Horror"],
    director: "Krishnadev Yagnik",
    cast: ["Janki Bodiwala", "Hitu Kanodia", "Niilam Paanchal", "Hiten Kumar", "Aaryan Sanghvi"],
    description: "An idyllic weekend getaway for Atharva and his family turns into a terrifying fight for survival when an enigmatic stranger named Pratap visits their cottage and controls their teenage daughter using malevolent black magic.",
    poster: "/images/movies/vash.jpg",
    imdbRating: 7.9,
    runtime: 118,
    featured: true,
    addedAt: "2026-11-02T11:00:00Z",
    sources: ["https://en.wikipedia.org/wiki/Vash_(film)"]
  },
  {
    id: "14",
    slug: "kasoombo",
    title: "Kasoombo",
    releaseYear: 2024,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Historical", "Action", "Drama"],
    director: "Vijaygiri Bava",
    cast: ["Raunaq Kamdar", "Dharmendra Gohil", "Darshan Pandya", "Chetan Dhanani", "Shraddha Dangar", "Monal Gajjar"],
    description: "Based on Vimy Shah's historical novel 'Amar Balidan', this epic drama chronicles the fearless sacrifice of Dadu Barot and 51 valorous villagers standing against Allauddin Khilji's commanders to protect the sanctified temples of Palitana.",
    poster: "/images/movies/kasoombo.jpg",
    imdbRating: 8.6,
    runtime: 147,
    featured: true,
    addedAt: "2026-11-02T11:05:00Z",
    sources: ["https://en.wikipedia.org/wiki/Kasoombo"]
  },
  {
    id: "15",
    slug: "jhamkudi",
    title: "Jhamkudi",
    releaseYear: 2024,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Horror", "Mystery"],
    director: "Umang Vyas",
    cast: ["Manasi Parekh", "Viraj Ghelani", "Sanjay Goradia", "Chetan Daiya", "Ojas Rawal", "Nisarg Trivedi"],
    description: "In the superstition-gripped village of Raniwada, celebrating Navratri is strictly forbidden under the deadly curse of the witch Jhamkudi. A clever NRI estate agent and an eccentric ghost hunter team up to uncover the chilling truth.",
    poster: "/images/movies/jhamkudi.jpg",
    imdbRating: 7.1,
    runtime: 133,
    featured: true,
    addedAt: "2026-11-02T11:10:00Z",
    sources: ["https://en.wikipedia.org/wiki/Jhamkudi"]
  },
  {
    id: "16",
    slug: "3-ekka",
    title: "3 Ekka",
    releaseYear: 2023,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama"],
    director: "Rajesh Sharma",
    cast: ["Yash Soni", "Malhar Thakar", "Mitra Gadhvi", "Esha Kansara", "Kinjal Rajpriya", "Tarjanee Bhadla"],
    description: "Facing severe financial crisis, three desperate friends hatch a wild plan to convert a quiet middle-class household into a temporary secret gambling club, sparking relentless hilarity and unexpected dangers.",
    poster: "/images/movies/3-ekka.jpg",
    imdbRating: 6.9,
    runtime: 153,
    featured: false,
    addedAt: "2026-11-02T11:15:00Z",
    sources: ["https://en.wikipedia.org/wiki/3_Ekka"]
  },
  {
    id: "17",
    slug: "fakt-mahilao-maate",
    title: "Fakt Mahilao Maate",
    releaseYear: 2022,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama", "Family"],
    director: "Jay Bodas",
    cast: ["Yash Soni", "Deeksha Joshi", "Amitabh Bachchan", "Tarjanee Bhadla", "Bhavini Jani"],
    description: "Constantly overwhelmed by the demanding women in his household, Chintan receives a miraculous superpower at Ambaji temple that lets him hear women's inner thoughts, turning his world upside down with hilarious revelations.",
    poster: "/images/movies/fakt-mahilao-maate.jpg",
    imdbRating: 7.0,
    runtime: 137,
    featured: false,
    addedAt: "2026-11-02T11:20:00Z",
    sources: ["https://en.wikipedia.org/wiki/Fakt_Mahilao_Maate"]
  },
  {
    id: "18",
    slug: "kutch-express",
    title: "Kutch Express",
    releaseYear: 2023,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Drama", "Family"],
    director: "Viral Shah",
    cast: ["Ratna Pathak Shah", "Manasi Parekh", "Dharmendra Gohil", "Darsheel Safary", "Viraf Patel"],
    description: "Upon discovering her husband's secret infidelity, Monghi is empowered by her progressive mother-in-law to rebuild her identity, pursue her long-lost passions, and discover unconditional self-worth in vibrant Kutch.",
    poster: "/images/movies/kutch-express.jpg",
    imdbRating: 7.0,
    runtime: 130,
    featured: false,
    addedAt: "2026-11-02T11:25:00Z",
    sources: ["https://en.wikipedia.org/wiki/Kutch_Express_(film)"]
  },
  {
    id: "19",
    slug: "laalo",
    title: "Laalo - Krishna Sada Sahaayate",
    releaseYear: 2025,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Drama", "Family"],
    director: "Ankit Sakhiya",
    cast: ["Karan Joshi", "Reeva Rachh", "Shruhad Goswami", "Mishty Kadecha"],
    description: "An honest rickshaw driver burdened by heavy debt and family tribulations finds spiritual guidance and unexpected miracles through profound visions of Lord Krishna, embarking on a path of perseverance and faith.",
    poster: "/images/movies/laalo.jpg",
    imdbRating: null,
    runtime: 125,
    featured: false,
    addedAt: "2026-11-02T11:30:00Z",
    sources: ["https://en.wikipedia.org/wiki/Laalo_%E2%80%93_Krishna_Sada_Sahaayate"]
  },
  {
    id: "20",
    slug: "umbarro",
    title: "Umbarro",
    releaseYear: 2025,
    language: "Gujarati",
    industry: "Gujarati Cinema",
    genres: ["Comedy", "Drama", "Family"],
    director: "Abhishek Shah",
    cast: ["Vandana Pathak", "Kaajal Oza Vaidya", "Suchita Trivedi", "Deeksha Joshi", "Tarjanee Bhadla", "Aarjav Trivedi"],
    description: "Seven diverse Gujarati women spanning different generations cross their doorsteps ('Umbarro') and travel together to London on an unforgettable international tour, discovering inner strength, joy, and deep sisterhood.",
    poster: "/images/movies/umbarro.jpg",
    imdbRating: null,
    runtime: 132,
    featured: false,
    addedAt: "2026-11-02T11:35:00Z",
    sources: ["https://en.wikipedia.org/wiki/Umbarro"]
  }
];

async function main() {
  const destDir = path.join(process.cwd(), 'public', 'images', 'movies');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  let startId = 21;
  const fullList = [...existingGujarati];
  let downloadedCount = 0;
  let fallbackCount = 0;
  let existingCount = 20;

  for (const item of newMovies) {
    const movieRecord = {
      id: String(startId++),
      slug: item.slug,
      title: item.title,
      releaseYear: item.releaseYear,
      language: item.language,
      industry: item.industry,
      genres: item.genres,
      director: item.director,
      cast: item.cast,
      description: item.description,
      poster: `/images/movies/${item.slug}.jpg`,
      imdbRating: item.imdbRating ?? null,
      runtime: item.runtime,
      featured: item.featured ?? false,
      addedAt: new Date(Date.now() - (fullList.length * 3600000)).toISOString(),
      sources: item.wiki ? [`https://en.wikipedia.org/wiki/${item.wiki}`] : []
    };

    fullList.push(movieRecord);

    const localPosterPath = path.join(destDir, `${item.slug}.jpg`);
    if (fs.existsSync(localPosterPath) && fs.statSync(localPosterPath).size > 1500) {
      console.log(`[EXISTS] ${item.slug}.jpg`);
      existingCount++;
      continue;
    }

    // Attempt to download poster from Wikipedia
    let success = false;
    if (item.wiki) {
      try {
        await delay(1200);
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wiki)}`, {
          headers: { 'User-Agent': 'MoviezuiApp/2.0 (contact@moviezui.com)' }
        });
        if (res.ok) {
          const json = await res.json();
          const imgUrl = json.originalimage?.source || json.thumbnail?.source;
          if (imgUrl) {
            await delay(1200);
            const imgRes = await fetch(imgUrl, {
              headers: { 'User-Agent': 'MoviezuiApp/2.0 (contact@moviezui.com)' }
            });
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              fs.writeFileSync(localPosterPath, buf);
              console.log(`[DOWNLOADED] ${item.slug}.jpg (${buf.length} bytes)`);
              downloadedCount++;
              success = true;
            }
          }
        }
      } catch (e) {
        console.error(`[ERR] Failed Wikipedia download for ${item.slug}:`, e.message);
      }
    }

    if (!success) {
      console.log(`[FALLBACK] Sourcing placeholder for ${item.slug}.jpg`);
      const placeholder = path.join(destDir, 'placeholder.png');
      if (fs.existsSync(placeholder)) {
        fs.copyFileSync(placeholder, localPosterPath);
        fallbackCount++;
      }
    }
  }

  console.log(`\n===========================================`);
  console.log(`Total Movies in Catalogue: ${fullList.length}`);
  console.log(`Previously Existing Posters: ${existingCount}`);
  console.log(`Newly Downloaded Posters: ${downloadedCount}`);
  console.log(`Fallback Posters: ${fallbackCount}`);

  // Write src/data/movies.ts
  const moviesTsPath = path.join(process.cwd(), 'src', 'data', 'movies.ts');
  const tsContent = `// src/data/movies.ts
import type { Movie } from "../types/movie";

export const movies: Movie[] = ${JSON.stringify(fullList, null, 2)};
`;
  fs.writeFileSync(moviesTsPath, tsContent);
  console.log(`Successfully updated ${moviesTsPath}!`);
}

main();
