// https://www.kaggle.com/muhadel/hobbies/version/1
const interests = ["typing", "computers", "action figures", "adventure park", "aerobics", "air hockey", "aircraft", "all-terrain vehicles", "alternate reality games", "alternative", "geology", "meteorology", "amusement park", "animals", "animal care", "antiques", "antiquing", "antiquities", "aquariums", "arcade games", "archaeology", "archery/crossbow", "architecture", "aromatherapy", "art activities", "art and crafts", "art/antique collecting", "arts and crafts", "arts/cultural", "artwork", "astrology", "audiophilia", "australian football league", "auto audiophilia", "autographs", "automotive work/repair", "bmx tricks", "back packing", "backgamon", "backpacking", "badge collecting", "baking", "ballet", "ballet dancing", "ballooning", "scuba", "scuba diving", "sculpture", "seaglass collecting", "seashell collecting", "seashells", "self-improvement", "self-improvement courses", "service", "sewing", "shoes", "shooting guns", "shooting sport", "shopping for latest trends", "shortwave listening", "show choir", "sightseeing", "singing", "singing lessons", "singing games", "singing/composing music", "skate boarding", "skateboarding", "in-line skating", "skiing", "skill games", "playing soccer", "free diving", "diving", "skincare regime", "skydiving", "skydiving / parachuting", "skype", "skyrunning", "sledding", "slot car racing", "snake", "snooker", "snorkeling", "snow biking", "snow skiing", "snowmobile riding", "snowmobiles", "snowmobiling", "snowshoeing", "soap box derby", "soccer", "social", "social networking", "soft rock", "softball", "space exploration", "speed skating", "spider", "spinning", "sport fishing", "sporting dog field trials", "sporting interests", "sports cards", "sports memorabilia", "sports on tv", "squash", "stained glass", "stamp collecting", "stamps", "stargazing", "stereo/records/tapes/cds", "stereo/records", "stocks/bonds", "street racing", "street games", "sudoku puzzles", "sunbathing", "surfing", "survey date", "sweepstakes", "sweepstakes/contests", "table football", "tabletop games", "tango dance", "target shooting", "tarot", "tarot card reading", "taxidermy", "team games", "telescopes", "ten pin bowling", "theater sports", "theater/performing arts", "theatre", "first person shooter games", "thriller/suspense", "tie dying", "tile-based games", "timeshare", "touch football", "toys", "track &amp", "train spotting", "trap/clays/skeet", "travel", "travel games", "traveling", "traveling and exploration", "treasure hunting", "tree climbing", "trekkie", "trekking", "turtle", "tutoring", "types of recreation", "us travel", "urban exploration", "vacation cruises", "vacations / traveling", "vehicle restoration", "veterans", "video/dvd", "videophilia", "vintage books", "vintage car", "vintage clothing", "vitamin supplements", "volleyball", "volunteering", "walking and hiking", "walking", "wall art", "want further mailings", "wargames", "warships", "watching sports", "watching tv", "water polo", "water skiing", "watercolor paintings", "weather forecasting", "weaving", "websites", "weight training", "weightlifting", "white water rafting", "whitewater rafting", "wildlife safari", "wildlife/environment", "wind surfing", "wind surfing kayaking", "wine appreciation", "wine making", "wine tasting", "wines", "wingsuit flying", "wood working", "word games", "world news or politics", "worship team", "yachting", "yoga", "youth band", "youth group", "zumba", "cooperative games", "courses", "deck building games", "insects", "leaves", "magician", "angling/fly fishing", "real time games", "rocks", "strategy games", "thematic games", "acting", "aeromodeling", "air sports", "airbrushing", "aircraft spotting", "airsoft", "radio", "american football", "animal fancy", "pets", "aqua-lung", "aquarium", "art collecting", "arts", "association football", "astronomy", "australian rules football", "auto racing", "backgammon", "badminton", "base jumping", "baseball", "basketball", "baton twirling", "beach volleyball", "beach/sun tanning", "beachcombing", "beadwork", "beatboxing", "becoming a child advocate", "beekeeping", "bell ringing", "belly dancing", "bicycle polo", "bicycling", "billiards", "bird watching", "birding", "birdwatching", "blacksmithing", "blogging", "bmx", "board games", "board sports", "boardgames", "boating", "body building", "bodybuilding", "bonsai tree", "book collecting", "bookbinding", "boomerangs", "bowling", "boxing", "brazilian jiu-jitsu", "breakdancing", "brewing beer", "bridge", "bridge building", "building houses", "building dollhouses", "bus spotting", "butterfly watching", "button collecting", "cake decorating", "calligraphy", "camping", "candle making", "canoeing", "car racing", "card collecting", "cartooning", "casino gambling", "cave diving", "ceramics", "cheerleading", "chess", "church/church activities", "cigar smoking", "climbing", "cloud watching", "coin collecting", "collecting", "collecting antiques", "collecting artwork", "collecting hats", "collecting music albums", "collecting rpm records", "collecting sports cards", "collecting swords", "color guard", "coloring", "comic book collecting", "compose music", "computer activities", "computer programming", "conworlding", "cooking", "cosplay", "cosplaying", "couponing", "crafts", "creative writing", "cricket", "crochet", "crocheting", "cross-stitch", "crossword puzzles", "cryptography", "curling", "cycling", "dance", "dancing", "darts", "debate", "deltiology", "postcard collecting", "diecast collectibles", "digital arts", "digital photography", "disc golf", "do it yourself", "dodgeball", "dog sport", "dolls", "dominoes", "dowsing", "drama", "drawing", "driving", "dumpster diving", "eating out", "educational courses", "electronics", "element collecting", "embroidery", "entertaining", "equestrianism", "exercise", "exhibition drill", "falconry", "fast cars", "felting", "fencing", "field hockey", "figure skating", "fire poi", "fashion design", "fishing", "fishkeeping", "flag football", "floorball", "floral arrangements", "flower arranging", "flower collecting", "fly tying", "flying", "footbag", "football", "foraging", "language learning", "fossil hunting", "four wheeling", "freshwater aquariums", "frisbee golf", "gambling", "games", "gaming", "garage saleing", "gardening", "genealogy", "geocaching", "ghost hunting", "glassblowing", "glowsticking", "gnoming", "go", "go kart racing", "going to movies", "golf", "golfing", "gongoozling", "graffiti", "grip strength", "guitar", "gun collecting", "gunsmithing", "gymnastics", "gyotaku", "handball", "handwriting analysis", "hang gliding", "herping", "hiking", "home brewing", "home repair", "home theater", "homebrewing", "hooping", "horse riding", "hot air ballooning", "hula hooping", "hunting", "ice hockey", "ice skating", "iceskating", "illusion", "impersonations", "inline skating", "insect collecting", "internet", "inventing", "jet engines", "jewelry making", "jigsaw puzzles", "jogging", "judo", "juggling", "jukskei", "jump roping", "kabaddi", "kart racing", "kayaking", "keep a journal", "kitchen chemistry", "kite boarding", "kite flying", "kites", "kite surfing", "knapping", "knife making", "knife throwing", "knitting", "knotting", "lacemaking", "lacrosse", "lapidary", "larping", "laser tag", "lasers", "lawn darts", "learn to play poker", "learning an instrument", "learning to pilot a plane", "leather crafting", "leathercrafting", "lego building", "legos", "letterboxing", "listening to music", "locksport", "machining", "macramé", "macrame", "magic", "mahjong", "making model cars", "marbles", "marksmanship", "martial arts", "matchstick modeling", "meditation", "metal detecting", "meteorology", "microscopy", "mineral collecting", "model aircraft", "model building", "model railroading", "model rockets", "modeling ships", "models", "3d modeling", "motor sports", "motorcycles", "mountain biking", "mountain climbing", "mountaineering", "movie collecting", "mushroom hunting/mycology", "musical instruments", "nail art", "needlepoint", "netball", "nordic skating", "orienteering", "origami", "owning an antique car", "paintball", "painting", "papermache", "papermaking", "parachuting", "paragliding", "parkour", "people watching", "photography", "piano", "pigeon racing", "pinochle", "pipe smoking", "planking", "playing music", "playing musical instruments", "playing team sports", "poker", "pole dancing", "polo", "pottery", "powerboking", "protesting", "puppetry", "puzzles", "pyrotechnics", "quilting", "r/c boats", "r/c cars", "r/c helicopters", "r/c planes", "racing pigeons", "racquetball", "radio-controlled car racing", "rafting", "railfans", "rappelling", "rapping", "reading", "reading to the elderly", "record collecting", "relaxing", "renaissance faire", "renting movies", "rescuing animals", "robotics", "rock balancing", "rock climbing", "rock collecting", "rockets", "rocking aids babies", "roleplaying", "roller derby", "roller skating", "rugby", "rugby league football", "running", "sailing", "saltwater aquariums", "sand art", "sand castles", "scrapbooking", "sculpting", "sea glass collecting", "self defense", "shark fishing", "shooting", "shopping", "singing in choir", "skeet shooting", "sketching", "skimboarding", "sky diving", "skydiving", "slack lining", "slacklining", "sleeping", "slingshots", "snowboarding", "soap making", "soapmaking", "socializing", "speed cubing", "spelunkering", "sports", "stand-up comedy", "stone collecting", "stone skipping", "storm chasing", "storytelling", "string figures", "sudoku", "surf fishing", "survival", "swimming", "table tennis", "taekwondo", "tai chi", "tatting", "tea tasting", "tennis", "tesla coils", "tetris", "textiles", "tombstone rubbing", "tool collecting", "tour skating", "toy collecting", "train collecting", "trainspotting", "triathlon", "tutoring children", "tv watching", "ultimate frisbee", "video game collecting", "video games", "vintage cars", "violin", "volunteer", "warhammer", "watching movies", "watching sporting events", "water sports", "weather watcher", "web surfing", "wood carving", "woodworking", "working in a food pantry", "working on cars", "world record breaking", "worldbuilding", "wrestling", "writing music", "yo-yoing", "ziplining"];

