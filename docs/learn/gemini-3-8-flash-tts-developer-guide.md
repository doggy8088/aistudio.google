# Gemini 3.8 Flash TTS：開發者指南

設計一個聲音，指導整場演出，再用我們全新的文字轉語音模型把音訊交付出去

![Geneviève Huskens](https://www.gstatic.com/aistudio-static/editorial/gemini-3-8-flash-tts-developer-guide/973fe0cb.png)

![fofr](https://www.gstatic.com/aistudio-static/editorial/directing-speech-gemini-3-8-flash-tts/95de99e9.webp)

**Gemini 3.8 Flash TTS**（`gemini-3.8-flash-tts`）與 **Gemini 3.8 Flash-Lite TTS**（`gemini-3.8-flash-lite-tts`）是我們在 Gemini API 中最新的文字轉語音模型。它們讓你用文字描述設計自訂聲音、逐句指導演出的呈現方式，並安排帶有重疊反應的逼真雙說話者對話。我們也新增了聲音複製的支援、將聲音庫從 30 個擴充到 2,000 多個，現在你還能透過提示詞加入笑聲、咳嗽與嘆息等逼真的對話質感。在本指南中，我們將介紹新模型的運作方式、與 `gemini-3.1-flash-tts-preview` 相比有哪些改變，並分享大量提示詞範例，示範如何駕馭聲音、情緒與時機。

## 我們的全新 TTS 模型說明

兩個模型使用完全相同的 API 結構與提示格式，因此只要更換模型字串就能互相切換。• **gemini-3.8-flash-tts——適合創意與錄音室工作**：專為錄音室等級的聲音品質與跨 **130 種語言**的豐富演技打造。它在 [Hume AI's Voice Design Benchmark](https://www.hume.ai/rw-voice-eq) 上以 71.4 分拿下整體第一，並在地區口音建模方面領先。適合細膩的情緒演出、自訂聲音設計、地區或少數方言、帶附和回應的雙說話者場景，或需要全程保持聲音穩定的長篇音訊生成。• **gemini-3.8-flash-lite-tts——快速且具成本效益**：我們的高輸送量主力，支援 **101 種語言**，也是我們建議從 `gemini-3.1-flash-tts-preview` 直接升級的選擇。它在 Hume AI 的整體品質指數中排名第二、僅次於 Flash TTS，而運作成本更低。適合即時語音代理、客服機器人、朗讀功能與大量配音。

## 將劇本與指導分開

如果你用過 `gemini-3.1-flash-tts-preview`，可能習慣在逐字稿正上方寫一大段「Audio Profile」和「Director's Notes」。這種做法雖然彈性十足，但把指示和對話放在同一個字串中有個缺點：只要提示詞稍有歧義，模型可能不小心把舞台指示唸出來（*"Say cheerfully: Hello!"*），或聲音在較長的段落中慢慢走樣。在 Gemini 3.8 TTS 中，text 欄位被嚴格視為逐字稿。你放進 text 的任何內容都會被唸出來，唯一的例外是 `<angle brackets>` 形式的行內聲音標籤，以及 `|pipes|` 形式的附和回應。與其把所有東西塞進逐字稿，不如把提示詞乾淨地拆成三個部分：**選角（voice）**：由誰來說話。你可以從 30 個錄音室聲音中挑選（例如 Puck、Kore 或 Algenib）、在我們的 Extended Voice Library 中搜尋 2,000 多個地區聲音、用一段 30 秒的片段複製聲音，或用文字提示詞透過 **Voice Design** 生成全新的聲音。**指導（speech_metadata.style）**：台詞如何呈現。你可以透過附加在每個回合上的獨立 style 欄位傳入情緒、節奏與語氣（例如「whispered urgently」或「bored and monotone」）。**台詞與標點（text）**：他們說的話，再加上用尖括號標在確切發生位置的即時非語言聲音，例如 `<sigh>`、`<laugh>`、`<breath>` 或 `<short pause>`。

## 從零設計聲音

**Voice Design**（`POST /v1beta/voices`，搭配 `type="prompted"`）讓你用白話英文描述一個聲音，並將它存成專案中可重複使用的 `voice_...` ID，不必在每次 API 呼叫時重送一長串角色描述。撰寫新聲音的提示詞時，重點應放在**說話者是誰**（年齡、音色、音高、地區口音與基本說話節奏），而不是一時的情緒。以下是幾個聲音設計提示詞範例，以及讓它們栩栩如生的示範台詞：

**反派女角——聲音設計提示詞**："厭世的貴族反派女角，咬字清晰俐落、如切割玻璃般銳利，低沉冰冷的音域，語調拖長"

**拍賣官——聲音設計提示詞**："一位 50 多歲的資深肯塔基鄉村拍賣官。敏捷、共鳴十足的鄉村腔男中音，咬字節奏快如閃電，音高彈性起伏，丹田發聲、聲量洪亮。"

**飛航管制——聲音設計提示詞**："一位 1969 年休士頓 NASA 飛航主任，40 多歲出頭。清晰、鋼鐵般的德州—中西部男中音，耳麥麥克風的中頻聚焦緊實，技術用語精準俐落，在極端壓力下依然鎮定自若。"

**1938 年新聞片播音員——聲音設計提示詞**："1930 年代大西洋中部口音的新聞片旁白員。洪亮、位置靠前的戲劇化男高音，r 音顫音清晰，措辭短促有力，帶有復古緞帶麥克風的中頻投射感。"

一般來說，我們建議先用空的 style 測試你的逐字稿。大多數請求完全不需要指導，因為 Gemini 3.8 TTS 會讀取標點、上下文與聲音本身的性格。當需要更強烈的情緒與變化時，將 `speech_metadata.style` 與行內 `<tags>` 結合，將徹底改變演出效果。我們以 Algenib 預建聲音（一個略帶沙啞的男聲）為例，給它完全相同的一句台詞，只改變 style 欄位與行內標籤：**基準——Style**：*（空白）*

設定 `speech_metadata.style` 後，模型會調整整句話的音高、能量與語調：

**狂喜——Style**："狂喜、喘不過氣的難以置信，帶著喜悅笑意的聲音"

**驚慌——Style**："驚慌、多疑的耳語，語速飛快"

**落敗——Style**："徹底落敗，平板單調，毫無能量"

**恐懼——Style**："極度恐懼，聲音顫抖，害怕地往後退"

## 以多段回合在場景中途切換語氣

由於 `speech_metadata` 是附加在輸入清單的每個部分上，你可以在句子中途改變呈現方式——例如從輕聲耳語轉為大聲喊叫，再回到正常音量——只要把台詞拆成同一位說話者連續的三個部分：

## 多段語氣轉換

**第 1 段**：*「壓低音量、充滿敬畏的野生動物紀錄片式耳語」*「我們必須完全一動不動……<breath>獅子離我們不到四英尺……」**第 2 段**：*「以最大音量驚慌大喊」*「<gasp>牠正朝我們衝過來！<argh>快上車!!!!」**第 3 段**：*「喘不過氣、驚魂未定」*<pant>我們從安全的車內觀察著……<throat-clearing>大自然收回了它的領地。

### 野生動物紀錄片語氣轉換示範

## 以聲音爆發、停頓與發音增添人味質感

行內尖括號標籤（`<...>`）會在你放置的確切字詞位置觸發非語言聲音。與塑造整個回合的 style 不同，行內標籤只發生一次就結束。

## 劇本中值得一試的常用 <tags>

• **呼吸**：`<breath>`、`<heavy breath>`、`<exhales>`、`<pant>`、`<sigh>` • **笑聲**：`<laugh>`、`<chuckle>`、`<giggle>`、`<snicker>`、`<cackle>` • **反應**：`<gasp>`、`<cough>`、`<sneeze>`、`<throat-clearing>`、`<snort>` • **聲音**：`<sob>`、`<cry>`、`<whimper>`、`<groan>`、`<yawn>` • **停頓**：`<short pause>`、`<long pause>`、`<tsk>`、`<argh>`

以下是行內標籤、大寫字母、標點（`...`）與 `/IPA/` 在實際劇本中如何搭配運作：

**ASMR——Style**："ASMR，輕聲耳語"

**喜劇救場——Style**："鎮定、正式的新聞主播，努力忍住不笑"

**以國際音標自訂發音** 如果劇本中包含棘手的專有名詞、奇幻名稱或技術縮寫，可以把該字詞替換成國際音標拼寫，或在其後加上以 /斜線/ 包起的國際音標（International Phonetic Alphabet）拼寫：

## 雙說話者對話與豎線附和回應

使用 `gemini-3.8-flash-tts`，你可以在單一 API 呼叫中安排雙說話者場景（`mode: "conversational"`）。兩個聲音保持鮮明區別、對彼此的節奏做出反應，並自然地交接回合。想讓音訊更引人入勝、更逼真，你可以加入**聽者附和回應**，不必把句子切成一小段一小段的回合。當你在說話者 A 的逐字稿中用豎線包起 1–3 個字（`|mhm|`、`|oh really?|`、`|wait|`、`|yeah|`）時，**說話者 B 會同時在背景說出那個反應**，而說話者 A 繼續說話。

## 範例場景：「The Heist」

**回合 1：Maya**（聲音：`Aoede` · *「陰謀感十足、說故事風格的 podcast 主持人」*）「所以保全在午夜巡查藝廊的時候 |嗯哼| 那幅畫還好端端地掛在牆上。」**回合 2：Liam**（聲音：`Puck` · *「好奇地湊近」*）「等等，所以動作警報從頭到尾都沒響過？|一次也沒有| 那他們到底是怎麼把畫弄出大樓的？」**回合 3：Maya**（聲音：`Aoede` · *「覺得好笑，鋪陳揭曉時刻」*）「<chuckle>他們才不是趁夜裡偷偷運出去的。|等等，什麼？|他們在早上九點穿上維修連身工作服 |不會吧| 就這樣大搖大擺地從正門抬了出去。」

### 雙說話者對話：The Heist

你甚至可以在同一句台詞中使用多個豎線區塊，讓兩位說話者互相插話，或齊聲倒數：「好，數到三 |準備好了| 一、二、三—— |生日快樂！| 生日快樂！」

### 重疊附和回應：「Happy Birthday!」

## 開始打造

準備好在自己的應用程式中試試這些聲音了嗎？你可以在 [Google AI Studio Speech Playground](https://aistudio.google.com/generate-speech?model=gemini-3.8-flash-tts) 中互動式地設計自訂聲音並測試多說話者劇本，或前往[語音生成開發者指南](https://ai.google.dev/gemini-api/docs/speech-generation)查看完整的程式碼範例，以及 [Voice Design](https://ai.google.dev/gemini-api/docs/voice-design) 和 [Voice Replication](https://ai.google.dev/gemini-api/docs/voice-replication) 的專屬指南。如果你要將現有應用程式從 `gemini-3.1-flash-tts-preview` 升級，請查看[遷移指南](https://ai.google.dev/gemini-api/docs/speech-generation#migration)，其中有更新請求的逐步說明：
