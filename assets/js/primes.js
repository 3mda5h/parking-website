//function from claude that generates a list of all the prime numbers up too 100,000
//using this for my super over-engineered way of generating the parking lot dimensions
function buildPrimeSieve(limit) {
  const isPrime = new Uint8Array(limit + 1).fill(1);
  isPrime[0] = isPrime[1] = 0;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = 0;
      }
    }
  }
  return isPrime;
}

export const isPrime = buildPrimeSieve(100_000);