import { PrismaClient, BookType } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  // First create users
  const users = [
    {
      id: "user_1",
      email: "user1@example.com",
      authProvider: "google",
      displayName: "Tech Reader 1",
      bio: "技術書が大好きなエンジニアです。",
      laprasUrl: "https://lapras.com/public/EXAMPLE1",
      imageUrl: "https://example.com/profile1.jpg"
    },
    {
      id: "user_2",
      email: "user2@example.com",
      authProvider: "google",
      displayName: "Book Lover 2",
      bio: "読書が趣味のITエンジニアです。",
      laprasUrl: "https://lapras.com/public/EXAMPLE2",
      imageUrl: "https://example.com/profile2.jpg"
    }
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
  }

  // Create books
  const books = [
    {
      title: "リーダブルコード",
      authors: ["Dustin Boswell", "Trevor Foucher"],
      publisher: "O'Reilly Media",
      type: BookType.TECHNICAL,
      pageCount: 260,
      summary: "より良いコードを書くためのシンプルで実践的なテクニック",
      publishedAt: new Date("2012-06-23"),
      isbn: "978-4873115658",
      imageUrl: "https://example.com/readable-code.jpg"
    },
    {
      title: "Clean Code",
      authors: ["Robert C. Martin"],
      publisher: "Prentice Hall",
      type: BookType.TECHNICAL,
      pageCount: 464,
      summary: "アジャイルソフトウェア技能者による職人的な技",
      publishedAt: new Date("2008-08-01"),
      isbn: "978-0132350884",
      imageUrl: "https://example.com/clean-code.jpg"
    },
    {
      title: "小説 プログラマー",
      authors: ["日向 夏"],
      publisher: "技術評論社",
      type: BookType.NOVEL,
      pageCount: 320,
      summary: "新人プログラマーの成長物語",
      publishedAt: new Date("2023-01-15"),
      isbn: "978-1234567890",
      imageUrl: "https://example.com/programmer-novel.jpg"
    }
  ]

  for (const book of books) {
    const createdBook = await prisma.book.create({
      data: book
    })

    // Add reviews for each book by each user
    for (const user of users) {
      const review = await prisma.review.create({
        data: {
          content: `${book.title}は非常に参考になりました。特に${book.summary}という点が素晴らしいです。`,
          userId: user.id,
          bookId: createdBook.id
        }
      })

      // Add likes for each review
      await prisma.likes.create({
        data: {
          userId: user.id,
          reviewId: review.id,
          isLiked: Math.random() > 0.5 // ランダムにいいね/悪いねを設定
        }
      })
    }
  }

  console.log('Seed data has been inserted successfully!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })