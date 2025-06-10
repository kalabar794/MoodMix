import { test } from '@playwright/test'

test('Check tracks for all moods', async ({ page }) => {
  console.log('🔍 Checking tracks for all moods')
  
  await page.goto('https://mood-mix-theta.vercel.app/')
  await page.waitForLoadState('networkidle')
  
  const moods = ['Euphoric', 'Melancholic', 'Serene', 'Passionate']
  const popularTracks: Array<{track: string, artist: string}> = []
  
  for (const mood of moods) {
    console.log(`\n=== ${mood} ===`)
    
    const moodButton = page.locator(`button:has-text("${mood}")`).first()
    await moodButton.click()
    await page.waitForTimeout(8000)
    
    const trackCards = page.locator('.track-card')
    const count = await trackCards.count()
    
    // Check first 10 tracks
    for (let i = 0; i < Math.min(10, count); i++) {
      const trackCard = trackCards.nth(i)
      const trackName = await trackCard.locator('h3').first().textContent() || ''
      const artistName = await trackCard.locator('p').first().textContent() || ''
      
      // Look for popular artists
      const popularArtists = ['weeknd', 'swift', 'drake', 'bieber', 'grande', 'sheeran', 'eilish', 'dua lipa', 'styles', 'olivia', 'post malone', 'bruno mars', 'adele', 'coldplay', 'imagine dragons', 'maroon', 'rihanna', 'beyonce', 'jay-z', 'kanye', 'eminem', 'ed sheeran', 'lady gaga', 'katy perry', 'miley', 'selena', 'shawn mendes', 'charlie puth', 'camila', 'halsey', 'lizzo', 'doja cat', 'sza', 'travis scott', 'bad bunny', 'j balvin', 'ozuna', 'maluma', 'calvin harris', 'david guetta', 'marshmello', 'chainsmokers', 'diplo', 'skrillex', 'martin garrix', 'tiesto', 'avicii', 'swedish house', 'daft punk', 'gorillaz', 'twenty one pilots', 'panic', 'fall out boy', 'paramore', 'green day', '5sos', 'one direction', 'bts', 'blackpink', 'twice', 'seventeen', 'nct', 'stray kids', 'enhypen', 'txt', 'ateez', 'itzy', 'aespa', 'ive', 'newjeans', 'le sserafim', 'sam smith', 'lewis capaldi', 'niall horan', 'zayn', 'liam payne', 'louis tomlinson', 'demi lovato', 'nick jonas', 'joe jonas', 'kevin jonas', 'jonas brothers', 'dnce', 'haim', 'lorde', 'lana del rey', 'florence', 'sia', 'meghan trainor', 'bebe rexha', 'ava max', 'madison beer', 'tate mcrae', 'gracie abrams', 'conan gray', 'troye sivan', 'bazzi', 'lauv', 'jeremy zucker', 'chelsea cutler', 'quinn xcii', 'blackbear', 'machine gun kelly', 'yungblud', 'mod sun', 'iann dior', '24kgoldn', 'the kid laroi', 'juice wrld', 'xxxtentacion', 'lil peep', 'trippie redd', 'lil uzi vert', 'playboi carti', 'lil baby', 'gunna', 'young thug', 'future', 'metro boomin', '21 savage', 'migos', 'offset', 'quavo', 'takeoff', 'cardi b', 'megan thee stallion', 'doja cat', 'saweetie', 'city girls', 'latto', 'ice spice', 'nicki minaj', 'drake', 'j cole', 'kendrick', 'asap rocky', 'tyler', 'frank ocean', 'childish gambino', 'chance the rapper', 'mac miller', 'logic', 'g-eazy', 'macklemore', 'post malone', 'swae lee', 'french montana', 'wiz khalifa', 'tyga', 'chris brown', 'trey songz', 'bryson tiller', 'partynextdoor', '6lack', 'khalid', 'daniel caesar', 'giveon', 'brent faiyaz', 'summer walker', 'jhene aiko', 'kehlani', 'tinashe', 'normani', 'chloe', 'halle', 'fka twigs', 'jorja smith', 'ella mai', 'h.e.r.', 'ari lennox', 'snoh aalegra', 'alina baraz', 'sabrina claudio', 'kali uchis', 'sza', 'solange', 'janelle monae', 'lizzo', 'doja cat', 'megan thee stallion', 'cardi b', 'nicki minaj', 'beyonce', 'rihanna', 'ariana grande', 'taylor swift', 'olivia rodrigo', 'billie eilish', 'dua lipa', 'miley cyrus', 'selena gomez', 'camila cabello', 'shawn mendes', 'ed sheeran', 'justin bieber', 'the weeknd', 'bruno mars', 'post malone', 'drake', 'kanye west', 'jay-z', 'eminem', 'kendrick lamar', 'j cole', 'travis scott', 'asap rocky', 'tyler the creator', 'childish gambino', 'frank ocean', 'miguel', 'usher', 'chris brown', 'jason derulo', 'pitbull', 'flo rida', 'ne-yo', 'john legend', 'alicia keys', 'mariah carey', 'whitney houston', 'celine dion', 'adele', 'sam smith', 'ed sheeran', 'lewis capaldi', 'james arthur', 'rag n bone man', 'tom walker', 'george ezra', 'james bay', 'hozier', 'vance joy', 'passenger', 'kodaline', 'snow patrol', 'coldplay', 'u2', 'the killers', 'kings of leon', 'arctic monkeys', 'the 1975', 'the neighbourhood', 'imagine dragons', 'onerepublic', 'maroon 5', 'train', 'counting crows', 'matchbox twenty', 'goo goo dolls', 'lifehouse', '3 doors down', 'nickelback', 'daughtry', 'paramore', 'fall out boy', 'panic at the disco', 'my chemical romance', 'green day', 'blink-182', 'sum 41', 'good charlotte', 'simple plan', 'all time low', 'mayday parade', 'pierce the veil', 'sleeping with sirens', 'bring me the horizon', 'asking alexandria', 'of mice & men', 'a day to remember', 'the used', 'taking back sunday', 'brand new', 'thursday', 'silverstein', 'underoath', 'august burns red', 'the devil wears prada', 'we came as romans', 'crown the empire', 'issues', 'i see stars', 'dance gavin dance', 'emarosa', 'hands like houses', 'the amity affliction', 'beartooth', 'wage war', 'architects', 'while she sleeps', 'parkway drive', 'killswitch engage', 'as i lay dying', 'trivium', 'bullet for my valentine', 'avenged sevenfold', 'five finger death punch', 'disturbed', 'godsmack', 'three days grace', 'breaking benjamin', 'shinedown', 'seether', 'theory of a deadman', 'papa roach', 'skillet', 'thousand foot krutch', 'red', 'flyleaf', 'evanescence', 'halestorm', 'the pretty reckless', 'dorothy', 'new years day', 'in this moment', 'arch enemy', 'lacuna coil', 'nightwish', 'within temptation', 'epica', 'delain', 'amaranthe', 'babymetal', 'band-maid', 'lovebites', 'aldious', 'wagakki band', 'one ok rock', 'crossfaith', 'coldrain', 'crystal lake', 'dir en grey', 'the gazette', 'versailles', 'x japan', 'luna sea', 'larc en ciel', 'glay', 'b\\'z', 'mr children', 'southern all stars', 'dreams come true', 'hikaru utada', 'ayumi hamasaki', 'namie amuro', 'koda kumi', 'boa', 'tvxq', 'super junior', 'shinee', 'exo', 'nct', 'wayv', 'superm', 'bigbang', 'ikon', 'winner', 'treasure', 'stray kids', 'ateez', 'the boyz', 'enhypen', 'txt', 'seventeen', 'monsta x', 'got7', '2pm', 'infinite', 'vixx', 'b.a.p', 'block b', 'btob', 'sf9', 'astro', 'pentagon', 'golden child', 'onf', 'verivery', 'cravity', 'treasure', 'p1harmony', 'mirae', 'epex', 'omega x', 'tnt', 'drippin', 'e\\'last', 'kingdom', 'just b', 'luminous', 'nine.i', 'blank2y', 'tempest', 'tan', 'trendz', 'younite', 'xeed', 'atbo', 'nomad', '82major', 'nct dream', 'nct 127', 'wayv', 'bts', 'blackpink', 'twice', 'red velvet', 'itzy', 'aespa', 'stayc', 'ive', 'le sserafim', 'newjeans', 'nmixx', 'kep1er', 'billlie', 'purple kiss', 'weeekly', 'lightsum', 'cherry bullet', 'cignature', 'bugaboo', 'class:y', 'h1-key', 'mimiirose', 'yena', 'jo yuri', 'kwon eunbi', 'kim chaewon', 'miyawaki sakura', 'kang hyewon', 'choi yena', 'lee chaeyeon', 'kim minju', 'nako yabuki', 'honda hitomi', 'jo yuri', 'ahn yujin', 'jang wonyoung', 'kim sohye', 'yoo yeonjung', 'kim chungha', 'kim sejeong', 'jung chaeyeon', 'zhou jieqiong', 'kim doyeon', 'choi yoojung', 'kang mina']
      
      const artistLower = artistName.toLowerCase()
      const isPopular = popularArtists.some(pa => artistLower.includes(pa))
      
      if (isPopular) {
        console.log(`⭐ "${trackName}" by ${artistName}`)
        popularTracks.push({ track: trackName, artist: artistName })
      } else if (i < 5) {
        console.log(`   "${trackName}" by ${artistName}`)
      }
    }
    
    // Go back
    const changeMood = page.locator('button:has-text("Change Mood")')
    if (await changeMood.count() > 0) {
      await changeMood.click()
      await page.waitForTimeout(2000)
    }
  }
  
  console.log(`\n📊 Found ${popularTracks.length} tracks by popular artists`)
  console.log('\nPopular tracks to add to database:')
  popularTracks.forEach(t => {
    console.log(`- ${t.artist}: "${t.track}"`)
  })
})