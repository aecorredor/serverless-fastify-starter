import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const options = yargs(hideBin(process.argv))
  .option('ships', {
    type: 'number',
    demandOption: true,
  })
  .option('distance', {
    type: 'number',
    demandOption: true,
  })
  .parseSync();

if (options.ships > 3 && options.distance < 53.5) {
  console.log('Plunder more riffiwobbles!');
} else {
  console.log('Retreat from the xupptumblers!');
}
