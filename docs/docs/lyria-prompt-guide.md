# Lyria 提示詞指南

Gemini API 提供兩種使用 Lyria 產生音樂的方式：

* **Lyria 3.5 & Lyria 3 Clip**：非串流產生方式，可產生 30 秒短片，或附歌詞與人聲的完整歌曲。請參閱[使用 Lyria 3.5 產生音樂](/docs/music-generation/)。
* **Lyria RealTime**：透過 WebSockets 進行即時、互動式的音樂串流與即時操控。請參閱[使用 Lyria RealTime 即時產生音樂](/docs/realtime-music-generation/)。

這兩個模型都能理解描述性文字提示詞、音樂術語與結構指示。本指南說明如何為批次產生與即時操控撰寫有效的提示詞。

## 提示詞基礎 {#prompt-fundamentals}

提示詞可以是一句簡短的描述：

```none
A folk song about cute cats avoiding puddles, female vocals, acoustic guitar, sound of rain
```

也可以是結構化且細緻的說明：

```none
A 1980s-style synth-pop track with a driving beat, shimmering synthesizers, and a catchy, anthemic chorus. The song should have a retro-futuristic feel with modern production polish. Upbeat tempo around 120 BPM, clear verse-chorus structure, and a memorable instrumental hook. The lyrics describe getting ready for a party.
```

無論簡短或詳盡的提示詞，都能產生出色的成果。你可以運用以下策略，引導模型產出心中理想的聲音。

## 曲風與風格 {#genre-and-style}

在提示詞開頭先寫明主要曲風。你也可以混搭不同曲風，創造獨特的融合風格：

* 金屬樂與嘻哈的融合
* 死亡金屬結合歌劇式人聲
* 古典室內樂加入黑暗電子嗡鳴元素
* 現代電子舞曲（EDM）混合 Europop

你也可以指定音樂年代或地區變體：

* 1990 年代早期的 boom-bap 嘻哈
* 1960 年代法國 yé-yé 流行樂
* 1980 年代後龐克與新浪潮
* 2000 年代主流 R&B
* 柏林極簡 techno 或灣區 hyphy

### 曲風關鍵字 {#genre-keywords}

在 Lyria 3.5 與 Lyria RealTime 的提示詞中，可使用以下公認的曲風詞彙：

* **Electronic & Dance**：`Acid House, Breakbeat, Chillout, Chiptune, Deep House, Drum & Bass, Dubstep, EDM, Electro Swing, Glitch Hop, Hyperpop, Minimal Techno, Moombahton, Psytrance, Synthpop, Techno, Trance, Trip Hop, Vaporwave`
* **Hip-Hop & R&B**：`808 Hip Hop, Boom-Bap, Contemporary R&B, G-funk, Grime, Lo-Fi Hip Hop, Neo-Soul, New Jack Swing, Trap Beat`
* **Rock & Alternative**：`Alternative Country, Blues Rock, Classic Rock, Funk Metal, Garage Rock, Indie Folk, Indie Pop, Post-Punk, 60s Psychedelic Rock, Shoegaze, Surf Rock`
* **Jazz, Soul & Funk**：`Acid Jazz, Afrobeat, Bossa Nova, Disco Funk, Funk, Jazz Fusion, Latin Jazz`
* **Folk & Traditional**：`Bengal Baul, Bhangra, Bluegrass, Celtic Folk, Cumbia, Indian Classical, Irish Folk, Merengue, Polka, Reggae, Reggaeton, Renaissance Music, Salsa`
* **Classical & Acoustic**：`Baroque, Orchestral Score, Piano Ballad`

## 樂器與音色質感 {#instruments-and-textures}

Lyria 會依你指定的曲風自動選用合適的樂器編制。若你想要特定樂器或不尋常的組合，請在提示詞中明確寫出：

```none
A dance track with a driving beat, shimmering synthesizers, and a catchy, anthemic chorus. A saxophone solo enters during the bridge.
```

進一步描述樂器的音色與彼此的互動方式，有助於營造情緒與質感：

* 扭曲的 303 貝斯線條，穿透清脆緊實的 hi-hat
* 溫暖的類比合成器鋪底，在乾淨親密的木吉他之下緩緩湧動
* 由多層 fuzz 吉他堆疊而成的音牆，搭配遙遠且浸透殘響的人聲

### 樂器關鍵字 {#instrument-keywords}

