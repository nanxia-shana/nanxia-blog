export interface LyricLine {
  time: number;
  text?: string;
  translation?: string;
  isMeta?: boolean;
}

export const parseLyrics = (lrcContent: string, isBilingual: boolean) => {
  const lines = lrcContent.split('\n');
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
  const metaRegex = /\[(ti|ar|al|by|au):(.+)\]/i;

  const result: LyricLine[] = [];
  const validLyricLines: { time: number; text: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const metaMatch = line.match(metaRegex);
    if (metaMatch) {
      const metaKey = metaMatch[1].toLowerCase();
      const metaValue = metaMatch[2].trim();
      let metaLabel = '';
      switch (metaKey) {
        case 'ti': metaLabel = '歌曲'; break;
        case 'ar': metaLabel = '艺术家'; break;
        case 'al': metaLabel = '专辑'; break;
        case 'by': metaLabel = '歌词'; break;
        case 'au': metaLabel = '作曲'; break;
      }
      if (metaLabel && metaValue && !metaValue.includes('好听音乐网')) {
        result.push({ time: -999999 + result.length, text: `${metaLabel}: ${metaValue}`, isMeta: true });
      }
      continue;
    }

    const matches = [...line.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = line.replace(timeRegex, '');
      if (text && !text.startsWith('[') && !text.includes('好听音乐网')) {
        for (const match of matches) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const ms = parseInt(match[3].padEnd(3, '0'));
          const time = minutes * 60 + seconds + ms / 1000;
          validLyricLines.push({ time, text });
        }
      }
    }
  }

  if (isBilingual && validLyricLines.length > 0) {
    let i = 0;
    while (i < validLyricLines.length) {
      const originalLine = validLyricLines[i];
      if (i + 1 < validLyricLines.length) {
        const translationLine = validLyricLines[i + 1];
        result.push({
          time: originalLine.time,
          text: originalLine.text,
          translation: translationLine.text,
          isMeta: false
        });
        i += 2;
      } else {
        result.push({ time: originalLine.time, text: originalLine.text, isMeta: false });
        i += 1;
      }
    }
  } else {
    for (const line of validLyricLines) {
      result.push({ time: line.time, translation: line.text, isMeta: false });
    }
    result.sort((a, b) => a.time - b.time);
  }

  return result;
};
