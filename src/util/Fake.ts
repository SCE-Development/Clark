
const ALPHA = [
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
];
const ALPHA_NUM = [
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "0","1","2","3","4","5","6","7","8","9"
];

function randint(min:number, max:number) {
    return Math.floor((max - min) * Math.random() + min);
}

const Fake = {
    email() {
        return Fake.name() + "@" + Fake.name() + ".com";
    },
    password() {
        let len = randint(6,11);
        let out = "";
        for(let i = 0; i < len; i ++) {
            out += ALPHA_NUM[randint(0, ALPHA_NUM.length)];
        }
        return out;
    },
    name() {
        let len = randint(4,9);
        let out = "";
        for(let i = 0; i < len; i ++) {
            out += ALPHA[randint(0, ALPHA.length)];
        }
        return out;
    },
    username() {
        let len = randint(4,9);
        let out = "";
        for(let i = 0; i < len; i ++) {
            out += ALPHA_NUM[randint(0, ALPHA_NUM.length)];
        }
        return out;
    }
};

export default Fake;