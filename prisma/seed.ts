import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 12);

  const esplanade = await prisma.organizer.create({
    data: {
      name: "Esplanade Team",
      email: "events@esplanade.com",
      passwordHash,
      organization: "Esplanade – Theatres on the Bay",
      description: "Singapore's national performing arts centre",
      website: "https://www.esplanade.com",
    },
  });

  const nac = await prisma.organizer.create({
    data: {
      name: "NAC Admin",
      email: "events@nac.gov.sg",
      passwordHash,
      organization: "National Arts Council",
      description: "Championing the arts in Singapore",
      website: "https://www.nac.gov.sg",
    },
  });

  const nhb = await prisma.organizer.create({
    data: {
      name: "NHB Events",
      email: "events@nhb.gov.sg",
      passwordHash,
      organization: "National Heritage Board",
      description: "Preserving and celebrating Singapore's heritage",
      website: "https://www.nhb.gov.sg",
    },
  });

  const wildRice = await prisma.organizer.create({
    data: {
      name: "Wild Rice Team",
      email: "hello@wildrice.com.sg",
      passwordHash,
      organization: "Wild Rice",
      description: "Singapore's leading professional theatre company",
      website: "https://www.wildrice.com.sg",
    },
  });

  const sco = await prisma.organizer.create({
    data: {
      name: "SCO Admin",
      email: "events@sco.com.sg",
      passwordHash,
      organization: "Singapore Chinese Orchestra",
      description: "Singapore's only professional Chinese orchestra",
      website: "https://www.sco.com.sg",
    },
  });

  const artScience = await prisma.organizer.create({
    data: {
      name: "ArtScience Museum",
      email: "events@marinabaysands.com",
      passwordHash,
      organization: "ArtScience Museum",
      description: "Where art meets science at Marina Bay Sands",
    },
  });

  const events = [
    {
      title: "Huayi – Chinese Festival of Arts 2026",
      description: "Esplanade's annual Chinese Festival of Arts returns with a vibrant line-up of performances celebrating Chinese culture and arts. Featuring renowned artists from Singapore, China, Taiwan, and Hong Kong.\n\nThis year's edition explores the theme of 'Roots & Wings', examining how traditional Chinese arts evolve in contemporary expressions.",
      category: "Festivals",
      venue: "Esplanade – Theatres on the Bay",
      address: "1 Esplanade Drive, Singapore 038981",
      startDate: new Date("2026-04-18"),
      endDate: new Date("2026-04-27"),
      startTime: "10:00",
      endTime: "22:00",
      isFree: true,
      price: 0,
      capacity: 500,
      spotsLeft: 342,
      organizerId: esplanade.id,
    },
    {
      title: "Shakespeare in the Park: A Midsummer Night's Dream",
      description: "Wild Rice presents Shakespeare's beloved comedy set in the lush gardens of Fort Canning Park. This magical outdoor production reimagines the classic tale with a distinctly Singaporean flavour.\n\nBring a picnic blanket and enjoy an enchanting evening under the stars.",
      category: "Theatre & Drama",
      venue: "Fort Canning Park",
      address: "River Valley Road, Singapore 179037",
      startDate: new Date("2026-05-08"),
      endDate: new Date("2026-05-24"),
      startTime: "19:30",
      endTime: "21:30",
      isFree: false,
      price: 45,
      capacity: 300,
      spotsLeft: 156,
      organizerId: wildRice.id,
    },
    {
      title: "Singapore Night Festival 2026",
      description: "The annual Singapore Night Festival transforms the Bras Basah-Bugis precinct into a dazzling playground of light art installations, performances, and creative experiences.\n\nThe festival is free and open to all. Food trucks and pop-up bars available throughout.",
      category: "Festivals",
      venue: "Bras Basah-Bugis Precinct",
      address: "National Museum of Singapore, 93 Stamford Road, Singapore 178897",
      startDate: new Date("2026-08-21"),
      endDate: new Date("2026-08-30"),
      startTime: "19:00",
      endTime: "00:00",
      isFree: true,
      price: 0,
      organizerId: nhb.id,
    },
    {
      title: "SCO: Sounds of the Orient – Spring Concert",
      description: "The Singapore Chinese Orchestra presents an evening of beloved Chinese orchestral classics under the baton of Music Director Tsung Yeh.",
      category: "Music & Concerts",
      venue: "Singapore Conference Hall",
      address: "7 Shenton Way, Singapore 068810",
      startDate: new Date("2026-04-25"),
      endDate: new Date("2026-04-25"),
      startTime: "19:30",
      endTime: "21:30",
      isFree: false,
      price: 38,
      capacity: 800,
      spotsLeft: 450,
      organizerId: sco.id,
    },
    {
      title: "Peranakan Beadwork Workshop",
      description: "Learn the intricate art of Peranakan beadwork in this hands-on workshop. Create your own beaded slippers (kasut manek) using traditional techniques.\n\nAll materials provided. Suitable for beginners.",
      category: "Workshops & Classes",
      venue: "The Peranakan Museum",
      address: "39 Armenian Street, Singapore 179941",
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-05-10"),
      startTime: "14:00",
      endTime: "17:00",
      isFree: false,
      price: 65,
      capacity: 20,
      spotsLeft: 8,
      organizerId: nhb.id,
    },
    {
      title: "Baybeats 2026",
      description: "Esplanade's annual alternative music festival with three days of non-stop live music. Showcasing Singapore's independent music scene alongside regional acts from Southeast Asia.\n\nGenres: indie rock, electronic, hip-hop, folk, experimental.",
      category: "Music & Concerts",
      venue: "Esplanade – Theatres on the Bay",
      address: "1 Esplanade Drive, Singapore 038981",
      startDate: new Date("2026-06-19"),
      endDate: new Date("2026-06-21"),
      startTime: "16:00",
      endTime: "23:00",
      isFree: true,
      price: 0,
      capacity: 2000,
      spotsLeft: 1500,
      organizerId: esplanade.id,
    },
    {
      title: "Future World: Where Art Meets Science",
      description: "Interactive digital art installations by teamLab. 16 digital artworks that respond to your presence and touch.\n\nHighlights: Crystal Universe, Sketch Town, Space of Flowers. A must-visit for all ages.",
      category: "Visual Arts",
      venue: "ArtScience Museum",
      address: "6 Bayfront Avenue, Singapore 018974",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-12-31"),
      startTime: "10:00",
      endTime: "19:00",
      isFree: false,
      price: 19,
      capacity: 200,
      spotsLeft: 120,
      organizerId: artScience.id,
    },
    {
      title: "Singapore Writers Festival 2026",
      description: "Asia's premier literary event with readings, panel discussions, book launches, and performances.\n\nTheme: 'Stories We Carry' — exploring migration, identity, and belonging through literature. Events in English, Malay, Chinese, and Tamil.",
      category: "Literary Arts",
      venue: "Various Venues (Arts House, NLB)",
      address: "The Arts House, 1 Old Parliament Lane, Singapore 179429",
      startDate: new Date("2026-11-06"),
      endDate: new Date("2026-11-16"),
      startTime: "10:00",
      endTime: "21:00",
      isFree: true,
      price: 0,
      capacity: 300,
      spotsLeft: 300,
      organizerId: nac.id,
    },
    {
      title: "Traditional Malay Dance: Zapin Workshop",
      description: "Experience Zapin, a traditional Malay dance form with Arab influences. Beginner-friendly workshop covering basic movements, rhythms, and cultural significance.",
      category: "Dance",
      venue: "Malay Heritage Centre",
      address: "85 Sultan Gate, Singapore 198501",
      startDate: new Date("2026-05-17"),
      endDate: new Date("2026-05-17"),
      startTime: "10:00",
      endTime: "12:00",
      isFree: true,
      price: 0,
      capacity: 30,
      spotsLeft: 22,
      organizerId: nhb.id,
    },
    {
      title: "Singapore International Film Festival 2026",
      description: "Southeast Asia's longest-running film festival with over 100 films. Special focus on Asian filmmakers.\n\nHighlights: Silver Screen Awards, masterclasses with acclaimed directors, SE Asian short films showcase.",
      category: "Film & Media",
      venue: "The Projector",
      address: "6001 Beach Road, #05-00 Golden Mile Tower, Singapore 199589",
      startDate: new Date("2026-10-15"),
      endDate: new Date("2026-10-26"),
      startTime: "12:00",
      endTime: "23:00",
      isFree: false,
      price: 15,
      capacity: 150,
      spotsLeft: 150,
      organizerId: nac.id,
    },
    {
      title: "Heritage Walking Tour: Chinatown Stories",
      description: "Guided walking tour through Singapore's historic Chinatown. Visit temples, shophouses, and hidden gems.\n\nStops include Thian Hock Keng Temple, Sago Street, and Chinatown Heritage Centre. Ends with traditional kopi.",
      category: "Heritage & Culture",
      venue: "Chinatown MRT Station (Exit A)",
      address: "Pagoda Street, Singapore 059186",
      startDate: new Date("2026-04-12"),
      endDate: new Date("2026-04-12"),
      startTime: "09:30",
      endTime: "12:00",
      isFree: true,
      price: 0,
      capacity: 25,
      spotsLeft: 14,
      organizerId: nhb.id,
    },
    {
      title: "Singapore Comedy Festival: Stand-Up Showcase",
      description: "An evening of stand-up comedy featuring Singapore's funniest comedians. Six performers doing 20-minute sets.\n\nPerformers include Kumar, Fakkah Fuzz, Sam See, and surprise international guests. Rated PG-16.",
      category: "Comedy",
      venue: "Capitol Theatre",
      address: "17 Stamford Road, Singapore 178907",
      startDate: new Date("2026-07-11"),
      endDate: new Date("2026-07-11"),
      startTime: "20:00",
      endTime: "22:30",
      isFree: false,
      price: 55,
      capacity: 400,
      spotsLeft: 275,
      organizerId: nac.id,
    },
    {
      title: "Batik Painting Masterclass",
      description: "Learn traditional wax-resist batik painting at National Gallery Singapore. Create your own artwork on fabric.\n\nCovers history of batik in SE Asia, wax application, and colour blending. All materials included. Ages 12+.",
      category: "Workshops & Classes",
      venue: "National Gallery Singapore",
      address: "1 St Andrew's Road, Singapore 178957",
      startDate: new Date("2026-05-03"),
      endDate: new Date("2026-05-03"),
      startTime: "14:00",
      endTime: "17:00",
      isFree: false,
      price: 48,
      capacity: 25,
      spotsLeft: 11,
      organizerId: nac.id,
    },
    {
      title: "Indian Classical Dance: Bharatanatyam Recital",
      description: "Bharatanatyam performance by acclaimed Singaporean dancer Aravinth Kumarasamy and troupe. Traditional pieces accompanied by live Carnatic musicians.\n\nPost-show dialogue with the artists included.",
      category: "Dance",
      venue: "Esplanade Recital Studio",
      address: "1 Esplanade Drive, Singapore 038981",
      startDate: new Date("2026-06-07"),
      endDate: new Date("2026-06-07"),
      startTime: "19:30",
      endTime: "21:00",
      isFree: false,
      price: 30,
      capacity: 200,
      spotsLeft: 130,
      organizerId: esplanade.id,
    },
    {
      title: "Singapore Art Week: Open Studios Trail",
      description: "Visit studios of 50+ Singapore-based artists at Gillman Barracks, Goodman Arts Centre, and Tanjong Pagar Distripark.\n\nConversations with artists, live demos, and exclusive artwork sales. Free shuttle bus connects venues.",
      category: "Visual Arts",
      venue: "Gillman Barracks",
      address: "9 Lock Road, Singapore 108937",
      startDate: new Date("2026-04-20"),
      endDate: new Date("2026-04-21"),
      startTime: "11:00",
      endTime: "19:00",
      isFree: true,
      price: 0,
      organizerId: nac.id,
    },
    {
      title: "Photography Exhibition: Singapore Through the Lens",
      description: "100 years of Singapore photography — from colonial-era portraits to contemporary street photography.\n\nFeaturing Chua Soo Bin, Darren Soh, Nguan, and other notable photographers. Audio guide in four languages.",
      category: "Photography",
      venue: "National Museum of Singapore",
      address: "93 Stamford Road, Singapore 178897",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-08-31"),
      startTime: "10:00",
      endTime: "19:00",
      isFree: false,
      price: 15,
      capacity: 100,
      spotsLeft: 100,
      organizerId: nhb.id,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log("Seed data created successfully!");
  console.log(`Created ${events.length} events across 6 organizers`);
  console.log("\nDemo organizer login: events@esplanade.com / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
