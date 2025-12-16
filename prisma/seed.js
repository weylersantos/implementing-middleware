import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = "75ca685d-b6e5-4237-8314-eaec230471fd";

const moviesMock = [
  {
    title: "Fight Club",
    overview: "An office worker forms an underground fight club.",
    releaseYear: 1999,
    genres: ["Drama"],
    runtime: 139,
    createdBy: userId,
  },
  {
    title: "Inception",
    overview:
      "A skilled thief enters people's dreams to steal secrets and plant ideas.",
    releaseYear: 2010,
    genres: ["Sci-Fi", "Action", "Thriller"],
    runtime: 148,
    createdBy: userId,
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space to save humanity.",
    releaseYear: 2014,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    runtime: 169,
    createdBy: userId,
  },
  {
    title: "The Dark Knight",
    overview:
      "Batman faces the Joker, a criminal mastermind spreading chaos in Gotham.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    createdBy: userId,
  },
  {
    title: "The Matrix",
    overview:
      "A hacker discovers the true nature of reality and his role in the war against machines.",
    releaseYear: 1999,
    genres: ["Sci-Fi", "Action"],
    runtime: 136,
    createdBy: userId,
  },
  {
    title: "Parasite",
    overview: "A poor family schemes to infiltrate a wealthy household.",
    releaseYear: 2019,
    genres: ["Thriller", "Drama"],
    runtime: 132,
    createdBy: userId,
  },
  {
    title: "Whiplash",
    overview:
      "A young drummer pushes himself to the limit under a ruthless instructor.",
    releaseYear: 2014,
    genres: ["Drama", "Music"],
    runtime: 106,
    createdBy: userId,
  },
  {
    title: "Gladiator",
    overview: "A former Roman general seeks revenge after being betrayed.",
    releaseYear: 2000,
    genres: ["Action", "Drama", "History"],
    runtime: 155,
    createdBy: userId,
  },
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over years, finding solace and redemption.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    createdBy: userId,
  },
  {
    title: "Blade Runner 2049",
    overview:
      "A new blade runner uncovers a long-buried secret that threatens society.",
    releaseYear: 2017,
    genres: ["Sci-Fi", "Drama"],
    runtime: 164,
    createdBy: userId,
  },
];

const main = async () => {
  console.log("Seeding movies...");

  for (const movie of moviesMock) {
    await prisma.movie.create({
      data: movie,
    });
    console.log(`Created movie: ${movie.title}`);
  }

  console.log("Seeding completed!");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
