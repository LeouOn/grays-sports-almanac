const CPI_VALUES: Record<number, number> = {
  1970: 38.8,
  1971: 40.5,
  1972: 41.8,
  1973: 44.4,
  1974: 49.3,
  1975: 53.8,
  1976: 56.9,
  1977: 60.6,
  1978: 65.2,
  1979: 72.6,
  1980: 82.4,
  1981: 90.9,
  1982: 96.5,
  1983: 99.6,
  1984: 103.9,
  1985: 107.6,
  1986: 109.6,
  1987: 113.6,
  1988: 118.3,
  1989: 124.0,
  1990: 130.7,
  1991: 136.2,
  1992: 140.3,
  1993: 144.5,
  1994: 148.2,
  1995: 152.4,
  1996: 156.9,
  1997: 160.5,
  1998: 163.0,
  1999: 166.6,
  2000: 172.2,
  2001: 177.1,
};

export function calculateInflation(amount: number, fromYear: number, toYear: number): number {
  const getCPI = (year: number): number => {
    if (CPI_VALUES[year] !== undefined) {
      return CPI_VALUES[year];
    }
    // Extrapolate if outside the 1970-2001 range using a 3.5% average
    const assumedAnnualRate = 0.035;
    if (year < 1970) {
      const diff = 1970 - year;
      return CPI_VALUES[1970] / Math.pow(1 + assumedAnnualRate, diff);
    } else {
      const diff = year - 2001;
      return CPI_VALUES[2001] * Math.pow(1 + assumedAnnualRate, diff);
    }
  };

  const fromCPI = getCPI(fromYear);
  const toCPI = getCPI(toYear);

  return amount * (toCPI / fromCPI);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
