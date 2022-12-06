import { regexp, seq, string, seqMap } from "parsimmon";


export const triple = regexp(/\d{3}/);

export const leadingTriple = regexp(/0|([1-9]\d{0,2})/);

export const double = regexp(/\d{2}/);

export const comma = string(",");

export const dot = string(".");

export const trailingDouble = dot.then(double);

export const dollarSign = string("$").result("");

export const trailingTriples = comma.then(triple).many();

export const triples = seqMap(leadingTriple, trailingTriples, (head, tail) => [head, ...tail].join(""));

export const dollarsAndCents = seq(dollarSign.fallback(""), triples, trailingDouble.fallback("00")).tieWith("").map(Number);

