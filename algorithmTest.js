const first = 'sports,cars,games,tv,books';
const second = 'cars,games,movies,travel';

const bob = first.split(',');
const dave = second.split(',');

console.log(bob);
console.log(dave);

let count = 0;
let list = [];
for (let i = 0; i < bob.length; i++) {
	for (let j = 0; j < dave.length; j++) {
        if (bob[i] === dave[j]) {
            list[count] = [bob[i]];
            count++;
        }
    }
    console.log('Bob: ' + bob[i]);
}
console.log('Count: ' + count);
console.log(list);

// list[0] = bob[2];
// console.log(bob[2]);
// console.log(list);