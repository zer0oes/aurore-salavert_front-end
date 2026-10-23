/** Last project prefix that fills a three-column dense grid without gaps. */
export function completeGridPrefix(projects: ReadonlyArray<{ layout: unknown }>): number {
  const rows: boolean[][] = [];
  let completeCount = 0;
  projects.forEach((project, index) => {
    const width = project.layout === 'double-horizontal' ? 2 : 1;
    const height = project.layout === 'double-vertical' ? 2 : 1;
    let placed = false;
    for (let row = 0; !placed; row++) {
      for (let column = 0; column <= 3 - width; column++) {
        let fits = true;
        for (let y = row; y < row + height; y++) {
          for (let x = column; x < column + width; x++) {
            if (rows[y]?.[x]) fits = false;
          }
        }
        if (!fits) continue;
        for (let y = row; y < row + height; y++) {
          rows[y] ??= [false, false, false];
          for (let x = column; x < column + width; x++) rows[y][x] = true;
        }
        placed = true;
        break;
      }
    }
    if (rows.every(row => row.every(Boolean))) completeCount = index + 1;
  });
  return completeCount;
}

