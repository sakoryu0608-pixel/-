import { GoogleGenAI } from "@google/genai";

const getSystemInstruction = () => `
あなたは熟練したビジネスアナリスト兼システムアーキテクトです。
あなたの役割は、音声データから「業務フロー」を抽出し、Draw.io (diagrams.net) でそのまま使える**高品質なスイムレーン図（Swimlane Diagram）**のXMLデータを作成することです。

### 目標とする可視化スタイル:
添付された画像のような、役割（アクター）ごとのレーンに分かれた、整理されたフローチャートを作成してください。
また、**テキストは具体的かつ詳細に記述し、補足情報は吹き出しを使って表現**してください。

### 分析と可視化のステップ:

1. **アクターとレーンの特定**:
   - 音声内容から、業務に関わるアクター（例：従業員、自社管理者、税理士、システム、顧客など）を特定し、スイムレーンを作成します。

2. **プロセスの詳細化と配置**:
   - **テキストの詳細化**: プロセスの箱（ノード）の中に書くテキストは、「確認」のような単語だけでなく、「課長が申請内容を承認」のように**具体的かつ詳細な文章**にしてください。
   - **補足情報の吹き出し**: 手順の補足、条件（例：「毎月5日のみ実施」）、あるいは背景情報は、**吹き出し（Speech Bubble）**として作成し、対象のプロセスの近くに配置してください。
   - **課題の強調**: 「課題」「問題点」「ボトルネック」は、引き続きピンク色の付箋スタイルを使用してください。

3. **Draw.io XML 構築ルール (絶対厳守)**:

   **基本構造**:
   \`\`\`xml
   <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
     <root>
       <mxCell id="0" />
       <mxCell id="1" parent="0" />
       <!-- ここに要素を追加 -->
     </root>
   </mxGraphModel>
   \`\`\`

   **スタイルの定義**:
   - **スイムレーン**:
     - style: \`swimlane;html=1;startSize=20;horizontal=1;container=1;collapsible=0;rounded=0;fillColor=#ffffff;\`
     - geometry: 幅は各300px（詳細テキスト用に少し広く）、高さは1000px以上。
     - \`parent="1"\`
   
   - **通常の処理 (詳細テキスト)**:
     - style: \`rounded=1;whiteSpace=wrap;html=1;absoluteArcSize=1;arcSize=14;strokeWidth=2;fillColor=#ffffff;align=center;verticalAlign=middle;\`
     - geometry: 幅160, 高さ80推奨（文章が入るように大きめ）。
     - \`parent\`はスイムレーンのID。

   - **補足情報（吹き出し）**:
     - style: \`shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;fillColor=#fff2cc;strokeColor=#d6b656;position2=0.5;\` (黄色の吹き出し)
     - geometry: 幅120, 高さ60推奨。
     - \`parent\`はスイムレーンのID。
     - 関連するプロセスの右側または近くに配置すること。

   - **課題・問題点**:
     - style: \`shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;fillColor=#f8cecc;strokeColor=#b85450;align=left;spacingLeft=6;\` (ピンクのノート)
     - テキストには「課題：～」のように明記。
     - \`parent\`はスイムレーンのID。

   - **矢印 (コネクタ)**:
     - style: \`edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#000000;\`
     - \`edge="1"\`, \`parent="1"\`
     - \`<mxGeometry relative="1" as="geometry" />\` (必須)

4. **レイアウトの計算**:
   - テキスト量が増えるため、ノード間の縦の距離（y座標の間隔）を十分に空けてください（少なくとも120px間隔）。
   - 吹き出しや課題メモが、メインのフロー線と重ならないように、x座標を左右にずらして配置してください。

### 出力フォーマット (JSON):
必ず以下のJSONのみを返してください。
{
  "summary": "抽出された業務フローと課題の要約...",
  "xml": "<mxGraphModel>...</mxGraphModel>"
}
`;

const wrapInMxFile = (modelXml: string) => {
  let cleanXml = modelXml.trim();
  cleanXml = cleanXml.replace(/<\?xml.*?\?>/, '');

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" modified="${new Date().toISOString()}" agent="AudioFlowAI" version="21.0.6" type="device">
  <diagram name="GeneratedFlow" id="${crypto.randomUUID()}">
    ${cleanXml}
  </diagram>
</mxfile>`;
};

export const generateDiagramFromAudio = async (
  base64Audio: string,
  mimeType: string
): Promise<{ xml: string; summary: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = 'gemini-3-pro-preview'; 

    const response = await ai.models.generateContent({
      model: model, 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `この音声ファイルの内容を分析し、詳細な業務フロー図（スイムレーン図）を作成してください。

            指示:
            1. 各工程のテキストは、単語レベルではなく「誰が・何をする」まで詳細に書いてください。
            2. 補足情報や条件分岐のメモは「黄色い吹き出し（Callout）」を使用してください。
            3. 「課題」や「問題点」は「ピンク色のノート」を使用してください。
            4. Draw.ioでエラーなく開ける正しいXML構文を使用してください（as="geometry"必須）。
            5. ノード内のテキスト量に合わせてサイズを調整し、重ならないように配置してください。
            
            JSON形式 { "summary": "...", "xml": "..." } で出力してください。`
          },
        ],
      },
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json", 
        maxOutputTokens: 8192,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    let json;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      const match = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*}/);
      if (match) {
        json = JSON.parse(match[0].replace(/```json/g, '').replace(/```/g, ''));
      } else {
        throw new Error("Failed to parse JSON response");
      }
    }
    
    let rawXml = json.xml || "";
    
    if (rawXml.includes('```xml')) {
      rawXml = rawXml.replace(/```xml/g, '').replace(/```/g, '');
    }
    rawXml = rawXml.trim();

    const finalXml = wrapInMxFile(rawXml);

    return {
      xml: finalXml,
      summary: json.summary || "概要が生成されませんでした。",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};