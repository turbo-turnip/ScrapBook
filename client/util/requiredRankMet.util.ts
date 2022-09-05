export const requiredRankMet = (rank: string, comparisonRank: string) => {
  const hierarchy = ["Silver", "Gold", "Diamond"];

  return hierarchy.indexOf(rank) >= hierarchy.indexOf(comparisonRank);
}