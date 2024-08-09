export const extractAndGetAvgCompanySize = (companySize: string | null) => {
  const companySizeRange = companySize || '0-0';
  const [min, max] = companySizeRange
    .replace(/,/g, '')
    .replace(/\+/g, '') // Handle `10,000+`
    .split(/–|-/)
    .map(Number);

  const avg = max ? (min + max) / 2.0 : min;
  return avg; // Use the average value for comparison
};

export const parseCompanySize = (companySize: string) => {
  const cleanCompanySize = companySize.replace(/,/g, '').replace(/\+/g, '');
  const [min, max] = cleanCompanySize.split('-').map((num) => parseInt(num));
  return { min, max: max || min };
};

export const extractRevenueValue = (revenueCode: string | null): number => {
  switch (revenueCode) {
    case 'r_00000000':
      return 0;
    case 'r_00001000':
      return 1_000_000;
    case 'r_00010000':
      return 10_000_000;
    case 'r_00050000':
      return 50_000_000;
    case 'r_00100000':
      return 100_000_000;
    case 'r_00500000':
      return 500_000_000;
    case 'r_01000000':
      return 1_000_000_000;
    case 'r_10000000':
      return 10_000_000_000;
    default:
      return 0;
  }
};
