const CircuitBreaker = require('opossum');

const breakerOptions = {
  timeout: 5000,               // Si la fonction prend plus de 5 secondes, déclenche une erreur
  errorThresholdPercentage: 50, // Si plus de 50% des requêtes échouent, ouvre le circuit
  resetTimeout: 30000          // Attend 30s avant de tester à nouveau si le service est rétabli
};

function createCircuitBreaker(asyncFunction, fallbackFunction) {
  const breaker = new CircuitBreaker(asyncFunction, breakerOptions);
  
  if (fallbackFunction) {
    breaker.fallback(fallbackFunction);
  }
  
  breaker.on('open', () => console.warn(`Circuit breaker OPEN for ${asyncFunction.name}`));
  breaker.on('halfOpen', () => console.log(`Circuit breaker HALF-OPEN for ${asyncFunction.name}`));
  breaker.on('close', () => console.log(`Circuit breaker CLOSED for ${asyncFunction.name}`));
  
  return breaker;
}

module.exports = { createCircuitBreaker };