export const capitalizeSentence = (sentence: string) => {
  const words = sentence.split(' ');
  const capitalized = words.map((word: string) => {
    const capitalizedFirstChar = word.charAt(0).toUpperCase();
    return capitalizedFirstChar + word.slice(1, word.length);
  });

  return capitalized.join(' ');
}

export const queryInterests = (interest: string): Array<{ name: string, weight: number }> => {
  const relatedInterests: Array<{ name: string, weight: number }> = [];

  // Start by looking for matching words
  const words = interest.split(/ |-|'/g); 
  interests.forEach(relatedInterest => {
    const relatedWords = relatedInterest.split(/ |-|'/g);

    words.forEach(word => {
      if (relatedWords.includes(word)) {
        if (relatedInterests.find(i => i.name === relatedInterest)) {
          const relatedInterestIndex = relatedInterests.findIndex(obj => obj.name === relatedInterest);
          relatedInterests[relatedInterestIndex].weight += 0.9;
        } else relatedInterests.push({ name: relatedInterest, weight: 0.9 });
      }
    });
  });

  // Look for matching consonant assortments in words 
  const consonantWeightStrength = 0.1;
  const interestConsonants = Array.from(interest.replace(/a|e|i|o|u/g, ""))
    .filter(c => c != " ")
    .map(c => c.toLowerCase());
  interests.forEach(relatedInterest => {
    const relatedConsonants = Array.from(relatedInterest.replace(/a|e|i|o|u/g, ""))
      .filter(c => c != " ")
      .map(c => c.toLowerCase());

    const matchingConsonants = interestConsonants.filter(consonant => {
        return relatedConsonants.includes(consonant);
    });

    const removedDuplicates = Array.from(new Set(matchingConsonants));
    removedDuplicates.forEach(_ => {
        if (relatedInterests.find(i => i.name === relatedInterest)) {
            const relatedInterestIndex = relatedInterests.findIndex(obj => obj.name === relatedInterest);
            relatedInterests[relatedInterestIndex].weight += consonantWeightStrength;
        } else relatedInterests.push({ name: relatedInterest, weight: consonantWeightStrength });
    });

  });

  // Sort queried results based on weight
  const sortedEntries = relatedInterests.sort((a, b) => {
    return a.weight > b.weight ? 1 : 0;
  });

  return sortedEntries;
}

export const queryLimitedInterests = (interest: string): Array<string> => {
  const queriedInterests = queryInterests(interest);
  const minWeight = 0.5;

  const filtered = queriedInterests.filter(queriedInterest => queriedInterest.weight > minWeight);
  return filtered.map(queriedInterest => capitalizeSentence(queriedInterest.name));
}