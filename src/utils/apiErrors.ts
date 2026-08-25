import axios from 'axios'

export const isRateLimitError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 429
