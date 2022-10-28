const wait = ms =>
  new Promise((resolve: (value: void) => void) => {
    setTimeout(() => resolve(), ms);
  });

export default wait;
