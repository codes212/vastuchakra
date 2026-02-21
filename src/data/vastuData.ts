export const SLICE_ANGLE = 11.25;

// Clockwise from due North
export const SLICES = [
  'N5','N6','N7','N8','E1','E2','E3','E4',
  'E5','E6','E7','E8','S1','S2','S3','S4',
  'S5','S6','S7','S8','W1','W2','W3','W4',
  'W5','W6','W7','W8','N1','N2','N3','N4'
];

export const SLICE_TO_ZONE: Record<string, string> = {
  N4: 'North', N5: 'North',
  N6: 'NNE', N7: 'NNE',
  N8: 'NE', E1: 'NE',
  E2: 'ENE', E3: 'ENE',
  E4: 'East', E5: 'East',
  E6: 'ESE', E7: 'ESE',
  E8: 'SE', S1: 'SE',
  S2: 'SSE', S3: 'SSE',
  S4: 'South', S5: 'South',
  S6: 'SSW', S7: 'SSW',
  S8: 'SW', W1: 'SW',
  W2: 'WSW', W3: 'WSW',
  W4: 'West', W5: 'West',
  W6: 'WNW', W7: 'WNW',
  W8: 'NW', N1: 'NW',
  N2: 'NNW', N3: 'NNW',
};

export interface ZoneInfo {
  aspects: string[];
  element: string;
  relationships: string;
}

export interface ElementInfo {
  beneficColors: string[];
  maleficColors: string[];
  beneficMetals: string[];
  maleficMetals: string[];
  planets: string[];
  directions: string[];
}

export const ELEMENT_DETAILS: Record<string, ElementInfo> = {
  Earth: {
    beneficColors: ['Yellow', 'Beige', 'Cream'],
    maleficColors: ['Green', 'Brown', 'Blue', 'Black', 'Red', 'Purple', 'Violet', 'Orange', 'Pink'],
    beneficMetals: ['Brass'],
    maleficMetals: ['Stainless Steel', 'Aluminum'],
    planets: ['Rahu'],
    directions: ['South of South West', 'South West'],
  },
  Water: {
    beneficColors: ['Blue', 'Black', 'White', 'Grey', 'Silver', 'Metallic Colors'],
    maleficColors: ['Yellow', 'Red', 'Orange', 'Violet', 'Pink', 'Purple'],
    beneficMetals: ['Aluminum', 'Iron'],
    maleficMetals: ['Copper', 'Brass'],
    planets: ['Mercury', 'Moon', 'Jupiter', 'Ketu'],
    directions: ['North of North West', 'North', 'North of North East', 'North East'],
  },
  Fire: {
    beneficColors: ['Green', 'Brown', 'Red', 'Orange', 'Pink', 'Violet', 'Purple'],
    maleficColors: ['Blue', 'Black', 'White', 'Silver', 'Grey', 'Golden', 'Metallic'],
    beneficMetals: ['Stainless Steel', 'Copper'],
    maleficMetals: ['Aluminum', 'Iron'],
    planets: ['Venus', 'Mars'],
    directions: ['South East', 'South of South East', 'South'],
  },
  Air: {
    beneficColors: ['Wooden', 'Brown', 'Green'],
    maleficColors: ['Yellow', 'Golden', 'Silver', 'White', 'Grey'],
    beneficMetals: ['Stainless Steel', 'Aluminum'],
    maleficMetals: ['Brass', 'Iron'],
    planets: ['Sun'],
    directions: ['East of North East', 'East', 'East of South East'],
  },
  Akash: {
    beneficColors: ['Metallic Colors', 'Silver', 'Grey', 'Gold'],
    maleficColors: ['Green', 'Brown', 'Red', 'Violet', 'Orange', 'Purple', 'Pink'],
    beneficMetals: ['Iron', 'Brass'],
    maleficMetals: ['Stainless Steel', 'Copper'],
    planets: ['Saturn'],
    directions: ['West of South West', 'West', 'West of North West', 'North West'],
  },
};

export const ZONES: Record<string, ZoneInfo> = {
  North: { aspects: ['Money', 'Opportunities'], element: 'Water', relationships: 'Customers, Clients' },
  NNE: { aspects: ['Health', 'Immunity'], element: 'Water', relationships: 'Healers, Doctors' },
  NE: { aspects: ['Clarity', 'Mind'], element: 'Water', relationships: 'Self and God' },
  ENE: { aspects: ['Recreation', 'Fun'], element: 'Air', relationships: 'Friends' },
  East: { aspects: ['Social', 'Associations'], element: 'Air', relationships: 'Society, Government Departments' },
  ESE: { aspects: ['Anxiety', 'Churning'], element: 'Fire', relationships: 'In-Laws, Unlawful relationships' },
  SE: { aspects: ['Cash', 'Fire', 'Liquidity'], element: 'Fire', relationships: 'Domestic helper, cleaner, washer' },
  SSE: { aspects: ['Power', 'Confidence'], element: 'Fire', relationships: 'Siblings, Relatives, Influential Persons, Police' },
  South: { aspects: ['Relaxation', 'Fame'], element: 'Fire', relationships: 'Neighbours, Society' },
  SSW: { aspects: ['Expenditure', 'Disposal'], element: 'Earth', relationships: 'Sweeper, Enemy' },
  SW: { aspects: ['Relationship', 'Skill'], element: 'Earth', relationships: 'Parents, Spouse, Siblings, Children, Customer, Partner' },
  WSW: { aspects: ['Education', 'Savings'], element: 'Earth', relationships: 'Technical and Skilled Employees, Staff' },
  West: { aspects: ['Gain', 'Profits'], element: 'Earth', relationships: 'Teacher, Guru, Friends, Supplier' },
  WNW: { aspects: ['Depression', 'Detoxify'], element: 'Air', relationships: 'Counsellors' },
  NW: { aspects: ['Support', 'Banking'], element: 'Air', relationships: 'Bank and Financial Institutions, Work-Partner' },
  NNW: { aspects: ['Sex', 'Attraction'], element: 'Water', relationships: 'Sex-partner, Extra Marital Affair' },
};

