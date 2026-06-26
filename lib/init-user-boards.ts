import connectDB from './db'
import { Board, Column } from './models'

const DEFAULT_COLUMNS = [
  { name: 'Wish List', order: 0 },
  { name: 'Applied', order: 1 },
  { name: 'Interviewing', order: 2 },
  { name: 'Offer', order: 3 },
  { name: 'Rejected', order: 4 },
]

export async function initUserBoards(userId: string) {
  try {
    await connectDB()

    // check if board exists

    const existingBoard = await Board.findOne({ userId, name: 'Job Hunt' })

    if (existingBoard) {
      return existingBoard
    }

    const board = await Board.create({
      name: 'Job Hunt',
      userId,
      columns: [],
    })

    // Create default columns

    const columns = await Promise.all(
      DEFAULT_COLUMNS.map(async (column) => {
        return Column.create({
          name: column.name,
          order: column.order,
          boardId: board._id,
          jobApplications: [],
        })
      })
    )

    board.columns = columns.map((c) => c._id)

    // Save

    await board.save()

    return board
  } catch (err) {
    console.error(err)
    throw err
  }
}