* **Keyboards & Synths**：`Buchla Synths, Clavichord, Dirty Synths, Harpsichord, Mellotron, Moog Oscillations, Ragtime Piano, Rhodes Piano, Smooth Pianos, Spacey Synths, Synth Pads`
* **Bass & Drums**：`303 Acid Bass, 808 Hip Hop Beat, Boomy Bass, Conga Drums, Drumline, Funk Drums, Precision Bass, Tabla, TR-909 Drum Machine`
* **Guitars & Strings**：`Banjo, Balalaika, Bouzouki, Cello, Charango, Dulcimer, Fiddle, Flamenco Guitar, Guitar, Harp, Koto, Lyre, Mandolin, Pipa, Shamisen, Shredding Guitar, Sitar, Slide Guitar, Viola Ensemble, Warm Acoustic Guitar`
* **Wind & Brass**：`Alto Saxophone, Bagpipes, Bass Clarinet, Didgeridoo, Harmonica, Ocarina, Trumpet, Tuba, Woodwinds`
* **Percussion**：`Bongos, Djembe, Glockenspiel, Hang Drum, Kalimba, Maracas, Marimba, Mbira, Steel Drum, Vibraphone`

## 歌曲結構與時序 {#structure-and-timing}

使用 Lyria 3.5 時，可用標籤或箭頭定義歌曲的進行方式：

* `[Intro] -> [Verse 1] -> [Chorus] -> [Verse 2] -> [Chorus] -> [Bridge] -> [Outro]`
* 以安靜的鋼琴前奏開場，逐漸推升為充滿活力的主歌，短暫停頓留白後，再爆發進入副歌。

你也可以指示能量的動態與段落轉換：

* 在導歌段逐步累積張力，進入爆發式副歌前先驟然歸於寂靜
* 全曲漸強，每個段落加入一種新樂器
* 在橋段之後突然停止，接著以清唱方式呈現副歌

你也可以在提示詞中指定明確的時間標記：

* 在 12 秒處推升至 beat drop
* 人聲取樣每 4 小節重複一次
* 副歌在 22 秒處進入

## 歌詞與人聲 {#lyrics-and-vocals}

Lyria 3.5 預設會產生附歌詞的人聲曲目。你可以提供自己的歌詞、請模型代為創作，或指定產生純器樂曲目。

### 使用自己的歌詞 {#own-lyrics}

將歌詞直接寫入提示詞，並置於 `Lyrics:` 標題之下。為每個段落加上標籤，以引導人聲的呈現方式：

```none
Lyrics:

[Intro]
Ooooh, yeah

[Verse 1]
Early morning rain on the window pane
City lights wash away the pain
Walking down this empty street again

[Chorus]
We keep moving on (moving on)
Until the morning light
Everything will be alright
```

使用括號標示和聲、回聲或即興襯詞，例如 `(moving on)`。

### 指示模型產生歌詞 {#generated-lyrics}

請 Lyria 3.5 撰寫歌詞時，請概略說明故事、情緒或關鍵詞句：

```none
The lyrics describe driving down the Pacific Coast Highway at sunset. The mood is nostalgic and reflective. Include an uplifting, anthemic chorus about second chances and starting over.
```

若是電子與舞曲曲風，可要求簡短且重複的人聲 hook：

```none
An upbeat dance-pop track with a repetitive, high-energy vocal hook: "Feel the rhythm all night long."
```

### 人聲呈現與歌手形象 {#vocal-delivery}

指定性別、音域與音色，以精準控制呈現效果：

* **Female Soprano**：音色清澈晶瑩，演唱靈活且高亢飛揚。明亮的音色能呈現輕盈、帶氣聲的質感。
* **Female Alto**：低音域豐厚、溫暖且略帶沙啞。煙燻般的音色，搭配深情而共鳴充沛的胸聲。
* **Male Tenor**：明亮、穿透力強且充滿活力。年輕的音色具備強大的高音 belt 能力，能穿透厚重的混音。
* **Male Baritone**：深沉如絲絨般滑順的胸聲，演唱溫暖撫慰、娓娓動人。
* **Weathered Rocker**：沙啞粗礪的音色，讓人聯想到 1990 年代另類搖滾。情感強烈而原始，高音帶有緊繃感。

### 非歌詞式人聲效果 {#vocal-effects}

你也可以在提示詞中加入口白對話、人聲切片與取樣效果：

