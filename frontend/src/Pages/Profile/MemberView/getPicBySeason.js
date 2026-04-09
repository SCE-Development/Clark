import spring from './Image/spring.jpg';
import fall from './Image/fall.jpeg';
import winter from './Image/winter.jpeg';
import summer from './Image/summer.jpeg';

export function getPictureByMonth() {
  let pic = null;
  const month = parseInt(new Date().getMonth()) + 1;
  if (month === 3 || month === 4 || month === 5) {
    pic = spring;
  } else if (month === 6 || month === 7 || month === 8) {
    pic = summer;
  } else if (month === 9 || month === 10 || month === 11) {
    pic = fall;
  } else if (month === 12 || month === 1 || month === 2) {
    pic = winter;
  }
  return pic;
}
