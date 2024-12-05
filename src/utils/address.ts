const datas = {
    UCLA: [
        'Campus Main Entrance',
        'Royce Hall',
        'Powell Library',
        'Kerckhoff Hall',
        'Ackerman Union',
        'Pauley Pavilion',
        'Hedrick Hall',
        'Sproul Hall',
        'De Neve Plaza',
        'Rieber Hall',
        'Bruin Plaza',
        'Bruin Walk',
        'Sculpture Garden',
        'Botanical Garden',
        'Parking Lot 7',
    ],
    Westwood: [
        'Westwood Village',
        'Hammer Museum',
        'Geffen Playhouse',
        'Westwood Plaza',
        'Wilshire Boulevard',
        'Gayley Avenue',
        'Le Conte Avenue',
        'Veteran Avenue',
    ],
    NearbyAttractions: [
        'Santa Monica Pier',
        'Venice Beach',
        'Getty Center',
        'Hollywood Walk of Fame',
        'Griffith Observatory',
        'Beverly Hills',
        'Rodeo Drive',
    ],
}

export type City = keyof typeof datas
export const cities = Object.keys(datas) as City[]
export const getDistricts = (city: City) => Object.values(datas[city])