* 復古廣播節目主持人的聲音在節拍進入前介紹歌曲
* 口白人聲在 drop 之前低語，隨後接上高能量的合成器
* 經切片與變調處理的人聲取樣反覆播放，作為器樂節奏元素

## 音樂參數 {#musical-parameters}

運用標準音樂屬性，進一步打磨提示詞：

* **Tempo (BPM)**：直接設定速度（例如 `120 BPM`、`slow tempo around 72 BPM`、`fast 160 BPM`）。
* **Key and Scale**：指定主音調性與調式（例如 `in G major`、`in D minor`、`in C pentatonic`）。
* **Mood and Atmosphere**：使用描繪情緒的形容詞：
  `Ambient, Bright, Chill, Dark, Dreamy, Emotional, Ethereal, Euphoric, Funky, Groovy, Melancholic, Nostalgic, Ominous, Psychedelic, Relaxed, Soulful, Triumphant, Upbeat, Whimsical`

## 為 Lyria RealTime 撰寫提示詞 {#realtime-prompting}

Lyria RealTime 採用**加權提示詞**，而非單一完整的提示詞字串。這種方式讓你能動態混搭多種音樂影響，並透過 WebSocket 連線持續操控音樂。

### 加權提示詞結構 {#weighted-prompts}

每個加權提示詞由一段描述性文字與一個浮點數權重組成：

```python
prompts = [
    types.WeightedPrompt(text="minimal techno", weight=1.0),
    types.WeightedPrompt(text="deep sub bass", weight=0.6),
    types.WeightedPrompt(text="shimmering hi-hats", weight=0.4),
]
```

### 即時操控策略 {#steering-strategies}

* **混搭曲風**：為不同風格分配均衡的權重來加以融合：
  * `ambient synth pads (weight: 0.8)` + `lo-fi hip-hop drums (weight: 0.6)`
  * `flamenco guitar (weight: 0.7)` + `deep house groove (weight: 0.5)`

* **動態轉換**：若要讓音樂平順轉換，請隨時間調整提示詞權重：
  1. 先以 `chill jazz piano (weight: 1.0)` 開始。
  2. 逐漸加入 `electronic breakbeat (weight: 0.3)`。
  3. 將 `electronic breakbeat` 提高至 `0.8`，同時把 `chill jazz piano` 降至 `0.3`。

* **分層堆疊元素**：將樂器標籤與情緒標籤分開，以便獨立調整：
  * Prompt 1：`bossa nova guitar (weight: 0.9)`
  * Prompt 2：`warm acoustic bass (weight: 0.7)`
  * Prompt 3：`subtle vinyl crackle (weight: 0.3)`


## 提示詞範例 {#example-prompts}

### Lyria 3.5 範例

* **Lo-Fi Study Beat**：
  ```none
  A 30-second lofi hip hop beat with dusty vinyl crackle, mellow Rhodes piano chords, a relaxed boom-bap drum groove at 82 BPM, and a warm upright bassline. Instrumental only.
  ```

  * **Pop Anthem**：
  ```none
  An upbeat, feel-good indie-pop song in G major at 122 BPM. Bright acoustic guitar strumming, driving kick drum, handclaps, and warm female vocal harmonies. The lyrics describe an unforgettable summer road trip with friends.
  ```

* **Cinematic Cyberpunk**：
  ```none
  Dark, cinematic cyberpunk synthwave at 110 BPM in D minor. Heavy distorted bass, ominous arpeggiated analog synthesizers, distant metallic percussion, and an ethereal female vocalise swelling during the climax.
  ```


### Lyria RealTime 操控組合

  ```python
  # Initial high-energy groove
  await session.set_weighted_prompts(
    prompts=[
        types.WeightedPrompt(text="techno groove", weight=1.0),
        types.WeightedPrompt(text="acid 303 bass", weight=0.8),
    ]
  )

  # Transition to a melodic breakdown
  await session.set_weighted_prompts(
    prompts=[
        types.WeightedPrompt(text="ambient synth pads", weight=1.0),
        types.WeightedPrompt(text="subtle reverberant piano", weight=0.7),
        types.WeightedPrompt(text="techno groove", weight=0.2),
    ]
  )
  ```

## 後續步驟 {#whats-next}

* [使用 Lyria 3.5 產生音樂](/docs/music-generation/)：使用 Interactions API 產生完整歌曲與 30 秒短片。
* [使用 Lyria RealTime 即時產生音樂](/docs/realtime-music-generation/)：透過 WebSockets 打造即時、互動式的音樂串流應用程式。
