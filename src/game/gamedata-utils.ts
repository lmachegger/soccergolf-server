import { Points } from './game-data';

export function createInitialPlayerPoints(numberOfHoles = 18): Points[] {
  const result = new Array();

  for (let i = 0; i < numberOfHoles; i++) {
    const name = (i + 1).toString();
    const score = 0;
    result.push({ name: name, score: score });
  }
  return result;
}
