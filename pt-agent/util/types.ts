import { Page } from "puppeteer";
import { array, boolean, Infer, intersection, nullable, number, object, record, string, union, partial, any} from "superstruct"

export type AgentLabels = Infer<typeof AgentLabels>
const AgentLabels = object({
  always: array(string()),
  sometimes: array(string()),
});

export type AgentOptions = Infer<typeof AgentOptions>;
export const AgentOptions = object({
  enabled: boolean(),
  url: string(),
  labels: AgentLabels
})

export type AgentResult = Infer<typeof AgentResult>;
const AgentResult = object({
  vendor: string(),
  id: string(),
  title: nullable(string()),
  image: nullable(string()),
  href: nullable(string()),
  price: number(),
  labels: record(string(), boolean()),
})

type LabelAlert = Infer<typeof LabelAlert>;
const LabelAlert = union([
  object({ allOf: array(string()) }),
  object({ oneOf: array(string()) })
])

type PriceAlert = Infer<typeof PriceAlert>;
const PriceAlert = union([
  object({ lessThan: number() }),
  object({ greaterThan: number() })
])

type Alert = Infer<typeof Alert>;
const Alert = intersection([
  object({
    slug: string(),
    title: string(),
    enabled: boolean(),
  }),
  partial(object({
    labels: array(LabelAlert),
    price: array(PriceAlert)
  }))
])

export type Config = Infer<typeof Config>;
export const Config = object({
  agents: record(string(), array(AgentOptions)),
  alerts: any()
});

export type Agent = (page: Page, options: AgentOptions) => Promise<AgentResult[]>;