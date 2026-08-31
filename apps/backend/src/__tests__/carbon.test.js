const { calculateCarbonBatchSchema, carbonEmissionSchema } = require('../schemas/carbon.schemas');

describe('Carbon Calculation & ESG Tests', () => {
  function calculateTotalEmissions(emissions) {
    return emissions.reduce((sum, item) => sum + (item.quantity * item.emissionFactor), 0);
  }

  test('should validate a valid carbon emission payload', () => {
    const validEmission = {
      scope: 'SCOPE_1',
      category: 'Combustion Fixe',
      source: 'Chaudière Gaz',
      quantity: 500,
      unit: 'm3',
      emissionFactor: 2.2, // 2.2 kgCO2e/m3
      periodStart: '2026-01-01T00:00:00.000Z',
      periodEnd: '2026-01-31T23:59:59.000Z'
    };

    const result = carbonEmissionSchema.safeParse(validEmission);
    expect(result.success).toBe(true);
  });

  test('should reject invalid scope or negative quantity', () => {
    const invalidEmission = {
      scope: 'SCOPE_INVALID',
      category: 'Carburant',
      source: 'Véhicules',
      quantity: -50,
      unit: 'liters',
      emissionFactor: 2.68,
      periodStart: '2026-01-01T00:00:00.000Z',
      periodEnd: '2026-01-31T23:59:59.000Z'
    };

    const result = carbonEmissionSchema.safeParse(invalidEmission);
    expect(result.success).toBe(false);
  });

  test('should calculate total kgCO2e correctly across Scopes 1, 2, and 3', () => {
    const emissions = [
      { scope: 'SCOPE_1', quantity: 1000, emissionFactor: 2.2 }, // Gaz: 2200 kgCO2e
      { scope: 'SCOPE_2', quantity: 5000, emissionFactor: 0.06 }, // Électricité: 300 kgCO2e
      { scope: 'SCOPE_3', quantity: 200, emissionFactor: 1.5 }, // Déchets: 300 kgCO2e
    ];

    const total = calculateTotalEmissions(emissions);
    expect(total).toBe(2800);
  });
});
