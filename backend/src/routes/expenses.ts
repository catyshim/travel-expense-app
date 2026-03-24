import { Router } from 'express'
import { supabase } from '../supabase'
import axios from 'axios'

const router = Router()
const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY

// get all expenses (GET)
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('expenses').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// add an expense (POST)
router.post('/', async (req, res) => {
  const { amount, category, date, note } = req.body
  const { data, error } = await supabase.from('expenses').insert([{ amount, category, date, note }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// delete an expense (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Expense deleted' })
})

// get summary, total spent by category (GET)
router.get('/summary', async (req, res) => {
  const { data, error } = await supabase.from('expenses').select('*')
  if (error) return res.status(500).json({ error: error.message })

  const total = data.reduce((sum, e) => sum + Number(e.amount), 0)
  
  const byCategory = data.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
    return acc
  }, {} as Record<string, number>)

  res.json({ total, byCategory })
})

// get exchange rate (GET)
router.get('/rates/:base', async (req, res) => {
  const { base } = req.params
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${base}`)
    res.json(response.data.conversion_rates)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rates' })
  }
})

export default router