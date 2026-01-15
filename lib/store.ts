import { create } from 'zustand'
import { Square, SelectedSquare } from './types'
import { getSquareKey, calculatePrice, canAddSquare } from './utils'

interface GridStore {
  // Grid state
  squares: Map<string, Square>
  loadedRows: number
  totalSold: number
  loading: boolean

  // Selection state
  selectedSquares: SelectedSquare[]
  isSelecting: boolean

  // Modal state
  isModalOpen: boolean

  // Actions
  setSquares: (squares: Square[]) => void
  addSquares: (squares: Square[]) => void
  setTotalSold: (count: number) => void
  setLoading: (loading: boolean) => void
  setLoadedRows: (rows: number) => void

  // Selection actions
  selectSquare: (row: number, col: number) => void
  deselectSquare: (row: number, col: number) => void
  clearSelection: () => void
  toggleSquareSelection: (row: number, col: number) => void

  // Modal actions
  openModal: () => void
  closeModal: () => void

  // Computed
  getSelectionPrice: () => number
  isSquareSelected: (row: number, col: number) => boolean
  isSquarePurchased: (row: number, col: number) => boolean
  getSquare: (row: number, col: number) => Square | undefined
}

export const useGridStore = create<GridStore>((set, get) => ({
  // Initial state
  squares: new Map(),
  loadedRows: 0,
  totalSold: 0,
  loading: false,
  selectedSquares: [],
  isSelecting: false,
  isModalOpen: false,

  // Grid setters
  setSquares: (squares) => {
    const squareMap = new Map<string, Square>()
    squares.forEach((square) => {
      squareMap.set(getSquareKey(square.row_index, square.col_index), square)
    })
    set({ squares: squareMap })
  },

  addSquares: (squares) => {
    set((state) => {
      const newMap = new Map(state.squares)
      squares.forEach((square) => {
        newMap.set(getSquareKey(square.row_index, square.col_index), square)
      })
      return { squares: newMap }
    })
  },

  setTotalSold: (count) => set({ totalSold: count }),
  setLoading: (loading) => set({ loading }),
  setLoadedRows: (rows) => set({ loadedRows: rows }),

  // Selection actions
  selectSquare: (row, col) => {
    const state = get()
    const square = state.getSquare(row, col)

    // Don't select if already purchased
    if (square?.purchased) return

    // Check if already selected
    if (state.isSquareSelected(row, col)) return

    const newSquare = { row, col }

    // Check if we can add this square (max 100 squares)
    if (canAddSquare(state.selectedSquares, newSquare)) {
      set({
        selectedSquares: [...state.selectedSquares, newSquare],
        isSelecting: true,
      })
    }
  },

  deselectSquare: (row, col) => {
    set((state) => ({
      selectedSquares: state.selectedSquares.filter(
        (s) => !(s.row === row && s.col === col)
      ),
      isSelecting: state.selectedSquares.length > 1,
    }))
  },

  clearSelection: () => {
    set({
      selectedSquares: [],
      isSelecting: false,
    })
  },

  toggleSquareSelection: (row, col) => {
    const state = get()
    if (state.isSquareSelected(row, col)) {
      state.deselectSquare(row, col)
    } else {
      state.selectSquare(row, col)
    }
  },

  // Modal actions
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // Computed values
  getSelectionPrice: () => {
    const { selectedSquares } = get()
    return calculatePrice(selectedSquares.length)
  },

  isSquareSelected: (row, col) => {
    const { selectedSquares } = get()
    return selectedSquares.some((s) => s.row === row && s.col === col)
  },

  isSquarePurchased: (row, col) => {
    const { squares } = get()
    const square = squares.get(getSquareKey(row, col))
    return square?.purchased ?? false
  },

  getSquare: (row, col) => {
    const { squares } = get()
    return squares.get(getSquareKey(row, col))
  },
}))
