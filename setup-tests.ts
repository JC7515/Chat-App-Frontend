import { beforeAll, vi, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/node'

beforeAll(() => {
  vi.mock("next/router", () => require("next-router-mock"));
  vi.mock("next/navigation", () => require("next-router-mock"));
})
 
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())