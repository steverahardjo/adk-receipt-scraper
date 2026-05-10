export interface QrisData {
  code_type: string
  merchant: string
  amount: number | null
  reference: string | null
  raw: string
  deeplink: string
}