export const ZONE_FULL_TO_SHORT: Record<string, string> = {
  'North East': 'NE',
  'East North East': 'ENE',
  'East': 'East',
  'East South East': 'ESE',
  'South East': 'SE',
  'South South East': 'SSE',
  'South': 'South',
  'South South West': 'SSW',
  'South West': 'SW',
  'West South West': 'WSW',
  'West': 'West',
  'West North West': 'WNW',
  'North West': 'NW',
  'North North West': 'NNW',
  'North': 'North',
  'North North East': 'NNE',
};

export const ZONE_SHORT_TO_FULL: Record<string, string> = Object.fromEntries(
  Object.entries(ZONE_FULL_TO_SHORT).map(([full, short]) => [short, full])
);

export const ZONE_ANGLES: Record<string, number> = {
  North: 0, NNE: 22.5, NE: 45, ENE: 67.5,
  East: 90, ESE: 112.5, SE: 135, SSE: 157.5,
  South: 180, SSW: 202.5, SW: 225, WSW: 247.5,
  West: 270, WNW: 292.5, NW: 315, NNW: 337.5,
};

// Devta mapped to each of the 32 outer slices
export const SLICE_TO_DEVTA: Record<string, string> = {
  N5: 'Soma', N4: 'Bhallat', N3: 'Mukhya', N2: 'Naag', N1: 'Rog',
  N6: 'Sarp', N7: 'Aditi', N8: 'Diti',
  E1: 'Shikhi', E2: 'Parjanya', E3: 'Jayant', E4: 'Aryama',
  E5: 'Surya', E6: 'Satya', E7: 'Bhrish', E8: 'Akash',
  S1: 'Anil', S2: 'Pusha', S3: 'Vitatha', S4: 'Vivaswan',
  S5: 'Yama', S6: 'Gandharva', S7: 'Bhringraj', S8: 'Mriga',
  W1: 'Pitra', W2: 'Dauvarik', W3: 'Sugreev', W4: 'Mitra',
  W5: 'Varun', W6: 'Pushpdant', W7: 'Asur', W8: 'Shosh',
};

// Inner zone devtas (middle ring) — small corner devtas
export interface InnerDevta {
  name: string;
  startDeg: number;
  endDeg: number;
  color: string;
}

export const INNER_CORNER_DEVTAS: InnerDevta[] = [
  { name: 'Aapa', startDeg: 28.125, endDeg: 45, color: 'hsl(45, 80%, 55%)' },
  { name: 'Aapvatsa', startDeg: 45, endDeg: 61.875, color: 'hsl(45, 70%, 60%)' },
  { name: 'Savitra', startDeg: 118.125, endDeg: 135, color: 'hsl(0, 70%, 55%)' },
  { name: 'Savita', startDeg: 135, endDeg: 151.875, color: 'hsl(0, 60%, 60%)' },
  { name: 'Indra', startDeg: 208.125, endDeg: 225, color: 'hsl(120, 50%, 45%)' },
  { name: 'Jaya', startDeg: 225, endDeg: 241.875, color: 'hsl(120, 45%, 50%)' },
  { name: 'Rudra', startDeg: 298.125, endDeg: 315, color: 'hsl(220, 60%, 55%)' },
  { name: 'Rajyakshama', startDeg: 315, endDeg: 331.875, color: 'hsl(220, 50%, 60%)' },
];

// Inner large cardinal devtas (middle ring)
export const INNER_CARDINAL_DEVTAS: InnerDevta[] = [
  { name: 'Bhudhar', startDeg: 331.875, endDeg: 28.125, color: 'hsl(45, 75%, 50%)' },
  { name: 'Aryama', startDeg: 61.875, endDeg: 118.125, color: 'hsl(35, 80%, 50%)' },
  { name: 'Vivaswan', startDeg: 151.875, endDeg: 208.125, color: 'hsl(0, 65%, 50%)' },
  { name: 'Mitra', startDeg: 241.875, endDeg: 298.125, color: 'hsl(200, 60%, 50%)' },
];
